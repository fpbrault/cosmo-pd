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

// TODO: Implement SSE2, AVX2, and WasmSimd types (conditional compilation)
// This is scaffolding for future SIMD backends

#[cfg(all(target_arch = "x86_64", target_feature = "avx2"))]
mod avx2;
#[cfg(all(target_arch = "x86_64", target_feature = "avx2"))]
pub use avx2::Avx2;

#[cfg(all(target_arch = "x86_64", target_feature = "avx2"))]
pub type NativeSimd = Avx2;

#[cfg(all(target_arch = "x86_64", target_feature = "sse2", not(target_feature = "avx2")))]
pub type NativeSimd = Scalar; // TODO: Sse2 implementation

#[cfg(target_arch = "wasm32")]
pub type NativeSimd = Scalar; // TODO: WasmSimd when stable

#[cfg(not(any(
    target_arch = "x86_64",
    target_arch = "x86",
    target_arch = "wasm32"
)))]
pub type NativeSimd = Scalar;

#[cfg(test)]
mod tests {
    use super::*;

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
}
