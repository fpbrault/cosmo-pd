use crate::params::{AdsrData, CurveShape};

/// Phase state for a per-line ADSR envelope.
#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub(crate) enum AdsrPhase {
    #[default]
    Idle,
    Attack,
    Decay,
    Sustain,
    Release,
    Finished,
}

/// Per-line ADSR envelope generator with curve shapes.
#[derive(Debug, Clone)]
pub struct AdsrGen {
    phase: AdsrPhase,
    pub output: f32,
    pub elapsed: u32,

    // Pre-computed at note_on
    attack_samples: u32,
    decay_samples: u32,
    sustain_level: f32,
    release_samples: u32,

    // Pre-computed
    release_start_level: f32,
    attack_curve: CurveShape,
    decay_curve: CurveShape,
    release_curve: CurveShape,
}

impl Default for AdsrGen {
    fn default() -> Self {
        Self {
            phase: AdsrPhase::Idle,
            output: 0.0,
            elapsed: 0,
            attack_samples: 0,
            decay_samples: 0,
            sustain_level: 0.0,
            release_samples: 0,
            release_start_level: 0.0,
            attack_curve: CurveShape::Linear,
            decay_curve: CurveShape::Linear,
            release_curve: CurveShape::Linear,
        }
    }
}

impl AdsrGen {
    pub fn reset(&mut self) {
        self.phase = AdsrPhase::Idle;
        self.output = 0.0;
        self.elapsed = 0;
    }

    pub fn note_on(&mut self, data: &AdsrData, sr: f32) {
        let safe_sr = sr.max(1.0);
        self.attack_samples = (data.attack_time_secs * safe_sr).max(1.0).round() as u32;
        self.decay_samples = (data.decay_time_secs * safe_sr).max(1.0).round() as u32;
        self.release_samples = (data.release_time_secs * safe_sr).max(1.0).round() as u32;
        self.sustain_level = data.sustain_level.clamp(0.0, 1.0);
        self.attack_curve = data.attack_curve;
        self.decay_curve = data.decay_curve;
        self.release_curve = data.release_curve;
        self.elapsed = 0;
        self.output = 0.0;
        self.phase = AdsrPhase::Attack;
    }

    pub fn note_off(&mut self) {
        if matches!(self.phase, AdsrPhase::Idle | AdsrPhase::Finished) {
            return;
        }
        self.release_start_level = self.output;
        self.elapsed = 0;
        self.phase = AdsrPhase::Release;
    }

    #[inline(always)]
    fn curve_map(t: f32, shape: CurveShape) -> f32 {
        let t = t.clamp(0.0, 1.0);
        match shape {
            CurveShape::Linear => t,
            CurveShape::Exp => 1.0 - (1.0 - t) * (1.0 - t),
            CurveShape::Log => t * t,
        }
    }

    #[inline]
    pub fn advance(&mut self) -> f32 {
        match self.phase {
            AdsrPhase::Idle | AdsrPhase::Finished => {
                self.output = 0.0;
            }
            AdsrPhase::Attack => {
                self.elapsed += 1;
                let t = (self.elapsed as f32 / self.attack_samples as f32).min(1.0);
                let wt = Self::curve_map(t, self.attack_curve);
                self.output = wt;
                if t >= 1.0 {
                    self.output = 1.0;
                    self.elapsed = 0;
                    self.phase = AdsrPhase::Decay;
                }
            }
            AdsrPhase::Decay => {
                self.elapsed += 1;
                if self.sustain_level >= 1.0 {
                    self.output = self.sustain_level;
                    self.elapsed = 0;
                    self.phase = AdsrPhase::Sustain;
                } else {
                    let t = (self.elapsed as f32 / self.decay_samples as f32).min(1.0);
                    let wt = Self::curve_map(t, self.decay_curve);
                    self.output = 1.0 - (1.0 - self.sustain_level) * wt;
                    if t >= 1.0 {
                        self.output = self.sustain_level;
                        self.elapsed = 0;
                        self.phase = AdsrPhase::Sustain;
                    }
                }
            }
            AdsrPhase::Sustain => {
                self.output = self.sustain_level;
            }
            AdsrPhase::Release => {
                self.elapsed += 1;
                if self.release_start_level <= 0.0 {
                    self.output = 0.0;
                    self.elapsed = 0;
                    self.phase = AdsrPhase::Finished;
                } else {
                    let t = (self.elapsed as f32 / self.release_samples as f32).min(1.0);
                    let wt = Self::curve_map(t, self.release_curve);
                    self.output = self.release_start_level * (1.0 - wt);
                    if t >= 1.0 {
                        self.output = 0.0;
                        self.elapsed = 0;
                        self.phase = AdsrPhase::Finished;
                    }
                }
            }
        }
        self.output
    }

    pub fn phase_index(&self) -> u8 {
        match self.phase {
            AdsrPhase::Idle => 0,
            AdsrPhase::Attack => 1,
            AdsrPhase::Decay => 2,
            AdsrPhase::Sustain => 3,
            AdsrPhase::Release => 4,
            AdsrPhase::Finished => 5,
        }
    }

    pub fn is_releasing(&self) -> bool {
        matches!(self.phase, AdsrPhase::Release)
    }

    pub fn has_reached_sustain(&self) -> bool {
        matches!(
            self.phase,
            AdsrPhase::Sustain | AdsrPhase::Release | AdsrPhase::Finished
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_data() -> AdsrData {
        AdsrData {
            attack_time_secs: 0.01,
            decay_time_secs: 0.01,
            sustain_level: 0.5,
            release_time_secs: 0.01,
            ..Default::default()
        }
    }

    #[test]
    fn adsr_phase_transitions() {
        let data = make_data();
        let sr = 1000.0;
        let mut gen = AdsrGen::default();

        assert_eq!(gen.phase, AdsrPhase::Idle);
        assert_eq!(gen.output, 0.0);

        gen.note_on(&data, sr);
        assert_eq!(gen.phase, AdsrPhase::Attack);

        // Attack: 0.01s * 1000 = 10 samples
        for _ in 0..10 {
            gen.advance();
        }
        assert_eq!(gen.phase, AdsrPhase::Decay);

        // Decay: 0.01s * 1000 = 10 samples
        for _ in 0..10 {
            gen.advance();
        }
        assert_eq!(gen.phase, AdsrPhase::Sustain);
        assert!((gen.output - 0.5).abs() < 1e-6);

        gen.note_off();
        assert_eq!(gen.phase, AdsrPhase::Release);

        // Release: 0.01s * 1000 = 10 samples
        for _ in 0..10 {
            gen.advance();
        }
        assert_eq!(gen.phase, AdsrPhase::Finished);
        assert_eq!(gen.output, 0.0);
    }

    #[test]
    fn adsr_sustain_at_zero_skips_decay_and_decays_immediately() {
        let data = AdsrData {
            attack_time_secs: 0.001,
            decay_time_secs: 0.01,
            sustain_level: 0.0,
            release_time_secs: 0.01,
            ..Default::default()
        };
        let sr = 1000.0;
        let mut gen = AdsrGen::default();
        gen.note_on(&data, sr);

        // Must pass through attack
        while gen.phase == AdsrPhase::Attack {
            gen.advance();
        }
        assert_eq!(gen.phase, AdsrPhase::Decay);

        // Must decay to 0
        while gen.phase == AdsrPhase::Decay {
            gen.advance();
        }
        assert_eq!(gen.phase, AdsrPhase::Sustain);
        assert_eq!(gen.output, 0.0);
    }

    #[test]
    fn adsr_note_off_from_attack_transitions_to_release() {
        let data = make_data();
        let sr = 1000.0;
        let mut gen = AdsrGen::default();
        gen.note_on(&data, sr);

        // Advance partway through attack
        gen.advance();
        gen.advance();
        let mid_attack = gen.output;
        assert!(mid_attack > 0.0 && mid_attack < 1.0);

        gen.note_off();
        assert_eq!(gen.phase, AdsrPhase::Release);
        assert!((gen.output - mid_attack).abs() < 1e-6);
    }

    #[test]
    fn adsr_reset_returns_to_idle() {
        let data = make_data();
        let sr = 1000.0;
        let mut gen = AdsrGen::default();
        gen.note_on(&data, sr);
        gen.advance();
        gen.reset();
        assert_eq!(gen.phase, AdsrPhase::Idle);
        assert_eq!(gen.output, 0.0);
    }

    #[test]
    fn adsr_curve_shapes_produce_different_outputs() {
        let linear = AdsrGen::curve_map(0.5, CurveShape::Linear);
        let exp = AdsrGen::curve_map(0.5, CurveShape::Exp);
        let log = AdsrGen::curve_map(0.5, CurveShape::Log);

        assert_eq!(linear, 0.5);
        assert!(exp > 0.5);
        assert!(log < 0.5);
    }

    #[test]
    fn adsr_phase_index_mapping() {
        let mut gen = AdsrGen::default();
        assert_eq!(gen.phase_index(), 0);

        let data = make_data();
        gen.note_on(&data, 1000.0);
        assert_eq!(gen.phase_index(), 1);

        while gen.phase == AdsrPhase::Attack {
            gen.advance();
        }
        assert_eq!(gen.phase_index(), 2);

        while gen.phase == AdsrPhase::Decay {
            gen.advance();
        }
        assert_eq!(gen.phase_index(), 3);

        gen.note_off();
        assert_eq!(gen.phase_index(), 4);

        while gen.phase == AdsrPhase::Release {
            gen.advance();
        }
        assert_eq!(gen.phase_index(), 5);
    }
}
