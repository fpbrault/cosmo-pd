extern crate alloc;

use alloc::vec;
use alloc::vec::Vec;

/// Fixed-capacity ring buffer for delay, capture, and sampling utilities.
#[derive(Debug, Clone, PartialEq)]
pub struct RingBuffer<T: Copy + Default> {
    samples: Vec<T>,
    write_index: usize,
}

impl<T: Copy + Default> RingBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        Self {
            samples: vec![T::default(); capacity.max(1)],
            write_index: 0,
        }
    }

    pub fn len(&self) -> usize {
        self.samples.len()
    }

    pub fn is_empty(&self) -> bool {
        self.samples.is_empty()
    }

    pub fn clear(&mut self) {
        self.samples.fill(T::default());
        self.write_index = 0;
    }

    pub fn push(&mut self, sample: T) {
        self.samples[self.write_index] = sample;
        self.write_index = (self.write_index + 1) % self.samples.len();
    }

    pub fn read_delay(&self, delay_samples: usize) -> T {
        let delay = delay_samples.min(self.samples.len() - 1);
        let index = (self.write_index + self.samples.len() - 1 - delay) % self.samples.len();
        self.samples[index]
    }
}

/// Simple fractional delay line using linear interpolation.
#[derive(Debug, Clone, PartialEq)]
pub struct DelayLine {
    buffer: RingBuffer<f32>,
}

impl DelayLine {
    pub fn new(max_delay_samples: usize) -> Self {
        Self {
            buffer: RingBuffer::new(max_delay_samples + 2),
        }
    }

    pub fn clear(&mut self) {
        self.buffer.clear();
    }

    pub fn push(&mut self, sample: f32) {
        self.buffer.push(sample);
    }

    pub fn read(&self, delay_samples: f32) -> f32 {
        let delay = delay_samples.max(0.0);
        let base_delay = libm::floorf(delay) as usize;
        let fraction = delay - base_delay as f32;
        let a = self.buffer.read_delay(base_delay);
        let b = self.buffer.read_delay(base_delay + 1);
        a + (b - a) * fraction
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ring_buffer_reads_recent_delays() {
        let mut buffer = RingBuffer::new(4);
        buffer.push(1);
        buffer.push(2);
        buffer.push(3);

        assert_eq!(buffer.read_delay(0), 3);
        assert_eq!(buffer.read_delay(1), 2);
    }

    #[test]
    fn delay_line_reads_fractional_delay() {
        let mut delay = DelayLine::new(4);
        delay.push(0.0);
        delay.push(1.0);
        delay.push(2.0);

        assert!((delay.read(0.5) - 1.5).abs() < 0.0001);
    }
}
