#[cfg(feature = "std")]
use std::sync::Arc;

#[cfg(not(feature = "std"))]
use alloc::sync::Arc;

use crate::dsp_utils::{lfo_output_with_symmetry, random_hold_value};
use crate::params::{LineParams, ModDestination, ModMatrixCache, SynthParams, NUM_VOICES};
use crate::render_cache::CompiledLinePlan;
use crate::voice::modulated_line_params;
use crate::voice::{ModSources, VoiceRenderContext};

use super::state::RuntimeModSources;
use super::utils::soft_clip_tanh;
use super::CosmoProcessor;

#[cfg(all(feature = "no_denormals", not(target_arch = "wasm32")))]
use no_denormals::no_denormals;

#[cfg(all(debug_assertions, feature = "std"))]
use assert_no_alloc::assert_no_alloc;

const SOFT_CLIP_DRIVE: f32 = 1.0;

#[derive(Clone, Copy)]
struct LfoFrame {
    lfo1: f32,
    lfo2: f32,
    random: f32,
}

#[derive(Clone, Copy)]
struct VoiceLinesFrame {
    line1: LineParams,
    line2: LineParams,
}

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
            assert_no_alloc(|| self.process_with_denormal_guard(output));
            return;
        }

        #[cfg(not(all(debug_assertions, feature = "std")))]
        self.process_with_denormal_guard(output);
    }

    fn process_with_denormal_guard(&mut self, output: &mut [f32]) {
        #[cfg(all(feature = "no_denormals", not(target_arch = "wasm32")))]
        no_denormals(|| self.process_inner(output));

        #[cfg(not(all(feature = "no_denormals", not(target_arch = "wasm32"))))]
        self.process_inner(output);
    }

    fn process_inner(&mut self, output: &mut [f32]) {
        if self.compiled_params_dirty {
            self.update_fx();
            self.rebuild_compiled_params();
        }

        let params = Arc::clone(&self.params);
        let p = params.as_ref();
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
        let has_active_mod_routes = self.compiled_params.has_active_mod_routes;
        let _has_env_step_routes = self.compiled_params.has_env_step_routes;
        let line1_plan = self.compiled_params.line1;
        let line2_plan = self.compiled_params.line2;
        let mut mod_cache = self.compiled_params.mod_cache.clone();
        let norm = self.compiled_params.norm;

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

            if has_active_mod_routes {
                mod_cache.compute(&pre_sources);
            }

            let lfos = self.compute_lfos(
                p,
                &pre_sources,
                &mod_cache,
                has_active_mod_routes,
                base_lfo1_rate,
                base_lfo1_depth,
                base_lfo1_symmetry,
                base_lfo1_offset,
                lfo1_waveform,
                base_lfo2_rate,
                base_lfo2_depth,
                base_lfo2_symmetry,
                base_lfo2_offset,
                lfo2_waveform,
                base_random_rate,
                sr,
            );

            let lines = if has_active_mod_routes {
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
                VoiceLinesFrame {
                    line1: self.line1_scratch,
                    line2: self.line2_scratch,
                }
            } else {
                VoiceLinesFrame {
                    line1: p.line1,
                    line2: p.line2,
                }
            };

            let mut mixed = self.render_all_voices(
                p,
                &lfos,
                &lines,
                &mod_cache,
                has_active_mod_routes,
                sr,
                line1_plan,
                line2_plan,
            );

            let (mod_env, velocity) = self
                .runtime_mod_source_voice_index()
                .map(|voice_idx| {
                    let voice = &self.voices[voice_idx];
                    (voice.mod_env.output, voice.velocity)
                })
                .unwrap_or((0.0, 0.0));
            self.last_runtime_mod_sources = RuntimeModSources {
                lfo1: lfos.lfo1,
                lfo2: lfos.lfo2,
                random: lfos.random,
                mod_env,
                velocity,
                mod_wheel: self.mod_wheel,
                aftertouch: self.aftertouch,
            };
            prev_lfo1 = lfos.lfo1;
            prev_lfo2 = lfos.lfo2;
            prev_random = lfos.random;

            mixed *= norm;
            *sample_out = self.apply_fx_and_limit(mixed, sr, p.cz_dac_enabled);
        }
    }

    #[allow(clippy::too_many_arguments)]
    fn compute_lfos(
        &mut self,
        _p: &SynthParams,
        pre_sources: &ModSources,
        mod_cache: &ModMatrixCache,
        has_active_mod_routes: bool,
        base_lfo1_rate: f32,
        base_lfo1_depth: f32,
        base_lfo1_symmetry: f32,
        base_lfo1_offset: f32,
        lfo1_waveform: crate::params::LfoWaveform,
        base_lfo2_rate: f32,
        base_lfo2_depth: f32,
        base_lfo2_symmetry: f32,
        base_lfo2_offset: f32,
        lfo2_waveform: crate::params::LfoWaveform,
        base_random_rate: f32,
        sr: f32,
    ) -> LfoFrame {
        let lfo1_rate_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo1Rate,
            pre_sources,
        );
        let lfo1_depth_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo1Depth,
            pre_sources,
        );
        let lfo1_symmetry_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo1Symmetry,
            pre_sources,
        );
        let lfo1_offset_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo1Offset,
            pre_sources,
        );
        let lfo2_rate_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo2Rate,
            pre_sources,
        );
        let lfo2_depth_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo2Depth,
            pre_sources,
        );
        let lfo2_symmetry_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo2Symmetry,
            pre_sources,
        );
        let lfo2_offset_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::Lfo2Offset,
            pre_sources,
        );
        let random_rate_mod = get_mod_if_active(
            has_active_mod_routes,
            mod_cache,
            ModDestination::RandomRate,
            pre_sources,
        );

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
        let lfo1_mod_val = lfo_output_with_symmetry(self.lfo_phase, lfo1_waveform, lfo1_symmetry)
            * lfo1_depth
            + lfo1_offset;

        self.lfo2_phase += lfo2_rate / sr;
        if self.lfo2_phase >= 1.0 {
            self.lfo2_phase -= 1.0;
        }
        let lfo2_mod_val = lfo_output_with_symmetry(self.lfo2_phase, lfo2_waveform, lfo2_symmetry)
            * lfo2_depth
            + lfo2_offset;

        let random_rate = (base_random_rate + random_rate_mod * 20.0).clamp(0.0, 200.0);
        self.random_phase += random_rate / sr;
        if self.random_phase >= 1.0 {
            self.random_phase -= 1.0;
            self.random_step = self.random_step.wrapping_add(1);
            self.random_hold = random_hold_value(self.random_step);
        }

        LfoFrame {
            lfo1: lfo1_mod_val,
            lfo2: lfo2_mod_val,
            random: self.random_hold,
        }
    }

    #[allow(clippy::too_many_arguments)]
    fn render_all_voices(
        &mut self,
        p: &SynthParams,
        lfos: &LfoFrame,
        lines: &VoiceLinesFrame,
        mod_cache: &ModMatrixCache,
        has_active_mod_routes: bool,
        sr: f32,
        line1_plan: CompiledLinePlan,
        line2_plan: CompiledLinePlan,
    ) -> f32 {
        let render_ctx = VoiceRenderContext {
            p,
            lfo_mod_val: lfos.lfo1,
            lfo2_mod_val: lfos.lfo2,
            random_mod_val: lfos.random,
            line1_modded: &lines.line1,
            line2_modded: &lines.line2,
            sr,
            timing: &self.envelope_timing,
            pitch_bend_semitones: self.pitch_bend * p.pitch_bend_range,
            mod_wheel: self.mod_wheel,
            aftertouch: self.aftertouch,
            cache: mod_cache,
            modulation_active: has_active_mod_routes,
            line1_plan: &line1_plan,
            line2_plan: &line2_plan,
        };
        let mut mixed = 0.0_f32;
        let mut v = 0;
        if matches!(self.simd_backend, crate::simd::SimdBackend::Scalar) {
            while v + 4 <= NUM_VOICES {
                mixed += crate::voice::render_voice(&mut self.voices[v], &render_ctx);
                mixed += crate::voice::render_voice(&mut self.voices[v + 1], &render_ctx);
                mixed += crate::voice::render_voice(&mut self.voices[v + 2], &render_ctx);
                mixed += crate::voice::render_voice(&mut self.voices[v + 3], &render_ctx);
                v += 4;
            }
        } else {
            let mut vector_acc = [0.0_f32; 4];
            while v + 4 <= NUM_VOICES {
                let voice_samples = [
                    crate::voice::render_voice(&mut self.voices[v], &render_ctx),
                    crate::voice::render_voice(&mut self.voices[v + 1], &render_ctx),
                    crate::voice::render_voice(&mut self.voices[v + 2], &render_ctx),
                    crate::voice::render_voice(&mut self.voices[v + 3], &render_ctx),
                ];
                vector_acc = self.simd_backend.add4(vector_acc, voice_samples);
                v += 4;
            }
            mixed += self.simd_backend.horizontal_sum4(vector_acc);
        }

        while v < NUM_VOICES {
            mixed += crate::voice::render_voice(&mut self.voices[v], &render_ctx);
            v += 1;
        }
        mixed
    }

    fn apply_fx_and_limit(&mut self, mixed: f32, sr: f32, cz_dac_enabled: bool) -> f32 {
        let fx_out = self.fx.process(mixed);
        let colored = if cz_dac_enabled {
            self.cz_dac_color.process(fx_out, sr)
        } else {
            fx_out
        };
        let soft_limited = soft_clip_tanh(colored, SOFT_CLIP_DRIVE);
        soft_limited.clamp(-1.0, 1.0)
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

#[inline(always)]
fn get_mod_if_active(
    active: bool,
    cache: &ModMatrixCache,
    destination: ModDestination,
    sources: &ModSources,
) -> f32 {
    if active {
        cache.get(destination, sources)
    } else {
        0.0
    }
}
