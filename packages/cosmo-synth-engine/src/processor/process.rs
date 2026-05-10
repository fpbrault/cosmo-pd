use crate::dsp_utils::{lfo_output_with_symmetry, random_hold_value};
use crate::generators::PER_LINE_HEADROOM;
use crate::params::{ModDestination, NUM_VOICES};
use crate::voice::{mod_value_for, mod_values_for_destinations4, ModSources};

use super::state::RuntimeModSources;
use super::utils::soft_clip_tanh;
use super::CosmoProcessor;

const SOFT_CLIP_DRIVE: f32 = 1.0;
const REFERENCE_LINE_HEADROOM: f32 = 0.75;
const HEADROOM_MAKEUP_EXPONENT: f32 = 0.8;
const MAX_HEADROOM_MAKEUP: f32 = 1.0;
const ENABLE_CZ_DAC_COLOR: bool = false;

impl CosmoProcessor {
    /// Fill `output` with mono samples.
    pub fn process(&mut self, output: &mut [f32]) {
        let p = &self.params;
        let volume = p.volume;
        let base_lfo1_rate = p.lfo.rate;
        let lfo1_waveform = p.lfo.waveform;
        let base_lfo1_symmetry = p.lfo.symmetry;
        let base_lfo1_depth = p.lfo.depth;
        let base_lfo1_offset = p.lfo.offset;
        let base_lfo2_rate = p.lfo2.rate;
        let lfo2_waveform = p.lfo2.waveform;
        let base_lfo2_symmetry = p.lfo2.symmetry;
        let base_lfo2_depth = p.lfo2.depth;
        let base_lfo2_offset = p.lfo2.offset;
        let base_random_rate = p.random.rate;
        let sr = self.sample_rate;
        let headroom_ratio = REFERENCE_LINE_HEADROOM / PER_LINE_HEADROOM.max(0.01);
        let headroom_makeup =
            libm::powf(headroom_ratio, HEADROOM_MAKEUP_EXPONENT).clamp(1.0, MAX_HEADROOM_MAKEUP);
        let norm = volume * headroom_makeup / libm::sqrtf(NUM_VOICES as f32);
        let matrix = &p.mod_matrix;

        let mut prev_lfo1 = self.last_runtime_mod_sources.lfo1;
        let mut prev_lfo2 = self.last_runtime_mod_sources.lfo2;
        let mut prev_random = self.last_runtime_mod_sources.random;

        for sample_out in output.iter_mut() {
            let (source_mod_env, source_velocity) = self
                .runtime_mod_source_voice_index()
                .map(|voice_idx| {
                    let voice = &self.voices[voice_idx];
                    (voice.mod_env.output, voice.velocity)
                })
                .unwrap_or((0.0, 0.0));

            let pre_sources = ModSources::new(
                prev_lfo1,
                prev_lfo2,
                prev_random,
                source_mod_env,
                source_velocity,
                self.mod_wheel,
                self.aftertouch,
            );

            let [lfo1_rate_mod, lfo1_depth_mod, lfo1_symmetry_mod, lfo1_offset_mod] =
                mod_values_for_destinations4(
                    [
                        ModDestination::Lfo1Rate,
                        ModDestination::Lfo1Depth,
                        ModDestination::Lfo1Symmetry,
                        ModDestination::Lfo1Offset,
                    ],
                    matrix,
                    &pre_sources,
                    self.simd_backend,
                );

            let [lfo2_rate_mod, lfo2_depth_mod, lfo2_symmetry_mod, lfo2_offset_mod] =
                mod_values_for_destinations4(
                    [
                        ModDestination::Lfo2Rate,
                        ModDestination::Lfo2Depth,
                        ModDestination::Lfo2Symmetry,
                        ModDestination::Lfo2Offset,
                    ],
                    matrix,
                    &pre_sources,
                    self.simd_backend,
                );
            let random_rate_mod = mod_value_for(ModDestination::RandomRate, matrix, &pre_sources);

            let lfo1_rate = (base_lfo1_rate + lfo1_rate_mod * 20.0).clamp(0.01, 40.0);
            let lfo1_depth = (base_lfo1_depth + lfo1_depth_mod).clamp(0.0, 1.0);
            let lfo1_symmetry = (base_lfo1_symmetry + lfo1_symmetry_mod).clamp(0.0, 1.0);
            let lfo1_offset = (base_lfo1_offset + lfo1_offset_mod).clamp(-1.0, 1.0);

            let lfo2_rate = (base_lfo2_rate + lfo2_rate_mod * 20.0).clamp(0.01, 40.0);
            let lfo2_depth = (base_lfo2_depth + lfo2_depth_mod).clamp(0.0, 1.0);
            let lfo2_symmetry = (base_lfo2_symmetry + lfo2_symmetry_mod).clamp(0.0, 1.0);
            let lfo2_offset = (base_lfo2_offset + lfo2_offset_mod).clamp(-1.0, 1.0);

            self.lfo_phase += lfo1_rate / sr;
            if self.lfo_phase >= 1.0 {
                self.lfo_phase -= 1.0;
            }
            let lfo1_mod_val =
                lfo_output_with_symmetry(self.lfo_phase, lfo1_waveform, lfo1_symmetry) * lfo1_depth
                    + lfo1_offset;

            self.lfo2_phase += lfo2_rate / sr;
            if self.lfo2_phase >= 1.0 {
                self.lfo2_phase -= 1.0;
            }
            let lfo2_mod_val =
                lfo_output_with_symmetry(self.lfo2_phase, lfo2_waveform, lfo2_symmetry)
                    * lfo2_depth
                    + lfo2_offset;

            let random_rate = (base_random_rate + random_rate_mod * 20.0).clamp(0.0, 200.0);
            self.random_phase += random_rate / sr;
            if self.random_phase >= 1.0 {
                self.random_phase -= 1.0;
                self.random_step = self.random_step.wrapping_add(1);
                self.random_hold = random_hold_value(self.random_step);
            }
            let random_mod_val = self.random_hold;

            let mut mixed = 0.0_f32;
            let params_ptr: *const crate::params::SynthParams = self.params.as_ref();
            let pitch_bend_semitones = self.pitch_bend * self.params.pitch_bend_range;
            let mod_wheel = self.mod_wheel;
            let aftertouch = self.aftertouch;
            let mut vector_acc = [0.0_f32; 4];
            let mut v = 0;
            while v + 4 <= NUM_VOICES {
                let p_ref: &crate::params::SynthParams = unsafe { &*params_ptr };
                let voice_samples = [
                    crate::voice::render_voice(
                        &mut self.voices[v],
                        p_ref,
                        lfo1_mod_val,
                        lfo2_mod_val,
                        random_mod_val,
                        sr,
                        &self.envelope_timing,
                        pitch_bend_semitones,
                        mod_wheel,
                        aftertouch,
                        self.simd_backend,
                    ),
                    crate::voice::render_voice(
                        &mut self.voices[v + 1],
                        p_ref,
                        lfo1_mod_val,
                        lfo2_mod_val,
                        random_mod_val,
                        sr,
                        &self.envelope_timing,
                        pitch_bend_semitones,
                        mod_wheel,
                        aftertouch,
                        self.simd_backend,
                    ),
                    crate::voice::render_voice(
                        &mut self.voices[v + 2],
                        p_ref,
                        lfo1_mod_val,
                        lfo2_mod_val,
                        random_mod_val,
                        sr,
                        &self.envelope_timing,
                        pitch_bend_semitones,
                        mod_wheel,
                        aftertouch,
                        self.simd_backend,
                    ),
                    crate::voice::render_voice(
                        &mut self.voices[v + 3],
                        p_ref,
                        lfo1_mod_val,
                        lfo2_mod_val,
                        random_mod_val,
                        sr,
                        &self.envelope_timing,
                        pitch_bend_semitones,
                        mod_wheel,
                        aftertouch,
                        self.simd_backend,
                    ),
                ];
                vector_acc = self.simd_backend.add4(vector_acc, voice_samples);
                v += 4;
            }

            mixed += self.simd_backend.horizontal_sum4(vector_acc);

            while v < NUM_VOICES {
                let p_ref: &crate::params::SynthParams = unsafe { &*params_ptr };
                mixed += crate::voice::render_voice(
                    &mut self.voices[v],
                    p_ref,
                    lfo1_mod_val,
                    lfo2_mod_val,
                    random_mod_val,
                    sr,
                    &self.envelope_timing,
                    pitch_bend_semitones,
                    mod_wheel,
                    aftertouch,
                    self.simd_backend,
                );
                v += 1;
            }

            let (mod_env, velocity) = self
                .runtime_mod_source_voice_index()
                .map(|voice_idx| {
                    let voice = &self.voices[voice_idx];
                    (voice.mod_env.output, voice.velocity)
                })
                .unwrap_or((0.0, 0.0));
            self.last_runtime_mod_sources = RuntimeModSources {
                lfo1: lfo1_mod_val,
                lfo2: lfo2_mod_val,
                random: random_mod_val,
                mod_env,
                velocity,
                mod_wheel,
                aftertouch,
            };
            prev_lfo1 = lfo1_mod_val;
            prev_lfo2 = lfo2_mod_val;
            prev_random = random_mod_val;

            mixed *= norm;

            let fx_out = self.fx.process(mixed);
            let colored = if ENABLE_CZ_DAC_COLOR {
                self.cz_dac_color.process(fx_out, sr)
            } else {
                fx_out
            };
            let soft_limited = soft_clip_tanh(colored, SOFT_CLIP_DRIVE);
            *sample_out = soft_limited.clamp(-1.0, 1.0);
        }
    }

    fn runtime_mod_source_voice_index(&self) -> Option<usize> {
        self.active_notes
            .last()
            .map(|entry| entry.voice_idx)
            .filter(|voice_idx| *voice_idx < NUM_VOICES)
            .or_else(|| {
                self.voices.iter().position(|voice| {
                    voice.note.is_some() && (!voice.is_silent || voice.mod_env.output > 0.0)
                })
            })
            .or_else(|| {
                self.voices
                    .iter()
                    .position(|voice| voice.mod_env.output > 0.0)
            })
    }
}
