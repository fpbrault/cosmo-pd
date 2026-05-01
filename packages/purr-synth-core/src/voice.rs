use crate::event::NoteId;

/// Stable index for a voice in an allocator-managed pool.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct VoiceId(pub usize);

/// Generic voice lifecycle state independent of synth-specific DSP.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum VoiceStatus {
    Idle,
    Active,
    Releasing,
    Sustained,
}

impl Default for VoiceStatus {
    fn default() -> Self {
        Self::Idle
    }
}

/// Runtime metadata used by voice allocators and note handlers.
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct VoiceRuntime {
    pub note: Option<NoteId>,
    pub status: VoiceStatus,
    pub started_at: u64,
    pub released_at: u64,
}

impl VoiceRuntime {
    pub fn note_on(&mut self, note: NoteId, sample_clock: u64) {
        self.note = Some(note);
        self.status = VoiceStatus::Active;
        self.started_at = sample_clock;
        self.released_at = 0;
    }

    pub fn note_off(&mut self, sample_clock: u64) {
        if self.note.is_none() {
            return;
        }

        self.status = VoiceStatus::Releasing;
        self.released_at = sample_clock;
    }

    pub fn hold_with_sustain(&mut self) {
        if self.status == VoiceStatus::Active {
            self.status = VoiceStatus::Sustained;
        }
    }

    pub fn release_sustain(&mut self, sample_clock: u64) {
        if self.status == VoiceStatus::Sustained {
            self.status = VoiceStatus::Releasing;
            self.released_at = sample_clock;
        }
    }

    pub fn clear(&mut self) {
        *self = Self::default();
    }

    pub fn is_available(&self) -> bool {
        self.note.is_none() || self.status == VoiceStatus::Idle
    }

    pub fn is_active(&self) -> bool {
        matches!(
            self.status,
            VoiceStatus::Active | VoiceStatus::Releasing | VoiceStatus::Sustained
        )
    }
}
