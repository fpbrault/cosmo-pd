use crate::default_envelopes::{default_dca_env, default_dco_env, default_dcw_env};
use serde::{Deserialize, Deserializer, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

pub const NUM_VOICES: usize = 8;
pub const NUM_ENV_STEPS: usize = 8;

/// A single step in a step envelope
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct EnvStep {
    /// Internal machine level [0, 127].
    #[serde(deserialize_with = "deserialize_step_value")]
    pub level: u8,
    /// Internal machine rate [0, 127].
    #[serde(deserialize_with = "deserialize_step_value")]
    pub rate: u8,
}

/// Accept value as either integer or float and normalize into [0, 127].
fn deserialize_step_value<'de, D: Deserializer<'de>>(d: D) -> Result<u8, D::Error> {
    let v = f64::deserialize(d)?;
    Ok(v.round().clamp(0.0, 127.0) as u8)
}

/// Step envelope data (CZ-style)
///
/// Field names match the JS `StepEnvData` type exactly (camelCase).
/// `steps` is always stored as a fixed [EnvStep; 8] internally; JS may
/// send a shorter array which gets padded with silent steps.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct StepEnvData {
    #[cfg_attr(feature = "specta-bindings", specta(type = Vec<EnvStep>))]
    pub steps: [EnvStep; NUM_ENV_STEPS],
    /// Which step to sustain on (0-based index into steps)
    #[cfg_attr(feature = "specta-bindings", specta(type = u32))]
    pub sustain_step: usize,
    /// Number of active steps (JS `stepCount`)
    #[cfg_attr(feature = "specta-bindings", specta(type = u32))]
    pub step_count: usize,
    /// Whether envelope loops after end
    #[serde(rename = "loop")]
    pub loop_: bool,
}

impl<'de> Deserialize<'de> for StepEnvData {
    fn deserialize<D: Deserializer<'de>>(d: D) -> Result<Self, D::Error> {
        #[derive(Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct Raw {
            steps: Vec<EnvStep>,
            sustain_step: usize,
            /// JS `stepCount` — older data may omit it; default to full length
            #[serde(default)]
            step_count: usize,
            #[serde(rename = "loop", default)]
            loop_: bool,
        }
        let mut raw = Raw::deserialize(d)?;
        // If step_count was missing or 0, use the number of provided steps
        if raw.step_count == 0 {
            raw.step_count = raw.steps.len().max(1);
        }
        let mut steps = [EnvStep { level: 0, rate: 0 }; NUM_ENV_STEPS];
        for (i, s) in raw.steps.iter().enumerate().take(NUM_ENV_STEPS) {
            steps[i] = *s;
        }
        Ok(StepEnvData {
            steps,
            sustain_step: raw.sustain_step,
            step_count: raw.step_count,
            loop_: raw.loop_,
        })
    }
}

impl Default for StepEnvData {
    fn default() -> Self {
        // Neutral envelope: single silent step, no loop.
        // Use default_dco_env/default_dcw_env/default_dca_env for kind-specific defaults.
        StepEnvData {
            steps: [EnvStep { level: 0, rate: 0 }; NUM_ENV_STEPS],
            sustain_step: 0,
            step_count: 1,
            loop_: false,
        }
    }
}

/// Low-level CZ waveform selector.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum CzWaveform {
    #[default]
    Saw,
    Square,
    Pulse,
    Null,
    SinePulse,
    SawPulse,
    MultiSine,
    Pulse2,
}

/// Base waveform used as the final carrier for warp algorithms.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum BaseWaveform {
    #[default]
    Cosine,
    Sine,
    Triangle,
    Saw,
    Square,
}

/// Front-panel CZ algorithm shortcuts.
///
/// These map to a `(CzWaveform, WindowType)` pair.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum CzAlgo {
    #[default]
    Saw,
    Square,
    Pulse,
    DoubleSine,
    SawPulse,
    Reso1,
    Reso2,
    Reso3,
}

impl CzAlgo {
    pub fn waveform(self) -> CzWaveform {
        match self {
            CzAlgo::Saw => CzWaveform::Saw,
            CzAlgo::Square => CzWaveform::Square,
            CzAlgo::Pulse => CzWaveform::Pulse,
            CzAlgo::DoubleSine => CzWaveform::SinePulse,
            CzAlgo::SawPulse => CzWaveform::SawPulse,
            CzAlgo::Reso1 | CzAlgo::Reso2 | CzAlgo::Reso3 => CzWaveform::MultiSine,
        }
    }

    pub fn window(self) -> WindowType {
        match self {
            CzAlgo::Saw
            | CzAlgo::Square
            | CzAlgo::Pulse
            | CzAlgo::DoubleSine
            | CzAlgo::SawPulse => WindowType::Off,
            CzAlgo::Reso1 => WindowType::Saw,
            CzAlgo::Reso2 => WindowType::Triangle,
            CzAlgo::Reso3 => WindowType::Trapezoid,
        }
    }
}

/// Flat algorithm selector — unifies CZ waveforms and warp variants.
/// Serializes as plain camelCase string (e.g., "saw", "bend", "sync").
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum Algo {
    // CZ waveforms — phase distortion with piecewise-linear carrier
    Saw,
    Square,
    Pulse,
    Null,
    SinePulse,
    SawPulse,
    MultiSine,
    Pulse2,
    // Warp algorithms — phase distortion applied to a sine carrier
    #[default]
    Cz101,
    Bend,
    Sync,
    Pinch,
    Fold,
    Skew,
    Quantize,
    Twist,
    Clip,
    Ripple,
    Mirror,
    Fof,
    Karpunk,
    Sine,
}

impl Algo {
    /// Convert a CZ waveform identifier into its corresponding `Algo` variant.
    pub fn from_cz_waveform(waveform: CzWaveform) -> Self {
        match waveform {
            CzWaveform::Saw => Algo::Saw,
            CzWaveform::Square => Algo::Square,
            CzWaveform::Pulse => Algo::Pulse,
            CzWaveform::Null => Algo::Null,
            CzWaveform::SinePulse => Algo::SinePulse,
            CzWaveform::SawPulse => Algo::SawPulse,
            CzWaveform::MultiSine => Algo::MultiSine,
            CzWaveform::Pulse2 => Algo::Pulse2,
        }
    }

    pub fn as_cz_waveform(self) -> Option<CzWaveform> {
        match self {
            Algo::Saw => Some(CzWaveform::Saw),
            Algo::Square => Some(CzWaveform::Square),
            Algo::Pulse => Some(CzWaveform::Pulse),
            Algo::Null => Some(CzWaveform::Null),
            Algo::SinePulse => Some(CzWaveform::SinePulse),
            Algo::SawPulse => Some(CzWaveform::SawPulse),
            Algo::MultiSine => Some(CzWaveform::MultiSine),
            Algo::Pulse2 => Some(CzWaveform::Pulse2),
            _ => None,
        }
    }

    pub fn is_cz_waveform(self) -> bool {
        self.as_cz_waveform().is_some()
    }
}

/// Window type applied to oscillator output
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum WindowType {
    #[default]
    Off,
    Saw,
    Triangle,
    Trapezoid,
    Pulse,
    DoubleSaw,
}

/// Line select
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub enum LineSelect {
    #[serde(rename = "L1+L2")]
    #[default]
    L1PlusL2,
    #[serde(rename = "L1")]
    L1,
    #[serde(rename = "L2")]
    L2,
    #[serde(rename = "L1+L1'")]
    L1PlusL1Prime,
    #[serde(rename = "L1+L2'")]
    L1PlusL2Prime,
}

/// Modulation mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModMode {
    #[default]
    Normal,
    Ring,
    Noise,
}

/// Polyphony mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum PolyMode {
    #[default]
    #[serde(rename = "poly8")]
    Poly8,
    Mono,
}

/// LFO waveform
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum LfoWaveform {
    #[default]
    Sine,
    Triangle,
    Square,
    Saw,
    InvertedSaw,
    Random,
}

/// Filter type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum FilterType {
    #[default]
    #[serde(rename = "lp")]
    Lp,
    #[serde(rename = "hp")]
    Hp,
    #[serde(rename = "bp")]
    Bp,
}

/// Portamento mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum PortamentoMode {
    #[default]
    Rate,
    Time,
}

/// One algorithm-specific control value persisted on a line.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoControlValueV1 {
    pub id: String,
    pub value: f32,
}

/// Per-line parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LineParams {
    pub algo: Algo,
    pub algo2: Option<Algo>,
    pub algo_blend: f32,
    #[serde(default)]
    pub base_waveform_a: BaseWaveform,
    #[serde(default)]
    pub base_waveform_b: BaseWaveform,
    pub window: WindowType,
    pub dca_base: f32,
    pub dcw_base: f32,
    pub modulation: f32,
    pub detune_cents: f32,
    pub octave: f32,
    pub dco_env: StepEnvData,
    pub dcw_env: StepEnvData,
    pub dca_env: StepEnvData,
    pub key_follow: f32,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub algo_controls_a: Option<Vec<AlgoControlValueV1>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub algo_controls_b: Option<Vec<AlgoControlValueV1>>,
}

impl Default for LineParams {
    fn default() -> Self {
        Self {
            algo: Algo::Saw,
            algo2: None,
            algo_blend: 0.0,
            base_waveform_a: BaseWaveform::default(),
            base_waveform_b: BaseWaveform::default(),
            window: WindowType::Off,
            dca_base: 1.0,
            dcw_base: 0.0,
            modulation: 0.0,
            detune_cents: 0.0,
            octave: 0.0,
            dco_env: default_dco_env(),
            dcw_env: default_dcw_env(),
            dca_env: default_dca_env(),
            key_follow: 0.0,
            algo_controls_a: None,
            algo_controls_b: None,
        }
    }
}

/// Chorus parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct ChorusParams {
    #[serde(default)]
    pub enabled: bool,
    pub rate: f32,
    pub depth: f32,
    pub mix: f32,
}

impl Default for ChorusParams {
    fn default() -> Self {
        Self {
            enabled: false,
            rate: 0.8,
            depth: 0.003,
            mix: 0.0,
        }
    }
}

/// Delay parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct DelayParams {
    #[serde(default)]
    pub enabled: bool,
    pub time: f32,
    pub feedback: f32,
    pub mix: f32,
    /// When true, applies tape echo characteristics (LP filter + soft saturation in feedback).
    #[serde(default)]
    pub tape_mode: bool,
    /// Tape warmth (0 = bright, 1 = warm). Only effective when `tape_mode` is true.
    #[serde(default = "default_delay_warmth")]
    pub warmth: f32,
}

fn default_delay_warmth() -> f32 {
    0.5
}

impl Default for DelayParams {
    fn default() -> Self {
        Self {
            enabled: false,
            time: 0.3,
            feedback: 0.35,
            mix: 0.0,
            tape_mode: false,
            warmth: 0.5,
        }
    }
}

/// Phaser parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct PhaserParams {
    #[serde(default)]
    pub enabled: bool,
    /// LFO rate in Hz (0.1–10 Hz)
    pub rate: f32,
    /// LFO depth: how much the all-pass center frequency is swept (0–1)
    pub depth: f32,
    /// Wet/dry mix (0–1)
    pub mix: f32,
    /// Feedback amount from phaser output back to input (-0.9–0.9)
    pub feedback: f32,
}

impl Default for PhaserParams {
    fn default() -> Self {
        Self {
            enabled: false,
            rate: 0.5,
            depth: 1.0,
            mix: 0.0,
            feedback: 0.5,
        }
    }
}

fn default_reverb_space() -> f32 {
    0.5
}

fn default_reverb_distance() -> f32 {
    0.3
}

fn default_reverb_character() -> f32 {
    0.65
}

/// Reverb parameters for the FDN reverb engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct ReverbParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub mix: f32,
    /// Decay time / room size. 0 = dead, 1 = large hall.
    #[serde(default = "default_reverb_space")]
    pub space: f32,
    /// Pre-delay time in seconds (0–0.1 s). Default 0.
    #[serde(default)]
    pub predelay: f32,
    /// Near/far blend between early reflections and late reverb. Default 0.3.
    #[serde(default = "default_reverb_distance")]
    pub distance: f32,
    /// Combined reverb tone and motion: 0 = dark/static, 1 = bright/shimmery. Default 0.65.
    #[serde(default = "default_reverb_character")]
    pub character: f32,
}

impl Default for ReverbParams {
    fn default() -> Self {
        Self {
            enabled: false,
            mix: 0.0,
            space: 0.5,
            predelay: 0.0,
            distance: 0.3,
            character: 0.65,
        }
    }
}

/// Phase modulation parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct PhaseModParams {
    pub enabled: bool,
    /// Internal PM depth (0.0–0.5)
    pub amount: f32,
    /// Modulator-to-carrier frequency ratio (0.5–8.0)
    pub ratio: f32,
    /// Apply PM before warp shaping when true
    pub pm_pre: bool,
}

impl Default for PhaseModParams {
    fn default() -> Self {
        Self {
            enabled: false,
            amount: 0.0,
            ratio: 1.0,
            pm_pre: true,
        }
    }
}

/// Vibrato parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct VibratoParams {
    pub enabled: bool,
    /// Waveform as integer 1-4 (JS sends a number: 1=sine 2=tri 3=sq 4=saw)
    pub waveform: u8,
    /// Rate in Hz
    pub rate: f32,
    /// Depth in "per mille" (divide by 1000 for pitch multiplier)
    pub depth: f32,
    /// Delay in milliseconds
    pub delay: f32,
}

impl Default for VibratoParams {
    fn default() -> Self {
        Self {
            enabled: false,
            waveform: 1,
            rate: 55.0,
            depth: 8.0,
            delay: 120.0,
        }
    }
}

/// Portamento parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct PortamentoParams {
    pub enabled: bool,
    pub mode: PortamentoMode,
    pub rate: f32,
    pub time: f32,
}

impl Default for PortamentoParams {
    fn default() -> Self {
        Self {
            enabled: false,
            mode: PortamentoMode::Rate,
            rate: 50.0,
            time: 0.5,
        }
    }
}

/// Parameters for the random (sample-and-hold) modulation source.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct RandomParams {
    /// Rate in Hz — how often the held value steps to a new random value.
    pub rate: f32,
}

impl Default for RandomParams {
    fn default() -> Self {
        Self { rate: 2.0 }
    }
}

/// ADSR mod envelope parameters.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct ModEnvParams {
    /// Attack time in seconds.
    pub attack: f32,
    /// Decay time in seconds.
    pub decay: f32,
    /// Sustain level [0, 1].
    pub sustain: f32,
    /// Release time in seconds.
    pub release: f32,
}

impl Default for ModEnvParams {
    fn default() -> Self {
        Self {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.2,
        }
    }
}

/// Modulation source selector for modulation matrix routes.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModSource {
    #[default]
    Lfo1,
    /// Secondary LFO source.
    Lfo2,
    /// Sample-and-hold random source with configurable rate.
    Random,
    /// Dedicated ADSR mod envelope.
    ModEnv,
    Velocity,
    ModWheel,
    Aftertouch,
}

/// Modulation destination selector for modulation matrix routes.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModDestination {
    #[default]
    Volume,
    Pitch,
    Line1DcwBase,
    Line1DcaBase,
    Line1AlgoBlend,
    Line1Detune,
    Line1Octave,
    Line1AlgoParam1,
    Line1AlgoParam2,
    Line1AlgoParam3,
    Line1AlgoParam4,
    Line1AlgoParam5,
    Line1AlgoParam6,
    Line1AlgoParam7,
    Line1AlgoParam8,
    Line2DcwBase,
    Line2DcaBase,
    Line2AlgoBlend,
    Line2Detune,
    Line2Octave,
    Line2AlgoParam1,
    Line2AlgoParam2,
    Line2AlgoParam3,
    Line2AlgoParam4,
    Line2AlgoParam5,
    Line2AlgoParam6,
    Line2AlgoParam7,
    Line2AlgoParam8,
    FilterCutoff,
    FilterResonance,
    FilterEnvAmount,
    ChorusMix,
    DelayMix,
    ReverbMix,
    VibratoDepth,
    VibratoRate,
    IntPmRatio,
    Line1DcoEnvStep1Level,
    Line1DcoEnvStep1Rate,
    Line1DcoEnvStep2Level,
    Line1DcoEnvStep2Rate,
    Line1DcoEnvStep3Level,
    Line1DcoEnvStep3Rate,
    Line1DcoEnvStep4Level,
    Line1DcoEnvStep4Rate,
    Line1DcoEnvStep5Level,
    Line1DcoEnvStep5Rate,
    Line1DcoEnvStep6Level,
    Line1DcoEnvStep6Rate,
    Line1DcoEnvStep7Level,
    Line1DcoEnvStep7Rate,
    Line1DcoEnvStep8Level,
    Line1DcoEnvStep8Rate,
    Line1DcwEnvStep1Level,
    Line1DcwEnvStep1Rate,
    Line1DcwEnvStep2Level,
    Line1DcwEnvStep2Rate,
    Line1DcwEnvStep3Level,
    Line1DcwEnvStep3Rate,
    Line1DcwEnvStep4Level,
    Line1DcwEnvStep4Rate,
    Line1DcwEnvStep5Level,
    Line1DcwEnvStep5Rate,
    Line1DcwEnvStep6Level,
    Line1DcwEnvStep6Rate,
    Line1DcwEnvStep7Level,
    Line1DcwEnvStep7Rate,
    Line1DcwEnvStep8Level,
    Line1DcwEnvStep8Rate,
    Line1DcaEnvStep1Level,
    Line1DcaEnvStep1Rate,
    Line1DcaEnvStep2Level,
    Line1DcaEnvStep2Rate,
    Line1DcaEnvStep3Level,
    Line1DcaEnvStep3Rate,
    Line1DcaEnvStep4Level,
    Line1DcaEnvStep4Rate,
    Line1DcaEnvStep5Level,
    Line1DcaEnvStep5Rate,
    Line1DcaEnvStep6Level,
    Line1DcaEnvStep6Rate,
    Line1DcaEnvStep7Level,
    Line1DcaEnvStep7Rate,
    Line1DcaEnvStep8Level,
    Line1DcaEnvStep8Rate,
    Line2DcoEnvStep1Level,
    Line2DcoEnvStep1Rate,
    Line2DcoEnvStep2Level,
    Line2DcoEnvStep2Rate,
    Line2DcoEnvStep3Level,
    Line2DcoEnvStep3Rate,
    Line2DcoEnvStep4Level,
    Line2DcoEnvStep4Rate,
    Line2DcoEnvStep5Level,
    Line2DcoEnvStep5Rate,
    Line2DcoEnvStep6Level,
    Line2DcoEnvStep6Rate,
    Line2DcoEnvStep7Level,
    Line2DcoEnvStep7Rate,
    Line2DcoEnvStep8Level,
    Line2DcoEnvStep8Rate,
    Line2DcwEnvStep1Level,
    Line2DcwEnvStep1Rate,
    Line2DcwEnvStep2Level,
    Line2DcwEnvStep2Rate,
    Line2DcwEnvStep3Level,
    Line2DcwEnvStep3Rate,
    Line2DcwEnvStep4Level,
    Line2DcwEnvStep4Rate,
    Line2DcwEnvStep5Level,
    Line2DcwEnvStep5Rate,
    Line2DcwEnvStep6Level,
    Line2DcwEnvStep6Rate,
    Line2DcwEnvStep7Level,
    Line2DcwEnvStep7Rate,
    Line2DcwEnvStep8Level,
    Line2DcwEnvStep8Rate,
    Line2DcaEnvStep1Level,
    Line2DcaEnvStep1Rate,
    Line2DcaEnvStep2Level,
    Line2DcaEnvStep2Rate,
    Line2DcaEnvStep3Level,
    Line2DcaEnvStep3Rate,
    Line2DcaEnvStep4Level,
    Line2DcaEnvStep4Rate,
    Line2DcaEnvStep5Level,
    Line2DcaEnvStep5Rate,
    Line2DcaEnvStep6Level,
    Line2DcaEnvStep6Rate,
    Line2DcaEnvStep7Level,
    Line2DcaEnvStep7Rate,
    Line2DcaEnvStep8Level,
    Line2DcaEnvStep8Rate,
    ChorusRate,
    ChorusDepth,
    DelayTime,
    DelayFeedback,
    DelayWarmth,
    ReverbSpace,
    ReverbPredelay,
    ReverbDistance,
    ReverbCharacter,
    PhaserRate,
    PhaserDepth,
    PhaserFeedback,
    PhaserMix,
    Lfo1Rate,
    Lfo1Depth,
    Lfo1Symmetry,
    Lfo1Offset,
    Lfo2Rate,
    Lfo2Depth,
    Lfo2Symmetry,
    Lfo2Offset,
    RandomRate,
    VibratoDelay,
    CompressorThreshold,
    CompressorRatio,
    CompressorMakeup,
    CompressorMix,
    GrainDelayTime,
    GrainDelayFeedback,
    GrainDelayScatter,
    GrainDelayDensity,
    GrainDelayMix,
    BitcrusherBits,
    BitcrusherRateReduction,
    BitcrusherMix,
    ShimmerVerbShimmer,
    ShimmerVerbSpace,
    ShimmerVerbMix,
    DistortionDrive,
    DistortionTone,
    DistortionMix,
    JunoChorusMix,
    RingModCarrierHz,
    RingModMix,
    TremoloRate,
    TremoloDepth,
    TremoloMix,
    WavefolderDrive,
    WavefolderFolds,
    WavefolderMix,
    LoFiDegrade,
    LoFiWowDepth,
    LoFiWowRate,
    LoFiFlutterDepth,
    LoFiFlutterRate,
    LoFiTone,
    LoFiMix,
    EqGain80,
    EqGain240,
    EqGain750,
    EqGain2200,
    EqGain8000,
}

/// A single modulation route assignment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModRoute {
    pub source: ModSource,
    pub destination: ModDestination,
    /// Modulation amount in range [-1.0, 1.0].
    pub amount: f32,
    pub enabled: bool,
}

impl Default for ModRoute {
    fn default() -> Self {
        Self {
            source: ModSource::Lfo1,
            destination: ModDestination::Volume,
            amount: 0.0,
            enabled: false,
        }
    }
}

/// Collection of modulation routes.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModMatrix {
    #[serde(default)]
    pub routes: Vec<ModRoute>,
}

/// LFO parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct LfoParams {
    pub waveform: LfoWaveform,
    /// Rate in Hz
    pub rate: f32,
    /// Depth [0, 1]
    pub depth: f32,
    /// Symmetry [0, 1] (0 = saw, 0.5 = triangle, 1 = reverse saw)
    pub symmetry: f32,
    /// Retrigger LFO on note-on
    pub retrigger: bool,
    /// DC offset/bias applied to LFO output [-1, 1]
    #[serde(default)]
    pub offset: f32,
}

impl Default for LfoParams {
    fn default() -> Self {
        Self {
            waveform: LfoWaveform::Sine,
            rate: 5.0,
            depth: 0.2,
            symmetry: 0.5,
            retrigger: false,
            offset: 0.0,
        }
    }
}

/// Filter parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct FilterParams {
    pub enabled: bool,
    #[serde(rename = "type")]
    pub filter_type: FilterType,
    pub cutoff: f32,
    pub resonance: f32,
    pub env_amount: f32,
}

impl Default for FilterParams {
    fn default() -> Self {
        Self {
            enabled: false,
            filter_type: FilterType::Lp,
            cutoff: 5000.0,
            resonance: 0.0,
            env_amount: 0.0,
        }
    }
}

/// FX slot type selector — determines which effect is active in a given slot.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum FxSlotType {
    #[default]
    Empty,
    Chorus,
    Phaser,
    Delay,
    Reverb,
    Vibrato,
    PhaseMod,
    Compressor,
    Eq5Band,
    GrainDelay,
    Bitcrusher,
    ShimmerVerb,
    Distortion,
    JunoChorus,
    RingMod,
    Tremolo,
    Wavefolder,
    LoFi,
}

/// Per-slot FX configuration — wraps effect-specific parameters with the slot type.
/// Serializes as `{"type": "chorus", "params": {...}}` for effects,
/// or `{"type": "empty"}` for empty slots.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(tag = "type", content = "params", rename_all = "camelCase")]
pub enum FxSlotConfig {
    Empty,
    Chorus(ChorusParams),
    Phaser(PhaserParams),
    Delay(DelayParams),
    Reverb(ReverbParams),
    Vibrato(VibratoParams),
    PhaseMod(PhaseModParams),
    Compressor(CompressorParams),
    Eq5Band(EqParams),
    GrainDelay(GrainDelayParams),
    Bitcrusher(BitcrusherParams),
    ShimmerVerb(ShimmerVerbParams),
    Distortion(DistortionParams),
    JunoChorus(JunoChorusParams),
    RingMod(RingModParams),
    Tremolo(TremoloParams),
    Wavefolder(WavefolderParams),
    LoFi(LoFiParams),
}

impl Default for FxSlotConfig {
    fn default() -> Self {
        Self::Empty
    }
}

impl FxSlotConfig {
    /// Return the `FxSlotType` discriminant for this slot configuration.
    pub fn slot_type(&self) -> FxSlotType {
        match self {
            Self::Empty => FxSlotType::Empty,
            Self::Chorus(_) => FxSlotType::Chorus,
            Self::Phaser(_) => FxSlotType::Phaser,
            Self::Delay(_) => FxSlotType::Delay,
            Self::Reverb(_) => FxSlotType::Reverb,
            Self::Vibrato(_) => FxSlotType::Vibrato,
            Self::PhaseMod(_) => FxSlotType::PhaseMod,
            Self::Compressor(_) => FxSlotType::Compressor,
            Self::Eq5Band(_) => FxSlotType::Eq5Band,
            Self::GrainDelay(_) => FxSlotType::GrainDelay,
            Self::Bitcrusher(_) => FxSlotType::Bitcrusher,
            Self::ShimmerVerb(_) => FxSlotType::ShimmerVerb,
            Self::Distortion(_) => FxSlotType::Distortion,
            Self::JunoChorus(_) => FxSlotType::JunoChorus,
            Self::RingMod(_) => FxSlotType::RingMod,
            Self::Tremolo(_) => FxSlotType::Tremolo,
            Self::Wavefolder(_) => FxSlotType::Wavefolder,
            Self::LoFi(_) => FxSlotType::LoFi,
        }
    }

    /// Whether the effect in this slot is currently enabled.
    pub fn is_enabled(&self) -> bool {
        match self {
            Self::Empty => false,
            Self::Chorus(p) => p.enabled,
            Self::Phaser(p) => p.enabled,
            Self::Delay(p) => p.enabled,
            Self::Reverb(p) => p.enabled,
            Self::Vibrato(p) => p.enabled,
            Self::PhaseMod(p) => p.enabled,
            Self::Compressor(p) => p.enabled,
            Self::Eq5Band(p) => p.enabled,
            Self::GrainDelay(p) => p.enabled,
            Self::Bitcrusher(p) => p.enabled,
            Self::ShimmerVerb(p) => p.enabled,
            Self::Distortion(p) => p.enabled,
            Self::JunoChorus(p) => p.enabled,
            Self::RingMod(p) => p.enabled,
            Self::Tremolo(p) => p.enabled,
            Self::Wavefolder(p) => p.enabled,
            Self::LoFi(p) => p.enabled,
        }
    }

    /// Create a default-params config for the given type with `enabled = true`.
    /// Used when the user selects a new effect type for a slot.
    pub fn default_for_type(slot_type: FxSlotType) -> Self {
        match slot_type {
            FxSlotType::Empty => Self::Empty,
            FxSlotType::Chorus => Self::Chorus(ChorusParams {
                enabled: true,
                ..ChorusParams::default()
            }),
            FxSlotType::Phaser => Self::Phaser(PhaserParams {
                enabled: true,
                ..PhaserParams::default()
            }),
            FxSlotType::Delay => Self::Delay(DelayParams {
                enabled: true,
                ..DelayParams::default()
            }),
            FxSlotType::Reverb => Self::Reverb(ReverbParams {
                enabled: true,
                ..ReverbParams::default()
            }),
            FxSlotType::Vibrato => Self::Vibrato(VibratoParams {
                enabled: true,
                ..VibratoParams::default()
            }),
            FxSlotType::PhaseMod => Self::PhaseMod(PhaseModParams {
                enabled: true,
                ..PhaseModParams::default()
            }),
            FxSlotType::Compressor => Self::Compressor(CompressorParams {
                enabled: true,
                ..CompressorParams::default()
            }),
            FxSlotType::Eq5Band => Self::Eq5Band(EqParams {
                enabled: true,
                ..EqParams::default()
            }),
            FxSlotType::GrainDelay => Self::GrainDelay(GrainDelayParams {
                enabled: true,
                ..GrainDelayParams::default()
            }),
            FxSlotType::Bitcrusher => Self::Bitcrusher(BitcrusherParams {
                enabled: true,
                ..BitcrusherParams::default()
            }),
            FxSlotType::ShimmerVerb => Self::ShimmerVerb(ShimmerVerbParams {
                enabled: true,
                ..ShimmerVerbParams::default()
            }),
            FxSlotType::Distortion => Self::Distortion(DistortionParams {
                enabled: true,
                ..DistortionParams::default()
            }),
            FxSlotType::JunoChorus => Self::JunoChorus(JunoChorusParams {
                enabled: true,
                ..JunoChorusParams::default()
            }),
            FxSlotType::RingMod => Self::RingMod(RingModParams {
                enabled: true,
                ..RingModParams::default()
            }),
            FxSlotType::Tremolo => Self::Tremolo(TremoloParams {
                enabled: true,
                ..TremoloParams::default()
            }),
            FxSlotType::Wavefolder => Self::Wavefolder(WavefolderParams {
                enabled: true,
                ..WavefolderParams::default()
            }),
            FxSlotType::LoFi => Self::LoFi(LoFiParams {
                enabled: true,
                ..LoFiParams::default()
            }),
        }
    }
}

/// Compressor parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct CompressorParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_compressor_threshold")]
    pub threshold_db: f32,
    #[serde(default = "default_compressor_ratio")]
    pub ratio: f32,
    #[serde(default = "default_compressor_attack")]
    pub attack_ms: f32,
    #[serde(default = "default_compressor_release")]
    pub release_ms: f32,
    #[serde(default = "default_compressor_makeup")]
    pub makeup_db: f32,
    #[serde(default = "default_one")]
    pub mix: f32,
}

fn default_compressor_threshold() -> f32 {
    -12.0
}
fn default_compressor_ratio() -> f32 {
    4.0
}
fn default_compressor_attack() -> f32 {
    5.0
}
fn default_compressor_release() -> f32 {
    100.0
}
fn default_compressor_makeup() -> f32 {
    6.0
}
fn default_one() -> f32 {
    1.0
}

impl Default for CompressorParams {
    fn default() -> Self {
        Self {
            enabled: false,
            threshold_db: -12.0,
            ratio: 4.0,
            attack_ms: 5.0,
            release_ms: 100.0,
            makeup_db: 6.0,
            mix: 1.0,
        }
    }
}

/// 5-band EQ parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct EqParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub gain80: f32,
    #[serde(default)]
    pub gain240: f32,
    #[serde(default)]
    pub gain750: f32,
    #[serde(default)]
    pub gain2200: f32,
    #[serde(default)]
    pub gain8000: f32,
}

impl Default for EqParams {
    fn default() -> Self {
        Self {
            enabled: false,
            gain80: 0.0,
            gain240: 0.0,
            gain750: 0.0,
            gain2200: 0.0,
            gain8000: 0.0,
        }
    }
}

/// Grain delay parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct GrainDelayParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_grain_delay_time")]
    pub time: f32,
    #[serde(default)]
    pub feedback: f32,
    #[serde(default)]
    pub scatter: f32,
    #[serde(default = "default_half")]
    pub density: f32,
    #[serde(default)]
    pub mix: f32,
}

fn default_grain_delay_time() -> f32 {
    0.25
}
fn default_half() -> f32 {
    0.5
}

impl Default for GrainDelayParams {
    fn default() -> Self {
        Self {
            enabled: false,
            time: 0.25,
            feedback: 0.0,
            scatter: 0.0,
            density: 0.5,
            mix: 0.0,
        }
    }
}

/// Bitcrusher parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct BitcrusherParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_bits")]
    pub bits: f32,
    #[serde(default = "default_one")]
    pub rate_reduction: f32,
    #[serde(default = "default_one")]
    pub mix: f32,
}

fn default_bits() -> f32 {
    8.0
}

impl Default for BitcrusherParams {
    fn default() -> Self {
        Self {
            enabled: false,
            bits: 8.0,
            rate_reduction: 1.0,
            mix: 1.0,
        }
    }
}

/// Shimmer verb parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ShimmerVerbParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_shimmer")]
    pub shimmer: f32,
    #[serde(default = "default_shimmer_space")]
    pub space: f32,
    #[serde(default)]
    pub mix: f32,
}

fn default_shimmer() -> f32 {
    0.4
}
fn default_shimmer_space() -> f32 {
    0.7
}

impl Default for ShimmerVerbParams {
    fn default() -> Self {
        Self {
            enabled: false,
            shimmer: 0.4,
            space: 0.7,
            mix: 0.0,
        }
    }
}

/// Distortion parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct DistortionParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub mode: u8,
    #[serde(default = "default_half")]
    pub drive: f32,
    #[serde(default = "default_half")]
    pub tone: f32,
    #[serde(default = "default_one")]
    pub mix: f32,
}

impl Default for DistortionParams {
    fn default() -> Self {
        Self {
            enabled: false,
            mode: 0,
            drive: 0.5,
            tone: 0.5,
            mix: 1.0,
        }
    }
}

/// LoFi effect parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LoFiParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_lofi_degrade")]
    pub degrade: f32,
    #[serde(default = "default_lofi_wow_depth")]
    pub wow_depth: f32,
    #[serde(default = "default_lofi_wow_rate")]
    pub wow_rate: f32,
    #[serde(default = "default_lofi_flutter_depth")]
    pub flutter_depth: f32,
    #[serde(default = "default_lofi_flutter_rate")]
    pub flutter_rate: f32,
    #[serde(default = "default_lofi_tone")]
    pub tone: f32,
    #[serde(default = "default_one")]
    pub mix: f32,
}

fn default_lofi_degrade() -> f32 {
    0.25
}
fn default_lofi_wow_depth() -> f32 {
    0.07
}
fn default_lofi_wow_rate() -> f32 {
    0.42
}
fn default_lofi_flutter_depth() -> f32 {
    0.036
}
fn default_lofi_flutter_rate() -> f32 {
    6.7
}
fn default_lofi_tone() -> f32 {
    0.45
}

impl Default for LoFiParams {
    fn default() -> Self {
        Self {
            enabled: false,
            degrade: 0.25,
            wow_depth: 0.07,
            wow_rate: 0.42,
            flutter_depth: 0.036,
            flutter_rate: 6.7,
            tone: 0.45,
            mix: 1.0,
        }
    }
}

/// Juno-style chorus parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct JunoChorusParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub mode: u8,
    #[serde(default = "default_half")]
    pub mix: f32,
}

impl Default for JunoChorusParams {
    fn default() -> Self {
        Self {
            enabled: false,
            mode: 0,
            mix: 0.5,
        }
    }
}

/// Ring modulator parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct RingModParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_carrier_hz")]
    pub carrier_hz: f32,
    #[serde(default = "default_one")]
    pub mix: f32,
}

fn default_carrier_hz() -> f32 {
    440.0
}

impl Default for RingModParams {
    fn default() -> Self {
        Self {
            enabled: false,
            carrier_hz: 440.0,
            mix: 1.0,
        }
    }
}

/// Tremolo parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct TremoloParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_tremolo_rate")]
    pub rate: f32,
    #[serde(default = "default_half")]
    pub depth: f32,
    #[serde(default)]
    pub waveform: u8,
    #[serde(default = "default_one")]
    pub mix: f32,
}

fn default_tremolo_rate() -> f32 {
    4.0
}

impl Default for TremoloParams {
    fn default() -> Self {
        Self {
            enabled: false,
            rate: 4.0,
            depth: 0.5,
            waveform: 0,
            mix: 1.0,
        }
    }
}

/// Wavefolder parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct WavefolderParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_half")]
    pub drive: f32,
    #[serde(default = "default_half")]
    pub folds: f32,
    #[serde(default = "default_one")]
    pub mix: f32,
}

impl Default for WavefolderParams {
    fn default() -> Self {
        Self {
            enabled: false,
            drive: 0.5,
            folds: 0.5,
            mix: 1.0,
        }
    }
}

pub(crate) fn default_fx_slot_configs() -> [FxSlotConfig; 6] {
    [
        FxSlotConfig::Empty,
        FxSlotConfig::Empty,
        FxSlotConfig::Empty,
        FxSlotConfig::Vibrato(VibratoParams::default()),
        FxSlotConfig::PhaseMod(PhaseModParams::default()),
        FxSlotConfig::Empty,
    ]
}

/// Top-level synth parameters (mirrors this.params in the JS)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct SynthParams {
    pub line_select: LineSelect,
    pub mod_mode: ModMode,
    #[serde(default = "default_ring_gain")]
    pub ring_gain: f32,
    pub octave: f32,
    pub line1: LineParams,
    pub line2: LineParams,
    pub frequency: f32,
    pub volume: f32,
    pub poly_mode: PolyMode,
    pub legato: bool,
    pub portamento: PortamentoParams,
    pub lfo: LfoParams,
    #[serde(default)]
    pub lfo2: LfoParams,
    /// Velocity curve exponent [-1, 1]. 0 = linear, >0 = convex, <0 = concave.
    #[serde(default)]
    pub velocity_curve: f32,
    /// Pitch bend wheel range in semitones (1-24). Default 2.
    #[serde(default = "default_pitch_bend_range")]
    pub pitch_bend_range: f32,
    /// Modulation matrix routes for source-to-destination parameter modulation.
    #[serde(default)]
    pub mod_matrix: ModMatrix,
    /// Parameters for the random (sample-and-hold) modulation source.
    #[serde(default)]
    pub random: RandomParams,
    /// Parameters for the ADSR mod envelope.
    #[serde(default)]
    pub mod_env: ModEnvParams,
    /// Per-slot FX configuration. Default is all 6 slots empty.
    #[serde(default = "default_fx_slot_configs")]
    pub fx_slots: [FxSlotConfig; 6],
}

pub(crate) fn default_pitch_bend_range() -> f32 {
    2.0
}

pub(crate) fn default_ring_gain() -> f32 {
    4.0
}

impl SynthParams {
    /// Returns a reference to vibrato params from the fx_slots, if present.
    pub fn vibrato_params(&self) -> Option<&VibratoParams> {
        self.fx_slots.iter().find_map(|s| {
            if let FxSlotConfig::Vibrato(p) = s {
                Some(p)
            } else {
                None
            }
        })
    }

    /// Returns a reference to phase mod params from the fx_slots, if present.
    pub fn phase_mod_params(&self) -> Option<&PhaseModParams> {
        self.fx_slots.iter().find_map(|s| {
            if let FxSlotConfig::PhaseMod(p) = s {
                Some(p)
            } else {
                None
            }
        })
    }
}

impl Default for SynthParams {
    fn default() -> Self {
        Self {
            line_select: LineSelect::default(),
            mod_mode: ModMode::default(),
            ring_gain: default_ring_gain(),
            octave: 0.0,
            line1: LineParams::default(),
            line2: LineParams::default(),
            frequency: 220.0,
            volume: 0.4,
            poly_mode: PolyMode::default(),
            legato: false,
            portamento: PortamentoParams::default(),
            lfo: LfoParams::default(),
            lfo2: LfoParams::default(),
            velocity_curve: 0.0,
            pitch_bend_range: 2.0,
            mod_matrix: ModMatrix::default(),
            random: RandomParams::default(),
            mod_env: ModEnvParams::default(),
            fx_slots: default_fx_slot_configs(),
        }
    }
}

/// Readout label for one string enum value.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(specta::Type))]
#[serde(rename_all = "camelCase")]
pub struct EngineEnumValueLabelV1 {
    pub value: &'static str,
    pub label: &'static str,
}

/// Engine-owned formatting strategy for infobar readouts.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(specta::Type))]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum EngineParamReadoutFormatV1 {
    OnOff,
    Raw,
    Uppercase,
    Integer,
    Decimal,
    Percent,
    BipolarPercent,
    Degrees,
    Semitones,
    Milliseconds,
    Seconds2,
    Hertz,
    EnumMap {
        values: &'static [EngineEnumValueLabelV1],
    },
}

/// Engine-owned UI metadata for one parameter key.
#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineParamUiMetaV1 {
    pub key: &'static str,
    pub tooltip: &'static str,
    pub readout_label: &'static str,
    pub readout_format: EngineParamReadoutFormatV1,
}

/// Tooltip metadata for enum-like button choices.
#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineEnumValueTooltipV1 {
    pub key: &'static str,
    pub value: &'static str,
    pub tooltip: &'static str,
}

const POLY_MODE_LABELS_V1: [EngineEnumValueLabelV1; 2] = [
    EngineEnumValueLabelV1 {
        value: "poly8",
        label: "POLY 8",
    },
    EngineEnumValueLabelV1 {
        value: "mono",
        label: "MONO",
    },
];

const ENGINE_PARAM_UI_META_V1: [EngineParamUiMetaV1; 55] = [
    EngineParamUiMetaV1 {
        key: "volume",
        tooltip: "Sets the global synth output level.",
        readout_label: "Volume",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "warpAAmount",
        tooltip: "Sets base harmonic warp amount for this line.",
        readout_label: "Line 1 DCW",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "warpBAmount",
        tooltip: "Sets base harmonic warp amount for this line.",
        readout_label: "Line 2 DCW",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "algoBlendA",
        tooltip: "Crossfades between Algo A and Algo B outputs.",
        readout_label: "Line 1 Blend",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "algoBlendB",
        tooltip: "Crossfades between Algo A and Algo B outputs.",
        readout_label: "Line 2 Blend",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "line1Level",
        tooltip: "Sets base output level for this line.",
        readout_label: "Line 1 Level",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "line2Level",
        tooltip: "Sets base output level for this line.",
        readout_label: "Line 2 Level",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "line1Octave",
        tooltip: "Transposes this line by octave steps.",
        readout_label: "Line 1 Octave",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2Octave",
        tooltip: "Transposes this line by octave steps.",
        readout_label: "Line 2 Octave",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line1Detune",
        tooltip: "Fine tunes this line in cents.",
        readout_label: "Line 1 Detune",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2Detune",
        tooltip: "Fine tunes this line in cents.",
        readout_label: "Line 2 Detune",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "lineSelect",
        tooltip: "Selects which oscillator lines are heard together.",
        readout_label: "Line Select",
        readout_format: EngineParamReadoutFormatV1::Raw,
    },
    EngineParamUiMetaV1 {
        key: "modMode",
        tooltip: "Chooses the interaction mode between oscillator lines.",
        readout_label: "Modulation",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "polyMode",
        tooltip: "Switches between polyphonic and monophonic note allocation.",
        readout_label: "Voice Mode",
        readout_format: EngineParamReadoutFormatV1::EnumMap {
            values: &POLY_MODE_LABELS_V1,
        },
    },
    EngineParamUiMetaV1 {
        key: "intPmAmount",
        tooltip: "Sets internal phase modulation depth.",
        readout_label: "PM Amount",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "intPmRatio",
        tooltip: "Sets modulator-to-carrier frequency ratio.",
        readout_label: "PM Ratio",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "pmPre",
        tooltip: "Apply phase modulation before warp shaping.",
        readout_label: "PM Mode",
        readout_format: EngineParamReadoutFormatV1::OnOff,
    },
    EngineParamUiMetaV1 {
        key: "vibratoRate",
        tooltip: "Sets vibrato speed.",
        readout_label: "Vibrato Rate",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "vibratoDepth",
        tooltip: "Sets vibrato pitch modulation depth.",
        readout_label: "Vibrato Depth",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "vibratoDelay",
        tooltip: "Delays vibrato onset after note start.",
        readout_label: "Vibrato Delay",
        readout_format: EngineParamReadoutFormatV1::Milliseconds,
    },
    EngineParamUiMetaV1 {
        key: "lfoWaveform",
        tooltip: "Selects LFO 1 waveform shape.",
        readout_label: "LFO Wave",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "lfoRate",
        tooltip: "Sets LFO 1 speed.",
        readout_label: "LFO Rate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoDepth",
        tooltip: "Sets LFO 1 modulation depth.",
        readout_label: "LFO Depth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoOffset",
        tooltip: "Offsets LFO 1 output around zero.",
        readout_label: "LFO Offset",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Rate",
        tooltip: "Sets LFO 2 speed.",
        readout_label: "LFO 2 Rate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Depth",
        tooltip: "Sets LFO 2 modulation depth.",
        readout_label: "LFO 2 Depth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Offset",
        tooltip: "Offsets LFO 2 output around zero.",
        readout_label: "LFO 2 Offset",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "randomRate",
        tooltip: "Sets sample-and-hold random modulation refresh rate.",
        readout_label: "Random Rate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "modEnvAttack",
        tooltip: "Sets modulation envelope attack time.",
        readout_label: "Mod Env Attack",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "modEnvDecay",
        tooltip: "Sets modulation envelope decay time.",
        readout_label: "Mod Env Decay",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "modEnvSustain",
        tooltip: "Sets sustained modulation level while note is held.",
        readout_label: "Mod Env Sustain",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "modEnvRelease",
        tooltip: "Sets modulation envelope release time after note off.",
        readout_label: "Mod Env Release",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "filterType",
        tooltip: "Selects the filter response shape.",
        readout_label: "Filter Type",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "filterCutoff",
        tooltip: "Sets the filter cutoff frequency.",
        readout_label: "Filter Cutoff",
        readout_format: EngineParamReadoutFormatV1::Hertz,
    },
    EngineParamUiMetaV1 {
        key: "filterResonance",
        tooltip: "Boosts frequencies around the cutoff point.",
        readout_label: "Filter Resonance",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "filterEnvAmount",
        tooltip: "Applies envelope modulation amount to the cutoff.",
        readout_label: "Filter Env",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusRate",
        tooltip: "Sets chorus modulation speed.",
        readout_label: "Chorus Rate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusDepth",
        tooltip: "Sets intensity of chorus pitch modulation.",
        readout_label: "Chorus Depth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusMix",
        tooltip: "Blends dry signal with chorus effect.",
        readout_label: "Chorus Mix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayTime",
        tooltip: "Sets the delay repeat interval.",
        readout_label: "Delay Time",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "delayFeedback",
        tooltip: "Feeds delayed signal back for additional repeats.",
        readout_label: "Delay Feedback",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayWarmth",
        tooltip: "Adds tape-style saturation and high-frequency rolloff.",
        readout_label: "Delay Warmth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayMix",
        tooltip: "Blends dry signal with delayed signal.",
        readout_label: "Delay Mix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayTapeMode",
        tooltip: "Toggle tape echo coloration for delay repeats.",
        readout_label: "Tape Mode",
        readout_format: EngineParamReadoutFormatV1::OnOff,
    },
    EngineParamUiMetaV1 {
        key: "reverbSpace",
        tooltip: "Sets the virtual room size for reverb reflections.",
        readout_label: "Reverb Space",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbPredelay",
        tooltip: "Adds delay before the reverb tail starts.",
        readout_label: "Reverb Pre-Delay",
        readout_format: EngineParamReadoutFormatV1::Milliseconds,
    },
    EngineParamUiMetaV1 {
        key: "reverbDistance",
        tooltip: "Moves source position deeper into the reverb space.",
        readout_label: "Reverb Distance",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbCharacter",
        tooltip: "Shapes reverb tone from dark to bright.",
        readout_label: "Reverb Character",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbMix",
        tooltip: "Blends dry signal with reverb output.",
        readout_label: "Reverb Mix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "portamentoMode",
        tooltip: "Chooses whether glide uses rate or fixed time behavior.",
        readout_label: "Portamento Mode",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "portamentoRate",
        tooltip: "Sets glide speed when portamento mode is Rate.",
        readout_label: "Portamento Rate",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "portamentoTime",
        tooltip: "Sets glide duration when portamento mode is Time.",
        readout_label: "Portamento Time",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "pitchBendRange",
        tooltip: "Sets maximum pitch bend range in semitones.",
        readout_label: "Bend Range",
        readout_format: EngineParamReadoutFormatV1::Semitones,
    },
    EngineParamUiMetaV1 {
        key: "velocityCurve",
        tooltip: "Shapes how keyboard velocity maps to output level.",
        readout_label: "Vel Curve",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "modWheelVibratoDepth",
        tooltip: "Sets how much mod wheel movement affects vibrato depth.",
        readout_label: "Mod to Vibrato",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
];

const ENGINE_ENUM_VALUE_TOOLTIPS_V1: [EngineEnumValueTooltipV1; 13] = [
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1",
        tooltip: "Play oscillator line 1 only.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1+L2",
        tooltip: "Layer oscillator lines 1 and 2.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L2",
        tooltip: "Play oscillator line 2 only.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1+L1'",
        tooltip: "Stack line 1 with a detuned variant.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1+L2'",
        tooltip: "Layer line 1 with a detuned line 2 variant.",
    },
    EngineEnumValueTooltipV1 {
        key: "modMode",
        value: "normal",
        tooltip: "Standard phase modulation behavior.",
    },
    EngineEnumValueTooltipV1 {
        key: "modMode",
        value: "ring",
        tooltip: "Enable ring modulation between lines.",
    },
    EngineEnumValueTooltipV1 {
        key: "modMode",
        value: "noise",
        tooltip: "Mix noise source into modulation path.",
    },
    EngineEnumValueTooltipV1 {
        key: "filterType",
        value: "lp",
        tooltip: "Low-pass mode: attenuates frequencies above cutoff.",
    },
    EngineEnumValueTooltipV1 {
        key: "filterType",
        value: "hp",
        tooltip: "High-pass mode: attenuates frequencies below cutoff.",
    },
    EngineEnumValueTooltipV1 {
        key: "filterType",
        value: "bp",
        tooltip: "Band-pass mode: emphasizes a narrow band around cutoff.",
    },
    EngineEnumValueTooltipV1 {
        key: "portamentoMode",
        value: "rate",
        tooltip: "Portamento time scales with note interval distance.",
    },
    EngineEnumValueTooltipV1 {
        key: "portamentoMode",
        value: "time",
        tooltip: "Portamento uses a fixed glide time between notes.",
    },
];

pub fn engine_param_ui_meta_v1() -> &'static [EngineParamUiMetaV1] {
    &ENGINE_PARAM_UI_META_V1
}

/// Engine-owned numeric defaults for UI parameters where a concrete number
/// exists and should be reused by frontend state initialization.
pub fn engine_param_default_v1(key: &str) -> Option<f32> {
    let synth = SynthParams::default();
    let line1 = &synth.line1;
    let line2 = &synth.line2;
    let phase_mod = PhaseModParams::default();
    let vibrato = VibratoParams::default();
    let filter = FilterParams::default();
    let chorus = ChorusParams::default();
    let delay = DelayParams::default();
    let reverb = ReverbParams::default();
    let phaser = PhaserParams::default();

    match key {
        "volume" => Some(synth.volume),
        "warpAAmount" => Some(line1.dcw_base),
        "warpBAmount" => Some(line2.dcw_base),
        "algoBlendA" => Some(line1.algo_blend),
        "algoBlendB" => Some(line2.algo_blend),
        "line1Level" => Some(line1.dca_base),
        "line2Level" => Some(line2.dca_base),
        "line1Octave" => Some(line1.octave),
        "line2Octave" => Some(line2.octave),
        "line1Detune" => Some(line1.detune_cents),
        "line2Detune" => Some(line2.detune_cents),
        "intPmAmount" => Some(phase_mod.amount),
        "intPmRatio" => Some(phase_mod.ratio),
        "pmPre" => Some(if phase_mod.pm_pre { 1.0 } else { 0.0 }),
        "vibratoRate" => Some(vibrato.rate),
        "vibratoDepth" => Some(vibrato.depth),
        "vibratoDelay" => Some(vibrato.delay),
        "lfoRate" => Some(synth.lfo.rate),
        "lfoDepth" => Some(synth.lfo.depth),
        "lfoOffset" => Some(synth.lfo.offset),
        "lfo2Rate" => Some(synth.lfo2.rate),
        "lfo2Depth" => Some(synth.lfo2.depth),
        "lfo2Offset" => Some(synth.lfo2.offset),
        "randomRate" => Some(synth.random.rate),
        "modEnvAttack" => Some(synth.mod_env.attack),
        "modEnvDecay" => Some(synth.mod_env.decay),
        "modEnvSustain" => Some(synth.mod_env.sustain),
        "modEnvRelease" => Some(synth.mod_env.release),
        "filterCutoff" => Some(filter.cutoff),
        "filterResonance" => Some(filter.resonance),
        "filterEnvAmount" => Some(filter.env_amount),
        "chorusRate" => Some(chorus.rate),
        "chorusDepth" => Some(chorus.depth),
        "chorusMix" => Some(chorus.mix),
        "delayTime" => Some(delay.time),
        "delayFeedback" => Some(delay.feedback),
        "delayWarmth" => Some(delay.warmth),
        "delayMix" => Some(delay.mix),
        "delayTapeMode" => Some(if delay.tape_mode { 1.0 } else { 0.0 }),
        "reverbSpace" => Some(reverb.space),
        "reverbPredelay" => Some(reverb.predelay),
        "reverbDistance" => Some(reverb.distance),
        "reverbCharacter" => Some(reverb.character),
        "reverbMix" => Some(reverb.mix),
        "phaserRate" => Some(phaser.rate),
        "phaserDepth" => Some(phaser.depth),
        "phaserFeedback" => Some(phaser.feedback),
        "phaserMix" => Some(phaser.mix),
        "velocityCurve" => Some(synth.velocity_curve),
        "portamentoRate" => Some(synth.portamento.rate),
        "portamentoTime" => Some(synth.portamento.time),
        "pitchBendRange" => Some(synth.pitch_bend_range),
        "modWheelVibratoDepth" => Some(0.0),
        _ => None,
    }
}

pub fn engine_enum_value_tooltips_v1() -> &'static [EngineEnumValueTooltipV1] {
    &ENGINE_ENUM_VALUE_TOOLTIPS_V1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn step_env_deserialize_uses_fallback_count_and_pads_steps() {
        let json = r#"{
            "steps": [
                { "level": 0.5, "rate": 12.6 },
                { "level": 1.0, "rate": 120.0 }
            ],
            "sustainStep": 1,
            "loop": true
        }"#;

        let env: StepEnvData = serde_json::from_str(json).expect("valid step env json");

        assert_eq!(env.step_count, 2);
        assert_eq!(env.sustain_step, 1);
        assert!(env.loop_);
        assert_eq!(env.steps[0].rate, 13);
        assert_eq!(env.steps[1].rate, 120);
        assert_eq!(env.steps[2].level, 0);
        assert_eq!(env.steps[2].rate, 0);
    }

    #[test]
    fn step_env_deserialize_treats_values_as_raw_7bit() {
        let json = r#"{
            "steps": [
                { "level": 66, "rate": 99 },
                { "level": 127, "rate": 127 }
            ],
            "sustainStep": 0,
            "stepCount": 2,
            "loop": false
        }"#;

        let env: StepEnvData = serde_json::from_str(json).expect("valid step env json");
        assert_eq!(env.steps[0].level, 66);
        assert_eq!(env.steps[0].rate, 99);
        assert_eq!(env.steps[1].level, 127);
        assert_eq!(env.steps[1].rate, 127);
    }

    #[test]
    fn algo_cz_waveform_roundtrip_and_non_cz_detection() {
        let from_square = Algo::from_cz_waveform(CzWaveform::Square);
        assert_eq!(from_square, Algo::Square);
        assert_eq!(from_square.as_cz_waveform(), Some(CzWaveform::Square));
        assert!(from_square.is_cz_waveform());

        assert_eq!(Algo::Bend.as_cz_waveform(), None);
        assert!(!Algo::Bend.is_cz_waveform());
    }

    #[test]
    fn synth_params_fx_fields_default_when_missing() {
        let mut value = serde_json::to_value(SynthParams::default())
            .expect("default synth params should serialize");

        let params = value
            .as_object_mut()
            .expect("synth params should serialize as an object");

        for key in ["chorus", "delay", "reverb", "phaser"] {
            params.remove(key);
        }
    }

    #[test]
    fn fx_slots_default_to_all_empty() {
        let params = SynthParams::default();
        for slot in &params.fx_slots {
            assert!(matches!(slot, FxSlotConfig::Empty));
        }
    }

    #[test]
    fn fx_slot_config_roundtrip_serialization() {
        let config = FxSlotConfig::Chorus(ChorusParams {
            enabled: true,
            rate: 1.2,
            depth: 0.01,
            mix: 0.5,
        });
        let json = serde_json::to_string(&config).expect("serialize FxSlotConfig");
        let back: FxSlotConfig = serde_json::from_str(&json).expect("deserialize FxSlotConfig");
        assert!(
            matches!(back, FxSlotConfig::Chorus(p) if p.enabled && (p.rate - 1.2).abs() < 1e-5)
        );
    }

    #[test]
    fn fx_slot_config_empty_roundtrip() {
        let config = FxSlotConfig::Empty;
        let json = serde_json::to_string(&config).expect("serialize empty slot");
        assert!(json.contains("\"type\":\"empty\""));
        let back: FxSlotConfig = serde_json::from_str(&json).expect("deserialize empty slot");
        assert!(matches!(back, FxSlotConfig::Empty));
    }

    #[test]
    fn fx_slot_config_default_for_type_sets_enabled() {
        let chorus = FxSlotConfig::default_for_type(FxSlotType::Chorus);
        assert!(chorus.is_enabled());
        assert!(matches!(chorus.slot_type(), FxSlotType::Chorus));

        let empty = FxSlotConfig::default_for_type(FxSlotType::Empty);
        assert!(!empty.is_enabled());

        let reverb = FxSlotConfig::default_for_type(FxSlotType::Reverb);
        assert!(reverb.is_enabled());
    }

    #[test]
    fn fx_slots_missing_from_json_defaults_to_empty() {
        let mut value =
            serde_json::to_value(SynthParams::default()).expect("serialize default params");
        value.as_object_mut().unwrap().remove("fxSlots");
        let decoded: SynthParams =
            serde_json::from_value(value).expect("fxSlots field should default");
        assert!(decoded
            .fx_slots
            .iter()
            .all(|s| matches!(s, FxSlotConfig::Empty)));
    }

    #[test]
    fn engine_param_ui_meta_v1_keys_are_unique_and_non_empty() {
        let meta = engine_param_ui_meta_v1();
        let mut seen_keys = std::collections::HashSet::new();
        for entry in meta {
            assert!(!entry.key.is_empty(), "param key must not be empty");
            assert!(
                seen_keys.insert(entry.key),
                "duplicate param key: {}",
                entry.key
            );
        }
    }

    #[test]
    fn engine_param_ui_meta_v1_labels_and_tooltips_non_empty() {
        for entry in engine_param_ui_meta_v1() {
            assert!(
                !entry.tooltip.is_empty(),
                "tooltip must not be empty for key: {}",
                entry.key
            );
            assert!(
                !entry.readout_label.is_empty(),
                "readout_label must not be empty for key: {}",
                entry.key
            );
        }
    }

    #[test]
    fn engine_param_ui_meta_v1_enum_map_values_are_unique() {
        for entry in engine_param_ui_meta_v1() {
            if let EngineParamReadoutFormatV1::EnumMap { values } = &entry.readout_format {
                let mut seen = std::collections::HashSet::new();
                for ev in *values {
                    assert!(
                        !ev.value.is_empty(),
                        "enum value must not be empty for key: {}",
                        entry.key
                    );
                    assert!(
                        !ev.label.is_empty(),
                        "enum label must not be empty for key: {}, value: {}",
                        entry.key,
                        ev.value
                    );
                    assert!(
                        seen.insert(ev.value),
                        "duplicate enum value '{}' for key: {}",
                        ev.value,
                        entry.key
                    );
                }
            }
        }
    }

    #[test]
    fn engine_enum_value_tooltips_v1_are_unique_and_non_empty() {
        let tooltips = engine_enum_value_tooltips_v1();
        let mut seen = std::collections::HashSet::new();
        for entry in tooltips {
            assert!(!entry.key.is_empty(), "enum tooltip key must not be empty");
            assert!(
                !entry.value.is_empty(),
                "enum tooltip value must not be empty for key: {}",
                entry.key
            );
            assert!(
                !entry.tooltip.is_empty(),
                "tooltip must not be empty for key: {}, value: {}",
                entry.key,
                entry.value
            );
            assert!(
                seen.insert((entry.key, entry.value)),
                "duplicate (key, value) pair: ({}, {})",
                entry.key,
                entry.value
            );
        }
    }
}
