use serde::{Deserialize, Deserializer, Serialize, Serializer};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::envelopes::StepEnvData;
use super::waveforms::{Algo, BaseWaveform, WindowType};
use crate::default_envelopes::{default_dca_env, default_dco_env, default_dcw_env};

/// Line select
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub enum LineSelect {
    #[serde(rename = "L1")]
    L1,
    #[serde(rename = "L2")]
    L2,
    #[serde(rename = "L1+L1'")]
    L1PlusL1Prime,
    #[serde(rename = "L1+L2'")]
    #[default]
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

pub const MAX_ALGO_CONTROLS: usize = 8;

pub type AlgoControlSlots = [Option<AlgoControlValueV1>; MAX_ALGO_CONTROLS];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub enum AlgoControlId {
    AlgoBlend,
    BendBias,
    BendCurve,
    BendKnee,
    ChebyOrder,
    ChebyTilt,
    ChebyWarp,
    ClipBias,
    ClipDrive,
    ClipShape,
    ClipSoft,
    CzwDoubleSine,
    CzwPulse,
    CzwReso1,
    CzwReso2,
    CzwReso3,
    CzwSaw,
    CzwSawPulse,
    CzwSquare,
    Dcw,
    FineDetune,
    FofOffset,
    FofRatio,
    FofSkew,
    FofTightness,
    FoldSoftness,
    FoldStages,
    FoldSymmetry,
    FoldTilt,
    KarpunkBright,
    KarpunkDamp,
    KarpunkDecay,
    KarpunkExcite,
    KeyFollow,
    Level,
    MirrorBlend,
    MirrorCenter,
    MirrorClip,
    MirrorSkew,
    Octave,
    PinchAsym,
    PinchCurve,
    PinchDrive,
    PinchFocus,
    Preset,
    RippleDepth,
    RippleFreq,
    RipplePhase,
    RippleShape,
    SkewBias,
    SkewCurve,
    SkewSpread,
    SkewTilt,
    StutterReverse,
    StutterSegs,
    StutterSlip,
    StutterSpacing,
    SyncCurve,
    SyncPhase,
    SyncRatio,
    SyncWindow,
    TerrainDepth,
    TerrainFmPhase,
    TerrainRatio,
    TerrainShape,
    TwistDepth,
    TwistHarmonics,
    TwistPhase,
    TwistShape,
    WarpAmount,
    Waveform1,
    Waveform2,
    WindowFunction,
    #[default]
    Unknown,
}

impl AlgoControlId {
    #[allow(clippy::should_implement_trait)]
    pub fn from_str(value: &str) -> Self {
        match value {
            "algoBlend" => Self::AlgoBlend,
            "bendBias" => Self::BendBias,
            "bendCurve" => Self::BendCurve,
            "bendKnee" => Self::BendKnee,
            "chebyOrder" => Self::ChebyOrder,
            "chebyTilt" => Self::ChebyTilt,
            "chebyWarp" => Self::ChebyWarp,
            "clipBias" => Self::ClipBias,
            "clipDrive" => Self::ClipDrive,
            "clipShape" => Self::ClipShape,
            "clipSoft" => Self::ClipSoft,
            "czDoubleSine" => Self::CzwDoubleSine,
            "czPulse" => Self::CzwPulse,
            "czReso1" => Self::CzwReso1,
            "czReso2" => Self::CzwReso2,
            "czReso3" => Self::CzwReso3,
            "czSaw" => Self::CzwSaw,
            "czSawPulse" => Self::CzwSawPulse,
            "czSquare" => Self::CzwSquare,
            "dcw" => Self::Dcw,
            "fineDetune" => Self::FineDetune,
            "fofOffset" => Self::FofOffset,
            "fofRatio" => Self::FofRatio,
            "fofSkew" => Self::FofSkew,
            "fofTightness" => Self::FofTightness,
            "foldSoftness" => Self::FoldSoftness,
            "foldStages" => Self::FoldStages,
            "foldSymmetry" => Self::FoldSymmetry,
            "foldTilt" => Self::FoldTilt,
            "karpunkBright" => Self::KarpunkBright,
            "karpunkDamp" => Self::KarpunkDamp,
            "karpunkDecay" => Self::KarpunkDecay,
            "karpunkExcite" => Self::KarpunkExcite,
            "keyFollow" => Self::KeyFollow,
            "level" => Self::Level,
            "mirrorBlend" => Self::MirrorBlend,
            "mirrorCenter" => Self::MirrorCenter,
            "mirrorClip" => Self::MirrorClip,
            "mirrorSkew" => Self::MirrorSkew,
            "octave" => Self::Octave,
            "pinchAsym" => Self::PinchAsym,
            "pinchCurve" => Self::PinchCurve,
            "pinchDrive" => Self::PinchDrive,
            "pinchFocus" => Self::PinchFocus,
            "preset" => Self::Preset,
            "rippleDepth" => Self::RippleDepth,
            "rippleFreq" => Self::RippleFreq,
            "ripplePhase" => Self::RipplePhase,
            "rippleShape" => Self::RippleShape,
            "skewBias" => Self::SkewBias,
            "skewCurve" => Self::SkewCurve,
            "skewSpread" => Self::SkewSpread,
            "skewTilt" => Self::SkewTilt,
            "stutterReverse" => Self::StutterReverse,
            "stutterSegs" => Self::StutterSegs,
            "stutterSlip" => Self::StutterSlip,
            "stutterSpacing" => Self::StutterSpacing,
            "syncCurve" => Self::SyncCurve,
            "syncPhase" => Self::SyncPhase,
            "syncRatio" => Self::SyncRatio,
            "syncWindow" => Self::SyncWindow,
            "terrainDepth" => Self::TerrainDepth,
            "terrainFmPhase" => Self::TerrainFmPhase,
            "terrainRatio" => Self::TerrainRatio,
            "terrainShape" => Self::TerrainShape,
            "twistDepth" => Self::TwistDepth,
            "twistHarmonics" => Self::TwistHarmonics,
            "twistPhase" => Self::TwistPhase,
            "twistShape" => Self::TwistShape,
            "warpAmount" => Self::WarpAmount,
            "waveform1" => Self::Waveform1,
            "waveform2" => Self::Waveform2,
            "windowFunction" => Self::WindowFunction,
            _ => Self::Unknown,
        }
    }

    pub const fn as_str(self) -> &'static str {
        match self {
            Self::AlgoBlend => "algoBlend",
            Self::BendBias => "bendBias",
            Self::BendCurve => "bendCurve",
            Self::BendKnee => "bendKnee",
            Self::ChebyOrder => "chebyOrder",
            Self::ChebyTilt => "chebyTilt",
            Self::ChebyWarp => "chebyWarp",
            Self::ClipBias => "clipBias",
            Self::ClipDrive => "clipDrive",
            Self::ClipShape => "clipShape",
            Self::ClipSoft => "clipSoft",
            Self::CzwDoubleSine => "czDoubleSine",
            Self::CzwPulse => "czPulse",
            Self::CzwReso1 => "czReso1",
            Self::CzwReso2 => "czReso2",
            Self::CzwReso3 => "czReso3",
            Self::CzwSaw => "czSaw",
            Self::CzwSawPulse => "czSawPulse",
            Self::CzwSquare => "czSquare",
            Self::Dcw => "dcw",
            Self::FineDetune => "fineDetune",
            Self::FofOffset => "fofOffset",
            Self::FofRatio => "fofRatio",
            Self::FofSkew => "fofSkew",
            Self::FofTightness => "fofTightness",
            Self::FoldSoftness => "foldSoftness",
            Self::FoldStages => "foldStages",
            Self::FoldSymmetry => "foldSymmetry",
            Self::FoldTilt => "foldTilt",
            Self::KarpunkBright => "karpunkBright",
            Self::KarpunkDamp => "karpunkDamp",
            Self::KarpunkDecay => "karpunkDecay",
            Self::KarpunkExcite => "karpunkExcite",
            Self::KeyFollow => "keyFollow",
            Self::Level => "level",
            Self::MirrorBlend => "mirrorBlend",
            Self::MirrorCenter => "mirrorCenter",
            Self::MirrorClip => "mirrorClip",
            Self::MirrorSkew => "mirrorSkew",
            Self::Octave => "octave",
            Self::PinchAsym => "pinchAsym",
            Self::PinchCurve => "pinchCurve",
            Self::PinchDrive => "pinchDrive",
            Self::PinchFocus => "pinchFocus",
            Self::Preset => "preset",
            Self::RippleDepth => "rippleDepth",
            Self::RippleFreq => "rippleFreq",
            Self::RipplePhase => "ripplePhase",
            Self::RippleShape => "rippleShape",
            Self::SkewBias => "skewBias",
            Self::SkewCurve => "skewCurve",
            Self::SkewSpread => "skewSpread",
            Self::SkewTilt => "skewTilt",
            Self::StutterReverse => "stutterReverse",
            Self::StutterSegs => "stutterSegs",
            Self::StutterSlip => "stutterSlip",
            Self::StutterSpacing => "stutterSpacing",
            Self::SyncCurve => "syncCurve",
            Self::SyncPhase => "syncPhase",
            Self::SyncRatio => "syncRatio",
            Self::SyncWindow => "syncWindow",
            Self::TerrainDepth => "terrainDepth",
            Self::TerrainFmPhase => "terrainFmPhase",
            Self::TerrainRatio => "terrainRatio",
            Self::TerrainShape => "terrainShape",
            Self::TwistDepth => "twistDepth",
            Self::TwistHarmonics => "twistHarmonics",
            Self::TwistPhase => "twistPhase",
            Self::TwistShape => "twistShape",
            Self::WarpAmount => "warpAmount",
            Self::Waveform1 => "waveform1",
            Self::Waveform2 => "waveform2",
            Self::WindowFunction => "windowFunction",
            Self::Unknown => "unknown",
        }
    }
}

impl Serialize for AlgoControlId {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(self.as_str())
    }
}

impl<'de> Deserialize<'de> for AlgoControlId {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let id = String::deserialize(deserializer)?;
        Ok(Self::from_str(&id))
    }
}

/// One algorithm-specific control value persisted on a line.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoControlValueV1 {
    #[cfg_attr(feature = "specta-bindings", specta(type = String))]
    pub id: AlgoControlId,
    pub value: f32,
}

fn default_algo_controls() -> AlgoControlSlots {
    [None; MAX_ALGO_CONTROLS]
}

fn serialize_algo_controls<S: Serializer>(
    controls: &AlgoControlSlots,
    serializer: S,
) -> Result<S::Ok, S::Error> {
    let entries: Vec<AlgoControlValueV1> = controls.iter().flatten().copied().collect();
    entries.serialize(serializer)
}

fn deserialize_algo_controls<'de, D: Deserializer<'de>>(
    deserializer: D,
) -> Result<AlgoControlSlots, D::Error> {
    let maybe_entries = Option::<Vec<AlgoControlValueV1>>::deserialize(deserializer)?;
    let mut controls = [None; MAX_ALGO_CONTROLS];
    if let Some(entries) = maybe_entries {
        for (index, entry) in entries.into_iter().take(MAX_ALGO_CONTROLS).enumerate() {
            if entry.id != AlgoControlId::Unknown {
                controls[index] = Some(entry);
            }
        }
    }
    Ok(controls)
}

/// Per-line parameters
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
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
    #[serde(default)]
    pub detune_note: f32,
    #[serde(default)]
    pub detune_fine: f32,
    pub octave: f32,
    pub dco_env: StepEnvData,
    pub dcw_env: StepEnvData,
    pub dca_env: StepEnvData,
    pub key_follow: f32,
    #[cfg_attr(feature = "specta-bindings", specta(optional, type = Vec<AlgoControlValueV1>))]
    #[serde(
        default = "default_algo_controls",
        serialize_with = "serialize_algo_controls",
        deserialize_with = "deserialize_algo_controls"
    )]
    pub algo_controls_a: AlgoControlSlots,
    #[cfg_attr(feature = "specta-bindings", specta(optional, type = Vec<AlgoControlValueV1>))]
    #[serde(
        default = "default_algo_controls",
        serialize_with = "serialize_algo_controls",
        deserialize_with = "deserialize_algo_controls"
    )]
    pub algo_controls_b: AlgoControlSlots,
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
            detune_note: 0.0,
            detune_fine: 0.0,
            octave: 0.0,
            dco_env: default_dco_env(),
            dcw_env: default_dcw_env(),
            dca_env: default_dca_env(),
            key_follow: 0.0,
            algo_controls_a: default_algo_controls(),
            algo_controls_b: default_algo_controls(),
        }
    }
}
