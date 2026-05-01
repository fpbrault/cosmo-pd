use crate::voice::{VoiceId, VoiceRuntime, VoiceStatus};

/// Chooses a voice when no idle voice is available.
pub trait VoiceStealingPolicy {
    fn choose_voice(&self, voices: &[VoiceRuntime]) -> Option<VoiceId>;
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
}

fn oldest_matching(voices: &[VoiceRuntime], status: VoiceStatus) -> Option<VoiceId> {
    voices
        .iter()
        .enumerate()
        .filter(|(_, voice)| voice.status == status)
        .min_by_key(|(_, voice)| voice.started_at)
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
}
