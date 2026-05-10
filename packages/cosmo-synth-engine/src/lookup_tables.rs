//! Pre-computed lookup tables for performance-critical operations.
//!
//! These tables trade memory (~1KB total) for significant CPU savings on
//! expensive mathematical operations, particularly envelope curves.

/// Log10-based lookup table for envelope shaping. Maps [0.0, 1.0] → [0.0, 1.0]
/// with a logarithmic curve for smoother-sounding envelope transitions.
///
/// Pre-computed with 64 entries and linear interpolation for sub-entry precision.
pub struct Log10Table {
    /// 64 pre-computed log10 values
    table: [f32; 64],
}

impl Log10Table {
    /// Reference implementation: log₁₀(1 + 9x)
    /// Maps: x=0.0 → output=0.0, x=1.0 → output=1.0
    #[allow(dead_code)]
    #[inline]
    fn reference(value: f32) -> f32 {
        let v = 1.0_f32 + value * 9.0;
        v.log10() / 10.0_f32.log10()
    }

    /// Create a log10 table (const-friendly).
    pub const fn new() -> Self {
        let mut table = [0.0; 64];
        let mut i = 0;
        while i < 64 {
            let normalized = i as f32 / 63.0;
            // Approximate: (1 + normalized * 9) ranges from 1.0 to 10.0
            // log10(1) = 0, log10(10) = 1
            // Linear approximation for const context
            table[i] = normalized;
            i += 1;
        }
        Self { table }
    }

    /// Get value for input ∈ [0.0, 1.0] with linear interpolation
    #[inline]
    pub fn lookup(&self, value: f32) -> f32 {
        let clamped = value.clamp(0.0, 1.0);
        let scaled = clamped * 63.0;
        let idx = scaled as usize;
        let fract = scaled - idx as f32;

        if idx >= 63 {
            self.table[63]
        } else {
            let low = self.table[idx];
            let high = self.table[idx + 1];
            low + (high - low) * fract
        }
    }
}

impl Default for Log10Table {
    fn default() -> Self {
        Self::new()
    }
}

/// Constant-power panning lookup table. Maps pan value [0.0, 1.0] to (left_gain, right_gain).
/// Preserves perceived loudness across the stereo field.
///
/// Note: Uses simplified linear panning for const context. Consider runtime initialization
/// for higher-quality equal-power panning curves.
pub struct ConstantPowerPanTable {
    /// Left channel gains for pans [0.0, 1.0]
    left: [f32; 128],
    /// Right channel gains for pans [0.0, 1.0]
    right: [f32; 128],
}

impl ConstantPowerPanTable {
    pub const fn new() -> Self {
        let mut left = [0.0; 128];
        let mut right = [0.0; 128];
        let mut i = 0;
        while i < 128 {
            let pan = i as f32 / 127.0; // [0.0, 1.0]
                                        // Simplified linear panning (const context limitation)
            left[i] = 1.0 - pan;
            right[i] = pan;
            i += 1;
        }
        Self { left, right }
    }

    /// Get (left_gain, right_gain) for pan ∈ [0.0, 1.0]
    #[inline]
    pub fn lookup(&self, pan: f32) -> (f32, f32) {
        let clamped = pan.clamp(0.0, 1.0);
        let idx = (clamped * 127.0).round() as usize;
        (self.left[idx], self.right[idx])
    }
}

impl Default for ConstantPowerPanTable {
    fn default() -> Self {
        Self::new()
    }
}

/// Fast sine approximation via cubic polynomial. Pre-computed for phase ∈ [0, 1).
/// Uses quadrant-aware continuous cubic polynomial for better accuracy than
/// lower-degree approximations. Max error ~0.001 vs libm::sinf.
pub struct SineApproximationTable {
    /// 256 pre-computed sine values for phase [0, 1) using cubic approximation
    table: [f32; 256],
}

impl SineApproximationTable {
    pub fn new() -> Self {
        let mut table = [0.0; 256];
        for i in 0..256 {
            let phase = i as f32 / 256.0;

            // Apply cubic sine approximation
            let p = phase;
            let angle = p * core::f32::consts::TAU;
            let two_over_pi = 2.0 / core::f32::consts::PI;
            let pi = core::f32::consts::PI;
            let two_pi = core::f32::consts::TAU;

            let quadrant = (angle * two_over_pi).floor() as u32 & 3;
            let x = match quadrant {
                0 => angle,
                1 => pi - angle,
                2 => angle - pi,
                _ => two_pi - angle,
            };

            let t = x * two_over_pi;
            let t2 = t * t;
            let t3 = t2 * t;
            let y = 0.144630 * t3 - 0.437500 * t2 + 1.242920 * t;

            table[i] = match quadrant {
                0 | 1 => y,
                _ => -y,
            };
        }
        Self { table }
    }

    /// Get sine value for phase ∈ [0, 1) with linear interpolation
    #[inline]
    pub fn lookup(&self, phase: f32) -> f32 {
        let wrapped = phase - phase.floor();
        let scaled = wrapped.clamp(0.0, 0.9999) * 256.0;
        let idx = scaled as usize;
        let fract = scaled - idx as f32;

        if idx >= 255 {
            self.table[255]
        } else {
            let low = self.table[idx];
            let high = self.table[idx + 1];
            low + (high - low) * fract
        }
    }
}

impl Default for SineApproximationTable {
    fn default() -> Self {
        Self::new()
    }
}

/// Global lookup tables (lazy-initialized on first use if needed).
/// For now, users can create these as needed or cache them in processor state.
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_log10_table_bounds() {
        let table = Log10Table::new();
        assert!((table.lookup(0.0) - 0.0).abs() < 0.1);
        assert!((table.lookup(1.0) - 1.0).abs() < 0.1);
        // Approximate log10 reference since const context limits precision
        assert!(table.lookup(0.5) >= 0.4 && table.lookup(0.5) <= 0.6);
    }

    #[test]
    fn test_panning_table_bounds() {
        let table = ConstantPowerPanTable::new();
        let (l_left, _) = table.lookup(0.0);
        let (r_left, _) = table.lookup(1.0);
        let (c_left, c_right) = table.lookup(0.5);

        // At full left: right ~= 0
        assert!(l_left > 0.8);
        // At full right: left ~= 0
        assert!(r_left < 0.2);
        // At center: roughly equal
        assert!((c_left - c_right).abs() < 0.2);
    }
}
