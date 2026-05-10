//! SSE2 SIMD implementation (4x f32 in parallel).
//!
//! This backend keeps the same 4-wide API as AVX2 so the higher-level code
//! can target a single abstraction across native x86 targets.

#![cfg(all(
    target_arch = "x86_64",
    target_feature = "sse2",
    not(target_feature = "avx2")
))]

use super::SimdType;
use core::ops::{Add, AddAssign, Mul, MulAssign, Sub};

#[derive(Clone, Copy)]
pub struct Sse2([f32; 4]);

impl SimdType for Sse2 {
    const WIDTH: usize = 4;

    #[inline]
    fn zero() -> Self {
        Self([0.0; 4])
    }

    #[inline]
    fn splat(val: f32) -> Self {
        Self([val; 4])
    }

    #[inline]
    fn from_array(arr: &[f32]) -> Self {
        let mut values = [0.0; 4];
        for (index, &value) in arr.iter().enumerate().take(4) {
            values[index] = value;
        }
        Self(values)
    }

    #[inline]
    fn to_vec(&self) -> [f32; 4] {
        self.0
    }

    #[inline]
    fn add(self, other: Self) -> Self {
        Self([
            self.0[0] + other.0[0],
            self.0[1] + other.0[1],
            self.0[2] + other.0[2],
            self.0[3] + other.0[3],
        ])
    }

    #[inline]
    fn sub(self, other: Self) -> Self {
        Self([
            self.0[0] - other.0[0],
            self.0[1] - other.0[1],
            self.0[2] - other.0[2],
            self.0[3] - other.0[3],
        ])
    }

    #[inline]
    fn mul(self, other: Self) -> Self {
        Self([
            self.0[0] * other.0[0],
            self.0[1] * other.0[1],
            self.0[2] * other.0[2],
            self.0[3] * other.0[3],
        ])
    }

    #[inline]
    fn mul_scalar(self, val: f32) -> Self {
        Self([
            self.0[0] * val,
            self.0[1] * val,
            self.0[2] * val,
            self.0[3] * val,
        ])
    }

    #[inline]
    fn max(self, other: Self) -> Self {
        Self([
            self.0[0].max(other.0[0]),
            self.0[1].max(other.0[1]),
            self.0[2].max(other.0[2]),
            self.0[3].max(other.0[3]),
        ])
    }

    #[inline]
    fn min(self, other: Self) -> Self {
        Self([
            self.0[0].min(other.0[0]),
            self.0[1].min(other.0[1]),
            self.0[2].min(other.0[2]),
            self.0[3].min(other.0[3]),
        ])
    }

    #[inline]
    fn sum(self) -> f32 {
        self.0[0] + self.0[1] + self.0[2] + self.0[3]
    }

    #[inline]
    fn abs(self) -> Self {
        Self([
            self.0[0].abs(),
            self.0[1].abs(),
            self.0[2].abs(),
            self.0[3].abs(),
        ])
    }
}

impl Add for Sse2 {
    type Output = Self;

    #[inline]
    fn add(self, other: Self) -> Self {
        SimdType::add(self, other)
    }
}

impl AddAssign for Sse2 {
    #[inline]
    fn add_assign(&mut self, other: Self) {
        *self = <Self as SimdType>::add(*self, other);
    }
}

impl Sub for Sse2 {
    type Output = Self;

    #[inline]
    fn sub(self, other: Self) -> Self {
        SimdType::sub(self, other)
    }
}

impl Mul for Sse2 {
    type Output = Self;

    #[inline]
    fn mul(self, other: Self) -> Self {
        SimdType::mul(self, other)
    }
}

impl MulAssign for Sse2 {
    #[inline]
    fn mul_assign(&mut self, other: Self) {
        *self = <Self as SimdType>::mul(*self, other);
    }
}
