use std::sync::{Arc, Mutex};

use crate::preset_library::PresetLibrary;
use crate::runtime_state::SharedPresetSession;

#[derive(Clone)]
pub struct PresetService {
    pub library: Arc<Mutex<PresetLibrary>>,
    pub session: SharedPresetSession,
}

impl PresetService {
    pub fn new(library: Arc<Mutex<PresetLibrary>>, session: SharedPresetSession) -> Self {
        Self { library, session }
    }

    pub fn startup_entry(&self) -> Option<crate::preset_library::PresetLibraryEntry> {
        self.library
            .lock()
            .ok()
            .and_then(|library| library.find_startup_preset().ok().flatten())
    }
}
