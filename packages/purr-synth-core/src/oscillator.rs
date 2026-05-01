use crate::dsp::{lerp, wrap01, Phase};

/// Basic oscillator waveforms useful for examples and subtractive synths.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub enum BasicWaveform {
    #[default]
    Sine,
    Saw,
    Square,
    Triangle,
}

/// Small audio-rate oscillator backed by a normalized phase accumulator.
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct BasicOscillator {
    phase: Phase,
}

impl BasicOscillator {
    pub fn phase(&self) -> f32 {
        self.phase.value()
    }

    pub fn reset(&mut self, phase: f32) {
        self.phase.reset(phase);
    }

    pub fn next(&mut self, waveform: BasicWaveform, hz: f32, sample_rate: f32) -> f32 {
        let phase = self.phase.advance(hz, sample_rate);
        waveform_sample(waveform, phase)
    }
}

pub fn waveform_sample(waveform: BasicWaveform, phase: f32) -> f32 {
    let phase = wrap01(phase);

    match waveform {
        BasicWaveform::Sine => libm::sinf(core::f32::consts::TAU * phase),
        BasicWaveform::Saw => phase * 2.0 - 1.0,
        BasicWaveform::Square => {
            if phase < 0.5 {
                1.0
            } else {
                -1.0
            }
        }
        BasicWaveform::Triangle => 1.0 - 4.0 * libm::fabsf(phase - 0.5),
    }
}

/// A light wavetable reader with linear interpolation.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Wavetable<'a> {
    samples: &'a [f32],
}

impl<'a> Wavetable<'a> {
    pub fn new(samples: &'a [f32]) -> Self {
        Self { samples }
    }

    pub fn read(&self, phase: f32) -> f32 {
        if self.samples.is_empty() {
            return 0.0;
        }

        if self.samples.len() == 1 {
            return self.samples[0];
        }

        let position = wrap01(phase) * self.samples.len() as f32;
        let index = libm::floorf(position) as usize;
        let next_index = (index + 1) % self.samples.len();
        let fraction = position - index as f32;

        lerp(self.samples[index], self.samples[next_index], fraction)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn basic_oscillator_advances_phase() {
        let mut oscillator = BasicOscillator::default();

        oscillator.next(BasicWaveform::Saw, 100.0, 1_000.0);

        assert!((oscillator.phase() - 0.1).abs() < 0.0001);
    }

    #[test]
    fn wavetable_wraps_and_interpolates() {
        let table = Wavetable::new(&[0.0, 1.0, 0.0, -1.0]);

        assert!((table.read(0.125) - 0.5).abs() < 0.0001);
        assert!((table.read(1.125) - 0.5).abs() < 0.0001);
    }
}
