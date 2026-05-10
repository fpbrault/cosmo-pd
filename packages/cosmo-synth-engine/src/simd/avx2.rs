//! AVX2 SIMD implementation (4x f32 or 2x f64 in parallel)
//!
//! Processes 4 f32 values simultaneously using 256-bit AVX2 instructions.
//! Requires: x86_64 + avx2 feature support

#![cfg(all(target_arch = "x86_64", target_feature = "avx2"))]

use super::SimdType;
use core::arch::x86_64::*;
use core::ops::{Add, AddAssign, Mul, MulAssign, Sub};

/// AVX2-backed SIMD type. Processes 4x f32 in parallel.
#[derive(Clone, Copy)]
pub struct Avx2([f32; 4]);

impl Avx2 {
    /// Create from 256-bit register (4x f32)
    #[inline]
    pub fn from_m256(v: __m256) -> Self {
        let mut arr = [0.0; 4];
        unsafe {
            _mm256_storeu_ps(arr.as_mut_ptr(), v);
        }
        Self(arr)
    }

    /// Convert to 256-bit register
    #[inline]
    pub fn to_m256(&self) -> __m256 {
        unsafe { _mm256_loadu_ps(self.0.as_ptr()) }
    }
}

impl SimdType for Avx2 {
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
        let mut a = [0.0; 4];
        for (i, &v) in arr.iter().enumerate().take(4) {
            a[i] = v;
        }
        Self(a)
    }

    #[inline]
    fn to_vec(&self) -> [f32; 4] {
        self.0
    }

    #[inline]
    fn add(self, other: Self) -> Self {
        let v1 = self.to_m256();
        let v2 = other.to_m256();
        let result = unsafe { _mm256_add_ps(v1, v2) };
        Self::from_m256(result)
    }

    #[inline]
    fn sub(self, other: Self) -> Self {
        let v1 = self.to_m256();
        let v2 = other.to_m256();
        let result = unsafe { _mm256_sub_ps(v1, v2) };
        Self::from_m256(result)
    }

    #[inline]
    fn mul(self, other: Self) -> Self {
        let v1 = self.to_m256();
        let v2 = other.to_m256();
        let result = unsafe { _mm256_mul_ps(v1, v2) };
        Self::from_m256(result)
    }

    #[inline]
    fn mul_scalar(self, val: f32) -> Self {
        SimdType::mul(self, Self::splat(val))
    }

    #[inline]
    fn max(self, other: Self) -> Self {
        let v1 = self.to_m256();
        let v2 = other.to_m256();
        let result = unsafe { _mm256_max_ps(v1, v2) };
        Self::from_m256(result)
    }

    #[inline]
    fn min(self, other: Self) -> Self {
        let v1 = self.to_m256();
        let v2 = other.to_m256();
        let result = unsafe { _mm256_min_ps(v1, v2) };
        Self::from_m256(result)
    }

    #[inline]
    fn sum(self) -> f32 {
        self.0[0] + self.0[1] + self.0[2] + self.0[3]
    }

    #[inline]
    fn abs(self) -> Self {
        let v = self.to_m256();
        // abs: clear sign bit (AND with 0x7FFF_FFFF for each element)
        let sign_mask = unsafe { _mm256_set1_epi32(0x7fff_ffff as i32) };
        let result = unsafe { _mm256_and_ps(v, _mm256_castsi256_ps(sign_mask)) };
        Self::from_m256(result)
    }
}

impl Add for Avx2 {
    type Output = Self;
    #[inline]
    fn add(self, other: Self) -> Self {
        SimdType::add(self, other)
    }
}

impl AddAssign for Avx2 {
    #[inline]
    fn add_assign(&mut self, other: Self) {
        *self = SimdType::add(*self, other);
    }
}

impl Sub for Avx2 {
    type Output = Self;
    #[inline]
    fn sub(self, other: Self) -> Self {
        SimdType::sub(self, other)
    }
}

impl Mul for Avx2 {
    type Output = Self;
    #[inline]
    fn mul(self, other: Self) -> Self {
        SimdType::mul(self, other)
    }
}

impl MulAssign for Avx2 {
    #[inline]
    fn mul_assign(&mut self, other: Self) {
        *self = SimdType::mul(*self, other);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_avx2_operations() {
        let a = Avx2::splat(2.0);
        let b = Avx2::splat(3.0);

        assert_eq!(a.add(b).to_array(), [5.0; 4]);
        assert_eq!(a.mul(b).to_array(), [6.0; 4]);
        assert_eq!(b.sub(a).to_array(), [1.0; 4]);
        assert_eq!(a.max(b).to_array(), [3.0; 4]);
        assert_eq!(a.min(b).to_array(), [2.0; 4]);
        assert_eq!(a.sum(), 8.0);
    }
}
