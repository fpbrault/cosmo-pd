extern crate alloc;

use alloc::vec;
use alloc::vec::Vec;

// ---------------------------------------------------------------------------
// DelayLine — circular buffer for all delay-based effects
// ---------------------------------------------------------------------------

pub struct DelayLine {
    buffer: Vec<f32>,
    length: usize,
    write_pos: usize,
}

impl DelayLine {
    pub fn new(length: usize) -> Self {
        Self {
            buffer: vec![0.0_f32; length],
            length,
            write_pos: 0,
        }
    }

    /// Write a sample and advance the write pointer.
    #[inline]
    pub fn write(&mut self, value: f32) {
        self.buffer[self.write_pos] = value;
        self.write_pos = (self.write_pos + 1) % self.length;
    }

    /// Read a sample at `offset` samples behind the write pointer.
    #[inline]
    pub fn read(&self, offset: usize) -> f32 {
        let pos = (self.write_pos + self.length - offset % self.length) % self.length;
        self.buffer[pos]
    }

    /// Linear-interpolated read at fractional delay `samples` (≥ 1).
    #[inline]
    pub fn read_at_fractional(&self, samples: f32) -> f32 {
        let int_part = libm::floorf(samples) as usize;
        let frac = samples - libm::floorf(samples);
        let a = self.read(int_part);
        let b = self.read(int_part + 1);
        a + (b - a) * frac
    }
}
