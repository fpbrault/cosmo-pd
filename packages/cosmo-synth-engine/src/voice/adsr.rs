use crate::params::ModEnvParams;

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
                let range = 1.0 - p.sustain;
                let rate = if p.decay > 0.0 && range > 0.0 {
                    range / (p.decay * sr)
                } else {
                    range
                };
                self.output = (self.output - rate).max(p.sustain);
                if self.output <= p.sustain {
                    self.output = p.sustain;
                    self.phase = AdsrPhase::Sustain;
                }
            }
            AdsrPhase::Sustain => {
                self.output = p.sustain;
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
