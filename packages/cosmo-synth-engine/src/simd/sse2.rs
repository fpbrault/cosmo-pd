//! SSE2 SIMD implementation (4x f32 in parallel).
//!
//! This backend keeps the same 4-wide API as AVX2 so the higher-level code
//! can target a single abstraction across native x86 targets.

#![allow(unsafe_code)]
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
        unsafe { _mm_storeu_ps(arr.as_mut_ptr(), v) };
        Self(arr)
    }

    #[inline]
    unsafe fn to_m128(&self) -> __m128 {
        unsafe { _mm_loadu_ps(self.0.as_ptr()) }
    }

    #[inline]
    pub(crate) fn cmplt4(a: [f32; 4], b: [f32; 4]) -> [i32; 4] {
        unsafe {
            let a_vec = _mm_loadu_ps(a.as_ptr());
            let b_vec = _mm_loadu_ps(b.as_ptr());
            let cmp = _mm_cmplt_ps(a_vec, b_vec);
            let cmp_int = _mm_castps_si128(cmp);
            let mut mask = [0i32; 4];
            _mm_storeu_si128(mask.as_mut_ptr() as *mut __m128i, cmp_int);
            mask
        }
    }

    #[inline]
    pub(crate) fn blend4(a: [f32; 4], b: [f32; 4], mask: [i32; 4]) -> [f32; 4] {
        unsafe {
            let a_vec = _mm_loadu_ps(a.as_ptr());
            let b_vec = _mm_loadu_ps(b.as_ptr());
            let mask_ps = _mm_castsi128_ps(_mm_loadu_si128(mask.as_ptr() as *const __m128i));
            let result = _mm_or_ps(_mm_and_ps(mask_ps, a_vec), _mm_andnot_ps(mask_ps, b_vec));
            let mut out = [0.0; 4];
            _mm_storeu_ps(out.as_mut_ptr(), result);
            out
        }
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
