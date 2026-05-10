use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

/// FX slot type selector
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
    #[serde(default)]
    pub tape_mode: bool,
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
    pub rate: f32,
    pub depth: f32,
    pub mix: f32,
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

/// Reverb parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct ReverbParams {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub mix: f32,
    #[serde(default = "default_reverb_space")]
    pub space: f32,
    #[serde(default)]
    pub predelay: f32,
    #[serde(default = "default_reverb_distance")]
    pub distance: f32,
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
    pub amount: f32,
    pub ratio: f32,
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
    pub waveform: u8,
    pub rate: f32,
    pub depth: f32,
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

/// Per-slot FX configuration
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(tag = "type", content = "params", rename_all = "camelCase")]
pub enum FxSlotConfig {
    #[default]
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

impl FxSlotConfig {
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
