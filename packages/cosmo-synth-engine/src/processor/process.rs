#[cfg(feature = "std")]
use std::sync::Arc;

#[cfg(not(feature = "std"))]
use alloc::sync::Arc;

use crate::dsp_utils::{lfo_output_with_symmetry, random_hold_value};
use crate::generators::{pre_resolve_controls, PER_LINE_HEADROOM};
use crate::params::{ModDestination, ModMatrixCache, NUM_VOICES};
use crate::voice::modulated_line_params;
use crate::voice::ModSources;

use super::state::RuntimeModSources;
use super::utils::soft_clip_tanh;
use super::CosmoProcessor;

#[cfg(all(feature = "no_denormals", not(target_arch = "wasm32")))]
use no_denormals::no_denormals;

#[cfg(all(debug_assertions, feature = "std"))]
use assert_no_alloc::assert_no_alloc;

const SOFT_CLIP_DRIVE: f32 = 1.0;
const REFERENCE_LINE_HEADROOM: f32 = 0.75;
const HEADROOM_MAKEUP_EXPONENT: f32 = 0.8;
const MAX_HEADROOM_MAKEUP: f32 = 1.0;
const ENABLE_CZ_DAC_COLOR: bool = false;

impl CosmoProcessor {
    /// Fill `output` with mono samples.
    ///
    /// On `std` builds, denormals are suppressed for the duration of this
    /// call to prevent the ~100x CPU stalls that subnormal floats cause in
    /// IIR filters and feedback delay paths. The FTZ/DAZ CPU flags are
    /// restored on exit.
    #[cfg_attr(feature = "rtsan", rtsan_standalone::nonblocking)]
    pub fn process(&mut self, output: &mut [f32]) {
        #[cfg(all(debug_assertions, feature = "std"))]
        {
            assert_no_alloc(|| self.process_with_denormal_guard(output, false));
            return;
        }

        #[cfg(not(all(debug_assertions, feature = "std")))]
        self.process_with_denormal_guard(output, false);
    }

    /// Fill `output` with interleaved stereo L,R samples.
    /// `output.len()` must be even (2 × number of stereo frames).
    #[cfg_attr(feature = "rtsan", rtsan_standalone::nonblocking)]
    pub fn process_stereo(&mut self, output: &mut [f32]) {
        #[cfg(all(debug_assertions, feature = "std"))]
        {
            assert_no_alloc(|| self.process_with_denormal_guard(output, true));
            return;
        }

        #[cfg(not(all(debug_assertions, feature = "std")))]
        self.process_with_denormal_guard(output, true);
    }

    fn process_with_denormal_guard(&mut self, output: &mut [f32], stereo: bool) {
        #[cfg(all(feature = "no_denormals", not(target_arch = "wasm32")))]
        no_denormals(|| self.process_inner(output, stereo));

        #[cfg(not(all(feature = "no_denormals", not(target_arch = "wasm32"))))]
        self.process_inner(output, stereo);
    }

    fn process_inner(&mut self, output: &mut [f32], stereo: bool) {
        let params = Arc::clone(&self.params);
        let p = params.as_ref();
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
        let headroom_makeup = (headroom_ratio)
            .powf(HEADROOM_MAKEUP_EXPONENT)
            .clamp(1.0, MAX_HEADROOM_MAKEUP);
        let vc = (p.voice_count.max(1)) as f32;
        let norm = volume * headroom_makeup / vc.sqrt();
        let matrix = &p.mod_matrix;

        let mut prev_lfo1 = self.last_runtime_mod_sources.lfo1;
        let mut prev_lfo2 = self.last_runtime_mod_sources.lfo2;
        let mut prev_random = self.last_runtime_mod_sources.random;

        let mut mod_cache = ModMatrixCache::new();
        mod_cache.rebuild_routes(matrix);

        let l1_ctrl_p = pre_resolve_controls(p.line1.algo, &p.line1.algo_controls_a);
        let l1_ctrl_s = p
            .line1
            .algo2
            .map(|a| pre_resolve_controls(a, &p.line1.algo_controls_b))
            .unwrap_or([0.0; 8]);
        let l2_ctrl_p = pre_resolve_controls(p.line2.algo, &p.line2.algo_controls_a);
        let l2_ctrl_s = p
            .line2
            .algo2
            .map(|a| pre_resolve_controls(a, &p.line2.algo_controls_b))
            .unwrap_or([0.0; 8]);

        let num_frames = if stereo {
            output.len() / 2
        } else {
            output.len()
        };
        let mut out_idx: usize = 0;
        let unison_spread = p.unison_spread;

        for _ in 0..num_frames {
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

            mod_cache.compute(&pre_sources);

            let lfo1_rate_mod = mod_cache.get(ModDestination::Lfo1Rate, &pre_sources);
            let lfo1_depth_mod = mod_cache.get(ModDestination::Lfo1Depth, &pre_sources);
            let lfo1_symmetry_mod = mod_cache.get(ModDestination::Lfo1Symmetry, &pre_sources);
            let lfo1_offset_mod = mod_cache.get(ModDestination::Lfo1Offset, &pre_sources);

            let lfo2_rate_mod = mod_cache.get(ModDestination::Lfo2Rate, &pre_sources);
            let lfo2_depth_mod = mod_cache.get(ModDestination::Lfo2Depth, &pre_sources);
            let lfo2_symmetry_mod = mod_cache.get(ModDestination::Lfo2Symmetry, &pre_sources);
            let lfo2_offset_mod = mod_cache.get(ModDestination::Lfo2Offset, &pre_sources);

            let random_rate_mod = mod_cache.get(ModDestination::RandomRate, &pre_sources);

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

            modulated_line_params(
                &p.line1,
                &mut self.line1_scratch,
                1,
                &mod_cache,
                &pre_sources,
            );
            modulated_line_params(
                &p.line2,
                &mut self.line2_scratch,
                2,
                &mod_cache,
                &pre_sources,
            );
            let line1_modded = self.line1_scratch;
            let line2_modded = self.line2_scratch;

            let mut mixed_l = 0.0_f32;
            let mut mixed_r = 0.0_f32;
            let pitch_bend_semitones = self.pitch_bend * params.pitch_bend_range;
            let mod_wheel = self.mod_wheel;
            let aftertouch = self.aftertouch;

            for voice_idx in 0..NUM_VOICES {
                let sample = crate::voice::render_voice(
                    &mut self.voices[voice_idx],
                    params.as_ref(),
                    lfo1_mod_val,
                    lfo2_mod_val,
                    random_mod_val,
                    &line1_modded,
                    &line2_modded,
                    sr,
                    &self.envelope_timing,
                    pitch_bend_semitones,
                    mod_wheel,
                    aftertouch,
                    &mod_cache,
                    l1_ctrl_p,
                    l1_ctrl_s,
                    l2_ctrl_p,
                    l2_ctrl_s,
                );

                let pan = if self.voices[voice_idx].sub_voice_count > 1 && unison_spread > 0.0 {
                    let n = self.voices[voice_idx].sub_voice_count as f32;
                    let i = self.voices[voice_idx].sub_voice_index as f32;
                    0.5 + (i / (n - 1.0) - 0.5) * unison_spread
                } else {
                    0.5
                };
                let (l_gain, r_gain) = self.pan_table.lookup(pan);
                mixed_l += sample * l_gain;
                mixed_r += sample * r_gain;
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

            mixed_l *= norm;
            mixed_r *= norm;

            let (fx_l, fx_r) = self.fx.process_stereo(mixed_l, mixed_r);
            let colored_l = if ENABLE_CZ_DAC_COLOR {
                self.cz_dac_color.process(fx_l, sr)
            } else {
                fx_l
            };
            let colored_r = if ENABLE_CZ_DAC_COLOR {
                self.cz_dac_color.process(fx_r, sr)
            } else {
                fx_r
            };
            let soft_l = soft_clip_tanh(colored_l, SOFT_CLIP_DRIVE);
            let soft_r = soft_clip_tanh(colored_r, SOFT_CLIP_DRIVE);

            if stereo {
                output[out_idx] = soft_l.clamp(-1.0, 1.0);
                output[out_idx + 1] = soft_r.clamp(-1.0, 1.0);
                out_idx += 2;
            } else {
                output[out_idx] = ((soft_l + soft_r) * 0.5).clamp(-1.0, 1.0);
                out_idx += 1;
            }
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
