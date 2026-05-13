extern crate alloc;

use alloc::vec::Vec;

// ---------------------------------------------------------------------------
// DelayLine — circular buffer for all delay-based effects
// ---------------------------------------------------------------------------

pub struct DelayLine {
    buffer: Vec<f32>,
    write_pos: usize,
    length: usize,
}

impl DelayLine {
    pub fn new(length: usize) -> Self {
        assert!(length > 0, "DelayLine length must be > 0");
        Self {
            buffer: vec![0.0_f32; length],
            write_pos: 0,
            length,
        }
    }

    /// Write a sample and advance the write pointer.
    #[inline]
    pub fn write(&mut self, value: f32) {
        self.buffer[self.write_pos] = value;
        self.write_pos = (self.write_pos + 1) % self.length;
    }

    /// Read a sample at `offset` samples behind the write pointer.
    /// offset=1 returns the most recently written sample.
    #[inline]
    pub fn read(&self, offset: usize) -> f32 {
        let o = offset % self.length;
        let idx = (self.write_pos + self.length - o) % self.length;
        self.buffer[idx]
    }

    /// Linear-interpolated read at fractional delay `samples` (≥ 1).
    #[inline]
    pub fn read_at_fractional(&self, samples: f32) -> f32 {
        let floor = samples.floor();
        let int_part = floor as usize;
        let frac = samples - floor;
        let a = self.read(int_part);
        let b = self.read(int_part + 1);
        a + (b - a) * frac
    }
}
