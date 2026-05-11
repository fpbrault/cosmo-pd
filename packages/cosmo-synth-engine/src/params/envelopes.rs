use serde::{Deserialize, Deserializer, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

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
