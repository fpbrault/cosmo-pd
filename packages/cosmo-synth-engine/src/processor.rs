/// Top-level Cosmo PD-101 synthesizer engine.
extern crate alloc;

use alloc::vec::Vec;
use serde::Serialize;

use purr_synth_core::event::NoteId;
use purr_synth_core::runtime::{SynthRuntime, VoiceMode};
use purr_synth_core::voice_allocator::{HighestVoiceStealer, VoiceAllocator};

use crate::dsp_utils::{lfo_output_with_symmetry, random_hold_value};
use crate::envelope::normalize_synth_params_envelopes_to_raw_if_human;
use crate::fx::FxChain;
use crate::generators::PER_LINE_HEADROOM;
use crate::module_presets;
use crate::params::{FxSlotConfig, FxSlotType, ModDestination, PolyMode, SynthParams, NUM_VOICES};
use crate::pd101::{Pd101Patch, Pd101Synth, Pd101Telemetry, Pd101Voice};
use crate::voice::{mod_value_for, ModSources};

const SOFT_CLIP_DRIVE: f32 = 1.0;
const SOFT_CLIP_THRESHOLD: f32 = 0.9;
const REFERENCE_LINE_HEADROOM: f32 = 0.75;
const HEADROOM_MAKEUP_EXPONENT: f32 = 0.8;
const MAX_HEADROOM_MAKEUP: f32 = 1.0;

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeModSources {
    pub lfo1: f32,
    pub lfo2: f32,
    pub random: f32,
    pub mod_env: f32,
    pub velocity: f32,
    pub mod_wheel: f32,
    pub aftertouch: f32,
}

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceEnvState {
    pub value: f32,
    pub step: usize,
    pub releasing: bool,
    pub step_pos: u32,
    pub prev_level: f32,
}

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceLineState {
    pub dco: RuntimeVoiceEnvState,
    pub dcw: RuntimeVoiceEnvState,
    pub dca: RuntimeVoiceEnvState,
}

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceDebugState {
    pub index: usize,
    pub active: bool,
    pub is_releasing: bool,
    pub sustained: bool,
    pub note: Option<u8>,
    pub env_note: u8,
    pub velocity: f32,
    pub frequency: f32,
    pub current_freq: f32,
    pub target_freq: f32,
    pub phase1: f32,
    pub phase2: f32,
    pub anti_click_fade: u32,
    pub anti_click_attack: u32,
    pub release_tail_level: f32,
    pub line1: RuntimeVoiceLineState,
    pub line2: RuntimeVoiceLineState,
}

// ---------------------------------------------------------------------------
// CosmoProcessor
// ---------------------------------------------------------------------------

pub struct CosmoProcessor {
    pub runtime: SynthRuntime<Pd101Synth, Pd101Voice, HighestVoiceStealer>,
    pub fx: FxChain,
    pub lfo_phase: f32,
    pub lfo2_phase: f32,
    pub random_phase: f32,
    pub random_step: i32,
    pub random_hold: f32,
    pub sample_rate: f32,
    pub last_runtime_mod_sources: RuntimeModSources,
    pub telemetry: Pd101Telemetry,
}

impl CosmoProcessor {
    pub fn new(sample_rate: f32) -> Self {
        let voices: Vec<Pd101Voice> = (0..NUM_VOICES).map(|_| Pd101Voice::new()).collect();
        let mut patch = Pd101Patch::default();
        normalize_synth_params_envelopes_to_raw_if_human(&mut patch.params);

        let runtime = SynthRuntime::with_allocator(
            patch,
            voices,
            sample_rate,
            VoiceAllocator::new(HighestVoiceStealer),
        );

        let mut proc = Self {
            runtime,
            fx: FxChain::new(sample_rate),
            lfo_phase: 0.0,
            lfo2_phase: 0.0,
            random_phase: 0.0,
            random_step: 0,
            random_hold: random_hold_value(0),
            sample_rate,
            last_runtime_mod_sources: RuntimeModSources::default(),
            telemetry: Pd101Telemetry::default(),
        };
        proc.update_fx();
        proc
    }

    fn params(&self) -> &SynthParams {
        &self.runtime.patch().params
    }

    fn runtime_mod_source_voice_index(&self) -> Option<usize> {
        let runtimes = self.runtime.voice_runtimes();
        let voices = self.runtime.voices();
        runtimes
            .iter()
            .enumerate()
            .filter(|(i, rt)| rt.is_active() && voices[*i].note.is_some())
            .max_by_key(|(_, rt)| rt.started_at)
            .map(|(i, _)| i)
            .or_else(|| voices.iter().position(|v| v.mod_env.output > 0.0))
    }

    pub fn runtime_mod_sources(&self) -> RuntimeModSources {
        self.last_runtime_mod_sources
    }

    pub fn runtime_voice_debug_state(&self) -> Vec<RuntimeVoiceDebugState> {
        let runtimes = self.runtime.voice_runtimes();
        self.runtime
            .voices()
            .iter()
            .zip(runtimes.iter())
            .enumerate()
            .map(|(index, (voice, rt))| RuntimeVoiceDebugState {
                index,
                active: rt.is_active(),
                is_releasing: voice.is_releasing,
                sustained: voice.sustained,
                note: voice.note,
                env_note: voice.env_note,
                velocity: voice.velocity,
                frequency: voice.frequency,
                current_freq: voice.current_freq,
                target_freq: voice.target_freq,
                phase1: voice.phi1,
                phase2: voice.phi2,
                anti_click_fade: voice.anti_click_fade,
                anti_click_attack: voice.anti_click_attack,
                release_tail_level: voice.release_tail_level,
                line1: RuntimeVoiceLineState {
                    dco: RuntimeVoiceEnvState {
                        value: voice.line1_env.dco.output,
                        step: voice.line1_env.dco.step,
                        releasing: voice.line1_env.dco.releasing,
                        step_pos: voice.line1_env.dco.step_pos,
                        prev_level: voice.line1_env.dco.prev_level,
                    },
                    dcw: RuntimeVoiceEnvState {
                        value: voice.line1_env.dcw.output,
                        step: voice.line1_env.dcw.step,
                        releasing: voice.line1_env.dcw.releasing,
                        step_pos: voice.line1_env.dcw.step_pos,
                        prev_level: voice.line1_env.dcw.prev_level,
                    },
                    dca: RuntimeVoiceEnvState {
                        value: voice.line1_env.dca.output,
                        step: voice.line1_env.dca.step,
                        releasing: voice.line1_env.dca.releasing,
                        step_pos: voice.line1_env.dca.step_pos,
                        prev_level: voice.line1_env.dca.prev_level,
                    },
                },
                line2: RuntimeVoiceLineState {
                    dco: RuntimeVoiceEnvState {
                        value: voice.line2_env.dco.output,
                        step: voice.line2_env.dco.step,
                        releasing: voice.line2_env.dco.releasing,
                        step_pos: voice.line2_env.dco.step_pos,
                        prev_level: voice.line2_env.dco.prev_level,
                    },
                    dcw: RuntimeVoiceEnvState {
                        value: voice.line2_env.dcw.output,
                        step: voice.line2_env.dcw.step,
                        releasing: voice.line2_env.dcw.releasing,
                        step_pos: voice.line2_env.dcw.step_pos,
                        prev_level: voice.line2_env.dcw.prev_level,
                    },
                    dca: RuntimeVoiceEnvState {
                        value: voice.line2_env.dca.output,
                        step: voice.line2_env.dca.step,
                        releasing: voice.line2_env.dca.releasing,
                        step_pos: voice.line2_env.dca.step_pos,
                        prev_level: voice.line2_env.dca.prev_level,
                    },
                },
            })
            .collect()
    }

    pub fn update_fx(&mut self) {
        self.fx.sync_from_params(&self.runtime.patch().params);
    }

    pub fn set_params(&mut self, mut params: SynthParams) {
        normalize_synth_params_envelopes_to_raw_if_human(&mut params);
        let voice_mode = match params.poly_mode {
            PolyMode::Mono => VoiceMode::Monophonic {
                legato: params.legato,
            },
            PolyMode::Poly8 => VoiceMode::Polyphonic,
        };
        self.runtime.set_voice_mode(voice_mode);
        self.runtime.patch_mut().params = params;
        self.update_fx();
    }

    pub fn set_fx_slot_type(&mut self, slot: usize, slot_type: FxSlotType) {
        if slot < 6 {
            self.runtime.patch_mut().params.fx_slots[slot] =
                FxSlotConfig::default_for_type(slot_type);
            self.update_fx();
        }
    }

    pub fn get_fx_slot_types(&self) -> [FxSlotType; 6] {
        core::array::from_fn(|i| self.runtime.patch().params.fx_slots[i].slot_type())
    }

    pub fn apply_module_preset(&mut self, module: &str, preset: &str) -> bool {
        let applied = module_presets::apply_module_preset(
            &mut self.runtime.patch_mut().params,
            module,
            preset,
        );
        if applied {
            self.update_fx();
        }
        applied
    }

    /// Handle a note-on event.
    ///
    /// * `note`      — MIDI note number [0, 127]
    /// * `_frequency` — ignored; frequency is derived from `note` via MIDI standard mapping
    /// * `velocity`  — normalised velocity [0.0, 1.0]
    pub fn note_on(&mut self, note: u8, _frequency: f32, velocity: f32) {
        let vel = if velocity <= 0.0 { 1.0 } else { velocity };
        let vel = {
            let curve = self.params().velocity_curve;
            if curve.abs() < 0.001 {
                vel
            } else {
                let exponent = libm::powf(2.0_f32, -curve * 2.5);
                vel.clamp(0.0, 1.0).powf(exponent)
            }
        };

        if self.params().lfo.retrigger {
            self.lfo_phase = 0.0;
        }
        if self.params().lfo2.retrigger {
            self.lfo2_phase = 0.0;
        }

        let voice_mode = match self.params().poly_mode {
            PolyMode::Mono => VoiceMode::Monophonic {
                legato: self.params().legato,
            },
            PolyMode::Poly8 => VoiceMode::Polyphonic,
        };
        self.runtime.set_voice_mode(voice_mode);

        self.runtime.note_on(NoteId::new(note, vel));
    }

    pub fn note_off(&mut self, note: u8) {
        self.runtime.note_off(note);
    }

    pub fn set_sustain(&mut self, on: bool) {
        self.runtime.set_sustain(on);
    }

    pub fn set_pitch_bend(&mut self, value: f32) {
        self.runtime.set_pitch_bend(value);
    }

    pub fn set_mod_wheel(&mut self, value: f32) {
        self.runtime.set_mod_wheel(value);
    }

    pub fn set_aftertouch(&mut self, value: f32) {
        self.runtime.set_aftertouch(value);
    }

    pub fn process(&mut self, output: &mut [f32]) {
        let p = &self.runtime.patch().params;
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
        let matrix = p.mod_matrix.clone();
        let sr = self.sample_rate;
        let headroom_ratio = REFERENCE_LINE_HEADROOM / PER_LINE_HEADROOM.max(0.01);
        let headroom_makeup =
            libm::powf(headroom_ratio, HEADROOM_MAKEUP_EXPONENT).clamp(1.0, MAX_HEADROOM_MAKEUP);
        let norm = volume * headroom_makeup / libm::sqrtf(NUM_VOICES as f32);

        let mut prev_lfo1 = self.last_runtime_mod_sources.lfo1;
        let mut prev_lfo2 = self.last_runtime_mod_sources.lfo2;
        let mut prev_random = self.last_runtime_mod_sources.random;

        for sample_out in output.iter_mut() {
            let (source_mod_env, source_velocity) = self
                .runtime_mod_source_voice_index()
                .map(|i| {
                    let v = &self.runtime.voices()[i];
                    (v.mod_env.output, v.velocity)
                })
                .unwrap_or((0.0, 0.0));

            let pre_sources = ModSources::new(
                prev_lfo1,
                prev_lfo2,
                prev_random,
                source_mod_env,
                source_velocity,
                self.runtime.mod_wheel(),
                self.runtime.aftertouch(),
            );

            let lfo1_rate_mod = mod_value_for(ModDestination::Lfo1Rate, &matrix, &pre_sources);
            let lfo1_depth_mod = mod_value_for(ModDestination::Lfo1Depth, &matrix, &pre_sources);
            let lfo1_symmetry_mod =
                mod_value_for(ModDestination::Lfo1Symmetry, &matrix, &pre_sources);
            let lfo1_offset_mod = mod_value_for(ModDestination::Lfo1Offset, &matrix, &pre_sources);
            let lfo2_rate_mod = mod_value_for(ModDestination::Lfo2Rate, &matrix, &pre_sources);
            let lfo2_depth_mod = mod_value_for(ModDestination::Lfo2Depth, &matrix, &pre_sources);
            let lfo2_symmetry_mod =
                mod_value_for(ModDestination::Lfo2Symmetry, &matrix, &pre_sources);
            let lfo2_offset_mod = mod_value_for(ModDestination::Lfo2Offset, &matrix, &pre_sources);
            let random_rate_mod = mod_value_for(ModDestination::RandomRate, &matrix, &pre_sources);

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

            let random_rate = (base_random_rate + random_rate_mod * 20.0).clamp(0.01, 40.0);
            self.random_phase += random_rate / sr;
            if self.random_phase >= 1.0 {
                self.random_phase -= 1.0;
                self.random_step = self.random_step.wrapping_add(1);
                self.random_hold = random_hold_value(self.random_step);
            }
            let random_mod_val = self.random_hold;

            {
                let patch = self.runtime.patch_mut();
                patch.lfo1_out = lfo1_mod_val;
                patch.lfo2_out = lfo2_mod_val;
                patch.random_out = random_mod_val;
            }

            let frame = self.runtime.render_frame();
            let mixed = frame.left;

            let (mod_env, velocity) = self
                .runtime_mod_source_voice_index()
                .map(|i| {
                    let v = &self.runtime.voices()[i];
                    (v.mod_env.output, v.velocity)
                })
                .unwrap_or((0.0, 0.0));

            self.last_runtime_mod_sources = RuntimeModSources {
                lfo1: lfo1_mod_val,
                lfo2: lfo2_mod_val,
                random: random_mod_val,
                mod_env,
                velocity,
                mod_wheel: self.runtime.mod_wheel(),
                aftertouch: self.runtime.aftertouch(),
            };
            prev_lfo1 = lfo1_mod_val;
            prev_lfo2 = lfo2_mod_val;
            prev_random = random_mod_val;

            let scaled = mixed * norm;
            let fx_out = self.fx.process(scaled);
            let soft_limited = soft_clip_tanh(fx_out, SOFT_CLIP_DRIVE);
            let clamped = soft_limited.clamp(-1.0, 1.0);
            self.telemetry.push(clamped);
            *sample_out = clamped;
        }
    }

    pub fn find_voice_for_note(&self, note: u8) -> Option<usize> {
        self.runtime
            .voice_runtimes()
            .iter()
            .position(|rt| rt.note.is_some_and(|n| n.midi_note == note) && rt.is_active())
    }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

#[inline]
pub fn midi_note_to_freq(note: u8) -> f32 {
    440.0 * libm::powf(2.0, (note as f32 - 69.0) / 12.0)
}

#[inline]
fn soft_clip_tanh(sample: f32, drive: f32) -> f32 {
    if drive <= 0.0 {
        return sample;
    }

    let abs_sample = libm::fabsf(sample);
    if abs_sample <= SOFT_CLIP_THRESHOLD {
        return sample;
    }

    let norm = libm::tanhf(drive);
    if norm <= 0.0 {
        return sample;
    }

    let clipped = libm::tanhf(sample * drive) / norm;
    let blend = ((abs_sample - SOFT_CLIP_THRESHOLD) / (1.0 - SOFT_CLIP_THRESHOLD)).clamp(0.0, 1.0);
    sample + (clipped - sample) * blend
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{ModDestination, ModRoute, ModSource};

    fn active_voice_indices_for_note(proc: &CosmoProcessor, note: u8) -> Vec<usize> {
        proc.runtime
            .voice_runtimes()
            .iter()
            .zip(proc.runtime.voices().iter())
            .enumerate()
            .filter_map(|(idx, (rt, voice))| {
                (voice.note == Some(note) && rt.is_active() && !voice.is_releasing).then_some(idx)
            })
            .collect()
    }

    #[test]
    fn releasing_sustain_does_not_latch_old_voice_on_same_note_retrigger() {
        let mut proc = CosmoProcessor::new(48_000.0);
        let note = 60_u8;
        let freq = midi_note_to_freq(note);

        proc.note_on(note, freq, 1.0);
        proc.set_sustain(true);
        proc.note_off(note);

        proc.note_on(note, freq, 1.0);
        proc.set_sustain(false);

        let active_voice_indices = active_voice_indices_for_note(&proc, note);
        assert_eq!(
            active_voice_indices.len(),
            1,
            "expected only the latest retriggered voice to remain active",
        );

        proc.note_off(note);
        let mut scratch = [0.0_f32; 128];
        for _ in 0..400 {
            proc.process(&mut scratch);
        }

        let lingering = active_voice_indices_for_note(&proc, note);
        assert!(
            lingering.is_empty(),
            "note should fully release after note-off and enough process cycles",
        );
    }

    #[test]
    fn lfo_rate_destination_changes_runtime_lfo_phase_advance() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.runtime.patch_mut().params.mod_matrix.routes = alloc::vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::Lfo1Rate,
            amount: 1.0,
            enabled: true,
        }];

        let base_rate = proc.params().lfo.rate;
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        let expected_without_mod = base_rate / proc.sample_rate;
        assert!(proc.lfo_phase > expected_without_mod);
    }

    #[test]
    fn fx_destination_route_does_not_break_processing() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.runtime.patch_mut().params.mod_matrix.routes = alloc::vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::ChorusRate,
            amount: 1.0,
            enabled: true,
        }];
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        assert!(out[0].is_finite());
    }

    #[test]
    fn random_rate_destination_changes_random_phase_advance() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.runtime.patch_mut().params.mod_matrix.routes = alloc::vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::RandomRate,
            amount: 1.0,
            enabled: true,
        }];

        let base_rate = proc.params().random.rate;
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        let expected_without_mod = base_rate / proc.sample_rate;
        assert!(proc.random_phase > expected_without_mod);
    }
}
