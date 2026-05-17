#[cfg(feature = "std")]
use std::sync::Arc;

#[cfg(not(feature = "std"))]
use alloc::sync::Arc;

use crate::dsp_utils::{lfo_output_with_symmetry, random_hold_value};
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

            let lfo1_rate_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo1Rate,
                &pre_sources,
            );
            let lfo1_depth_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo1Depth,
                &pre_sources,
            );
            let lfo1_symmetry_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo1Symmetry,
                &pre_sources,
            );
            let lfo1_offset_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo1Offset,
                &pre_sources,
            );

            let lfo2_rate_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo2Rate,
                &pre_sources,
            );
            let lfo2_depth_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo2Depth,
                &pre_sources,
            );
            let lfo2_symmetry_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo2Symmetry,
                &pre_sources,
            );
            let lfo2_offset_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::Lfo2Offset,
                &pre_sources,
            );

            let random_rate_mod = get_mod_if_active(
                has_active_mod_routes,
                &mod_cache,
                ModDestination::RandomRate,
                &pre_sources,
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

            let (line1_modded, line2_modded) = if has_active_mod_routes {
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
                (self.line1_scratch, self.line2_scratch)
            } else {
                (p.line1, p.line2)
            };

            let mut mixed = 0.0_f32;
            let pitch_bend_semitones = self.pitch_bend * params.pitch_bend_range;
            let mod_wheel = self.mod_wheel;
            let aftertouch = self.aftertouch;
            let mut v = 0;
            if matches!(self.simd_backend, crate::simd::SimdBackend::Scalar) {
                while v + 4 <= NUM_VOICES {
                    mixed += crate::voice::render_voice(
                        &mut self.voices[v],
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
                        has_active_mod_routes,
                        &line1_plan,
                        &line2_plan,
                    );
                    mixed += crate::voice::render_voice(
                        &mut self.voices[v + 1],
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
                        has_active_mod_routes,
                        &line1_plan,
                        &line2_plan,
                    );
                    mixed += crate::voice::render_voice(
                        &mut self.voices[v + 2],
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
                        has_active_mod_routes,
                        &line1_plan,
                        &line2_plan,
                    );
                    mixed += crate::voice::render_voice(
                        &mut self.voices[v + 3],
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
                        has_active_mod_routes,
                        &line1_plan,
                        &line2_plan,
                    );
                    v += 4;
                }
            } else {
                let mut vector_acc = [0.0_f32; 4];
                while v + 4 <= NUM_VOICES {
                    let voice_samples = [
                        crate::voice::render_voice(
                            &mut self.voices[v],
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
                            has_active_mod_routes,
                            &line1_plan,
                            &line2_plan,
                        ),
                        crate::voice::render_voice(
                            &mut self.voices[v + 1],
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
                            has_active_mod_routes,
                            &line1_plan,
                            &line2_plan,
                        ),
                        crate::voice::render_voice(
                            &mut self.voices[v + 2],
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
                            has_active_mod_routes,
                            &line1_plan,
                            &line2_plan,
                        ),
                        crate::voice::render_voice(
                            &mut self.voices[v + 3],
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
                            has_active_mod_routes,
                            &line1_plan,
                            &line2_plan,
                        ),
                    ];
                    vector_acc = self.simd_backend.add4(vector_acc, voice_samples);
                    v += 4;
                }
                mixed += self.simd_backend.horizontal_sum4(vector_acc);
            }

            while v < NUM_VOICES {
                mixed += crate::voice::render_voice(
                    &mut self.voices[v],
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
                    has_active_mod_routes,
                    &line1_plan,
                    &line2_plan,
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
