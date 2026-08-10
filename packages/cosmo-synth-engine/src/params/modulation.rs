use num_enum::TryFromPrimitive;
use serde::{
    Deserialize, Serialize,
    de::{self, Deserializer},
};
#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Modulation source selector for modulation matrix routes.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModSource {
    #[default]
    Lfo1,
    Lfo2,
    Random,
    ModEnv,
    Velocity,
    ModWheel,
    Aftertouch,
    Macro1,
    Macro2,
    Macro3,
    Macro4,
}

/// Modulation destination selector for modulation matrix routes.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default, TryFromPrimitive)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
#[repr(u16)]
pub enum ModDestination {
    #[default]
    Volume,
    Pitch,
    Line1DcwBase,
    Line1DcaBase,
    Line1AlgoBlend,
    Line2DetuneNote,
    Line1Octave,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam1"))]
    Line1AlgoControl1,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam2"))]
    Line1AlgoControl2,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam3"))]
    Line1AlgoControl3,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam4"))]
    Line1AlgoControl4,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam5"))]
    Line1AlgoControl5,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam6"))]
    Line1AlgoControl6,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam7"))]
    Line1AlgoControl7,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line1AlgoParam8"))]
    Line1AlgoControl8,
    Line2DcwBase,
    Line2DcaBase,
    Line2AlgoBlend,
    Line2DetuneFine,
    Line2DetuneOctave,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam1"))]
    Line2AlgoControl1,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam2"))]
    Line2AlgoControl2,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam3"))]
    Line2AlgoControl3,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam4"))]
    Line2AlgoControl4,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam5"))]
    Line2AlgoControl5,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam6"))]
    Line2AlgoControl6,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam7"))]
    Line2AlgoControl7,
    #[cfg_attr(not(feature = "specta-bindings"), serde(alias = "line2AlgoParam8"))]
    Line2AlgoControl8,
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
    LoFiWow,
    LoFiFlutter,
    LoFiDegrade,
    LoFiFilter,
    LoFiCrackle,
    LoFiNoise,
    LoFiMix,
    LoFiSaturation,
    MultimodeFilterCutoffHz,
    MultimodeFilterResonance,
    MultimodeFilterDrive,
    MultimodeFilterMix,
    FlangerRate,
    FlangerDepth,
    FlangerDelayMs,
    FlangerFeedback,
    FlangerMix,
    EqGainBand1,
    EqGainBand2,
    EqGainBand3,
    EqGainBand4,
    EqGainBand5,
    EqGainBand6,
    EqGainBand7,
    EqGainBand8,
}

/// Total number of `ModDestination` variants.
pub const NUM_MOD_DESTINATIONS: usize = ModDestination::EqGainBand8 as usize + 1;

/// First env step destination discriminant.
pub const ENV_STEP_DEST_FIRST: usize = ModDestination::Line1DcoEnvStep1Level as usize;
/// Last env step destination discriminant.
pub const ENV_STEP_DEST_LAST: usize = ModDestination::Line2DcaEnvStep8Rate as usize;

/// A single modulation route assignment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModRoute {
    pub source: ModSource,
    pub destination: ModDestination,
    pub amount: f32,
    pub enabled: bool,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn algo_control_destinations_emit_canonical_names() {
        assert_eq!(
            serde_json::to_string(&ModDestination::Line1AlgoControl1).unwrap(),
            r#""line1AlgoControl1""#
        );
        assert_eq!(
            serde_json::to_string(&ModDestination::Line2AlgoControl8).unwrap(),
            r#""line2AlgoControl8""#
        );
    }

    #[test]
    #[cfg(not(feature = "specta-bindings"))]
    fn legacy_algo_param_destinations_deserialize_as_algo_controls() {
        assert_eq!(
            serde_json::from_str::<ModDestination>(r#""line1AlgoParam1""#).unwrap(),
            ModDestination::Line1AlgoControl1
        );
        assert_eq!(
            serde_json::from_str::<ModDestination>(r#""line2AlgoParam8""#).unwrap(),
            ModDestination::Line2AlgoControl8
        );
    }

    #[test]
    fn blend_and_octave_destinations_round_trip_through_json() {
        for destination in [
            ModDestination::Line1AlgoBlend,
            ModDestination::Line1Octave,
            ModDestination::Line2DetuneOctave,
        ] {
            let serialized = serde_json::to_string(&destination).unwrap();
            let deserialized = serde_json::from_str::<ModDestination>(&serialized).unwrap();
            assert_eq!(deserialized, destination);
        }
    }

    #[test]
    fn mod_matrix_layout_is_optional_for_legacy_json_and_round_trips() {
        let legacy = serde_json::from_str::<ModMatrix>(r#"{"routes":[]}"#).unwrap();
        assert!(legacy.layout.is_none());

        let layout = ModMatrixLayout {
            pages: [
                ModMatrixPage {
                    sources: [
                        Some(ModSource::Lfo1),
                        None,
                        None,
                        None,
                        None,
                        None,
                        None,
                        None,
                    ],
                    destinations: [
                        Some(ModDestination::Volume),
                        None,
                        None,
                        None,
                        None,
                        None,
                        None,
                        None,
                    ],
                    cells: None,
                },
                ModMatrixPage::default(),
                ModMatrixPage::default(),
            ],
        };
        let matrix = ModMatrix {
            routes: vec![ModRoute {
                source: ModSource::Lfo1,
                destination: ModDestination::Volume,
                amount: 0.5,
                enabled: true,
            }],
            layout: Some(layout.clone()),
        };

        let json = serde_json::to_string(&matrix).unwrap();
        let decoded = serde_json::from_str::<ModMatrix>(&json).unwrap();
        assert_eq!(decoded.layout, Some(layout));

        let legacy_layout = r#"{
            "pages": [
                {
                    "sources": ["lfo1", null, null, null, null, null, null, null],
                    "destinations": ["volume", null, null, null, null, null, null, null]
                },
                {
                    "sources": [null, null, null, null, null, null, null, null],
                    "destinations": [null, null, null, null, null, null, null, null]
                }
            ]
        }"#;
        let decoded_legacy = serde_json::from_str::<ModMatrixLayout>(legacy_layout).unwrap();
        assert_eq!(decoded_legacy.pages[0].sources[0], Some(ModSource::Lfo1));
        assert_eq!(decoded_legacy.pages[2], ModMatrixPage::default());
    }
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

/// One fixed 8×8 page in the modulation matrix editor.
///
/// These assignments are editor layout metadata. The audio engine continues to
/// evaluate the shared `ModMatrix::routes` collection independently of pages.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModMatrixPage {
    #[serde(default)]
    pub sources: [Option<ModSource>; 8],
    #[serde(default)]
    pub destinations: [Option<ModDestination>; 8],
    /// Per-cell values are optional for backwards-compatible layouts that only
    /// persisted source and destination labels.
    #[serde(default)]
    pub cells: Option<[[Option<ModMatrixCell>; 8]; 8]>,
}

/// A persisted modulation-matrix cell value, independent of its row and column
/// labels. A cell can retain its value while either label is temporarily empty.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModMatrixCell {
    pub amount: f32,
    pub enabled: bool,
}

/// Persisted editor layout for the three modulation matrix pages.
#[derive(Debug, Clone, PartialEq, Serialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModMatrixLayout {
    pub pages: [ModMatrixPage; 3],
}

impl<'de> Deserialize<'de> for ModMatrixLayout {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        #[derive(Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct ModMatrixLayoutWire {
            #[serde(default)]
            pages: Vec<ModMatrixPage>,
        }

        let mut pages = ModMatrixLayoutWire::deserialize(deserializer)?.pages;
        if pages.is_empty() {
            return Ok(Self::default());
        }
        if pages.len() == 2 {
            pages.push(ModMatrixPage::default());
        }
        if pages.len() != 3 {
            return Err(de::Error::custom(
                "modulation matrix layout must contain two or three pages",
            ));
        }

        let mut pages = pages.into_iter();
        Ok(Self {
            pages: [
                pages.next().expect("validated page count"),
                pages.next().expect("validated page count"),
                pages.next().expect("validated page count"),
            ],
        })
    }
}

/// Collection of modulation routes.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModMatrix {
    #[serde(default)]
    pub routes: Vec<ModRoute>,
    #[serde(default)]
    pub layout: Option<ModMatrixLayout>,
}
