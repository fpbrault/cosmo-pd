extern crate alloc;

use alloc::vec::Vec;

/// A modulation source lookup implemented by synth-specific runtime snapshots.
pub trait ModSourceValues<S> {
    fn value_for(&self, source: S) -> f32;
}

/// A synth-defined modulation route.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ModRoute<S, T> {
    pub source: S,
    pub target: T,
    pub amount: f32,
    pub enabled: bool,
}

impl<S, T> ModRoute<S, T> {
    pub fn new(source: S, target: T, amount: f32) -> Self {
        Self {
            source,
            target,
            amount,
            enabled: true,
        }
    }
}

/// Reusable route storage and evaluation for synth-defined vocabularies.
#[derive(Debug, Clone, PartialEq)]
pub struct ModMatrix<S, T> {
    routes: Vec<ModRoute<S, T>>,
}

impl<S, T> Default for ModMatrix<S, T> {
    fn default() -> Self {
        Self { routes: Vec::new() }
    }
}

impl<S: Copy, T: Copy + Eq> ModMatrix<S, T> {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn routes(&self) -> &[ModRoute<S, T>] {
        &self.routes
    }

    pub fn clear(&mut self) {
        self.routes.clear();
    }

    pub fn push(&mut self, route: ModRoute<S, T>) {
        self.routes.push(route);
    }

    pub fn value_for<V: ModSourceValues<S>>(&self, target: T, source_values: &V) -> f32 {
        let mut total = 0.0_f32;

        for route in &self.routes {
            if route.enabled && route.target == target {
                total += route.amount * source_values.value_for(route.source);
            }
        }

        total.clamp(-1.0, 1.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    enum Source {
        Lfo,
        Velocity,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    enum Target {
        Cutoff,
        Pitch,
    }

    struct Values;

    impl ModSourceValues<Source> for Values {
        fn value_for(&self, source: Source) -> f32 {
            match source {
                Source::Lfo => 0.75,
                Source::Velocity => 0.5,
            }
        }
    }

    #[test]
    fn sums_enabled_routes_for_target() {
        let mut matrix = ModMatrix::new();
        matrix.push(ModRoute::new(Source::Lfo, Target::Cutoff, 0.5));
        matrix.push(ModRoute::new(Source::Velocity, Target::Cutoff, 0.5));
        matrix.push(ModRoute::new(Source::Lfo, Target::Pitch, 1.0));

        let value = matrix.value_for(Target::Cutoff, &Values);

        assert!((value - 0.625).abs() < 0.0001);
    }

    #[test]
    fn clamps_route_sum() {
        let mut matrix = ModMatrix::new();
        matrix.push(ModRoute::new(Source::Lfo, Target::Cutoff, 2.0));
        matrix.push(ModRoute::new(Source::Velocity, Target::Cutoff, 2.0));

        assert_eq!(matrix.value_for(Target::Cutoff, &Values), 1.0);
    }
}
