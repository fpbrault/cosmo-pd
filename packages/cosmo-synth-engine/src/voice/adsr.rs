use crate::params::{ModEnvMode, ModEnvParams};

/// Phase state for the per-voice ADSR mod envelope.
#[derive(Debug, Clone, Default, PartialEq)]
pub(crate) enum AdsrPhase {
    #[default]
    Idle,
    Attack,
    Decay,
    Sustain,
    Release,
}

/// Simple ADSR envelope used as a modulation source.
#[derive(Debug, Clone, Default)]
pub struct AdsrEnv {
    phase: AdsrPhase,
    pub output: f32,
    release_start: f32,
}

impl AdsrEnv {
    pub fn note_on(&mut self) {
        self.phase = AdsrPhase::Attack;
    }

    pub fn note_off(&mut self) {
        self.release_start = self.output;
        self.phase = AdsrPhase::Release;
    }

    pub fn reset(&mut self) {
        self.phase = AdsrPhase::Idle;
        self.output = 0.0;
        self.release_start = 0.0;
    }

    pub fn advance(&mut self, p: &ModEnvParams, sr: f32) -> f32 {
        match self.phase {
            AdsrPhase::Idle => {
                self.output = 0.0;
            }
            AdsrPhase::Attack => {
                let rate = if p.attack > 0.0 {
                    1.0 / (p.attack * sr)
                } else {
                    1.0
                };
                self.output = (self.output + rate).min(1.0);
                if self.output >= 1.0 {
                    self.phase = AdsrPhase::Decay;
                }
            }
            AdsrPhase::Decay => {
                let target = if matches!(p.mode, ModEnvMode::Adr) {
                    0.0
                } else {
                    p.sustain
                };
                let range = 1.0 - target;
                let rate = if p.decay > 0.0 && range > 0.0 {
                    range / (p.decay * sr)
                } else {
                    range
                };
                self.output = (self.output - rate).max(target);
                if self.output <= target {
                    self.output = target;
                    self.phase = AdsrPhase::Sustain;
                }
            }
            AdsrPhase::Sustain => {
                self.output = if matches!(p.mode, ModEnvMode::Adr) {
                    0.0
                } else {
                    p.sustain
                };
            }
            AdsrPhase::Release => {
                if self.release_start <= 0.0 {
                    self.output = 0.0;
                    self.phase = AdsrPhase::Idle;
                } else {
                    let rate = if p.release > 0.0 {
                        self.release_start / (p.release * sr)
                    } else {
                        self.release_start
                    };
                    self.output = (self.output - rate).max(0.0);
                    if self.output <= 0.0 {
                        self.output = 0.0;
                        self.phase = AdsrPhase::Idle;
                    }
                }
            }
        }
        self.output
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{ModEnvMode, ModEnvRetrigMode};

    fn params(mode: ModEnvMode) -> ModEnvParams {
        ModEnvParams {
            attack: 0.0,
            decay: 0.1,
            sustain: 0.5,
            release: 0.2,
            mode,
            retrig_mode: ModEnvRetrigMode::default(),
        }
    }

    #[test]
    fn adr_decay_reaches_zero_and_sustain_holds_zero() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        env.note_on();

        let samples = (0.1_f32 * sr).ceil() as usize + 4;
        for _ in 0..samples {
            env.advance(&params(ModEnvMode::Adr), sr);
        }

        assert!(env.output.abs() < 1e-6, "ADR decay should reach zero");
        env.advance(&params(ModEnvMode::Adr), sr);
        assert!(
            env.output.abs() < 1e-6,
            "ADR sustain phase should hold at zero"
        );
    }

    #[test]
    fn adsr_decay_reaches_sustain_and_holds_it() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        env.note_on();

        let samples = (0.1_f32 * sr).ceil() as usize + 4;
        for _ in 0..samples {
            env.advance(&params(ModEnvMode::Adsr), sr);
        }

        assert!(
            (env.output - 0.5).abs() < 1e-6,
            "ADSR decay should reach sustain level"
        );
        env.advance(&params(ModEnvMode::Adsr), sr);
        assert!(
            (env.output - 0.5).abs() < 1e-6,
            "ADSR sustain phase should hold sustain level"
        );
    }

    #[test]
    fn adr_release_starts_from_current_decay_value() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        env.note_on();

        let samples = (0.05_f32 * sr).ceil() as usize;
        for _ in 0..samples {
            env.advance(&params(ModEnvMode::Adr), sr);
        }
        let held = env.output;
        assert!(held > 0.0 && held < 1.0, "should be partway through decay");

        env.note_off();
        let first_release_sample = env.advance(&params(ModEnvMode::Adr), sr);
        assert!(
            first_release_sample <= held,
            "release should ramp down from current value"
        );
    }
}
