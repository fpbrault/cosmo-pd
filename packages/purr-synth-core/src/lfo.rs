use crate::dsp::{wrap01, Phase};
use crate::noise::NoiseGenerator;

/// Low-frequency oscillator shapes for modulation utilities.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub enum LfoWaveform {
    #[default]
    Sine,
    Triangle,
    SawUp,
    SawDown,
    Square,
    SampleHold,
}

/// Reusable low-frequency oscillator for synth-defined modulation routing.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Lfo {
    phase: Phase,
    noise: NoiseGenerator,
    held_value: f32,
}

impl Lfo {
    pub fn new(seed: u32) -> Self {
        Self {
            phase: Phase::default(),
            noise: NoiseGenerator::new(seed),
            held_value: 0.0,
        }
    }

    pub fn phase(&self) -> f32 {
        self.phase.value()
    }

    pub fn reset(&mut self, phase: f32) {
        self.phase.reset(phase);
    }

    pub fn held_value(&self) -> f32 {
        self.held_value
    }

    pub fn next(&mut self, waveform: LfoWaveform, rate_hz: f32, sample_rate: f32) -> f32 {
        let previous_phase = self.phase.value();
        let phase_step = rate_hz.max(0.0) / sample_rate.max(1.0);
        let phase = self.phase.advance(rate_hz.max(0.0), sample_rate);

        if waveform == LfoWaveform::SampleHold && phase_step > 0.0 && phase <= previous_phase {
            self.held_value = self.noise.next_bipolar();
        }

        lfo_sample(waveform, phase, self.held_value)
    }
}

impl Default for Lfo {
    fn default() -> Self {
        Self::new(0x4c46_4f31)
    }
}

pub fn lfo_sample(waveform: LfoWaveform, phase: f32, held_value: f32) -> f32 {
    let phase = wrap01(phase);

    match waveform {
        LfoWaveform::Sine => libm::sinf(core::f32::consts::TAU * phase),
        LfoWaveform::Triangle => 1.0 - 4.0 * libm::fabsf(phase - 0.5),
        LfoWaveform::SawUp => phase * 2.0 - 1.0,
        LfoWaveform::SawDown => 1.0 - phase * 2.0,
        LfoWaveform::Square => {
            if phase < 0.5 {
                1.0
            } else {
                -1.0
            }
        }
        LfoWaveform::SampleHold => held_value.clamp(-1.0, 1.0),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lfo_advances_phase_and_outputs_shape() {
        let mut lfo = Lfo::default();

        let output = lfo.next(LfoWaveform::SawUp, 1.0, 4.0);

        assert!((lfo.phase() - 0.25).abs() < 0.0001);
        assert!((output + 0.5).abs() < 0.0001);
    }

    #[test]
    fn sample_hold_changes_on_wrap() {
        let mut lfo = Lfo::new(12);
        let before = lfo.held_value();

        lfo.next(LfoWaveform::SampleHold, 1.0, 1.0);

        assert_ne!(lfo.held_value(), before);
    }
}
