const TAU: f32 = core::f32::consts::TAU;

#[inline]
pub fn clamp_unit(value: f32) -> f32 {
    value.clamp(0.0, 1.0)
}

#[inline]
pub fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
}

#[inline]
pub fn wrap01(value: f32) -> f32 {
    let wrapped = value - libm::floorf(value);
    if wrapped < 0.0 {
        wrapped + 1.0
    } else {
        wrapped
    }
}

#[inline]
pub fn midi_note_to_hz(midi_note: u8) -> f32 {
    440.0 * libm::powf(2.0, (midi_note as f32 - 69.0) / 12.0)
}

/// Phase accumulator normalized to `[0, 1)`.
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct Phase {
    value: f32,
}

impl Phase {
    pub fn value(&self) -> f32 {
        self.value
    }

    pub fn reset(&mut self, value: f32) {
        self.value = wrap01(value);
    }

    pub fn advance(&mut self, hz: f32, sample_rate: f32) -> f32 {
        self.value = wrap01(self.value + hz / sample_rate.max(1.0));
        self.value
    }

    pub fn sine(&self) -> f32 {
        libm::sinf(self.value * TAU)
    }
}

/// One-pole smoother for de-zippering parameter changes.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Smoother {
    current: f32,
    coefficient: f32,
}

impl Smoother {
    pub fn new(initial: f32, time_seconds: f32, sample_rate: f32) -> Self {
        Self {
            current: initial,
            coefficient: smoothing_coefficient(time_seconds, sample_rate),
        }
    }

    pub fn current(&self) -> f32 {
        self.current
    }

    pub fn reset(&mut self, value: f32) {
        self.current = value;
    }

    pub fn set_time(&mut self, time_seconds: f32, sample_rate: f32) {
        self.coefficient = smoothing_coefficient(time_seconds, sample_rate);
    }

    pub fn next(&mut self, target: f32) -> f32 {
        self.current += (target - self.current) * self.coefficient;
        self.current
    }
}

impl Default for Smoother {
    fn default() -> Self {
        Self {
            current: 0.0,
            coefficient: 1.0,
        }
    }
}

/// Equal-power pan law.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct PanLaw;

impl PanLaw {
    pub fn gains(pan: f32) -> (f32, f32) {
        let normalized = clamp_unit((pan + 1.0) * 0.5);
        let angle = normalized * core::f32::consts::FRAC_PI_2;
        (libm::cosf(angle), libm::sinf(angle))
    }
}

fn smoothing_coefficient(time_seconds: f32, sample_rate: f32) -> f32 {
    if time_seconds <= 0.0 {
        return 1.0;
    }

    1.0 - libm::expf(-1.0 / (time_seconds * sample_rate.max(1.0)))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn wraps_phase_into_unit_range() {
        assert!((wrap01(1.25) - 0.25).abs() < 0.0001);
        assert!((wrap01(-0.25) - 0.75).abs() < 0.0001);
    }

    #[test]
    fn converts_midi_a4_to_440_hz() {
        assert!((midi_note_to_hz(69) - 440.0).abs() < 0.0001);
    }

    #[test]
    fn phase_advance_uses_frequency_and_sample_rate() {
        let mut phase = Phase::default();

        phase.advance(100.0, 1_000.0);

        assert!((phase.value() - 0.1).abs() < 0.0001);
    }
}
