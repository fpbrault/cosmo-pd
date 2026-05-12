//! Per-voice state and sample rendering for the Cosmo PD-101 engine.

extern crate alloc;

mod adsr;
mod modulation;
mod render;

pub use adsr::AdsrEnv;
pub(crate) use modulation::modulated_line_params;
pub(crate) use modulation::ModSources;
pub(crate) use render::render_voice;

use crate::envelope::EnvGen;
use crate::generators::AlgoRuntimeState;

pub(crate) const ANTI_CLICK_ATTACK_SAMPLES: u32 = 64;

const SILENCE_THRESHOLD: f32 = 0.001;
const ANTI_CLICK_FADE_SAMPLES: u32 = 64;
const ANTI_CLICK_FADE_MAX_SAMPLES: u32 = 1024;
const DCW_DEZIPPER_TIME_SECONDS: f32 = 0.0015;
const POP_SUPPRESS_DELTA_THRESHOLD: f32 = 1.2;
const POP_SUPPRESS_EXCESS_KEEP: f32 = 0.15;
const RELEASE_TAIL_LEVEL_TIME_SECONDS: f32 = 0.01;
const RELEASE_TAIL_LEVEL_THRESHOLD: f32 = 0.002;
const ZERO_CROSS_STOP_THRESHOLD: f32 = 0.0005;
const ZERO_CROSS_STOP_MAX_WAIT_SAMPLES: u32 = 1024;
const DCA_LEVEL_CURVE_EXPONENT: f32 = 1.5;
const DCW_LEVEL_CURVE_EXPONENT: f32 = 0.8;
const DUAL_LINE_MIX_GAIN: f32 = 0.8;
const DEFAULT_BASE_FREQ: f32 = 220.0;

/// The three envelope generators for a single oscillator line (DCO, DCW, DCA).
#[derive(Debug, Clone, Default)]
pub struct LineEnvs {
    pub dco: EnvGen,
    pub dcw: EnvGen,
    pub dca: EnvGen,
}

#[derive(Debug, Clone)]
pub struct Voice {
    pub phi1: f32,
    pub phi2: f32,
    pub cycle_count1: u32,
    pub cycle_count2: u32,
    pub pm_phi: f32,
    pub vibrato_phase: f32,
    pub vibrato_delay_counter: u32,
    pub current_freq: f32,
    pub target_freq: f32,
    pub glide_progress: f32,
    pub glide_start_freq: f32,
    pub is_releasing: bool,
    pub is_silent: bool,
    pub sustained: bool,
    pub gate_was_open: bool,
    pub note: Option<u8>,
    pub env_note: u8,
    pub frequency: f32,
    pub velocity: f32,
    pub line1_env: LineEnvs,
    pub line2_env: LineEnvs,
    pub mod_env: AdsrEnv,
    pub anti_click_fade: u32,
    pub anti_click_fade_len: u32,
    pub zero_cross_stop_pending: bool,
    pub zero_cross_stop_wait: u32,
    pub anti_click_attack: u32,
    pub smoothed_dcw1: f32,
    pub smoothed_dcw2: f32,
    pub last_output_sample: f32,
    pub release_tail_level: f32,
    pub algo_runtime: AlgoRuntimeState,
}

impl Voice {
    pub fn new() -> Self {
        Self {
            phi1: 0.0,
            phi2: 0.0,
            cycle_count1: 0,
            cycle_count2: 0,
            pm_phi: 0.0,
            vibrato_phase: 0.0,
            vibrato_delay_counter: 0,
            current_freq: 0.0,
            target_freq: 0.0,
            glide_progress: 0.0,
            glide_start_freq: 0.0,
            is_releasing: false,
            is_silent: true,
            sustained: false,
            gate_was_open: false,
            env_note: 60,
            note: None,
            frequency: 0.0,
            velocity: 1.0,
            line1_env: LineEnvs::default(),
            line2_env: LineEnvs::default(),
            mod_env: AdsrEnv::default(),
            anti_click_fade: 0,
            anti_click_fade_len: 0,
            zero_cross_stop_pending: false,
            zero_cross_stop_wait: 0,
            anti_click_attack: 0,
            smoothed_dcw1: 0.0,
            smoothed_dcw2: 0.0,
            last_output_sample: 0.0,
            release_tail_level: 0.0,
            algo_runtime: AlgoRuntimeState::default(),
        }
    }

    pub fn reset_envs(&mut self) {
        self.line1_env.dco.reset();
        self.line1_env.dcw.reset();
        self.line1_env.dca.reset();
        self.line2_env.dco.reset();
        self.line2_env.dcw.reset();
        self.line2_env.dca.reset();
        self.mod_env.reset();
    }
}

impl Default for Voice {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::modulation::mod_value_for;
    use super::ModSources;
    use super::{render::*, Voice};
    use crate::params::{
        LineParams, ModDestination, ModMatrix, ModMatrixCache, ModRoute, ModSource, SynthParams,
    };

    #[test]
    fn dca_gain_uses_gentle_power_taper() {
        assert_eq!(super::render::cz_dca_env_gain(0.0), 0.0);
        assert_eq!(super::render::cz_dca_env_gain(1.0), 1.0);
        assert!(super::render::cz_dca_env_gain(0.5) > 0.5);
        assert!(super::render::cz_dca_env_gain(0.75) > 0.75);
    }

    #[test]
    fn dcw_depth_uses_gentle_power_taper() {
        assert_eq!(super::render::cz_dcw_env_depth(0.0), 0.0);
        assert_eq!(super::render::cz_dcw_env_depth(1.0), 1.0);
        assert!(super::render::cz_dcw_env_depth(0.5) > 0.5);
        assert!(super::render::cz_dcw_env_depth(0.75) > 0.75);
    }

    #[test]
    fn dco_env_matches_cz_reference_semitone_points() {
        let cases = [
            (8_u8, 1.0_f32),
            (16_u8, 2.0_f32),
            (24_u8, 3.0_f32),
            (32_u8, 4.0_f32),
            (40_u8, 5.0_f32),
            (48_u8, 6.0_f32),
            (56_u8, 7.0_f32),
            (64_u8, 8.0_f32),
            (65_u8, 10.0_f32),
            (66_u8, 12.0_f32),
            (72_u8, 24.0_f32),
        ];
        for (level, expected_semitones) in cases {
            let normalized_level = level as f32 / 99.0;
            let got = super::render::cz_dco_env_semitones(normalized_level);
            assert!(
                (got - expected_semitones).abs() <= 0.02,
                "level {level}: expected {expected_semitones} st, got {got} st"
            );
        }
    }

    #[test]
    fn dco_env_level_66_is_one_octave_up() {
        let base_freq = 220.0_f32;
        let line = crate::params::LineParams::default();
        let level_66 = 66.0_f32 / 99.0;
        let got = super::render::line_frequency(base_freq, &line, level_66);
        let expected = base_freq * 2.0;
        assert!(
            (got - expected).abs() <= expected * 0.02,
            "expected about {expected} Hz at level 66, got {got} Hz"
        );
    }

    fn all_sources() -> [ModSource; 7] {
        [
            ModSource::Lfo1,
            ModSource::Lfo2,
            ModSource::Random,
            ModSource::ModEnv,
            ModSource::Velocity,
            ModSource::ModWheel,
            ModSource::Aftertouch,
        ]
    }

    fn all_destinations() -> [ModDestination; 51] {
        [
            ModDestination::Volume,
            ModDestination::Pitch,
            ModDestination::Line1DcwBase,
            ModDestination::Line1DcaBase,
            ModDestination::Line1AlgoBlend,
            ModDestination::Line2DetuneNote,
            ModDestination::Line1Octave,
            ModDestination::Line1AlgoParam1,
            ModDestination::Line1AlgoParam2,
            ModDestination::Line1AlgoParam3,
            ModDestination::Line1AlgoParam4,
            ModDestination::Line1AlgoParam5,
            ModDestination::Line1AlgoParam6,
            ModDestination::Line1AlgoParam7,
            ModDestination::Line1AlgoParam8,
            ModDestination::Line2DcwBase,
            ModDestination::Line2DcaBase,
            ModDestination::Line2AlgoBlend,
            ModDestination::Line2DetuneFine,
            ModDestination::Line2DetuneOctave,
            ModDestination::Line2AlgoParam1,
            ModDestination::Line2AlgoParam2,
            ModDestination::Line2AlgoParam3,
            ModDestination::Line2AlgoParam4,
            ModDestination::Line2AlgoParam5,
            ModDestination::Line2AlgoParam6,
            ModDestination::Line2AlgoParam7,
            ModDestination::Line2AlgoParam8,
            ModDestination::VibratoDepth,
            ModDestination::VibratoRate,
            ModDestination::IntPmRatio,
            ModDestination::Line1DcoEnvStep1Level,
            ModDestination::Line1DcoEnvStep1Rate,
            ModDestination::Line1DcwEnvStep3Level,
            ModDestination::Line1DcaEnvStep4Rate,
            ModDestination::Line2DcoEnvStep2Level,
            ModDestination::Line2DcwEnvStep6Rate,
            ModDestination::Line2DcaEnvStep8Level,
            ModDestination::PhaserRate,
            ModDestination::PhaserDepth,
            ModDestination::PhaserFeedback,
            ModDestination::PhaserMix,
            ModDestination::Lfo1Rate,
            ModDestination::Lfo1Depth,
            ModDestination::Lfo1Symmetry,
            ModDestination::Lfo1Offset,
            ModDestination::Lfo2Rate,
            ModDestination::Lfo2Depth,
            ModDestination::Lfo2Symmetry,
            ModDestination::Lfo2Offset,
            ModDestination::RandomRate,
        ]
    }

    fn source_value(sources: &ModSources, source: ModSource) -> f32 {
        match source {
            ModSource::Lfo1 => sources.lfo1,
            ModSource::Lfo2 => sources.lfo2,
            ModSource::Velocity => sources.velocity,
            ModSource::ModWheel => sources.mod_wheel,
            ModSource::Aftertouch => sources.aftertouch,
            ModSource::ModEnv => sources.mod_env,
            ModSource::Random => sources.random,
        }
    }

    #[test]
    fn every_source_can_drive_every_destination() {
        let sources = ModSources {
            lfo1: 0.25,
            lfo2: -0.4,
            velocity: 0.8,
            mod_wheel: 0.6,
            aftertouch: 0.3,
            mod_env: 0.5,
            random: -0.2,
        };
        let amount = 0.5;
        for destination in all_destinations() {
            for source in all_sources() {
                let matrix = ModMatrix {
                    routes: vec![ModRoute {
                        source,
                        destination,
                        amount,
                        enabled: true,
                    }],
                };
                let got = mod_value_for(destination, &matrix, &sources);
                let expected = (amount * source_value(&sources, source)).clamp(-1.0, 1.0);
                assert!(
                    (got - expected).abs() < 1e-6,
                    "unexpected route value for source={:?} destination={:?}: got {}, expected {}",
                    source,
                    destination,
                    got,
                    expected
                );
            }
        }
    }

    #[test]
    fn render_voice_returns_zero_for_silent_voice() {
        let mut voice = Voice::new();
        voice.is_silent = true;
        let p = SynthParams::default();
        let timing = crate::envelope::EnvelopeTimingCache::new(48_000.0);
        let sources = ModSources::new(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        let mut cache = ModMatrixCache::new();
        cache.compute(&sources);
        let default_line = LineParams::default();
        let out = render_voice(
            &mut voice,
            &p,
            0.0,
            0.0,
            0.0,
            &default_line,
            &default_line,
            48_000.0,
            &timing,
            0.0,
            0.0,
            0.0,
            &cache,
            [0.0; 8],
            [0.0; 8],
            [0.0; 8],
            [0.0; 8],
        );
        assert_eq!(out, 0.0);
    }

    #[test]
    fn render_voice_produces_nonzero_for_active_voice() {
        let mut voice = Voice::new();
        voice.frequency = 220.0;
        voice.env_note = 60;
        voice.is_silent = false;
        let p = SynthParams::default();
        let timing = crate::envelope::EnvelopeTimingCache::new(48_000.0);
        let sources = ModSources::new(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        let mut cache = ModMatrixCache::new();
        cache.compute(&sources);
        let default_line = LineParams::default();
        let mut any_nonzero = false;
        for _ in 0..64 {
            let out = render_voice(
                &mut voice,
                &p,
                0.0,
                0.0,
                0.0,
                &default_line,
                &default_line,
                48_000.0,
                &timing,
                0.0,
                0.0,
                0.0,
                &cache,
                [0.0; 8],
                [0.0; 8],
                [0.0; 8],
                [0.0; 8],
            );
            if out.abs() > 1e-6 {
                any_nonzero = true;
                break;
            }
        }
        assert!(any_nonzero, "expected nonzero output from active voice");
    }
}
