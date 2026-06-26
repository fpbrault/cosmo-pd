use serde::Serialize;

use crate::params::{ModEnvMode, ModEnvParams};

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Phase state for the per-voice ADSR mod envelope.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum AdsrPhase {
    #[default]
    Idle,
    Attack,
    Decay,
    Sustain,
    Release,
}

/// Simple ADSR envelope used as a modulation source.
#[derive(Debug, Clone)]
pub struct AdsrEnv {
    phase: AdsrPhase,
    pub output: f32,
    release_start: f32,
    mode: ModEnvMode,
    sustain: f32,
}

impl Default for AdsrEnv {
    fn default() -> Self {
        Self {
            phase: AdsrPhase::Idle,
            output: 0.0,
            release_start: 0.0,
            mode: ModEnvMode::Adsr,
            sustain: 0.5,
        }
    }
}

impl AdsrEnv {
    pub fn note_on(&mut self) {
        self.output = 0.0;
        self.release_start = 0.0;
        self.phase = AdsrPhase::Attack;
    }

    pub fn note_off(&mut self) {
        match self.mode {
            ModEnvMode::Adsr => {
                // Jump to sustain level before releasing (avoids truncating
                // release curve when release starts during attack or decay).
                if self.phase == AdsrPhase::Attack || self.phase == AdsrPhase::Decay {
                    self.output = self.sustain;
                }
                self.release_start = self.output;
                self.phase = AdsrPhase::Release;
            }
            ModEnvMode::Adr => {
                // ADR is trigger-driven; note-off does not interrupt the contour.
            }
        }
    }

    pub fn reset(&mut self) {
        self.phase = AdsrPhase::Idle;
        self.output = 0.0;
        self.release_start = 0.0;
        self.mode = ModEnvMode::Adsr;
        self.sustain = 0.5;
    }

    pub fn phase(&self) -> AdsrPhase {
        self.phase
    }

    pub fn release_start(&self) -> f32 {
        self.release_start
    }

    pub fn is_releasing(&self) -> bool {
        self.phase == AdsrPhase::Release
    }

    pub fn advance(&mut self, p: &ModEnvParams, sr: f32) -> f32 {
        self.mode = p.mode;
        self.sustain = p.sustain;
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
                let target = p.sustain;
                let range = 1.0 - target;
                let rate = if p.decay > 0.0 && range > 0.0 {
                    range / (p.decay * sr)
                } else {
                    range
                };
                self.output = (self.output - rate).max(target);
                if self.output <= target {
                    self.output = target;
                    match self.mode {
                        ModEnvMode::Adr => {
                            self.release_start = target;
                            self.phase = AdsrPhase::Release;
                        }
                        ModEnvMode::Adsr => {
                            self.phase = AdsrPhase::Sustain;
                        }
                    }
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{ModEnvMode, ModEnvRetrigMode};

    fn params(mode: ModEnvMode) -> ModEnvParams {
        ModEnvParams {
            attack: 0.001,
            decay: 0.1,
            sustain: 0.5,
            release: 0.2,
            mode,
            retrig_mode: ModEnvRetrigMode::default(),
        }
    }

    /// Runs `advance` n times at the given sample rate and params.
    fn run(env: &mut AdsrEnv, n: usize, p: &ModEnvParams, sr: f32) {
        for _ in 0..n {
            env.advance(p, sr);
        }
    }

    #[test]
    fn adsr_decay_reaches_sustain_and_holds_it() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        let p = params(ModEnvMode::Adsr);
        env.note_on();

        // Attack = 0.001s = 44 samples, Decay at 0.1s = 4410 samples.
        // After 0.11s = 4851 samples we should be in sustain at 0.5.
        run(&mut env, 5000, &p, sr);

        assert!(
            (env.output - 0.5).abs() < 1e-6,
            "ADSR decay should reach sustain level"
        );
        run(&mut env, 100, &p, sr);
        assert!(
            (env.output - 0.5).abs() < 1e-6,
            "ADSR sustain phase should hold sustain level"
        );

        env.note_off();
        let first_release = env.advance(&p, sr);
        assert!(first_release < 0.5, "ADSR should release after note-off");
    }

    #[test]
    fn adr_uses_sustain_as_decay_target_and_releases_after_decay() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        // attack=0.001s (44 samples), decay=0.1s (4410), sustain=0.35, release=0.05s (2205)
        let p = ModEnvParams {
            attack: 0.001,
            decay: 0.1,
            sustain: 0.35,
            release: 0.05,
            mode: ModEnvMode::Adr,
            retrig_mode: ModEnvRetrigMode::default(),
        };

        env.note_on();

        // After attack (0.001s = 44 samples) output should be ~1.0
        run(&mut env, 50, &p, sr);
        assert!(
            (env.output - 1.0).abs() < 0.02,
            "ADR should reach peak after attack, got {}",
            env.output
        );

        // After decay (0.1s = 4410 samples) from peak should reach sustain 0.35
        // Total: 50 + 0.1 * sr = 50 + 4410 = 4460 samples
        run(&mut env, 4410, &p, sr);
        assert!(
            (env.output - 0.35).abs() < 0.01,
            "ADR decay should reach sustain level, got {}",
            env.output
        );

        // After decay completes, next advance should be in Release phase (not Sustain)
        // Release starts from sustain level and drops
        let after_decay = env.advance(&p, sr);
        assert!(
            after_decay <= 0.35,
            "ADR should immediately start release after decay, got {}",
            after_decay
        );

        // After release time (0.05s = 2205 samples), should be near zero
        // Total samples in release: 2205
        run(&mut env, 2205, &p, sr);
        assert!(
            env.output.abs() < 0.01,
            "ADR release should reach zero, got {}",
            env.output
        );
    }

    #[test]
    fn adr_note_off_during_attack_does_not_alter_progression() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        // attack=0.05s (2205 samples), decay=0.05s (2205), sustain=0.35, release=0.05s (2205)
        let p = ModEnvParams {
            attack: 0.05,
            decay: 0.05,
            sustain: 0.35,
            release: 0.05,
            mode: ModEnvMode::Adr,
            retrig_mode: ModEnvRetrigMode::default(),
        };

        env.note_on();

        // Advance 10 samples into attack, then note-off (ignored for ADR)
        run(&mut env, 10, &p, sr);
        env.note_off();

        // Advance to the point decay should just finish (attack + decay = 0.1s total)
        // We've done 10 attack samples. Need 4410 - 10 = 4400 more.
        run(&mut env, 4400, &p, sr);

        // Should be at sustain level 0.35 just as decay finishes
        assert!(
            (env.output - 0.35).abs() < 0.02,
            "ADR should reach sustain level after note-off in attack, got {}",
            env.output
        );
    }

    #[test]
    fn adr_note_off_during_decay_does_not_alter_progression() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        // attack=0.01s (441 samples), decay=0.1s (4410), sustain=0.35, release=0.02s (882)
        let p = ModEnvParams {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.35,
            release: 0.02,
            mode: ModEnvMode::Adr,
            retrig_mode: ModEnvRetrigMode::default(),
        };

        env.note_on();

        // Advance into decay: 0.015s = 662 samples (attack=441, so 221 into decay)
        run(&mut env, 662, &p, sr);
        assert!(
            env.output < 1.0 && env.output > 0.35,
            "should be in decay, got {}",
            env.output
        );

        env.note_off(); // Should be ignored for ADR

        // Advance through remaining decay: decay needs 4410 - 221 = 4189 more samples
        // After that, release runs: release needs 882 samples
        // So to reach zero: 4189 + 882 = 5071 samples total after note-off
        // Check we're still >= sustain level before decay would complete
        run(&mut env, 2000, &p, sr);
        // After 2000 more decay samples, output = 0.934 - 2000 * (0.65/4410) = 0.934 - 0.295 = 0.639
        assert!(
            env.output > 0.35,
            "should still be above sustain during decay after note-off, got {}",
            env.output
        );

        // Continue through the rest of decay
        run(&mut env, 3000, &p, sr);
        // Should now be at or below sustain level
        assert!(
            env.output <= 0.36,
            "ADR should have decayed to sustain level after note-off in decay, got {}",
            env.output
        );
    }

    #[test]
    fn adr_release_starts_from_sustain_level() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        // attack=0.01s (441), decay=0.04s (1764), sustain=0.5, release=0.1s (4410)
        let p = ModEnvParams {
            attack: 0.01,
            decay: 0.04,
            sustain: 0.5,
            release: 0.1,
            mode: ModEnvMode::Adr,
            retrig_mode: ModEnvRetrigMode::default(),
        };

        env.note_on();

        // Advance past attack: 0.011s = 486 samples (>441 attack samples)
        run(&mut env, 486, &p, sr);

        // Advance through decay (0.04s = 1764 samples) to reach sustain
        // Now 486 + 1764 = 2250 samples total, output should be ~0.5
        run(&mut env, 1764, &p, sr);
        // After decay, first sample of release
        // Due to quantization, it might already be a hair below 0.5
        assert!(
            (env.output - 0.5).abs() < 0.02,
            "ADR release should start from sustain level, got {}",
            env.output
        );

        let next = env.advance(&p, sr);
        assert!(
            next < env.output + 0.001,
            "release should fall from sustain level, next={next} prev={}",
            env.output,
        );

        // After full release time (0.1s = 4410 samples), near zero
        run(&mut env, 4410, &p, sr);
        assert!(
            env.output.abs() < 1e-4,
            "ADR release should reach zero, got {}",
            env.output
        );
    }

    #[test]
    fn adsr_holds_sustain_until_note_off() {
        let sr = 44_100.0;
        let mut env = AdsrEnv::default();
        // attack=0.001s (44), decay=0.05s (2205), sustain=0.5, release=0.1s (4410)
        let p = ModEnvParams {
            attack: 0.001,
            decay: 0.05,
            sustain: 0.5,
            release: 0.1,
            mode: ModEnvMode::Adsr,
            retrig_mode: ModEnvRetrigMode::default(),
        };

        env.note_on();

        // Advance into sustain (44 + 2205 = 2249 samples)
        run(&mut env, 2500, &p, sr);
        assert!(
            (env.output - 0.5).abs() < 0.01,
            "ADSR should hold at sustain level"
        );

        // Sustain should hold without note-off
        run(&mut env, 500, &p, sr);
        assert!(
            (env.output - 0.5).abs() < 0.01,
            "ADSR should continue holding sustain"
        );

        // Note-off should enter release
        env.note_off();
        let first_release = env.advance(&p, sr);
        assert!(first_release < 0.5, "ADSR should release after note-off");

        // After full release should be zero
        run(&mut env, 4410, &p, sr);
        assert!(env.output.abs() < 1e-4, "ADSR release should reach zero");
    }
}
