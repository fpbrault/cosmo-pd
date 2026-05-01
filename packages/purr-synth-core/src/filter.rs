/// Common filter output modes for reusable filter primitives.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FilterMode {
    LowPass,
    HighPass,
    BandPass,
    Notch,
}

/// A simple one-pole low-pass filter for smoothing or lightweight tone shaping.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct OnePoleLowPass {
    sample_rate: f32,
    cutoff_hz: f32,
    coefficient: f32,
    state: f32,
}

impl OnePoleLowPass {
    pub fn new(sample_rate: f32, cutoff_hz: f32) -> Self {
        let mut filter = Self {
            sample_rate: sample_rate.max(1.0),
            cutoff_hz: 0.0,
            coefficient: 1.0,
            state: 0.0,
        };
        filter.set_cutoff(cutoff_hz);
        filter
    }

    pub fn reset(&mut self, value: f32) {
        self.state = value;
    }

    pub fn set_sample_rate(&mut self, sample_rate: f32) {
        self.sample_rate = sample_rate.max(1.0);
        self.recalculate();
    }

    pub fn set_cutoff(&mut self, cutoff_hz: f32) {
        self.cutoff_hz = cutoff_hz.max(0.0);
        self.recalculate();
    }

    pub fn process(&mut self, input: f32) -> f32 {
        self.state += (input - self.state) * self.coefficient;
        self.state
    }

    fn recalculate(&mut self) {
        if self.cutoff_hz <= 0.0 {
            self.coefficient = 0.0;
            return;
        }

        let dt = 1.0 / self.sample_rate;
        let rc = 1.0 / (core::f32::consts::TAU * self.cutoff_hz);
        self.coefficient = (dt / (rc + dt)).clamp(0.0, 1.0);
    }
}

impl Default for OnePoleLowPass {
    fn default() -> Self {
        Self::new(44_100.0, 1_000.0)
    }
}

/// Topology-preserving state-variable filter.
///
/// This is a compact general-purpose filter suitable for subtractive synth
/// examples and control-rate filtering. Synths needing circuit-specific
/// behavior can provide their own filter implementation instead.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct StateVariableFilter {
    sample_rate: f32,
    cutoff_hz: f32,
    resonance: f32,
    integrator1: f32,
    integrator2: f32,
    g: f32,
    damping: f32,
}

impl StateVariableFilter {
    pub fn new(sample_rate: f32) -> Self {
        let mut filter = Self {
            sample_rate: sample_rate.max(1.0),
            cutoff_hz: 1_000.0,
            resonance: 0.0,
            integrator1: 0.0,
            integrator2: 0.0,
            g: 0.0,
            damping: 1.0,
        };
        filter.recalculate();
        filter
    }

    pub fn reset(&mut self) {
        self.integrator1 = 0.0;
        self.integrator2 = 0.0;
    }

    pub fn set_sample_rate(&mut self, sample_rate: f32) {
        self.sample_rate = sample_rate.max(1.0);
        self.recalculate();
    }

    pub fn set_cutoff(&mut self, cutoff_hz: f32) {
        self.cutoff_hz = cutoff_hz.max(0.0);
        self.recalculate();
    }

    pub fn set_resonance(&mut self, resonance: f32) {
        self.resonance = resonance.clamp(0.0, 1.0);
        self.recalculate();
    }

    pub fn process(&mut self, input: f32, mode: FilterMode) -> f32 {
        let high = (input - self.damping * self.integrator1 - self.integrator2)
            / (1.0 + self.damping * self.g + self.g * self.g);
        let band = self.g * high + self.integrator1;
        self.integrator1 = self.g * high + band;
        let low = self.g * band + self.integrator2;
        self.integrator2 = self.g * band + low;

        match mode {
            FilterMode::LowPass => low,
            FilterMode::HighPass => high,
            FilterMode::BandPass => band,
            FilterMode::Notch => low + high,
        }
    }

    fn recalculate(&mut self) {
        let nyquist = self.sample_rate * 0.5;
        let cutoff = self.cutoff_hz.clamp(0.0, nyquist * 0.99);
        self.g = libm::tanf(core::f32::consts::PI * cutoff / self.sample_rate);
        self.damping = 2.0 - self.resonance * 1.9;
    }
}

impl Default for StateVariableFilter {
    fn default() -> Self {
        Self::new(44_100.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_pole_low_pass_smooths_step() {
        let mut filter = OnePoleLowPass::new(1_000.0, 10.0);

        let first = filter.process(1.0);
        let second = filter.process(1.0);

        assert!(first > 0.0);
        assert!(first < second);
        assert!(second < 1.0);
    }

    #[test]
    fn state_variable_filter_outputs_finite_values() {
        let mut filter = StateVariableFilter::new(44_100.0);
        filter.set_cutoff(2_000.0);
        filter.set_resonance(0.5);

        for _ in 0..128 {
            let output = filter.process(1.0, FilterMode::LowPass);
            assert!(output.is_finite());
        }
    }

    #[test]
    fn state_variable_filter_can_reset() {
        let mut filter = StateVariableFilter::new(44_100.0);
        filter.process(1.0, FilterMode::BandPass);
        filter.reset();

        let output = filter.process(0.0, FilterMode::LowPass);

        assert_eq!(output, 0.0);
    }
}
