extern crate alloc;

use alloc::vec::Vec;
use dasp_interpolate::{linear::Linear, Interpolator};
use dasp_ring_buffer::Fixed;

// ---------------------------------------------------------------------------
// DelayLine — circular buffer for all delay-based effects
// ---------------------------------------------------------------------------

pub struct DelayLine {
    buffer: Fixed<Vec<f32>>,
    length: usize,
}

impl DelayLine {
    pub fn new(length: usize) -> Self {
        assert!(length > 0, "DelayLine length must be > 0");
        Self {
            buffer: Fixed::from(vec![0.0_f32; length]),
            length,
        }
    }

    /// Write a sample and advance the write pointer.
    #[inline]
    pub fn write(&mut self, value: f32) {
        let _ = self.buffer.push(value);
    }

    /// Read a sample at `offset` samples behind the write pointer.
    #[inline]
    pub fn read(&self, offset: usize) -> f32 {
        // `Fixed` indexes from oldest -> newest. Convert delay offset (newest-back)
        // into that ordering while preserving legacy wrap-around semantics.
        let wrapped = offset % self.length;
        let idx = self.length - wrapped;
        *self.buffer.get(idx)
    }

    /// Linear-interpolated read at fractional delay `samples` (≥ 1).
    #[inline]
    pub fn read_at_fractional(&self, samples: f32) -> f32 {
        let floor = libm::floorf(samples);
        let int_part = floor as usize;
        let frac = samples - floor;
        let a = self.read(int_part);
        let b = self.read(int_part + 1);
        let interp = Linear::new([a], [b]);
        interp.interpolate(frac as f64)[0]
    }
}
