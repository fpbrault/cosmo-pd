//! SSE2 SIMD implementation (4x f32 in parallel).
//!
//! This backend keeps the same 4-wide API as AVX2 so the higher-level code
//! can target a single abstraction across native x86 targets.

#![cfg(target_arch = "x86_64")]

use super::SimdType;
use core::arch::x86_64::*;
use core::ops::{Add, AddAssign, Mul, MulAssign, Sub};

#[derive(Clone, Copy)]
pub struct Sse2([f32; 4]);

impl Sse2 {
    #[inline]
    unsafe fn from_m128(v: __m128) -> Self {
        let mut arr = [0.0; 4];
        _mm_storeu_ps(arr.as_mut_ptr(), v);
        Self(arr)
    }

    #[inline]
    unsafe fn to_m128(&self) -> __m128 {
        _mm_loadu_ps(self.0.as_ptr())
    }
}

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
        unsafe {
            let lhs = self.to_m128();
            let rhs = other.to_m128();
            Self::from_m128(_mm_add_ps(lhs, rhs))
        }
    }

    #[inline]
    fn sub(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_m128();
            let rhs = other.to_m128();
            Self::from_m128(_mm_sub_ps(lhs, rhs))
        }
    }

    #[inline]
    fn mul(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_m128();
            let rhs = other.to_m128();
            Self::from_m128(_mm_mul_ps(lhs, rhs))
        }
    }

    #[inline]
    fn mul_scalar(self, val: f32) -> Self {
        SimdType::mul(self, Self::splat(val))
    }

    #[inline]
    fn max(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_m128();
            let rhs = other.to_m128();
            Self::from_m128(_mm_max_ps(lhs, rhs))
        }
    }

    #[inline]
    fn min(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_m128();
            let rhs = other.to_m128();
            Self::from_m128(_mm_min_ps(lhs, rhs))
        }
    }

    #[inline]
    fn sum(self) -> f32 {
        self.0[0] + self.0[1] + self.0[2] + self.0[3]
    }

    #[inline]
    fn div(self, other: Self) -> Self {
        unsafe {
            let v1 = self.to_m128();
            let v2 = other.to_m128();
            Self::from_m128(_mm_div_ps(v1, v2))
        }
    }

    #[inline]
    fn abs(self) -> Self {
        unsafe {
            let v = self.to_m128();
            let sign_mask = _mm_set1_epi32(0x7fff_ffff_u32 as i32);
            Self::from_m128(_mm_and_ps(v, _mm_castsi128_ps(sign_mask)))
        }
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
