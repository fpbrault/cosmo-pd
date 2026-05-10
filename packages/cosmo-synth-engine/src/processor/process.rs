use crate::batch_cache::RenderBlockCache;
use crate::dsp_utils::{lfo_output_with_symmetry, random_hold_value};
use crate::generators::PER_LINE_HEADROOM;
use crate::params::{ModDestination, NUM_VOICES};
use crate::voice::{mod_value_for, ModSources};

use super::state::RuntimeModSources;
use super::utils::soft_clip_tanh;
use super::CosmoProcessor;

const SOFT_CLIP_DRIVE: f32 = 1.0;
const REFERENCE_LINE_HEADROOM: f32 = 0.75;
const HEADROOM_MAKEUP_EXPONENT: f32 = 0.8;
const MAX_HEADROOM_MAKEUP: f32 = 1.0;
const ENABLE_CZ_DAC_COLOR: bool = false;

/// Per-block invariants computed once at the start of [`CosmoProcessor::process`].
///
/// Values that are constant for the entire audio buffer (parameters, voice
/// topology, static control signals) are extracted here so the inner
/// sample loop can reference cheap stack copies instead of re-deriving them
/// every sample.
struct BlockContext {
    /// Master output normalisation factor (volume × headroom makeup ÷ √voices).
    norm: f32,
    /// Pitch bend in semitones for the current block.
    pitch_bend_semitones: f32,
    /// Mod wheel value (unchanged within a block).
    mod_wheel: f32,
    /// Aftertouch value (unchanged within a block).
    aftertouch: f32,
    /// Index of the voice used as the global modulation source (mod env,
    /// velocity) — computed once because note events cannot fire mid-buffer.
    mod_source_voice_idx: Option<usize>,
    /// Whether the mod matrix has any enabled routes.
    /// When `false`, all LFO-to-LFO modulation computations are skipped.
    has_modulation: bool,
    /// Sample rate for the current block.
    sample_rate: f32,
}

impl BlockContext {
    fn compute(proc: &CosmoProcessor) -> Self {
        let cache = RenderBlockCache::from_params(proc.params.as_ref());

        let headroom_ratio = REFERENCE_LINE_HEADROOM / PER_LINE_HEADROOM.max(0.01);
        let headroom_makeup =
            libm::powf(headroom_ratio, HEADROOM_MAKEUP_EXPONENT).clamp(1.0, MAX_HEADROOM_MAKEUP);
        let norm = cache.volume * headroom_makeup / libm::sqrtf(NUM_VOICES as f32);

        Self {
            norm,
            pitch_bend_semitones: proc.pitch_bend * proc.params.pitch_bend_range,
            mod_wheel: proc.mod_wheel,
            aftertouch: proc.aftertouch,
            mod_source_voice_idx: proc.runtime_mod_source_voice_index(),
            has_modulation: cache.has_modulation(),
            sample_rate: proc.sample_rate,
        }
    }
}

impl CosmoProcessor {
    /// Fill `output` with mono samples.
    pub fn process(&mut self, output: &mut [f32]) {
        // ── Block-level pre-computation ──────────────────────────────────────
        // These values are constant for the entire buffer: parameters, voice
        // topology, and control signals cannot change mid-block in WebAudio.
        let block = BlockContext::compute(self);

        let p = &self.params;
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
        let matrix = &p.mod_matrix;

        let mut prev_lfo1 = self.last_runtime_mod_sources.lfo1;
        let mut prev_lfo2 = self.last_runtime_mod_sources.lfo2;
        let mut prev_random = self.last_runtime_mod_sources.random;

        // ── Per-sample loop ──────────────────────────────────────────────────
        for sample_out in output.iter_mut() {
            // Retrieve the mod env / velocity from the cached voice index.
            // The index is stable for the whole block (note events cannot fire
            // mid-buffer), so we avoid re-scanning active_notes every sample.
            let (source_mod_env, source_velocity) = block
                .mod_source_voice_idx
                .map(|voice_idx| {
                    let voice = &self.voices[voice_idx];
                    (voice.mod_env.output, voice.velocity)
                })
                .unwrap_or((0.0, 0.0));

            // Compute LFO-to-LFO modulation only when the matrix is active.
            // When there are no routes the base rates/depths/symmetry apply
            // directly, saving ~9 mod_value_for iterations per sample.
            let (lfo1_rate, lfo1_depth, lfo1_symmetry, lfo1_offset, lfo2_rate, lfo2_depth, lfo2_symmetry, lfo2_offset, random_rate) =
                if block.has_modulation {
                    let pre_sources = ModSources::new(
                        prev_lfo1,
                        prev_lfo2,
                        prev_random,
                        source_mod_env,
                        source_velocity,
                        block.mod_wheel,
                        block.aftertouch,
                    );

                    let lfo1_rate_mod =
                        mod_value_for(ModDestination::Lfo1Rate, matrix, &pre_sources);
                    let lfo1_depth_mod =
                        mod_value_for(ModDestination::Lfo1Depth, matrix, &pre_sources);
                    let lfo1_symmetry_mod =
                        mod_value_for(ModDestination::Lfo1Symmetry, matrix, &pre_sources);
                    let lfo1_offset_mod =
                        mod_value_for(ModDestination::Lfo1Offset, matrix, &pre_sources);

                    let lfo2_rate_mod =
                        mod_value_for(ModDestination::Lfo2Rate, matrix, &pre_sources);
                    let lfo2_depth_mod =
                        mod_value_for(ModDestination::Lfo2Depth, matrix, &pre_sources);
                    let lfo2_symmetry_mod =
                        mod_value_for(ModDestination::Lfo2Symmetry, matrix, &pre_sources);
                    let lfo2_offset_mod =
                        mod_value_for(ModDestination::Lfo2Offset, matrix, &pre_sources);
                    let random_rate_mod =
                        mod_value_for(ModDestination::RandomRate, matrix, &pre_sources);

                    (
                        (base_lfo1_rate + lfo1_rate_mod * 20.0).clamp(0.01, 40.0),
                        (base_lfo1_depth + lfo1_depth_mod).clamp(0.0, 1.0),
                        (base_lfo1_symmetry + lfo1_symmetry_mod).clamp(0.0, 1.0),
                        (base_lfo1_offset + lfo1_offset_mod).clamp(-1.0, 1.0),
                        (base_lfo2_rate + lfo2_rate_mod * 20.0).clamp(0.01, 40.0),
                        (base_lfo2_depth + lfo2_depth_mod).clamp(0.0, 1.0),
                        (base_lfo2_symmetry + lfo2_symmetry_mod).clamp(0.0, 1.0),
                        (base_lfo2_offset + lfo2_offset_mod).clamp(-1.0, 1.0),
                        (base_random_rate + random_rate_mod * 20.0).clamp(0.0, 200.0),
                    )
                } else {
                    // Fast path: use base param values directly.
                    (
                        base_lfo1_rate.clamp(0.01, 40.0),
                        base_lfo1_depth.clamp(0.0, 1.0),
                        base_lfo1_symmetry.clamp(0.0, 1.0),
                        base_lfo1_offset.clamp(-1.0, 1.0),
                        base_lfo2_rate.clamp(0.01, 40.0),
                        base_lfo2_depth.clamp(0.0, 1.0),
                        base_lfo2_symmetry.clamp(0.0, 1.0),
                        base_lfo2_offset.clamp(-1.0, 1.0),
                        base_random_rate.clamp(0.0, 200.0),
                    )
                };

            self.lfo_phase += lfo1_rate / block.sample_rate;
            if self.lfo_phase >= 1.0 {
                self.lfo_phase -= 1.0;
            }
            let lfo1_mod_val =
                lfo_output_with_symmetry(self.lfo_phase, lfo1_waveform, lfo1_symmetry)
                    * lfo1_depth
                    + lfo1_offset;

            self.lfo2_phase += lfo2_rate / block.sample_rate;
            if self.lfo2_phase >= 1.0 {
                self.lfo2_phase -= 1.0;
            }
            let lfo2_mod_val =
                lfo_output_with_symmetry(self.lfo2_phase, lfo2_waveform, lfo2_symmetry)
                    * lfo2_depth
                    + lfo2_offset;

            self.random_phase += random_rate / block.sample_rate;
            if self.random_phase >= 1.0 {
                self.random_phase -= 1.0;
                self.random_step = self.random_step.wrapping_add(1);
                self.random_hold = random_hold_value(self.random_step);
            }
            let random_mod_val = self.random_hold;

            let mut mixed = 0.0_f32;
            let params_ptr: *const crate::params::SynthParams = self.params.as_ref();
            for v in 0..NUM_VOICES {
                let p_ref: &crate::params::SynthParams = unsafe { &*params_ptr };
                mixed += crate::voice::render_voice(
                    &mut self.voices[v],
                    p_ref,
                    lfo1_mod_val,
                    lfo2_mod_val,
                    random_mod_val,
                    block.sample_rate,
                    &self.envelope_timing,
                    block.pitch_bend_semitones,
                    block.mod_wheel,
                    block.aftertouch,
                );
            }

            // Update cached mod sources using the same stable voice index.
            let (mod_env, velocity) = block
                .mod_source_voice_idx
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
                mod_wheel: block.mod_wheel,
                aftertouch: block.aftertouch,
            };
            prev_lfo1 = lfo1_mod_val;
            prev_lfo2 = lfo2_mod_val;
            prev_random = random_mod_val;

            mixed *= block.norm;

            let fx_out = self.fx.process(mixed);
            let colored = if ENABLE_CZ_DAC_COLOR {
                self.cz_dac_color.process(fx_out, block.sample_rate)
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
