use arrayvec::ArrayVec;
use serde::Serialize;

#[cfg(feature = "specta-bindings")]
use specta::Type;

use crate::params::{
    SEQUENCER_STEP_COUNT, SequencerDirection, SequencerHoldMode, SequencerMode, SequencerParams,
};

const MAX_SOURCE_NOTES: usize = 16;

#[derive(Debug, Clone, Copy, Default)]
struct SourceNote {
    note: u8,
    velocity: f32,
    order: u64,
}

#[derive(Debug, Clone, Copy, Default)]
pub struct SequencerAction {
    pub note_off: Option<u8>,
    pub note_on: Option<(u8, f32)>,
}

#[derive(Debug, Clone, Copy, Default, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct SequencerRuntimeState {
    pub playing: bool,
    pub current_step: u8,
    pub source_note_count: u8,
    pub latched: bool,
}

pub struct SequencerPlayer {
    source_notes: ArrayVec<SourceNote, MAX_SOURCE_NOTES>,
    next_order: u64,
    active_note: Option<u8>,
    step_cursor: usize,
    current_step: usize,
    sample_position: f64,
    next_step_sample: f64,
    note_off_sample: f64,
    initialized: bool,
    manual_playing: bool,
    host_playing: bool,
    host_transport_seen: bool,
    last_host_position_beats: f64,
    random_state: u32,
    latched: bool,
}

impl Default for SequencerPlayer {
    fn default() -> Self {
        Self {
            source_notes: ArrayVec::new(),
            next_order: 0,
            active_note: None,
            step_cursor: 0,
            current_step: 0,
            sample_position: 0.0,
            next_step_sample: 0.0,
            note_off_sample: 0.0,
            initialized: false,
            manual_playing: false,
            host_playing: false,
            host_transport_seen: false,
            last_host_position_beats: 0.0,
            random_state: 0x6d2b79f5,
            latched: false,
        }
    }
}

impl SequencerPlayer {
    pub fn note_on(&mut self, params: &SequencerParams, note: u8, velocity: f32) {
        let velocity = velocity.clamp(0.0, 1.0);
        if self.source_notes.iter().any(|source| source.note == note) {
            return;
        }
        if self.source_notes.len() >= MAX_SOURCE_NOTES {
            return;
        }
        self.source_notes.push(SourceNote {
            note,
            velocity,
            order: self.next_order,
        });
        self.next_order = self.next_order.wrapping_add(1);
        if params.hold_mode == SequencerHoldMode::Latch {
            self.latched = true;
        }
        self.manual_playing = true;
    }

    pub fn note_off(&mut self, params: &SequencerParams, note: u8) {
        if params.hold_mode == SequencerHoldMode::Latch && self.latched {
            return;
        }
        self.source_notes.retain(|source| source.note != note);
        if self.source_notes.is_empty() {
            self.manual_playing = false;
        }
    }

    pub fn clear_latch(&mut self) {
        self.source_notes.clear();
        self.latched = false;
        self.manual_playing = false;
    }

    pub fn reset(&mut self) {
        self.active_note = None;
        self.step_cursor = 0;
        self.current_step = 0;
        self.sample_position = 0.0;
        self.next_step_sample = 0.0;
        self.note_off_sample = 0.0;
        self.initialized = false;
        self.host_playing = false;
        self.host_transport_seen = false;
        self.last_host_position_beats = 0.0;
        self.random_state = 0x6d2b79f5;
    }

    pub fn panic(&mut self) {
        self.clear_latch();
        self.reset();
    }

    pub fn sync_host_transport(
        &mut self,
        params: &SequencerParams,
        playing: bool,
        position_beats: f64,
    ) {
        let position_jump = self.host_transport_seen
            && (position_beats - self.last_host_position_beats).abs() > 2.0;
        if playing && (!self.host_playing || (params.reset_on_transport && position_jump)) {
            self.step_cursor = 0;
            self.current_step = 0;
            self.sample_position = 0.0;
            self.next_step_sample = 0.0;
            self.initialized = false;
        }
        self.host_playing = playing;
        self.host_transport_seen = true;
        self.last_host_position_beats = position_beats;
    }

    pub fn runtime_state(&self, host_available: bool) -> SequencerRuntimeState {
        SequencerRuntimeState {
            playing: if host_available {
                self.host_playing
            } else {
                self.manual_playing
            },
            current_step: self.current_step as u8,
            source_note_count: self.source_notes.len() as u8,
            latched: self.latched,
        }
    }

    pub fn advance(
        &mut self,
        params: &SequencerParams,
        sample_rate: f32,
        tempo_bpm: f32,
        host_available: bool,
    ) -> SequencerAction {
        let playing = if host_available {
            self.host_playing
        } else {
            self.manual_playing
        };
        let mut action = SequencerAction::default();

        if !params.enabled || !playing || self.source_notes.is_empty() {
            if let Some(note) = self.active_note.take() {
                action.note_off = Some(note);
            }
            self.initialized = false;
            self.sample_position += 1.0;
            return action;
        }

        let tempo_bpm = tempo_bpm.max(1.0);
        let step_samples = f64::from(params.rate.beats_per_cycle()) * 60.0 / f64::from(tempo_bpm)
            * f64::from(sample_rate);
        if !self.initialized {
            self.initialized = true;
            self.next_step_sample = self.sample_position;
        }

        if self.active_note.is_some() && self.sample_position >= self.note_off_sample {
            action.note_off = self.active_note.take();
        }

        if self.sample_position < self.next_step_sample {
            self.sample_position += 1.0;
            return action;
        }

        if let Some(note) = self.active_note.take() {
            action.note_off = Some(note);
        }

        let swing_step = self.step_cursor;
        let (step_index, note, velocity, gate, probability) = self.next_note(params);
        self.current_step = step_index;
        if self.next_random_float() <= probability
            && let Some(note) = note
        {
            let note = note.clamp(0, 127) as u8;
            let velocity = velocity.clamp(0.0, 1.0);
            action.note_on = Some((note, velocity));
            self.active_note = Some(note);
            self.note_off_sample = self.sample_position
                + (step_samples
                    * f64::from(params.gate.clamp(0.01, 1.0))
                    * f64::from(gate.clamp(0.01, 1.0)));
        }

        let swing = if swing_step.is_multiple_of(2) {
            1.0 + f64::from(params.swing.clamp(0.0, 0.5))
        } else {
            1.0 - f64::from(params.swing.clamp(0.0, 0.5))
        };
        self.next_step_sample = self.sample_position + (step_samples * swing).max(1.0);
        self.sample_position += 1.0;
        action
    }

    fn next_note(&mut self, params: &SequencerParams) -> (usize, Option<i16>, f32, f32, f32) {
        match params.mode {
            SequencerMode::Arpeggiator => self.next_arpeggio(params),
            SequencerMode::Step => self.next_step(params),
        }
    }

    fn next_arpeggio(&mut self, params: &SequencerParams) -> (usize, Option<i16>, f32, f32, f32) {
        let mut indices = [0usize; MAX_SOURCE_NOTES];
        let count = self.source_notes.len();
        for (index, item) in indices.iter_mut().enumerate().take(count) {
            *item = index;
        }
        indices[..count].sort_unstable_by_key(|index| self.source_notes[*index].note);
        if params.direction == SequencerDirection::AsPlayed {
            indices[..count].sort_unstable_by_key(|index| self.source_notes[*index].order);
        }

        let octave_count = usize::from(params.octave_range.clamp(1, 4));
        let total = count.saturating_mul(octave_count).max(1);
        let repeat = usize::from(params.repeat.clamp(1, 4));
        let position = self.direction_index(params.direction, self.step_cursor / repeat, total);
        let source_index = position % count;
        let octave = position / count;
        let source = self.source_notes[indices[source_index]];
        (
            position,
            Some(i16::from(source.note) + (octave as i16 * 12)),
            source.velocity,
            1.0,
            1.0,
        )
    }

    fn next_step(&mut self, params: &SequencerParams) -> (usize, Option<i16>, f32, f32, f32) {
        let length = usize::from(params.pattern_length.clamp(1, SEQUENCER_STEP_COUNT as u8));
        let position = self.direction_index(params.direction, self.step_cursor, length);
        let step = params.steps[position];
        let root = self
            .source_notes
            .iter()
            .map(|source| source.note)
            .min()
            .unwrap_or(60);
        (
            position,
            step.enabled
                .then_some(i16::from(root) + i16::from(step.pitch)),
            self.source_notes
                .first()
                .map(|source| source.velocity)
                .unwrap_or(1.0)
                * step.velocity,
            step.gate,
            step.probability.clamp(0.0, 1.0),
        )
    }

    fn direction_index(
        &mut self,
        direction: SequencerDirection,
        position: usize,
        length: usize,
    ) -> usize {
        if length <= 1 {
            self.step_cursor = self.step_cursor.wrapping_add(1);
            return 0;
        }
        let index = match direction {
            SequencerDirection::Down | SequencerDirection::Reverse => {
                length - 1 - (position % length)
            }
            SequencerDirection::UpDown | SequencerDirection::PingPong => {
                let cycle = position % (length * 2 - 2);
                if cycle < length {
                    cycle
                } else {
                    length * 2 - 2 - cycle
                }
            }
            SequencerDirection::Random => self.next_random_usize(length),
            SequencerDirection::Up | SequencerDirection::AsPlayed | SequencerDirection::Forward => {
                position % length
            }
        };
        self.step_cursor = self.step_cursor.wrapping_add(1);
        index
    }

    fn next_random_usize(&mut self, length: usize) -> usize {
        (self.next_random_u32() as usize) % length.max(1)
    }

    fn next_random_float(&mut self) -> f32 {
        self.next_random_u32() as f32 / u32::MAX as f32
    }

    fn next_random_u32(&mut self) -> u32 {
        let mut value = self.random_state;
        value ^= value << 13;
        value ^= value >> 17;
        value ^= value << 5;
        self.random_state = value;
        value
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_params() -> SequencerParams {
        SequencerParams {
            enabled: true,
            rate: crate::params::LfoSyncDivision::Quarter,
            ..SequencerParams::default()
        }
    }

    #[test]
    fn arpeggiator_orders_held_notes_and_advances_after_one_step() {
        let params = test_params();
        let mut player = SequencerPlayer::default();
        player.note_on(&params, 64, 0.8);
        player.note_on(&params, 60, 0.6);

        let first = player.advance(&params, 10.0, 60.0, false);
        assert_eq!(first.note_on, Some((60, 0.6)));

        for _ in 0..9 {
            assert!(player.advance(&params, 10.0, 60.0, false).note_on.is_none());
        }
        let second = player.advance(&params, 10.0, 60.0, false);
        assert_eq!(second.note_on, Some((64, 0.8)));
    }

    #[test]
    fn step_mode_uses_lowest_held_note_as_root() {
        let mut params = test_params();
        params.mode = SequencerMode::Step;
        params.pattern_length = 3;
        params.steps[0].pitch = 0;
        params.steps[1].pitch = 4;
        params.steps[2].pitch = 7;
        let mut player = SequencerPlayer::default();
        player.note_on(&params, 67, 1.0);
        player.note_on(&params, 60, 1.0);

        assert_eq!(
            player.advance(&params, 10.0, 60.0, false).note_on,
            Some((60, 1.0))
        );
        let mut second = None;
        for _ in 0..10 {
            let action = player.advance(&params, 10.0, 60.0, false);
            if action.note_on.is_some() {
                second = action.note_on;
            }
        }
        assert_eq!(second, Some((64, 1.0)));
    }

    #[test]
    fn latch_ignores_source_note_off_until_cleared() {
        let mut params = test_params();
        params.hold_mode = SequencerHoldMode::Latch;
        let mut player = SequencerPlayer::default();
        player.note_on(&params, 60, 1.0);
        player.note_on(&params, 64, 1.0);
        player.note_off(&params, 60);
        assert_eq!(player.runtime_state(false).source_note_count, 2);
        assert!(player.runtime_state(false).latched);
        player.clear_latch();
        assert_eq!(player.runtime_state(false).source_note_count, 0);
    }
}
