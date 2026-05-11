//! WebAssembly SIMD implementation (4x f32 in parallel).
//!
//! This module keeps the cross-platform 4-wide API available on wasm32
//! targets with `simd128` enabled.

#![cfg(target_arch = "wasm32")]

use super::SimdType;
use core::arch::wasm32::*;
use core::ops::{Add, AddAssign, Mul, MulAssign, Sub};

#[derive(Clone, Copy)]
pub struct WasmSimd([f32; 4]);

impl WasmSimd {
    #[target_feature(enable = "simd128")]
    #[inline]
    unsafe fn from_v128(v: v128) -> Self {
        Self([
            f32x4_extract_lane::<0>(v),
            f32x4_extract_lane::<1>(v),
            f32x4_extract_lane::<2>(v),
            f32x4_extract_lane::<3>(v),
        ])
    }

    #[target_feature(enable = "simd128")]
    #[inline]
    unsafe fn to_v128(&self) -> v128 {
        f32x4(self.0[0], self.0[1], self.0[2], self.0[3])
    }
}

impl SimdType for WasmSimd {
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
            let lhs = self.to_v128();
            let rhs = other.to_v128();
            Self::from_v128(f32x4_add(lhs, rhs))
        }
    }

    #[inline]
    fn sub(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_v128();
            let rhs = other.to_v128();
            Self::from_v128(f32x4_sub(lhs, rhs))
        }
    }

    #[inline]
    fn mul(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_v128();
            let rhs = other.to_v128();
            Self::from_v128(f32x4_mul(lhs, rhs))
        }
    }

    #[inline]
    fn mul_scalar(self, val: f32) -> Self {
        SimdType::mul(self, Self::splat(val))
    }

    #[inline]
    fn max(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_v128();
            let rhs = other.to_v128();
            Self::from_v128(f32x4_max(lhs, rhs))
        }
    }

    #[inline]
    fn min(self, other: Self) -> Self {
        unsafe {
            let lhs = self.to_v128();
            let rhs = other.to_v128();
            Self::from_v128(f32x4_min(lhs, rhs))
        }
    }

    #[inline]
    fn sum(self) -> f32 {
        self.0[0] + self.0[1] + self.0[2] + self.0[3]
    }

    #[inline]
    fn abs(self) -> Self {
        unsafe {
            let v = self.to_v128();
            let mask = i32x4(
                0x7fff_ffff_u32 as i32,
                0x7fff_ffff_u32 as i32,
                0x7fff_ffff_u32 as i32,
                0x7fff_ffff_u32 as i32,
            );
            Self::from_v128(v128_and(v, mask))
        }
    }
}

impl Add for WasmSimd {
    type Output = Self;

    #[inline]
    fn add(self, other: Self) -> Self {
        SimdType::add(self, other)
    }
}

impl AddAssign for WasmSimd {
    #[inline]
    fn add_assign(&mut self, other: Self) {
        *self = <Self as SimdType>::add(*self, other);
    }
}

impl Sub for WasmSimd {
    type Output = Self;

    #[inline]
    fn sub(self, other: Self) -> Self {
        SimdType::sub(self, other)
    }
}

impl Mul for WasmSimd {
    type Output = Self;

    #[inline]
    fn mul(self, other: Self) -> Self {
        SimdType::mul(self, other)
    }
}

impl MulAssign for WasmSimd {
    #[inline]
    fn mul_assign(&mut self, other: Self) {
        *self = <Self as SimdType>::mul(*self, other);
    }
}
