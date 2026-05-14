use serde::{Deserialize, Deserializer, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

pub const NUM_ENV_STEPS: usize = 8;

/// Curve shape for a single ADSR stage.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum CurveShape {
    #[default]
    Linear,
    /// Starts fast, eases to target.
    Exp,
    /// Starts slow, accelerates to target.
    Log,
}

/// ADSR envelope data with per-stage curve shapes.
/// Times are in seconds [0.001, 10.0].
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AdsrData {
    pub attack_time_secs: f32,
    pub decay_time_secs: f32,
    pub sustain_level: f32,
    pub release_time_secs: f32,
    pub attack_curve: CurveShape,
    pub decay_curve: CurveShape,
    pub release_curve: CurveShape,
}

impl Default for AdsrData {
    fn default() -> Self {
        Self {
            attack_time_secs: 0.01,
            decay_time_secs: 0.3,
            sustain_level: 0.7,
            release_time_secs: 0.5,
            attack_curve: CurveShape::default(),
            decay_curve: CurveShape::default(),
            release_curve: CurveShape::default(),
        }
    }
}

/// Unified envelope type: either CZ-style step or traditional ADSR.
/// Untagged so JSON is transparent (just the inner type), not a tagged union.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(untagged)]
pub enum EnvType {
    Step(StepEnvData),
    Adsr(AdsrData),
}

impl Default for EnvType {
    fn default() -> Self {
        Self::Step(StepEnvData::default())
    }
}

/// A single step in a step envelope
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct EnvStep {
    /// Internal machine level [0, 127].
    #[serde(deserialize_with = "deserialize_step_value")]
    pub level: u8,
    /// Internal machine rate [0, 127].
    #[serde(deserialize_with = "deserialize_step_value")]
    pub rate: u8,
    /// Pre-normalized level [0, 1] computed at load time from kind-specific conversion.
    #[serde(skip)]
    pub level_norm: f32,
}

impl Default for EnvStep {
    fn default() -> Self {
        Self {
            level: 0,
            rate: 0,
            level_norm: 0.0,
        }
    }
}

/// Accept value as either integer or float and normalize into [0, 127].
fn deserialize_step_value<'de, D: Deserializer<'de>>(d: D) -> Result<u8, D::Error> {
    let v = f64::deserialize(d)?;
    Ok(v.round().clamp(0.0, 127.0) as u8)
}

/// Step envelope data (CZ-style)
#[derive(Debug, Clone, Copy, PartialEq, Serialize)]
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
            #[serde(default)]
            step_count: usize,
            #[serde(rename = "loop", default)]
            loop_: bool,
        }
        let mut raw = Raw::deserialize(d)?;
        if raw.step_count == 0 {
            raw.step_count = raw.steps.len().max(1);
        }
        let mut steps = [EnvStep {
            level: 0,
            rate: 0,
            level_norm: 0.0,
        }; NUM_ENV_STEPS];
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
        StepEnvData {
            steps: [EnvStep {
                level: 0,
                rate: 0,
                level_norm: 0.0,
            }; NUM_ENV_STEPS],
            sustain_step: 0,
            step_count: 1,
            loop_: false,
        }
    }
}
