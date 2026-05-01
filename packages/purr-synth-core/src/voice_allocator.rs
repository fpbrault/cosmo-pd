use crate::voice::{VoiceId, VoiceRuntime, VoiceStatus};

/// Chooses a voice when no idle voice is available.
pub trait VoiceStealingPolicy {
    fn choose_voice(&self, voices: &[VoiceRuntime]) -> Option<VoiceId>;
}

/// Extended stealing policy that also receives per-voice DSP state.
/// Allows custom stealers (e.g. quietest-amplitude) to inspect DSP fields.
/// Implement this trait to override `choose_voice_with_dsp`; the default
/// delegates to `choose_voice` and ignores DSP state.
pub trait VoiceStealingPolicyExt<V>: VoiceStealingPolicy {
    fn choose_voice_with_dsp(&self, runtimes: &[VoiceRuntime], _dsps: &[V]) -> Option<VoiceId> {
        self.choose_voice(runtimes)
    }
}

/// Default policy: prefer idle, then oldest releasing, then oldest active voice.
#[derive(Debug, Default, Clone, Copy)]
pub struct DefaultVoiceStealer;

impl VoiceStealingPolicy for DefaultVoiceStealer {
    fn choose_voice(&self, voices: &[VoiceRuntime]) -> Option<VoiceId> {
        oldest_matching(voices, VoiceStatus::Idle)
            .or_else(|| oldest_matching(voices, VoiceStatus::Releasing))
            .or_else(|| oldest_started(voices))
    }
}

/// `DefaultVoiceStealer` ignores DSP state — delegates to the runtime-only path.
impl<V> VoiceStealingPolicyExt<V> for DefaultVoiceStealer {}

/// Reusable voice allocator over caller-owned voice runtime metadata.
#[derive(Debug, Clone, Copy)]
pub struct VoiceAllocator<P = DefaultVoiceStealer> {
    policy: P,
}

impl Default for VoiceAllocator<DefaultVoiceStealer> {
    fn default() -> Self {
        Self::new(DefaultVoiceStealer)
    }
}

impl<P: VoiceStealingPolicy> VoiceAllocator<P> {
    pub fn new(policy: P) -> Self {
        Self { policy }
    }

    pub fn allocate(&self, voices: &[VoiceRuntime]) -> Option<VoiceId> {
        voices
            .iter()
            .position(VoiceRuntime::is_available)
            .map(VoiceId)
            .or_else(|| self.policy.choose_voice(voices))
    }

    /// Like `allocate`, but also passes DSP state to the stealer.
    /// Uses `VoiceStealingPolicyExt::choose_voice_with_dsp` as the fallback.
    pub fn allocate_with_dsp<V>(&self, voices: &[VoiceRuntime], dsps: &[V]) -> Option<VoiceId>
    where
        P: VoiceStealingPolicyExt<V>,
    {
        voices
            .iter()
            .position(VoiceRuntime::is_available)
            .map(VoiceId)
            .or_else(|| self.policy.choose_voice_with_dsp(voices, dsps))
    }
}

/// Steals the most-recently-started (last-in, first-out) voice.
#[derive(Debug, Default, Clone, Copy)]
pub struct LastVoiceStealer;

impl VoiceStealingPolicy for LastVoiceStealer {
    fn choose_voice(&self, voices: &[VoiceRuntime]) -> Option<VoiceId> {
        newest_matching(voices, VoiceStatus::Idle)
            .or_else(|| newest_matching(voices, VoiceStatus::Releasing))
            .or_else(|| newest_started(voices))
    }
}

impl<V> VoiceStealingPolicyExt<V> for LastVoiceStealer {}

/// Steals the voice playing the highest MIDI note number.
#[derive(Debug, Default, Clone, Copy)]
pub struct HighestVoiceStealer;

impl VoiceStealingPolicy for HighestVoiceStealer {
    fn choose_voice(&self, voices: &[VoiceRuntime]) -> Option<VoiceId> {
        highest_note_matching(voices, VoiceStatus::Releasing)
            .or_else(|| highest_note_matching(voices, VoiceStatus::Active))
            .or_else(|| highest_note_matching(voices, VoiceStatus::Sustained))
    }
}

impl<V> VoiceStealingPolicyExt<V> for HighestVoiceStealer {}

/// Steals the voice playing the lowest MIDI note number.
#[derive(Debug, Default, Clone, Copy)]
pub struct LowestVoiceStealer;

impl VoiceStealingPolicy for LowestVoiceStealer {
    fn choose_voice(&self, voices: &[VoiceRuntime]) -> Option<VoiceId> {
        lowest_note_matching(voices, VoiceStatus::Releasing)
            .or_else(|| lowest_note_matching(voices, VoiceStatus::Active))
            .or_else(|| lowest_note_matching(voices, VoiceStatus::Sustained))
    }
}

impl<V> VoiceStealingPolicyExt<V> for LowestVoiceStealer {}

fn oldest_matching(voices: &[VoiceRuntime], status: VoiceStatus) -> Option<VoiceId> {
    voices
        .iter()
        .enumerate()
        .filter(|(_, voice)| voice.status == status)
        .min_by_key(|(_, voice)| voice.started_at)
        .map(|(index, _)| VoiceId(index))
}

fn newest_matching(voices: &[VoiceRuntime], status: VoiceStatus) -> Option<VoiceId> {
    voices
        .iter()
        .enumerate()
        .filter(|(_, voice)| voice.status == status)
        .max_by_key(|(_, voice)| voice.started_at)
        .map(|(index, _)| VoiceId(index))
}

fn newest_started(voices: &[VoiceRuntime]) -> Option<VoiceId> {
    voices
        .iter()
        .enumerate()
        .max_by_key(|(_, voice)| voice.started_at)
        .map(|(index, _)| VoiceId(index))
}

fn highest_note_matching(voices: &[VoiceRuntime], status: VoiceStatus) -> Option<VoiceId> {
    voices
        .iter()
        .enumerate()
        .filter(|(_, voice)| voice.status == status && voice.note.is_some())
        .max_by_key(|(_, voice)| voice.note.map(|n| n.midi_note).unwrap_or(0))
        .map(|(index, _)| VoiceId(index))
}

fn lowest_note_matching(voices: &[VoiceRuntime], status: VoiceStatus) -> Option<VoiceId> {
    voices
        .iter()
        .enumerate()
        .filter(|(_, voice)| voice.status == status && voice.note.is_some())
        .min_by_key(|(_, voice)| voice.note.map(|n| n.midi_note).unwrap_or(u8::MAX))
        .map(|(index, _)| VoiceId(index))
}

fn oldest_started(voices: &[VoiceRuntime]) -> Option<VoiceId> {
    voices
        .iter()
        .enumerate()
        .min_by_key(|(_, voice)| voice.started_at)
        .map(|(index, _)| VoiceId(index))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::event::NoteId;

    #[test]
    fn allocates_first_available_voice() {
        let allocator = VoiceAllocator::default();
        let mut voices = [VoiceRuntime::default(); 3];
        voices[0].note_on(NoteId::new(60, 1.0), 10);

        assert_eq!(allocator.allocate(&voices), Some(VoiceId(1)));
    }

    #[test]
    fn steals_oldest_releasing_voice_before_active_voice() {
        let allocator = VoiceAllocator::default();
        let mut voices = [VoiceRuntime::default(); 3];
        voices[0].note_on(NoteId::new(60, 1.0), 10);
        voices[1].note_on(NoteId::new(62, 1.0), 20);
        voices[2].note_on(NoteId::new(64, 1.0), 30);
        voices[1].note_off(40);

        assert_eq!(allocator.allocate(&voices), Some(VoiceId(1)));
    }

    #[test]
    fn highest_voice_stealer_prefers_highest_releasing_note() {
        let allocator = VoiceAllocator::new(HighestVoiceStealer);
        let mut voices = [VoiceRuntime::default(); 3];
        voices[0].note_on(NoteId::new(48, 1.0), 10);
        voices[1].note_on(NoteId::new(72, 1.0), 20);
        voices[2].note_on(NoteId::new(60, 1.0), 30);
        voices[0].note_off(40);
        voices[1].note_off(41);

        assert_eq!(allocator.allocate(&voices), Some(VoiceId(1)));
    }

    #[test]
    fn lowest_voice_stealer_prefers_lowest_releasing_note() {
        let allocator = VoiceAllocator::new(LowestVoiceStealer);
        let mut voices = [VoiceRuntime::default(); 3];
        voices[0].note_on(NoteId::new(48, 1.0), 10);
        voices[1].note_on(NoteId::new(72, 1.0), 20);
        voices[2].note_on(NoteId::new(60, 1.0), 30);
        voices[0].note_off(40);
        voices[1].note_off(41);

        assert_eq!(allocator.allocate(&voices), Some(VoiceId(0)));
    }

    #[test]
    fn last_voice_stealer_prefers_newest_voice() {
        let allocator = VoiceAllocator::new(LastVoiceStealer);
        let mut voices = [VoiceRuntime::default(); 3];
        voices[0].note_on(NoteId::new(60, 1.0), 10);
        voices[1].note_on(NoteId::new(62, 1.0), 20);
        voices[2].note_on(NoteId::new(64, 1.0), 30);

        assert_eq!(allocator.allocate(&voices), Some(VoiceId(2)));
    }
}
