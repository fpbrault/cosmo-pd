//! SIMD abstraction layer supporting multiple backends:
//! - Scalar (fallback)
//! - SSE2 (native x86/x64)
//! - AVX2 (native x86/x64)
//! - WasmSimd (WebAssembly)
//!
//! Provides unified interface for vectorized operations on f32 arrays.

use core::ops::{Add, AddAssign, Mul, MulAssign, Sub};

/// Base SIMD type trait. Implementations provide vectorized operations
/// on fixed-width data types.
pub trait SimdType: Sized + Copy {
    /// Width in number of f32 elements
    const WIDTH: usize;

    /// Create zeroed vector
    fn zero() -> Self;

    /// Create vector with all elements set to `val`
    fn splat(val: f32) -> Self;

    /// Load f32 values into SIMD vector
    fn from_slice(arr: &[f32]) -> Self {
        let mut arr_full = [0.0; 4];
        for (i, &v) in arr.iter().enumerate().take(Self::WIDTH) {
            arr_full[i] = v;
        }
        Self::from_array(&arr_full[..Self::WIDTH])
    }

    /// Helper: load from array (impl can override)
    fn from_array(arr: &[f32]) -> Self;

    /// Store to slice
    fn to_slice(&self, arr: &mut [f32]) {
        for (i, v) in self.to_vec().iter().enumerate() {
            if i < arr.len() {
                arr[i] = *v;
            }
        }
    }

    /// Helper: get as vector
    fn to_vec(&self) -> [f32; 4];

    /// Helper: get as array
    fn to_array(&self) -> [f32; 4] {
        self.to_vec()
    }

    /// Element-wise addition
    fn add(self, other: Self) -> Self;

    /// Element-wise subtraction
    fn sub(self, other: Self) -> Self;

    /// Element-wise multiplication
    fn mul(self, other: Self) -> Self;

    /// Element-wise multiplication by scalar
    fn mul_scalar(self, val: f32) -> Self;

    /// Element-wise maximum
    fn max(self, other: Self) -> Self;

    /// Element-wise minimum
    fn min(self, other: Self) -> Self;

    /// Clamp elements to [min_val, max_val]
    fn clamp(self, min_val: f32, max_val: f32) -> Self {
        self.max(Self::splat(min_val)).min(Self::splat(max_val))
    }

    /// Horizontal sum of all elements
    fn sum(self) -> f32;

    /// Absolute value of each element
    fn abs(self) -> Self;
}

macro_rules! simd_dispatch {
    ($self:ident, $scalar:expr, $sse2:expr, $avx2:expr, $wasm:expr) => {
        match $self {
            SimdBackend::Scalar => $scalar,
            SimdBackend::Sse2 => {
                #[cfg(target_arch = "x86_64")]
                { $sse2 }
                #[cfg(not(target_arch = "x86_64"))]
                { $scalar }
            }
            SimdBackend::Avx2 => {
                #[cfg(target_arch = "x86_64")]
                { $avx2 }
                #[cfg(not(target_arch = "x86_64"))]
                { $scalar }
            }
            SimdBackend::WasmSimd => {
                #[cfg(target_arch = "wasm32")]
                { $wasm }
                #[cfg(not(target_arch = "wasm32"))]
                { $scalar }
            }
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SimdBackend {
    Scalar,
    Sse2,
    Avx2,
    WasmSimd,
}

impl SimdBackend {
    #[inline]
    pub fn add4(self, lhs: [f32; 4], rhs: [f32; 4]) -> [f32; 4] {
        simd_dispatch!(self,
            [lhs[0] + rhs[0], lhs[1] + rhs[1], lhs[2] + rhs[2], lhs[3] + rhs[3]],
            SimdType::add(Sse2::from_array(&lhs), Sse2::from_array(&rhs)).to_array(),
            SimdType::add(Avx2::from_array(&lhs), Avx2::from_array(&rhs)).to_array(),
            SimdType::add(WasmSimd::from_array(&lhs), WasmSimd::from_array(&rhs)).to_array()
        )
    }

    #[inline]
    pub fn mul4(self, lhs: [f32; 4], rhs: [f32; 4]) -> [f32; 4] {
        simd_dispatch!(self,
            [lhs[0] * rhs[0], lhs[1] * rhs[1], lhs[2] * rhs[2], lhs[3] * rhs[3]],
            SimdType::mul(Sse2::from_array(&lhs), Sse2::from_array(&rhs)).to_array(),
            SimdType::mul(Avx2::from_array(&lhs), Avx2::from_array(&rhs)).to_array(),
            SimdType::mul(WasmSimd::from_array(&lhs), WasmSimd::from_array(&rhs)).to_array()
        )
    }

    #[inline]
    pub fn clamp4(self, values: [f32; 4], min_val: f32, max_val: f32) -> [f32; 4] {
        simd_dispatch!(self,
            [values[0].clamp(min_val, max_val), values[1].clamp(min_val, max_val),
             values[2].clamp(min_val, max_val), values[3].clamp(min_val, max_val)],
            Sse2::from_array(&values).clamp(min_val, max_val).to_array(),
            Avx2::from_array(&values).clamp(min_val, max_val).to_array(),
            WasmSimd::from_array(&values).clamp(min_val, max_val).to_array()
        )
    }

    #[inline]
    pub fn horizontal_sum4(self, values: [f32; 4]) -> f32 {
        simd_dispatch!(self,
            values[0] + values[1] + values[2] + values[3],
            Sse2::from_array(&values).sum(),
            Avx2::from_array(&values).sum(),
            WasmSimd::from_array(&values).sum()
        )
    }
}

#[inline]
pub fn detect_simd_backend() -> SimdBackend {
    #[cfg(target_arch = "x86_64")]
    {
        #[cfg(feature = "std")]
        {
            if std::arch::is_x86_feature_detected!("avx2") {
                return SimdBackend::Avx2;
            }
        }
        return SimdBackend::Sse2;
    }

    #[cfg(target_arch = "wasm32")]
    {
        if cfg!(target_feature = "simd128") {
            return SimdBackend::WasmSimd;
        }
        return SimdBackend::Scalar;
    }

    #[cfg(not(any(target_arch = "x86_64", target_arch = "wasm32")))]
    {
        SimdBackend::Scalar
    }
}

/// Scalar fallback implementation - processes one f32 at a time
#[derive(Debug, Clone, Copy)]
pub struct Scalar(pub f32);

impl SimdType for Scalar {
    const WIDTH: usize = 1;

    #[inline]
    fn zero() -> Self {
        Scalar(0.0)
    }

    #[inline]
    fn splat(val: f32) -> Self {
        Scalar(val)
    }

    #[inline]
    fn from_array(arr: &[f32]) -> Self {
        Scalar(if arr.is_empty() { 0.0 } else { arr[0] })
    }

    #[inline]
    fn to_vec(&self) -> [f32; 4] {
        [self.0, 0.0, 0.0, 0.0]
    }

    #[inline]
    fn add(self, other: Self) -> Self {
        Scalar(self.0 + other.0)
    }

    #[inline]
    fn sub(self, other: Self) -> Self {
        Scalar(self.0 - other.0)
    }

    #[inline]
    fn mul(self, other: Self) -> Self {
        Scalar(self.0 * other.0)
    }

    #[inline]
    fn mul_scalar(self, val: f32) -> Self {
        Scalar(self.0 * val)
    }

    #[inline]
    fn max(self, other: Self) -> Self {
        Scalar(self.0.max(other.0))
    }

    #[inline]
    fn min(self, other: Self) -> Self {
        Scalar(self.0.min(other.0))
    }

    #[inline]
    fn sum(self) -> f32 {
        self.0
    }

    #[inline]
    fn abs(self) -> Self {
        Scalar(self.0.abs())
    }
}

impl Add for Scalar {
    type Output = Self;
    #[inline]
    fn add(self, other: Self) -> Self {
        SimdType::add(self, other)
    }
}

impl AddAssign for Scalar {
    #[inline]
    fn add_assign(&mut self, other: Self) {
        *self = <Self as SimdType>::add(*self, other);
    }
}

impl Sub for Scalar {
    type Output = Self;
    #[inline]
    fn sub(self, other: Self) -> Self {
        SimdType::sub(self, other)
    }
}

impl Mul for Scalar {
    type Output = Self;
    #[inline]
    fn mul(self, other: Self) -> Self {
        SimdType::mul(self, other)
    }
}

impl MulAssign for Scalar {
    #[inline]
    fn mul_assign(&mut self, other: Self) {
        *self = <Self as SimdType>::mul(*self, other);
    }
}

#[cfg(target_arch = "x86_64")]
mod avx2;
#[cfg(target_arch = "x86_64")]
pub use avx2::Avx2;

#[cfg(target_arch = "x86_64")]
mod sse2;
#[cfg(target_arch = "x86_64")]
pub use sse2::Sse2;

#[cfg(target_arch = "wasm32")]
mod wasm_simd;
#[cfg(target_arch = "wasm32")]
pub use wasm_simd::WasmSimd;

#[cfg(test)]
mod tests {
    use super::*;

    fn ref_add(lhs: [f32; 4], rhs: [f32; 4]) -> [f32; 4] {
        [
            lhs[0] + rhs[0],
            lhs[1] + rhs[1],
            lhs[2] + rhs[2],
            lhs[3] + rhs[3],
        ]
    }

    fn ref_sub(lhs: [f32; 4], rhs: [f32; 4]) -> [f32; 4] {
        [
            lhs[0] - rhs[0],
            lhs[1] - rhs[1],
            lhs[2] - rhs[2],
            lhs[3] - rhs[3],
        ]
    }

    fn ref_mul(lhs: [f32; 4], rhs: [f32; 4]) -> [f32; 4] {
        [
            lhs[0] * rhs[0],
            lhs[1] * rhs[1],
            lhs[2] * rhs[2],
            lhs[3] * rhs[3],
        ]
    }

    fn ref_clamp(values: [f32; 4], min_val: f32, max_val: f32) -> [f32; 4] {
        [
            values[0].clamp(min_val, max_val),
            values[1].clamp(min_val, max_val),
            values[2].clamp(min_val, max_val),
            values[3].clamp(min_val, max_val),
        ]
    }

    fn ref_abs(values: [f32; 4]) -> [f32; 4] {
        [
            values[0].abs(),
            values[1].abs(),
            values[2].abs(),
            values[3].abs(),
        ]
    }

    fn assert_backend_parity<T: SimdType>(
        values: [f32; 4],
        other: [f32; 4],
        min_val: f32,
        max_val: f32,
    ) {
        let a = T::from_array(&values);
        let b = T::from_array(&other);

        assert_eq!(a.add(b).to_array(), ref_add(values, other));
        assert_eq!(a.sub(b).to_array(), ref_sub(values, other));
        assert_eq!(a.mul(b).to_array(), ref_mul(values, other));
        assert_eq!(
            a.clamp(min_val, max_val).to_array(),
            ref_clamp(values, min_val, max_val)
        );
        assert_eq!(a.abs().to_array(), ref_abs(values));
    }

    #[test]
    fn test_scalar_operations() {
        let a = Scalar::splat(2.0);
        let b = Scalar::splat(3.0);

        assert_eq!(SimdType::add(a, b).0, 5.0);
        assert_eq!(SimdType::mul(a, b).0, 6.0);
        assert_eq!(SimdType::sub(b, a).0, 1.0);
        assert_eq!(SimdType::max(a, b).0, 3.0);
        assert_eq!(SimdType::min(a, b).0, 2.0);
        assert_eq!(a.sum(), 2.0);
        assert_eq!(Scalar(-3.0).abs().0, 3.0);
    }

    #[test]
    fn test_scalar_clamp() {
        let val = Scalar(5.0);
        assert_eq!(val.clamp(0.0, 3.0).0, 3.0);
        assert_eq!(val.clamp(10.0, 20.0).0, 10.0);
        assert_eq!(val.clamp(3.0, 7.0).0, 5.0);
    }

    #[test]
    fn test_backend_add4_scalar() {
        let out = SimdBackend::Scalar.add4([1.0, 2.0, 3.0, 4.0], [10.0, 20.0, 30.0, 40.0]);
        assert_eq!(out, [11.0, 22.0, 33.0, 44.0]);
    }

    #[cfg(target_arch = "x86_64")]
    #[test]
    fn test_sse2_matches_scalar_reference_vectors() {
        assert_backend_parity::<Sse2>([1.25, -2.5, 3.75, -4.0], [0.5, 1.0, -1.5, 2.25], -2.0, 2.0);
    }

    #[cfg(target_arch = "x86_64")]
    #[test]
    fn test_avx2_matches_scalar_reference_vectors() {
        if !std::is_x86_feature_detected!("avx2") {
            return;
        }

        assert_backend_parity::<Avx2>([1.25, -2.5, 3.75, -4.0], [0.5, 1.0, -1.5, 2.25], -2.0, 2.0);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_wasm_simd_matches_scalar_reference_vectors() {
        assert_backend_parity::<WasmSimd>(
            [1.25, -2.5, 3.75, -4.0],
            [0.5, 1.0, -1.5, 2.25],
            -2.0,
            2.0,
        );
    }
}
