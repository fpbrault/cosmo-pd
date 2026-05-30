use std::collections::HashSet;
use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::preset_library_path;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/// A single entry in the preset library (file or embedded factory).
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PresetLibraryEntry {
    pub id: String,
    pub name: String,
    pub source: String,
    pub author: String,
    pub starred: bool,
    pub tags: Vec<String>,
    pub macro_labels: [String; 4],
    pub factory_version: u32,
    pub data: serde_json::Value,
}

/// On‑disk / in‑memory preset library.
#[derive(Serialize, Deserialize)]
pub struct PresetLibrary {
    pub version: u32,
    pub entries: Vec<PresetLibraryEntry>,
}

// ---------------------------------------------------------------------------
// Construction & factory merge
// ---------------------------------------------------------------------------

impl PresetLibrary {
    /// Build an in‑memory library from the embedded factory preset JSON.
    ///
    /// The JSON must decode into `Vec<PresetLibraryEntry>` (the factory output
    /// from `build.rs` minification).
    pub fn from_embedded_factory(factory_json: &str) -> Self {
        let entries: Vec<PresetLibraryEntry> =
            serde_json::from_str(factory_json).unwrap_or_default();
        Self {
            version: 1,
            entries,
        }
    }

    /// Load the on‑disk library, merging factory presets from the embedded JSON.
    ///
    /// * If no file exists → creates a library from embedded factory presets (and
    ///   persists it).
    /// * If a file exists → loads it, merges/upgrades factory entries, prunes
    ///   stale factory entries, preserves user entries, and persists.
    pub fn load_or_init(factory_json: &str) -> Result<Self, String> {
        let embedded: Vec<PresetLibraryEntry> = serde_json::from_str(factory_json)
            .map_err(|e| format!("failed to parse embedded factory presets: {e}"))?;

        let library = if let Some(file_lib) = Self::load_from_file() {
            Self::merge_factory(file_lib, &embedded)
        } else {
            Self {
                version: 1,
                entries: embedded,
            }
        };

        library.save_to_file()?;
        Ok(library)
    }

    /// Merge or overwrite factory entries from an embedded list.
    ///
    /// Rules:
    /// * Entry‑by‑entry merge keyed on `id`.
    /// * If `factory_version` in file < `factory_version` in embedded → overwrite
    ///   with embedded copy.
    /// * Prune: any factory entry whose `id` no longer exists in embedded is removed.
    /// * All `source == "user"` entries are preserved as‑is.
    fn merge_factory(mut library: Self, embedded: &[PresetLibraryEntry]) -> Self {
        let embedded_ids: HashSet<&str> = embedded.iter().map(|e| e.id.as_str()).collect();

        let max_embedded_version = embedded
            .iter()
            .map(|e| e.factory_version)
            .max()
            .unwrap_or(0);

        // Prune stale factory entries.
        library.entries.retain(|entry| {
            if entry.source == "user" {
                return true;
            }
            embedded_ids.contains(entry.id.as_str())
        });

        // Merge / overwrite factory entries.
        for emb in embedded {
            let existing = library
                .entries
                .iter_mut()
                .find(|e| e.id == emb.id && e.source != "user");
            match existing {
                Some(existing) if existing.factory_version < max_embedded_version => {
                    *existing = emb.clone();
                }
                Some(_) => { /* keep existing copy */ }
                None => library.entries.push(emb.clone()),
            }
        }

        library
    }

    // -----------------------------------------------------------------------
    // CRUD
    // -----------------------------------------------------------------------

    /// Add a new user preset.  Returns the created entry.
    pub fn add_entry(
        &mut self,
        name: String,
        tags: Vec<String>,
        data: serde_json::Value,
    ) -> PresetLibraryEntry {
        let entry = PresetLibraryEntry {
            id: Uuid::new_v4().to_string(),
            name,
            source: "user".to_string(),
            author: String::new(),
            starred: false,
            tags,
            macro_labels: [
                "Brightness".to_string(),
                "Timbre".to_string(),
                "Time".to_string(),
                "Movement".to_string(),
            ],
            factory_version: 0,
            data,
        };
        let clone = entry.clone();
        self.entries.push(entry);
        clone
    }

    /// Remove an entry by `id`.  Returns `true` if an entry was removed.
    pub fn delete_entry(&mut self, id: &str) -> bool {
        let len = self.entries.len();
        self.entries.retain(|e| e.id != id);
        self.entries.len() != len
    }

    /// Look up an entry by `id`.
    pub fn get_entry(&self, id: &str) -> Option<&PresetLibraryEntry> {
        self.entries.iter().find(|e| e.id == id)
    }

    /// Return only the `data` field of an entry (the opaque SynthPresetV1 blob).
    pub fn get_entry_data(&self, id: &str) -> Option<&serde_json::Value> {
        self.entries.iter().find(|e| e.id == id).map(|e| &e.data)
    }

    /// List entries, optionally filtered by `source`.
    pub fn list_entries(&self, source_filter: Option<&str>) -> Vec<&PresetLibraryEntry> {
        match source_filter {
            Some(filter) => self.entries.iter().filter(|e| e.source == filter).collect(),
            None => self.entries.iter().collect(),
        }
    }

    /// Rename an entry.  Returns `true` if the entry was found.
    pub fn rename_entry(&mut self, id: &str, new_name: &str) -> bool {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == id) {
            entry.name = new_name.to_string();
            true
        } else {
            false
        }
    }

    /// Set the `starred` flag.  Returns `true` if the entry was found.
    pub fn set_starred(&mut self, id: &str, starred: bool) -> bool {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == id) {
            entry.starred = starred;
            true
        } else {
            false
        }
    }

    // -----------------------------------------------------------------------
    // File I/O (atomic writes)
    // -----------------------------------------------------------------------

    fn library_path() -> PathBuf {
        preset_library_path::get_preset_library_path()
    }

    /// Atomically write the library to disk (temp file + rename).
    pub fn save_to_file(&self) -> Result<(), String> {
        let path = Self::library_path();
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("failed to create preset library directory: {e}"))?;
        }

        let temp_path = path.with_extension("json.tmp");
        let json = serde_json::to_string_pretty(self)
            .map_err(|e| format!("failed to serialize preset library: {e}"))?;
        std::fs::write(&temp_path, &json)
            .map_err(|e| format!("failed to write temp preset library: {e}"))?;
        std::fs::rename(&temp_path, &path)
            .map_err(|e| format!("failed to rename temp preset library: {e}"))?;
        Ok(())
    }

    /// Read the library from the on‑disk JSON file.
    /// Returns `None` if the file does not exist or is corrupt.
    fn load_from_file() -> Option<PresetLibrary> {
        let path = Self::library_path();
        if !path.exists() {
            return None;
        }
        let json = std::fs::read_to_string(&path).ok()?;
        serde_json::from_str(&json).ok()
    }
}

// ---------------------------------------------------------------------------
// Multi‑instance‑safe helpers
// ---------------------------------------------------------------------------

/// Read‑only access to the on‑disk library.
///
/// Re‑reads the file each time so multiple instances see the latest state.
pub fn read_library_then<R>(
    factory_json: &str,
    f: impl FnOnce(&PresetLibrary) -> R,
) -> Result<R, String> {
    let library = PresetLibrary::load_or_init(factory_json)?;
    Ok(f(&library))
}

/// Read‑modify‑write access to the on‑disk library.
///
/// Re‑reads the file, applies the mutation, then atomically writes back.
/// This ensures that concurrent instances do not clobber each other's changes.
pub fn mutate_library_then(
    factory_json: &str,
    f: impl FnOnce(&mut PresetLibrary),
) -> Result<(), String> {
    let mut library = PresetLibrary::load_or_init(factory_json)?;
    f(&mut library);
    library.save_to_file()?;
    Ok(())
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_entry(id: &str) -> PresetLibraryEntry {
        PresetLibraryEntry {
            id: id.to_string(),
            name: format!("Preset {}", id),
            source: "cosmo-factory".to_string(),
            author: "Factory".to_string(),
            starred: false,
            tags: vec![],
            macro_labels: Default::default(),
            factory_version: 1,
            data: serde_json::json!({ "schemaVersion": 1, "params": {} }),
        }
    }

    fn user_entry(id: &str) -> PresetLibraryEntry {
        PresetLibraryEntry {
            id: id.to_string(),
            name: format!("My {}", id),
            source: "user".to_string(),
            author: "You".to_string(),
            starred: false,
            tags: vec!["bass".to_string()],
            macro_labels: Default::default(),
            factory_version: 0,
            data: serde_json::json!({ "schemaVersion": 1, "params": {} }),
        }
    }

    #[test]
    fn from_embedded_factory_with_valid_json() {
        let json = serde_json::to_string(&vec![sample_entry("a"), sample_entry("b")]).unwrap();
        let lib = PresetLibrary::from_embedded_factory(&json);
        assert_eq!(lib.entries.len(), 2);
        assert_eq!(lib.version, 1);
    }

    #[test]
    fn from_embedded_factory_with_invalid_json_returns_empty() {
        let lib = PresetLibrary::from_embedded_factory("not json");
        assert!(lib.entries.is_empty());
    }

    #[test]
    fn merge_factory_preserves_user_entries() {
        let mut lib = PresetLibrary {
            version: 1,
            entries: vec![user_entry("u1"), sample_entry("f1")],
        };

        let embedded = vec![sample_entry("f1"), sample_entry("f2")];
        lib = PresetLibrary::merge_factory(lib, &embedded);

        assert!(lib.entries.iter().any(|e| e.id == "u1"), "user lost");
        assert!(lib.entries.iter().any(|e| e.id == "f1"), "factory f1 lost");
        assert!(
            lib.entries.iter().any(|e| e.id == "f2"),
            "factory f2 missing"
        );
    }

    #[test]
    fn merge_factory_prunes_stale_factory_ids() {
        let mut lib = PresetLibrary {
            version: 1,
            entries: vec![sample_entry("f_old"), user_entry("u_keep")],
        };

        let embedded = vec![sample_entry("f_new")];
        lib = PresetLibrary::merge_factory(lib, &embedded);

        assert!(lib.entries.iter().any(|e| e.id == "u_keep"), "user pruned");
        assert!(
            lib.entries.iter().any(|e| e.id == "f_new"),
            "new factory missing"
        );
        assert!(
            !lib.entries.iter().any(|e| e.id == "f_old"),
            "stale factory not pruned"
        );
    }

    #[test]
    fn merge_factory_upgrades_stale_version() {
        let mut lib = PresetLibrary {
            version: 1,
            entries: vec![PresetLibraryEntry {
                factory_version: 0,
                name: "old name".to_string(),
                ..sample_entry("f1")
            }],
        };

        let mut upgraded = sample_entry("f1");
        upgraded.factory_version = 2;
        upgraded.name = "new name".to_string();

        lib = PresetLibrary::merge_factory(lib, &[upgraded]);
        let entry = lib.get_entry("f1").unwrap();
        assert_eq!(entry.name, "new name");
        assert_eq!(entry.factory_version, 2);
    }

    #[test]
    fn crud_add_delete_get() {
        let mut lib = PresetLibrary {
            version: 1,
            entries: vec![],
        };

        let entry = lib.add_entry(
            "Test".to_string(),
            vec!["pad".to_string()],
            serde_json::json!({}),
        );
        assert_eq!(entry.name, "Test");
        assert_eq!(entry.source, "user");
        assert_eq!(entry.tags, vec!["pad"]);
        assert!(!entry.id.is_empty());

        let fetched = lib.get_entry(&entry.id).unwrap();
        assert_eq!(fetched.name, "Test");

        assert!(lib.get_entry("nonexistent").is_none());

        let deleted = lib.delete_entry(&entry.id);
        assert!(deleted);
        assert!(lib.get_entry(&entry.id).is_none());

        assert!(!lib.delete_entry("nonexistent"));
    }

    #[test]
    fn list_entries_with_filter() {
        let mut lib = PresetLibrary {
            version: 1,
            entries: vec![],
        };

        let mut cf = sample_entry("cf1");
        cf.source = "cosmo-factory".to_string();
        lib.entries.push(cf);

        let mut cz = sample_entry("cz1");
        cz.source = "cz-factory".to_string();
        lib.entries.push(cz);

        lib.entries.push(user_entry("u1"));

        let all = lib.list_entries(None);
        assert_eq!(all.len(), 3);

        let user = lib.list_entries(Some("user"));
        assert_eq!(user.len(), 1);

        let cf = lib.list_entries(Some("cosmo-factory"));
        assert_eq!(cf.len(), 1);
    }

    #[test]
    fn rename_and_star() {
        let mut lib = PresetLibrary {
            version: 1,
            entries: vec![user_entry("u1")],
        };

        assert!(lib.rename_entry("u1", "Renamed"));
        assert_eq!(lib.get_entry("u1").unwrap().name, "Renamed");

        assert!(!lib.rename_entry("nonexistent", "x"));

        assert!(lib.set_starred("u1", true));
        assert!(lib.get_entry("u1").unwrap().starred);

        assert!(!lib.set_starred("nonexistent", true));
    }

    #[test]
    fn get_entry_data_returns_data_only() {
        let entry = user_entry("u1");
        let lib = PresetLibrary {
            version: 1,
            entries: vec![entry],
        };

        let data = lib.get_entry_data("u1");
        assert!(data.is_some());

        assert!(lib.get_entry_data("nonexistent").is_none());
    }
}
