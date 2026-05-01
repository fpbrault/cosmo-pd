use crate::buffer::RingBuffer;

/// A bounded capture buffer for scopes, meters, and debug visualizations.
#[derive(Debug, Clone, PartialEq)]
pub struct ScopeCapture {
    buffer: RingBuffer<f32>,
    decimation: usize,
    samples_until_capture: usize,
}

impl ScopeCapture {
    pub fn new(capacity: usize, decimation: usize) -> Self {
        Self {
            buffer: RingBuffer::new(capacity),
            decimation: decimation.max(1),
            samples_until_capture: 0,
        }
    }

    pub fn push(&mut self, sample: f32) {
        if self.samples_until_capture == 0 {
            self.buffer.push(sample);
            self.samples_until_capture = self.decimation - 1;
            return;
        }

        self.samples_until_capture -= 1;
    }

    pub fn latest(&self, delay_samples: usize) -> f32 {
        self.buffer.read_delay(delay_samples)
    }

    pub fn clear(&mut self) {
        self.buffer.clear();
        self.samples_until_capture = 0;
    }
}

/// Lightweight peak/RMS meter accumulator.
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct LevelMeter {
    peak: f32,
    sum_squares: f32,
    count: u32,
}

impl LevelMeter {
    pub fn push(&mut self, sample: f32) {
        let abs_sample = libm::fabsf(sample);
        self.peak = self.peak.max(abs_sample);
        self.sum_squares += sample * sample;
        self.count += 1;
    }

    pub fn peak(&self) -> f32 {
        self.peak
    }

    pub fn rms(&self) -> f32 {
        if self.count == 0 {
            return 0.0;
        }

        libm::sqrtf(self.sum_squares / self.count as f32)
    }

    pub fn reset(&mut self) {
        *self = Self::default();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn scope_capture_decimates_input() {
        let mut scope = ScopeCapture::new(4, 2);
        scope.push(1.0);
        scope.push(2.0);
        scope.push(3.0);

        assert_eq!(scope.latest(0), 3.0);
        assert_eq!(scope.latest(1), 1.0);
    }

    #[test]
    fn level_meter_tracks_peak_and_rms() {
        let mut meter = LevelMeter::default();
        meter.push(1.0);
        meter.push(-1.0);

        assert_eq!(meter.peak(), 1.0);
        assert_eq!(meter.rms(), 1.0);
    }
}
