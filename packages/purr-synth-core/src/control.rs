extern crate alloc;

use alloc::string::String;

/// Stable metadata for a synth-defined control target.
#[derive(Debug, Clone, PartialEq)]
pub struct ControlDescriptor<T> {
    pub target: T,
    pub id: String,
    pub label: String,
    pub default_value: f32,
    pub min: f32,
    pub max: f32,
    pub bipolar: bool,
}

impl<T> ControlDescriptor<T> {
    pub fn new(target: T, id: impl Into<String>, label: impl Into<String>) -> Self {
        Self {
            target,
            id: id.into(),
            label: label.into(),
            default_value: 0.0,
            min: 0.0,
            max: 1.0,
            bipolar: false,
        }
    }

    pub fn with_range(mut self, min: f32, max: f32, default_value: f32) -> Self {
        self.min = min;
        self.max = max;
        self.default_value = default_value.clamp(min.min(max), min.max(max));
        self
    }

    pub fn bipolar(mut self, bipolar: bool) -> Self {
        self.bipolar = bipolar;
        self
    }

    pub fn normalize(&self, value: f32) -> f32 {
        if (self.max - self.min).abs() <= f32::EPSILON {
            return 0.0;
        }

        ((value - self.min) / (self.max - self.min)).clamp(0.0, 1.0)
    }

    pub fn denormalize(&self, normalized_value: f32) -> f32 {
        self.min + (self.max - self.min) * normalized_value.clamp(0.0, 1.0)
    }
}

/// A host/UI control update addressed to a synth-defined target.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ControlEvent<T> {
    pub target: T,
    pub normalized_value: f32,
}

impl<T> ControlEvent<T> {
    pub fn new(target: T, normalized_value: f32) -> Self {
        Self {
            target,
            normalized_value: normalized_value.clamp(0.0, 1.0),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn descriptor_converts_normalized_values() {
        let descriptor =
            ControlDescriptor::new((), "cutoff", "Cutoff").with_range(20.0, 20_000.0, 1_000.0);

        assert_eq!(descriptor.denormalize(1.0), 20_000.0);
        assert!((descriptor.normalize(10_010.0) - 0.5).abs() < 0.0001);
    }
}
