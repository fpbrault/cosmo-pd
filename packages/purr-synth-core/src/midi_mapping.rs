extern crate alloc;

use alloc::vec::Vec;

/// A normalized control update for a synth-defined target.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ControlChange<T> {
    pub target: T,
    pub normalized_value: f32,
    pub value: f32,
}

/// Incoming MIDI controller-like messages that can be mapped to controls.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum MidiControlEvent {
    ControlChange {
        channel: u8,
        controller: u8,
        value: u8,
    },
    PitchBend {
        channel: u8,
        value: f32,
    },
    ChannelPressure {
        channel: u8,
        value: u8,
    },
    PolyPressure {
        channel: u8,
        note: u8,
        value: u8,
    },
}

impl MidiControlEvent {
    pub fn normalized_value(&self) -> f32 {
        match *self {
            Self::ControlChange { value, .. }
            | Self::ChannelPressure { value, .. }
            | Self::PolyPressure { value, .. } => u7_to_unit(value),
            Self::PitchBend { value, .. } => ((value.clamp(-1.0, 1.0) + 1.0) * 0.5).clamp(0.0, 1.0),
        }
    }
}

/// A MIDI source selector. `None` means any channel or note for that field.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MidiControlSource {
    ControlChange {
        channel: Option<u8>,
        controller: u8,
    },
    PitchBend {
        channel: Option<u8>,
    },
    ChannelPressure {
        channel: Option<u8>,
    },
    PolyPressure {
        channel: Option<u8>,
        note: Option<u8>,
    },
}

impl MidiControlSource {
    pub fn from_event(event: MidiControlEvent) -> Self {
        match event {
            MidiControlEvent::ControlChange {
                channel,
                controller,
                ..
            } => Self::ControlChange {
                channel: Some(channel),
                controller,
            },
            MidiControlEvent::PitchBend { channel, .. } => Self::PitchBend {
                channel: Some(channel),
            },
            MidiControlEvent::ChannelPressure { channel, .. } => Self::ChannelPressure {
                channel: Some(channel),
            },
            MidiControlEvent::PolyPressure { channel, note, .. } => Self::PolyPressure {
                channel: Some(channel),
                note: Some(note),
            },
        }
    }

    pub fn matches_event(&self, event: MidiControlEvent) -> bool {
        match (*self, event) {
            (
                Self::ControlChange {
                    channel,
                    controller,
                },
                MidiControlEvent::ControlChange {
                    channel: event_channel,
                    controller: event_controller,
                    ..
                },
            ) => controller == event_controller && option_matches(channel, event_channel),
            (
                Self::PitchBend { channel },
                MidiControlEvent::PitchBend {
                    channel: event_channel,
                    ..
                },
            ) => option_matches(channel, event_channel),
            (
                Self::ChannelPressure { channel },
                MidiControlEvent::ChannelPressure {
                    channel: event_channel,
                    ..
                },
            ) => option_matches(channel, event_channel),
            (
                Self::PolyPressure { channel, note },
                MidiControlEvent::PolyPressure {
                    channel: event_channel,
                    note: event_note,
                    ..
                },
            ) => option_matches(channel, event_channel) && option_matches(note, event_note),
            _ => false,
        }
    }
}

/// Curve applied to normalized MIDI values before range scaling.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum MidiMappingCurve {
    Linear,
    Inverted,
    Exponential { exponent: f32 },
    Bipolar,
}

impl Default for MidiMappingCurve {
    fn default() -> Self {
        Self::Linear
    }
}

impl MidiMappingCurve {
    pub fn apply(self, value: f32) -> f32 {
        let value = value.clamp(0.0, 1.0);

        match self {
            Self::Linear => value,
            Self::Inverted => 1.0 - value,
            Self::Exponential { exponent } => libm::powf(value, exponent.max(0.001)),
            Self::Bipolar => value * 2.0 - 1.0,
        }
    }
}

/// A dynamic MIDI binding from an incoming controller source to a synth target.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct MidiMapping<T> {
    pub source: MidiControlSource,
    pub target: T,
    pub min: f32,
    pub max: f32,
    pub curve: MidiMappingCurve,
    pub enabled: bool,
}

impl<T> MidiMapping<T> {
    pub fn new(source: MidiControlSource, target: T) -> Self {
        Self {
            source,
            target,
            min: 0.0,
            max: 1.0,
            curve: MidiMappingCurve::Linear,
            enabled: true,
        }
    }

    pub fn with_range(mut self, min: f32, max: f32) -> Self {
        self.min = min;
        self.max = max;
        self
    }

    pub fn with_curve(mut self, curve: MidiMappingCurve) -> Self {
        self.curve = curve;
        self
    }
}

impl<T: Copy> MidiMapping<T> {
    pub fn evaluate(&self, event: MidiControlEvent) -> Option<ControlChange<T>> {
        if !self.enabled || !self.source.matches_event(event) {
            return None;
        }

        let normalized_value = self.curve.apply(event.normalized_value());
        let value = self.min + (self.max - self.min) * normalized_value;

        Some(ControlChange {
            target: self.target,
            normalized_value,
            value,
        })
    }
}

/// A learn request waiting for the next MIDI control input.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct MidiLearnState<T> {
    pub target: T,
    pub min: f32,
    pub max: f32,
    pub curve: MidiMappingCurve,
}

impl<T> MidiLearnState<T> {
    pub fn new(target: T) -> Self {
        Self {
            target,
            min: 0.0,
            max: 1.0,
            curve: MidiMappingCurve::Linear,
        }
    }

    pub fn with_range(mut self, min: f32, max: f32) -> Self {
        self.min = min;
        self.max = max;
        self
    }

    pub fn with_curve(mut self, curve: MidiMappingCurve) -> Self {
        self.curve = curve;
        self
    }
}

/// Runtime-editable MIDI mapping storage.
#[derive(Debug, Clone, PartialEq)]
pub struct MidiMappingTable<T> {
    mappings: Vec<MidiMapping<T>>,
    learn_state: Option<MidiLearnState<T>>,
}

impl<T> Default for MidiMappingTable<T> {
    fn default() -> Self {
        Self {
            mappings: Vec::new(),
            learn_state: None,
        }
    }
}

impl<T: Copy + Eq> MidiMappingTable<T> {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn mappings(&self) -> &[MidiMapping<T>] {
        &self.mappings
    }

    pub fn mapping_for_target(&self, target: T) -> Option<&MidiMapping<T>> {
        self.mappings
            .iter()
            .find(|mapping| mapping.target == target)
    }

    pub fn learn_state(&self) -> Option<MidiLearnState<T>> {
        self.learn_state
    }

    pub fn set_mapping(&mut self, mapping: MidiMapping<T>) {
        if let Some(existing) = self
            .mappings
            .iter_mut()
            .find(|existing| existing.source == mapping.source && existing.target == mapping.target)
        {
            *existing = mapping;
            return;
        }

        self.mappings.push(mapping);
    }

    pub fn remove_mapping(&mut self, source: MidiControlSource, target: T) -> bool {
        let before_len = self.mappings.len();
        self.mappings
            .retain(|mapping| !(mapping.source == source && mapping.target == target));
        self.mappings.len() != before_len
    }

    pub fn clear_target(&mut self, target: T) {
        self.mappings.retain(|mapping| mapping.target != target);
    }

    pub fn clear(&mut self) {
        self.mappings.clear();
        self.learn_state = None;
    }

    pub fn begin_learn(&mut self, learn_state: MidiLearnState<T>) {
        self.learn_state = Some(learn_state);
    }

    pub fn cancel_learn(&mut self) {
        self.learn_state = None;
    }

    pub fn learn_from_event(&mut self, event: MidiControlEvent) -> Option<MidiMapping<T>> {
        let learn_state = self.learn_state.take()?;
        let mapping = MidiMapping {
            source: MidiControlSource::from_event(event),
            target: learn_state.target,
            min: learn_state.min,
            max: learn_state.max,
            curve: learn_state.curve,
            enabled: true,
        };
        self.set_mapping(mapping);
        Some(mapping)
    }

    pub fn evaluate(&self, event: MidiControlEvent) -> Vec<ControlChange<T>> {
        self.mappings
            .iter()
            .filter_map(|mapping| mapping.evaluate(event))
            .collect()
    }
}

fn u7_to_unit(value: u8) -> f32 {
    value.min(127) as f32 / 127.0
}

fn option_matches<T: Eq>(expected: Option<T>, actual: T) -> bool {
    expected.map_or(true, |expected| expected == actual)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    enum Target {
        Cutoff,
        Resonance,
    }

    #[test]
    fn maps_cc_to_target_value() {
        let mapping = MidiMapping::new(
            MidiControlSource::ControlChange {
                channel: Some(0),
                controller: 74,
            },
            Target::Cutoff,
        )
        .with_range(20.0, 20_000.0);

        let change = mapping
            .evaluate(MidiControlEvent::ControlChange {
                channel: 0,
                controller: 74,
                value: 127,
            })
            .expect("mapping should match event");

        assert_eq!(change.target, Target::Cutoff);
        assert_eq!(change.normalized_value, 1.0);
        assert_eq!(change.value, 20_000.0);
    }

    #[test]
    fn ignores_channel_mismatch() {
        let mapping = MidiMapping::new(
            MidiControlSource::ControlChange {
                channel: Some(1),
                controller: 74,
            },
            Target::Cutoff,
        );

        assert_eq!(
            mapping.evaluate(MidiControlEvent::ControlChange {
                channel: 0,
                controller: 74,
                value: 127,
            }),
            None
        );
    }

    #[test]
    fn learns_mapping_from_next_event() {
        let mut table = MidiMappingTable::new();
        table.begin_learn(
            MidiLearnState::new(Target::Resonance)
                .with_range(0.0, 10.0)
                .with_curve(MidiMappingCurve::Inverted),
        );

        let mapping = table
            .learn_from_event(MidiControlEvent::ControlChange {
                channel: 2,
                controller: 71,
                value: 64,
            })
            .expect("learn state should create mapping");

        assert_eq!(
            mapping.source,
            MidiControlSource::ControlChange {
                channel: Some(2),
                controller: 71,
            }
        );
        assert!(table.learn_state().is_none());
        assert_eq!(table.mappings().len(), 1);
    }

    #[test]
    fn wildcard_channel_mapping_matches_any_channel() {
        let mut table = MidiMappingTable::new();
        table.set_mapping(MidiMapping::new(
            MidiControlSource::ChannelPressure { channel: None },
            Target::Cutoff,
        ));

        let changes = table.evaluate(MidiControlEvent::ChannelPressure {
            channel: 15,
            value: 127,
        });

        assert_eq!(changes.len(), 1);
        assert_eq!(changes[0].target, Target::Cutoff);
    }
}
