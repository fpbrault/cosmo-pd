use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::{Connection, OptionalExtension, params};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub use cosmo_pd101_bridge_types::{
    FxModulePresetEntry, PresetBankBundle, PresetBankEntry, PresetBankMetadata, PresetLibraryEntry,
};

use crate::SynthParams;
use crate::preset_library_path;

const DEFAULT_SORT_INDEX: u32 = u32::MAX;
const LIBRARY_SCHEMA_VERSION: u32 = 7;

#[derive(Clone, Debug, PartialEq)]
pub struct PresetLibraryRecord {
    pub entry: PresetLibraryEntry,
    pub favorite: bool,
}

#[derive(Serialize, Deserialize, Clone)]
struct LegacyPresetLibrary {
    version: u32,
    entries: Vec<PresetLibraryEntry>,
}

#[derive(Clone, Debug)]
enum StorageLocation {
    Path(PathBuf),
    Memory,
}

#[derive(Clone, Debug)]
pub struct PresetLibrary {
    storage: StorageLocation,
    factory_entries: Vec<PresetLibraryEntry>,
    initialization_error: Option<String>,
}

impl PresetLibrary {
    pub fn from_embedded_factory(factory_json: &str) -> Self {
        let mut library = Self {
            storage: StorageLocation::Memory,
            factory_entries: parse_factory_entries(factory_json).unwrap_or_default(),
            initialization_error: None,
        };
        if let Err(error) = library.initialize() {
            library.initialization_error = Some(error);
        }
        library
    }

    pub fn load_or_init(factory_json: &str) -> Result<Self, String> {
        let factory_entries = parse_factory_entries(factory_json)?;
        let storage = StorageLocation::Path(Self::library_path());
        let library = Self {
            storage,
            factory_entries,
            initialization_error: None,
        };
        library.initialize()?;
        Ok(library)
    }

    pub fn degraded(factory_json: &str, error: String) -> Self {
        Self {
            storage: StorageLocation::Path(Self::library_path()),
            factory_entries: parse_factory_entries(factory_json).unwrap_or_default(),
            initialization_error: Some(error),
        }
    }

    pub fn initialization_error(&self) -> Option<&str> {
        self.initialization_error.as_deref()
    }

    pub fn retry(&mut self) -> Result<(), String> {
        let previous_error = self.initialization_error.take();
        match self.initialize().and_then(|()| self.validate()) {
            Ok(()) => Ok(()),
            Err(error) => {
                self.initialization_error = previous_error.or_else(|| Some(error.clone()));
                Err(error)
            }
        }
    }

    pub fn repair(&mut self) -> Result<PathBuf, String> {
        let backup_path = self.backup_path()?;
        self.retry()?;
        Ok(backup_path)
    }

    pub fn rebuild(&mut self) -> Result<PathBuf, String> {
        let StorageLocation::Path(path) = &self.storage else {
            return Err("preset library rebuild is unavailable for in-memory storage".to_string());
        };
        let backup_path = self.backup_path()?;
        let rebuilt_path = path.with_extension("sqlite3.rebuilding");
        remove_sqlite_files(&rebuilt_path)?;

        let rebuilt = Self {
            storage: StorageLocation::Path(rebuilt_path.clone()),
            factory_entries: self.factory_entries.clone(),
            initialization_error: None,
        };
        rebuilt.initialize()?;
        salvage_recoverable_data(&backup_path, &rebuilt)?;
        rebuilt.validate()?;

        remove_sqlite_sidecars(path)?;
        std::fs::rename(&rebuilt_path, path)
            .map_err(|error| format!("failed to install rebuilt preset library: {error}"))?;
        self.initialization_error = None;
        Ok(backup_path)
    }

    pub fn add_entry(
        &mut self,
        name: String,
        description: String,
        tags: Vec<String>,
        macro_labels: [String; 4],
        data: serde_json::Value,
    ) -> Result<PresetLibraryEntry, String> {
        let entry = PresetLibraryEntry {
            id: Uuid::new_v4().to_string(),
            name,
            source: "user".to_string(),
            author: String::new(),
            description,
            starred: false,
            sort_index: DEFAULT_SORT_INDEX,
            bank_id: None,
            bank_name: None,
            tags,
            macro_labels,
            factory_version: 0,
            data,
        };
        self.with_connection_mut(|conn| upsert_entry(conn, &entry))?;
        Ok(entry)
    }

    pub fn save_entry(&mut self, entry: PresetLibraryEntry) -> Result<PresetLibraryEntry, String> {
        self.with_connection_mut(|conn| upsert_entry(conn, &entry))?;
        Ok(entry)
    }

    pub fn import_bank(&mut self, bundle: PresetBankBundle) -> Result<(), String> {
        self.with_connection_mut(|conn| import_bank_entries(conn, bundle))
    }

    pub fn delete_entry(&mut self, id: &str) -> Result<bool, String> {
        self.with_connection_mut(|conn| {
            let deleted = conn
                .execute("DELETE FROM presets WHERE id = ?1", [id])
                .map_err(db_err)?;
            conn.execute("DELETE FROM preset_favorites WHERE preset_id = ?1", [id])
                .map_err(db_err)?;
            Ok(deleted > 0)
        })
    }

    pub fn get_entry(&self, id: &str) -> Result<Option<PresetLibraryEntry>, String> {
        if self.initialization_error.is_some() {
            return Ok(self
                .factory_entries
                .iter()
                .find(|entry| entry.id == id)
                .cloned());
        }
        self.with_connection(|conn| load_entry(conn, id))
    }

    pub fn get_entry_data(&self, id: &str) -> Result<Option<serde_json::Value>, String> {
        self.get_entry(id).map(|entry| entry.map(|e| e.data))
    }

    pub fn list_entries(
        &self,
        source_filter: Option<&str>,
    ) -> Result<Vec<PresetLibraryEntry>, String> {
        if self.initialization_error.is_some() {
            return Ok(self
                .factory_entries
                .iter()
                .filter(|entry| source_filter.is_none_or(|source| entry.source == source))
                .cloned()
                .collect());
        }
        self.with_connection(|conn| list_entries(conn, source_filter))
    }

    pub fn list_records(
        &self,
        source_filter: Option<&str>,
    ) -> Result<Vec<PresetLibraryRecord>, String> {
        if self.initialization_error.is_some() {
            return Ok(self
                .factory_entries
                .iter()
                .filter(|entry| source_filter.is_none_or(|source| entry.source == source))
                .cloned()
                .map(|entry| PresetLibraryRecord {
                    entry,
                    favorite: false,
                })
                .collect());
        }
        self.with_connection(|conn| list_records(conn, source_filter))
    }

    pub fn find_startup_preset(&self) -> Result<Option<PresetLibraryEntry>, String> {
        if self.initialization_error.is_some() {
            return Ok(self
                .factory_entries
                .iter()
                .filter(|entry| entry.starred)
                .min_by_key(|entry| (entry.sort_index, entry.name.clone(), entry.id.clone()))
                .cloned());
        }
        self.with_connection(find_startup_starred_entry)
    }

    pub fn rename_entry(&mut self, id: &str, new_name: &str) -> Result<bool, String> {
        self.with_connection_mut(|conn| {
            conn.execute(
                "UPDATE presets SET name = ?2 WHERE id = ?1",
                params![id, new_name],
            )
            .map(|changed| changed > 0)
            .map_err(db_err)
        })
    }

    pub fn set_starred(&mut self, id: &str, starred: bool) -> Result<bool, String> {
        self.with_connection_mut(|conn| {
            let changed = if starred {
                conn.execute(
                    "INSERT INTO preset_favorites (preset_id) VALUES (?1)
                     ON CONFLICT(preset_id) DO NOTHING",
                    [id],
                )
            } else {
                conn.execute("DELETE FROM preset_favorites WHERE preset_id = ?1", [id])
            }
            .map_err(db_err)?;
            Ok(changed > 0)
        })
    }

    pub fn list_fx_module_presets(
        &self,
        module_type: &str,
    ) -> Result<Vec<FxModulePresetEntry>, String> {
        self.with_connection(|conn| list_fx_module_presets(conn, module_type))
    }

    pub fn save_fx_module_preset(
        &mut self,
        name: String,
        module_type: String,
        patch: serde_json::Value,
    ) -> Result<FxModulePresetEntry, String> {
        self.with_connection_mut(|conn| save_fx_module_preset(conn, name, module_type, patch))
    }

    pub fn delete_fx_module_preset(&mut self, id: &str) -> Result<bool, String> {
        self.with_connection_mut(|conn| {
            conn.execute("DELETE FROM fx_module_presets WHERE id = ?1", [id])
                .map(|changed| changed > 0)
                .map_err(db_err)
        })
    }

    fn initialize(&self) -> Result<(), String> {
        self.with_connection_mut(|conn| {
            let previous_schema_version = read_schema_version(conn)?;
            create_base_schema(conn)?;
            migrate_legacy_json_if_needed(conn, &self.storage)?;
            if previous_schema_version < 2 {
                migrate_starred_state_to_favorites(conn)?;
            }
            if previous_schema_version < 3 {
                migrate_sort_index_column(conn)?;
            }
            if previous_schema_version < 4 {
                migrate_fx_module_presets_timestamp_column(conn)?;
            }
            if previous_schema_version < 5 {
                migrate_bank_columns(conn)?;
            }
            if previous_schema_version < 6 {
                migrate_description_column(conn)?;
            }
            if previous_schema_version < 7 {
                migrate_blank_user_preset_authors(conn)?;
            }
            create_schema_indexes(conn)?;
            merge_factory_entries(conn, &self.factory_entries)?;
            write_schema_version(conn)?;
            Ok(())
        })
    }

    fn validate(&self) -> Result<(), String> {
        self.with_connection(|conn| {
            let integrity: String = conn
                .query_row("PRAGMA integrity_check", [], |row| row.get(0))
                .map_err(db_err)?;
            if integrity != "ok" {
                return Err(format!(
                    "preset library database integrity check failed: {integrity}"
                ));
            }
            for table in ["meta", "presets", "preset_favorites", "fx_module_presets"] {
                if !has_table(conn, table)? {
                    return Err(format!(
                        "preset library database is missing required table: {table}"
                    ));
                }
            }
            if read_schema_version(conn)? != LIBRARY_SCHEMA_VERSION {
                return Err("preset library database schema version is invalid".to_string());
            }
            Ok(())
        })
    }

    fn backup_path(&self) -> Result<PathBuf, String> {
        let StorageLocation::Path(path) = &self.storage else {
            return Err("preset library backup is unavailable for in-memory storage".to_string());
        };
        if !path.exists() {
            return Err("preset library database does not exist".to_string());
        }
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|error| format!("failed to create preset library backup timestamp: {error}"))?
            .as_secs();
        let backup_path = path.with_file_name(format!("preset_library.backup-{timestamp}.sqlite3"));
        remove_sqlite_files(&backup_path)?;
        std::fs::copy(path, &backup_path)
            .map_err(|error| format!("failed to copy preset library backup: {error}"))?;
        Ok(backup_path)
    }

    fn library_path() -> PathBuf {
        preset_library_path::get_preset_library_path()
    }

    fn open_connection(&self) -> Result<Connection, String> {
        let conn = match &self.storage {
            StorageLocation::Path(path) => {
                if let Some(parent) = path.parent() {
                    std::fs::create_dir_all(parent).map_err(|error| {
                        format!("failed to create preset library directory: {error}")
                    })?;
                }
                Connection::open(path).map_err(db_err)?
            }
            StorageLocation::Memory => Connection::open_in_memory().map_err(db_err)?,
        };

        conn.pragma_update(None, "journal_mode", "WAL")
            .map_err(db_err)?;
        conn.pragma_update(None, "synchronous", "FULL")
            .map_err(db_err)?;
        conn.busy_timeout(std::time::Duration::from_secs(5))
            .map_err(db_err)?;
        Ok(conn)
    }

    fn with_connection<T>(
        &self,
        f: impl FnOnce(&Connection) -> Result<T, String>,
    ) -> Result<T, String> {
        let conn = self.open_connection()?;
        f(&conn)
    }

    fn with_connection_mut<T>(
        &self,
        f: impl FnOnce(&Connection) -> Result<T, String>,
    ) -> Result<T, String> {
        if let Some(error) = &self.initialization_error {
            return Err(format!(
                "preset library is in factory-only mode; repair the database before making changes: {error}"
            ));
        }
        let mut conn = self.open_connection()?;
        let tx = conn.transaction().map_err(db_err)?;
        let result = f(&tx)?;
        tx.commit().map_err(db_err)?;
        Ok(result)
    }
}

pub fn read_library_then<R>(
    factory_json: &str,
    f: impl FnOnce(&PresetLibrary) -> R,
) -> Result<R, String> {
    let library = PresetLibrary::load_or_init(factory_json)?;
    Ok(f(&library))
}

pub fn mutate_library_then(
    factory_json: &str,
    f: impl FnOnce(&mut PresetLibrary),
) -> Result<(), String> {
    let mut library = PresetLibrary::load_or_init(factory_json)?;
    f(&mut library);
    Ok(())
}

fn parse_factory_entries(factory_json: &str) -> Result<Vec<PresetLibraryEntry>, String> {
    let entries: Vec<PresetLibraryEntry> = serde_json::from_str(factory_json)
        .map_err(|error| format!("failed to parse embedded factory presets: {error}"))?;
    Ok(entries
        .into_iter()
        .map(with_default_bank_metadata)
        .collect())
}

fn db_err(error: rusqlite::Error) -> String {
    format!("preset library database error: {error}")
}

fn create_base_schema(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS meta (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS presets (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            source TEXT NOT NULL,
            author TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            starred INTEGER NOT NULL DEFAULT 0,
            sort_index INTEGER NOT NULL DEFAULT 4294967295,
            bank_id TEXT,
            bank_name TEXT,
            tags_json TEXT NOT NULL,
            macro_labels_json TEXT NOT NULL,
            factory_version INTEGER NOT NULL DEFAULT 0,
            data_json TEXT NOT NULL,
            revision INTEGER NOT NULL DEFAULT 0,
            updated_at_unix_ms INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS preset_favorites (
            preset_id TEXT PRIMARY KEY NOT NULL
        );

        CREATE TABLE IF NOT EXISTS fx_module_presets (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            module_type TEXT NOT NULL,
            patch_json TEXT NOT NULL,
            updated_at_unix_ms INTEGER NOT NULL
        );

        ",
    )
    .map_err(db_err)?;
    Ok(())
}

fn create_schema_indexes(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        "
        CREATE INDEX IF NOT EXISTS idx_presets_source ON presets(source);
        CREATE INDEX IF NOT EXISTS idx_presets_bank_id ON presets(bank_id);
        CREATE INDEX IF NOT EXISTS idx_fx_module_presets_module_type ON fx_module_presets(module_type);
        ",
    )
    .map_err(db_err)
}

fn write_schema_version(conn: &Connection) -> Result<(), String> {
    conn.execute(
        "INSERT INTO meta(key, value) VALUES('schema_version', ?1)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        [LIBRARY_SCHEMA_VERSION.to_string()],
    )
    .map_err(db_err)?;
    Ok(())
}

fn has_table(conn: &Connection, table_name: &str) -> Result<bool, String> {
    conn.query_row(
        "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?1)",
        [table_name],
        |row| row.get(0),
    )
    .map_err(db_err)
}

fn remove_sqlite_sidecars(path: &Path) -> Result<(), String> {
    for suffix in ["-wal", "-shm"] {
        let sidecar = PathBuf::from(format!("{}{suffix}", path.display()));
        if sidecar.exists() {
            std::fs::remove_file(&sidecar).map_err(|error| {
                format!(
                    "failed to remove preset library sidecar {}: {error}",
                    sidecar.display()
                )
            })?;
        }
    }
    Ok(())
}

fn remove_sqlite_files(path: &Path) -> Result<(), String> {
    remove_sqlite_sidecars(path)?;
    if path.exists() {
        std::fs::remove_file(path).map_err(|error| {
            format!(
                "failed to remove temporary preset library {}: {error}",
                path.display()
            )
        })?;
    }
    Ok(())
}

fn salvage_recoverable_data(backup_path: &Path, rebuilt: &PresetLibrary) -> Result<(), String> {
    let salvage_path = backup_path.with_extension("sqlite3.salvage");
    remove_sqlite_files(&salvage_path)?;
    std::fs::copy(backup_path, &salvage_path)
        .map_err(|error| format!("failed to prepare preset library salvage copy: {error}"))?;

    let salvage = PresetLibrary {
        storage: StorageLocation::Path(salvage_path.clone()),
        factory_entries: rebuilt.factory_entries.clone(),
        initialization_error: None,
    };
    let result = salvage.initialize().and_then(|()| {
        let entries = salvage.list_entries(None)?;
        let favorites = salvage.with_connection(list_favorite_ids)?;
        let fx_presets = salvage.with_connection(list_all_fx_module_presets)?;

        rebuilt.with_connection_mut(|conn| {
            for entry in entries
                .into_iter()
                .filter(|entry| !matches!(entry.source.as_str(), "cosmo-factory" | "cz-factory"))
            {
                upsert_entry(conn, &entry)?;
            }
            for preset_id in favorites {
                upsert_favorite(conn, &preset_id)?;
            }
            for entry in fx_presets {
                upsert_fx_module_preset(conn, &entry)?;
            }
            conn.execute(
                "DELETE FROM preset_favorites
                 WHERE preset_id NOT IN (SELECT id FROM presets)",
                [],
            )
            .map_err(db_err)?;
            Ok(())
        })
    });

    let cleanup_result = remove_sqlite_files(&salvage_path);
    match (result, cleanup_result) {
        (Ok(()), Ok(())) => Ok(()),
        (Err(_), Ok(())) => Ok(()),
        (Ok(()), Err(error)) | (Err(_), Err(error)) => Err(error),
    }
}

fn migrate_legacy_json_if_needed(
    conn: &Connection,
    storage: &StorageLocation,
) -> Result<(), String> {
    let existing_count: i64 = conn
        .query_row("SELECT COUNT(*) FROM presets", [], |row| row.get(0))
        .map_err(db_err)?;
    if existing_count > 0 {
        return Ok(());
    }

    let StorageLocation::Path(_) = storage else {
        return Ok(());
    };

    let legacy_path = match storage {
        StorageLocation::Path(path) => path.with_file_name("preset_library.json"),
        StorageLocation::Memory => return Ok(()),
    };
    if !legacy_path.exists() {
        return Ok(());
    }

    let json = std::fs::read_to_string(&legacy_path)
        .map_err(|error| format!("failed to read legacy preset library: {error}"))?;
    let legacy: LegacyPresetLibrary = serde_json::from_str(&json)
        .map_err(|error| format!("failed to parse legacy preset library: {error}"))?;

    for entry in &legacy.entries {
        upsert_entry(conn, entry)?;
    }

    let migrated_path = legacy_path.with_extension("json.migrated");
    std::fs::rename(&legacy_path, &migrated_path).map_err(|error| {
        format!("failed to archive legacy preset library after migration: {error}")
    })?;
    Ok(())
}

fn read_schema_version(conn: &Connection) -> Result<u32, String> {
    let has_meta_table = conn
        .query_row(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'meta'",
            [],
            |_| Ok(()),
        )
        .optional()
        .map_err(db_err)?
        .is_some();

    if !has_meta_table {
        return Ok(0);
    }

    let version = conn
        .query_row(
            "SELECT value FROM meta WHERE key = 'schema_version'",
            [],
            |row| row.get::<_, String>(0),
        )
        .optional()
        .map_err(db_err)?
        .and_then(|value| value.parse::<u32>().ok())
        .unwrap_or(0);
    Ok(version)
}

fn migrate_starred_state_to_favorites(conn: &Connection) -> Result<(), String> {
    let mut statement = conn
        .prepare("SELECT id, source, starred FROM presets")
        .map_err(db_err)?;
    let rows = statement
        .query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, i64>(2)? != 0,
            ))
        })
        .map_err(db_err)?;

    for row in rows {
        let (id, source, starred) = row.map_err(db_err)?;
        if starred {
            upsert_favorite(conn, &id)?;
        }
        if source == "user" {
            conn.execute("UPDATE presets SET starred = 0 WHERE id = ?1", [id])
                .map_err(db_err)?;
        }
    }

    Ok(())
}

fn migrate_sort_index_column(conn: &Connection) -> Result<(), String> {
    let has_sort_index = has_preset_column(conn, "sort_index")?;

    if !has_sort_index {
        conn.execute(
            "ALTER TABLE presets ADD COLUMN sort_index INTEGER NOT NULL DEFAULT 4294967295",
            [],
        )
        .map_err(db_err)?;
    }

    Ok(())
}

fn migrate_bank_columns(conn: &Connection) -> Result<(), String> {
    if !has_preset_column(conn, "bank_id")? {
        conn.execute("ALTER TABLE presets ADD COLUMN bank_id TEXT", [])
            .map_err(db_err)?;
    }

    if !has_preset_column(conn, "bank_name")? {
        conn.execute("ALTER TABLE presets ADD COLUMN bank_name TEXT", [])
            .map_err(db_err)?;
    }

    Ok(())
}

fn migrate_description_column(conn: &Connection) -> Result<(), String> {
    if !has_preset_column(conn, "description")? {
        conn.execute(
            "ALTER TABLE presets ADD COLUMN description TEXT NOT NULL DEFAULT ''",
            [],
        )
        .map_err(db_err)?;
    }
    Ok(())
}

fn migrate_blank_user_preset_authors(conn: &Connection) -> Result<(), String> {
    conn.execute(
        "UPDATE presets SET author = 'User' WHERE source = 'user' AND TRIM(author) = ''",
        [],
    )
    .map_err(db_err)?;
    Ok(())
}

fn migrate_fx_module_presets_timestamp_column(conn: &Connection) -> Result<(), String> {
    let has_old_column: bool = conn
        .query_row(
            "SELECT COUNT(*) > 0 FROM pragma_table_info('fx_module_presets') WHERE name = 'created_at_unix_ms'",
            [],
            |row| row.get(0),
        )
        .map_err(db_err)?;

    if has_old_column {
        conn.execute_batch(
            "ALTER TABLE fx_module_presets RENAME COLUMN created_at_unix_ms TO updated_at_unix_ms;",
        )
        .map_err(db_err)?;
    }

    Ok(())
}

fn has_preset_column(conn: &Connection, column_name: &str) -> Result<bool, String> {
    Ok(conn
        .prepare("PRAGMA table_info(presets)")
        .map_err(db_err)?
        .query_map([], |row| row.get::<_, String>(1))
        .map_err(db_err)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(db_err)?
        .into_iter()
        .any(|column| column == column_name))
}

fn merge_factory_entries(
    conn: &Connection,
    factory_entries: &[PresetLibraryEntry],
) -> Result<(), String> {
    for entry in factory_entries {
        upsert_entry(conn, entry)?;
    }

    let current_ids = factory_entries
        .iter()
        .map(|entry| entry.id.as_str())
        .collect::<std::collections::HashSet<_>>();
    let existing_ids = conn
        .prepare("SELECT id FROM presets WHERE source IN ('cosmo-factory', 'cz-factory')")
        .map_err(db_err)?
        .query_map([], |row| row.get::<_, String>(0))
        .map_err(db_err)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(db_err)?;
    for id in existing_ids {
        if !current_ids.contains(id.as_str()) {
            conn.execute("DELETE FROM presets WHERE id = ?1", [id.as_str()])
                .map_err(db_err)?;
        }
    }

    conn.execute(
        "DELETE FROM preset_favorites
         WHERE preset_id NOT IN (SELECT id FROM presets)",
        [],
    )
    .map_err(db_err)?;

    Ok(())
}

fn with_default_bank_metadata(mut entry: PresetLibraryEntry) -> PresetLibraryEntry {
    if entry.bank_id.is_none() || entry.bank_name.is_none() {
        match entry.source.as_str() {
            "cosmo-factory" => {
                entry
                    .bank_id
                    .get_or_insert_with(|| "cosmo-factory".to_string());
                entry
                    .bank_name
                    .get_or_insert_with(|| "Cosmo Factory Library".to_string());
            }
            "cz-factory" => {
                entry
                    .bank_id
                    .get_or_insert_with(|| "cz-factory".to_string());
                entry
                    .bank_name
                    .get_or_insert_with(|| "Temple Of CZ".to_string());
            }
            _ => {}
        }
    }
    entry
}

fn load_entry(conn: &Connection, id: &str) -> Result<Option<PresetLibraryEntry>, String> {
    conn.query_row(
        "SELECT id, name, source, author, description, starred, sort_index, bank_id, bank_name, tags_json, macro_labels_json, factory_version, data_json
         FROM presets
         WHERE id = ?1",
        [id],
        map_entry_row,
    )
    .optional()
    .map_err(db_err)
}

fn list_entries(
    conn: &Connection,
    source_filter: Option<&str>,
) -> Result<Vec<PresetLibraryEntry>, String> {
    let sql = if source_filter.is_some() {
        "SELECT id, name, source, author, description, starred, sort_index, bank_id, bank_name, tags_json, macro_labels_json, factory_version, data_json
         FROM presets
         WHERE source = ?1
         ORDER BY
            CASE WHEN source = 'user' THEN 1 ELSE 0 END,
            CASE WHEN starred THEN 0 ELSE 1 END,
            CASE WHEN starred THEN sort_index ELSE 4294967295 END,
            name COLLATE NOCASE,
            id"
    } else {
        "SELECT id, name, source, author, description, starred, sort_index, bank_id, bank_name, tags_json, macro_labels_json, factory_version, data_json
         FROM presets
         ORDER BY
            CASE WHEN source = 'user' THEN 1 ELSE 0 END,
            CASE WHEN starred THEN 0 ELSE 1 END,
            CASE WHEN starred THEN sort_index ELSE 4294967295 END,
            name COLLATE NOCASE,
            id"
    };

    let mut statement = conn.prepare(sql).map_err(db_err)?;
    let rows = if let Some(source) = source_filter {
        statement
            .query_map([source], map_entry_row)
            .map_err(db_err)?
            .collect::<Result<Vec<_>, _>>()
            .map_err(db_err)?
    } else {
        statement
            .query_map([], map_entry_row)
            .map_err(db_err)?
            .collect::<Result<Vec<_>, _>>()
            .map_err(db_err)?
    };
    Ok(rows)
}

fn list_records(
    conn: &Connection,
    source_filter: Option<&str>,
) -> Result<Vec<PresetLibraryRecord>, String> {
    let favorites = list_favorite_ids(conn)?;
    let favorite_ids = favorites
        .into_iter()
        .collect::<std::collections::HashSet<_>>();
    let entries = list_entries(conn, source_filter)?;
    Ok(entries
        .into_iter()
        .map(|entry| PresetLibraryRecord {
            favorite: favorite_ids.contains(&entry.id),
            entry,
        })
        .collect())
}

fn find_startup_starred_entry(conn: &Connection) -> Result<Option<PresetLibraryEntry>, String> {
    conn.query_row(
        "SELECT p.id, p.name, p.source, p.author, p.description, p.starred, p.sort_index, p.bank_id, p.bank_name, p.tags_json,
                p.macro_labels_json, p.factory_version, p.data_json
         FROM presets p
         WHERE p.starred = 1
         ORDER BY
            p.sort_index,
            p.name COLLATE NOCASE,
            p.id
         LIMIT 1",
        [],
        map_entry_row,
    )
    .optional()
    .map_err(db_err)
}

fn upsert_entry(conn: &Connection, entry: &PresetLibraryEntry) -> Result<(), String> {
    let tags_json = serde_json::to_string(&entry.tags)
        .map_err(|error| format!("failed to serialize preset tags: {error}"))?;
    let macro_labels_json = serde_json::to_string(&entry.macro_labels)
        .map_err(|error| format!("failed to serialize preset macro labels: {error}"))?;
    let data_json = serde_json::to_string(&entry.data)
        .map_err(|error| format!("failed to serialize preset payload: {error}"))?;
    let updated_at_unix_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|duration| duration.as_millis() as i64)
        .unwrap_or_default();

    conn.execute(
        "INSERT INTO presets (
            id, name, source, author, description, starred, sort_index, bank_id, bank_name, tags_json,
            macro_labels_json, factory_version, data_json, revision,
            updated_at_unix_ms
         ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, 0, ?14)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            source = excluded.source,
            author = excluded.author,
            description = excluded.description,
            starred = excluded.starred,
            sort_index = excluded.sort_index,
            bank_id = excluded.bank_id,
            bank_name = excluded.bank_name,
            tags_json = excluded.tags_json,
            macro_labels_json = excluded.macro_labels_json,
            factory_version = excluded.factory_version,
            data_json = excluded.data_json,
            revision = presets.revision + 1,
            updated_at_unix_ms = excluded.updated_at_unix_ms",
        params![
            entry.id,
            entry.name,
            entry.source,
            entry.author,
            entry.description,
            if entry.starred { 1_i64 } else { 0_i64 },
            i64::from(entry.sort_index),
            entry.bank_id,
            entry.bank_name,
            tags_json,
            macro_labels_json,
            i64::from(entry.factory_version),
            data_json,
            updated_at_unix_ms,
        ],
    )
    .map_err(db_err)?;
    Ok(())
}

fn map_entry_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<PresetLibraryEntry> {
    let tags_json: String = row.get(9)?;
    let macro_labels_json: String = row.get(10)?;
    let data_json: String = row.get(12)?;

    let tags = serde_json::from_str(&tags_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(9, rusqlite::types::Type::Text, Box::new(error))
    })?;
    let macro_labels = serde_json::from_str(&macro_labels_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(10, rusqlite::types::Type::Text, Box::new(error))
    })?;
    let data = serde_json::from_str(&data_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(12, rusqlite::types::Type::Text, Box::new(error))
    })?;

    Ok(PresetLibraryEntry {
        id: row.get(0)?,
        name: row.get(1)?,
        source: row.get(2)?,
        author: row.get(3)?,
        description: row.get(4)?,
        starred: row.get::<_, i64>(5)? != 0,
        sort_index: row.get::<_, i64>(6)? as u32,
        bank_id: row.get(7)?,
        bank_name: row.get(8)?,
        tags,
        macro_labels,
        factory_version: row.get::<_, i64>(11)? as u32,
        data,
    })
}

fn list_favorite_ids(conn: &Connection) -> Result<Vec<String>, String> {
    let mut statement = conn
        .prepare("SELECT preset_id FROM preset_favorites ORDER BY preset_id")
        .map_err(db_err)?;
    let rows = statement
        .query_map([], |row| row.get::<_, String>(0))
        .map_err(db_err)?;
    rows.collect::<Result<Vec<_>, _>>().map_err(db_err)
}

fn upsert_favorite(conn: &Connection, id: &str) -> Result<(), String> {
    conn.execute(
        "INSERT INTO preset_favorites (preset_id) VALUES (?1)
         ON CONFLICT(preset_id) DO NOTHING",
        [id],
    )
    .map_err(db_err)?;
    Ok(())
}

fn import_bank_entries(conn: &Connection, bundle: PresetBankBundle) -> Result<(), String> {
    if bundle.r#type != "preset-bank" {
        return Err("unsupported preset bank bundle type".to_string());
    }
    if bundle.schema_version != 1 {
        return Err("unsupported preset bank bundle schema version".to_string());
    }

    let imported_ids = bundle
        .presets
        .iter()
        .map(|preset| preset.id.clone())
        .collect::<Vec<_>>();

    for preset in bundle.presets {
        let macro_labels = extract_macro_labels(&preset.data);
        upsert_entry(
            conn,
            &PresetLibraryEntry {
                id: preset.id,
                name: preset.name,
                source: bundle.bank.source.clone(),
                author: preset.author,
                description: preset.description,
                starred: preset.starred,
                sort_index: DEFAULT_SORT_INDEX,
                bank_id: Some(bundle.bank.id.clone()),
                bank_name: Some(bundle.bank.name.clone()),
                tags: preset.tags,
                macro_labels,
                factory_version: 0,
                data: preset.data,
            },
        )?;
    }

    let mut statement = conn
        .prepare("SELECT id FROM presets WHERE source = ?1 AND bank_id = ?2")
        .map_err(db_err)?;
    let existing_ids = statement
        .query_map(params![bundle.bank.source, bundle.bank.id], |row| {
            row.get::<_, String>(0)
        })
        .map_err(db_err)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(db_err)?;

    for existing_id in existing_ids {
        if imported_ids.contains(&existing_id) {
            continue;
        }
        conn.execute("DELETE FROM presets WHERE id = ?1", [existing_id.as_str()])
            .map_err(db_err)?;
    }

    conn.execute(
        "DELETE FROM preset_favorites
         WHERE preset_id NOT IN (SELECT id FROM presets)",
        [],
    )
    .map_err(db_err)?;

    Ok(())
}

fn extract_macro_labels(data: &serde_json::Value) -> [String; 4] {
    let fallback = SynthParams::default().macro_labels;
    let Some(params) = data.get("params").and_then(serde_json::Value::as_object) else {
        return fallback;
    };
    let Some(labels) = params
        .get("macroLabels")
        .and_then(serde_json::Value::as_array)
    else {
        return fallback;
    };
    let parsed = labels
        .iter()
        .take(4)
        .map(|label| label.as_str().map(str::to_string))
        .collect::<Option<Vec<_>>>();
    match parsed {
        Some(values) if values.len() == 4 => [
            values[0].clone(),
            values[1].clone(),
            values[2].clone(),
            values[3].clone(),
        ],
        _ => fallback,
    }
}

fn list_fx_module_presets(
    conn: &Connection,
    module_type: &str,
) -> Result<Vec<FxModulePresetEntry>, String> {
    let mut statement = conn
        .prepare(
            "SELECT id, name, module_type, patch_json, updated_at_unix_ms
             FROM fx_module_presets
             WHERE module_type = ?1
             ORDER BY updated_at_unix_ms, id",
        )
        .map_err(db_err)?;
    statement
        .query_map([module_type], |row| {
            let patch_json: String = row.get(3)?;
            let patch = serde_json::from_str(&patch_json).map_err(|error| {
                rusqlite::Error::FromSqlConversionFailure(
                    3,
                    rusqlite::types::Type::Text,
                    Box::new(error),
                )
            })?;
            Ok(FxModulePresetEntry {
                id: row.get(0)?,
                name: row.get(1)?,
                module_type: row.get(2)?,
                patch,
                updated_at_unix_ms: row.get(4)?,
            })
        })
        .map_err(db_err)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(db_err)
}

fn list_all_fx_module_presets(conn: &Connection) -> Result<Vec<FxModulePresetEntry>, String> {
    let mut statement = conn
        .prepare(
            "SELECT id, name, module_type, patch_json, updated_at_unix_ms
             FROM fx_module_presets
             ORDER BY updated_at_unix_ms, id",
        )
        .map_err(db_err)?;
    statement
        .query_map([], |row| {
            let patch_json: String = row.get(3)?;
            let patch = serde_json::from_str(&patch_json).map_err(|error| {
                rusqlite::Error::FromSqlConversionFailure(
                    3,
                    rusqlite::types::Type::Text,
                    Box::new(error),
                )
            })?;
            Ok(FxModulePresetEntry {
                id: row.get(0)?,
                name: row.get(1)?,
                module_type: row.get(2)?,
                patch,
                updated_at_unix_ms: row.get(4)?,
            })
        })
        .map_err(db_err)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(db_err)
}

fn upsert_fx_module_preset(conn: &Connection, entry: &FxModulePresetEntry) -> Result<(), String> {
    let patch_json = serde_json::to_string(&entry.patch)
        .map_err(|error| format!("failed to serialize FX module preset payload: {error}"))?;
    conn.execute(
        "INSERT INTO fx_module_presets (id, name, module_type, patch_json, updated_at_unix_ms)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            module_type = excluded.module_type,
            patch_json = excluded.patch_json,
            updated_at_unix_ms = excluded.updated_at_unix_ms",
        params![
            entry.id,
            entry.name,
            entry.module_type,
            patch_json,
            entry.updated_at_unix_ms,
        ],
    )
    .map_err(db_err)?;
    Ok(())
}

fn save_fx_module_preset(
    conn: &Connection,
    name: String,
    module_type: String,
    patch: serde_json::Value,
) -> Result<FxModulePresetEntry, String> {
    let entry = FxModulePresetEntry {
        id: Uuid::new_v4().to_string(),
        name,
        module_type,
        patch,
        updated_at_unix_ms: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|duration| duration.as_millis() as i64)
            .unwrap_or_default(),
    };
    let patch_json = serde_json::to_string(&entry.patch)
        .map_err(|error| format!("failed to serialize fx module preset payload: {error}"))?;
    conn.execute(
        "INSERT INTO fx_module_presets (id, name, module_type, patch_json, updated_at_unix_ms)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            entry.id,
            entry.name,
            entry.module_type,
            patch_json,
            entry.updated_at_unix_ms
        ],
    )
    .map_err(db_err)?;
    Ok(entry)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_entry(id: &str) -> PresetLibraryEntry {
        PresetLibraryEntry {
            id: id.to_string(),
            name: format!("Preset {id}"),
            source: "cosmo-factory".to_string(),
            author: "Factory".to_string(),
            description: "Factory description".to_string(),
            starred: false,
            sort_index: DEFAULT_SORT_INDEX,
            bank_id: Some("cosmo-factory".to_string()),
            bank_name: Some("Cosmo Factory Library".to_string()),
            tags: vec![],
            macro_labels: [
                "Brightness".to_string(),
                "Timbre".to_string(),
                "Time".to_string(),
                "Movement".to_string(),
            ],
            factory_version: 1,
            data: serde_json::json!({ "schemaVersion": 1, "params": { "volume": 0.5 } }),
        }
    }

    fn user_entry(id: &str) -> PresetLibraryEntry {
        PresetLibraryEntry {
            id: id.to_string(),
            name: format!("My {id}"),
            source: "user".to_string(),
            author: "You".to_string(),
            description: "User description".to_string(),
            starred: false,
            sort_index: DEFAULT_SORT_INDEX,
            bank_id: None,
            bank_name: None,
            tags: vec!["bass".to_string()],
            macro_labels: [
                "Brightness".to_string(),
                "Timbre".to_string(),
                "Time".to_string(),
                "Movement".to_string(),
            ],
            factory_version: 0,
            data: serde_json::json!({ "schemaVersion": 1, "params": { "volume": 0.8 } }),
        }
    }

    fn temp_db_path(label: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("cosmo-pd101-{label}-{}", Uuid::new_v4()));
        std::fs::create_dir_all(&dir).unwrap();
        dir.join("preset_library.sqlite3")
    }

    fn open_temp_library(entries: Vec<PresetLibraryEntry>) -> PresetLibrary {
        let library = PresetLibrary {
            storage: StorageLocation::Path(temp_db_path("tests")),
            factory_entries: entries,
            initialization_error: None,
        };
        library.initialize().unwrap();
        library
    }

    #[test]
    fn from_embedded_factory_with_valid_json() {
        let json = serde_json::to_string(&vec![sample_entry("a"), sample_entry("b")]).unwrap();
        let lib = PresetLibrary::from_embedded_factory(&json);
        assert_eq!(lib.factory_entries.len(), 2);
    }

    #[test]
    fn from_embedded_factory_with_invalid_json_returns_empty() {
        let lib = PresetLibrary::from_embedded_factory("not json");
        assert!(lib.factory_entries.is_empty());
    }

    #[test]
    fn merge_factory_preserves_user_entries() {
        let library = open_temp_library(vec![sample_entry("f1"), sample_entry("f2")]);
        let mut conn = library.open_connection().unwrap();
        let tx = conn.transaction().unwrap();
        upsert_entry(&tx, &user_entry("u1")).unwrap();
        upsert_entry(&tx, &sample_entry("stale")).unwrap();
        tx.commit().unwrap();

        merge_factory_entries(&conn, &[sample_entry("f1"), sample_entry("f3")]).unwrap();
        let ids: Vec<String> = list_entries(&conn, None)
            .unwrap()
            .into_iter()
            .map(|entry| entry.id)
            .collect();
        assert!(ids.iter().any(|id| id == "u1"));
        assert!(ids.iter().any(|id| id == "f1"));
        assert!(ids.iter().any(|id| id == "f3"));
        assert!(!ids.iter().any(|id| id == "stale"));
    }

    #[test]
    fn crud_round_trip_uses_sqlite() {
        let mut lib = open_temp_library(vec![]);
        let entry = lib
            .add_entry(
                "Test".to_string(),
                "Test description".to_string(),
                vec!["pad".to_string()],
                [
                    "Brightness".to_string(),
                    "Timbre".to_string(),
                    "Time".to_string(),
                    "Movement".to_string(),
                ],
                serde_json::json!({ "schemaVersion": 1 }),
            )
            .unwrap();
        assert_eq!(entry.source, "user");

        let fetched = lib.get_entry(&entry.id).unwrap().unwrap();
        assert_eq!(fetched.name, "Test");
        assert_eq!(fetched.description, "Test description");

        assert!(lib.rename_entry(&entry.id, "Renamed").unwrap());
        assert!(lib.set_starred(&entry.id, true).unwrap());
        let fetched = lib.get_entry(&entry.id).unwrap().unwrap();
        assert_eq!(fetched.name, "Renamed");
        assert!(!fetched.starred);
        assert!(
            lib.list_records(None)
                .unwrap()
                .into_iter()
                .any(|record| record.entry.id == entry.id && record.favorite)
        );

        assert!(lib.delete_entry(&entry.id).unwrap());
        assert!(lib.get_entry(&entry.id).unwrap().is_none());
    }

    #[test]
    fn description_migration_defaults_existing_rows() {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE presets (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL
            );
            INSERT INTO presets (id, name) VALUES ('legacy', 'Legacy');",
        )
        .unwrap();

        migrate_description_column(&conn).unwrap();

        let description: String = conn
            .query_row(
                "SELECT description FROM presets WHERE id = 'legacy'",
                [],
                |row| row.get(0),
            )
            .unwrap();
        assert_eq!(description, "");
    }

    #[test]
    fn user_author_migration_defaults_blank_existing_rows() {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE presets (
                id TEXT PRIMARY KEY NOT NULL,
                source TEXT NOT NULL,
                author TEXT NOT NULL
            );
            INSERT INTO presets (id, source, author) VALUES
                ('blank-user', 'user', '   '),
                ('named-user', 'user', 'Ada'),
                ('factory', 'cosmo-factory', '');",
        )
        .unwrap();

        migrate_blank_user_preset_authors(&conn).unwrap();

        let authors: Vec<(String, String)> = conn
            .prepare("SELECT id, author FROM presets ORDER BY id")
            .unwrap()
            .query_map([], |row| Ok((row.get(0)?, row.get(1)?)))
            .unwrap()
            .collect::<Result<_, _>>()
            .unwrap();
        assert_eq!(
            authors,
            vec![
                ("blank-user".to_string(), "User".to_string()),
                ("factory".to_string(), "".to_string()),
                ("named-user".to_string(), "Ada".to_string()),
            ]
        );
    }

    #[test]
    fn list_entries_filters_by_source() {
        let mut lib = open_temp_library(vec![sample_entry("cf1")]);
        let _ = lib
            .add_entry(
                "User".to_string(),
                String::new(),
                vec![],
                [
                    "Brightness".to_string(),
                    "Timbre".to_string(),
                    "Time".to_string(),
                    "Movement".to_string(),
                ],
                serde_json::json!({}),
            )
            .unwrap();
        assert_eq!(lib.list_entries(Some("cosmo-factory")).unwrap().len(), 1);
        assert_eq!(lib.list_entries(Some("user")).unwrap().len(), 1);
    }

    #[test]
    fn migrates_legacy_json_library_into_sqlite() {
        let sqlite_path = temp_db_path("legacy-migration");
        let legacy_path = sqlite_path.with_file_name("preset_library.json");
        let legacy = LegacyPresetLibrary {
            version: 1,
            entries: vec![user_entry("legacy-user")],
        };
        std::fs::create_dir_all(sqlite_path.parent().unwrap()).unwrap();
        std::fs::write(&legacy_path, serde_json::to_string(&legacy).unwrap()).unwrap();

        let library = PresetLibrary {
            storage: StorageLocation::Path(sqlite_path.clone()),
            factory_entries: vec![sample_entry("factory-1")],
            initialization_error: None,
        };
        library.initialize().unwrap();

        let ids: Vec<String> = library
            .list_entries(None)
            .unwrap()
            .into_iter()
            .map(|entry| entry.id)
            .collect();
        assert!(ids.iter().any(|id| id == "legacy-user"));
        assert!(ids.iter().any(|id| id == "factory-1"));
        assert!(!legacy_path.exists());
        assert!(sqlite_path.exists());
    }

    #[test]
    fn schema_v1_migrates_before_creating_bank_index() {
        let sqlite_path = temp_db_path("schema-v1");
        let conn = Connection::open(&sqlite_path).unwrap();
        conn.execute_batch(
            "CREATE TABLE meta (
                key TEXT PRIMARY KEY NOT NULL,
                value TEXT NOT NULL
            );
            INSERT INTO meta (key, value) VALUES ('schema_version', '1');
            CREATE TABLE presets (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                source TEXT NOT NULL,
                author TEXT NOT NULL,
                starred INTEGER NOT NULL DEFAULT 0,
                sort_index INTEGER NOT NULL DEFAULT 4294967295,
                tags_json TEXT NOT NULL,
                macro_labels_json TEXT NOT NULL,
                factory_version INTEGER NOT NULL DEFAULT 0,
                data_json TEXT NOT NULL,
                revision INTEGER NOT NULL DEFAULT 0,
                updated_at_unix_ms INTEGER NOT NULL DEFAULT 0
            );
            CREATE TABLE preset_favorites (preset_id TEXT PRIMARY KEY NOT NULL);",
        )
        .unwrap();
        drop(conn);

        let library = PresetLibrary {
            storage: StorageLocation::Path(sqlite_path),
            factory_entries: vec![sample_entry("factory-1")],
            initialization_error: None,
        };
        library.initialize().unwrap();
        library.validate().unwrap();

        let conn = library.open_connection().unwrap();
        assert!(has_preset_column(&conn, "bank_id").unwrap());
        assert!(has_preset_column(&conn, "description").unwrap());
        assert_eq!(read_schema_version(&conn).unwrap(), LIBRARY_SCHEMA_VERSION);
    }

    #[test]
    fn repair_backs_up_and_recovers_schema_v1_database() {
        let sqlite_path = temp_db_path("repair-schema-v1");
        let conn = Connection::open(&sqlite_path).unwrap();
        conn.execute_batch(
            "CREATE TABLE meta (
                key TEXT PRIMARY KEY NOT NULL,
                value TEXT NOT NULL
            );
            INSERT INTO meta (key, value) VALUES ('schema_version', '1');
            CREATE TABLE presets (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                source TEXT NOT NULL,
                author TEXT NOT NULL,
                starred INTEGER NOT NULL DEFAULT 0,
                sort_index INTEGER NOT NULL DEFAULT 4294967295,
                tags_json TEXT NOT NULL,
                macro_labels_json TEXT NOT NULL,
                factory_version INTEGER NOT NULL DEFAULT 0,
                data_json TEXT NOT NULL,
                revision INTEGER NOT NULL DEFAULT 0,
                updated_at_unix_ms INTEGER NOT NULL DEFAULT 0
            );
            CREATE TABLE preset_favorites (preset_id TEXT PRIMARY KEY NOT NULL);",
        )
        .unwrap();
        drop(conn);

        let mut library = PresetLibrary {
            storage: StorageLocation::Path(sqlite_path),
            factory_entries: vec![sample_entry("factory-1")],
            initialization_error: Some("legacy schema could not initialize".to_string()),
        };
        let backup_path = library.repair().unwrap();

        assert!(backup_path.exists());
        assert!(library.initialization_error().is_none());
        assert_eq!(library.list_records(None).unwrap().len(), 1);
    }

    #[test]
    fn rebuild_salvages_readable_user_presets_and_favorites() {
        let mut library = open_temp_library(vec![sample_entry("factory-1")]);
        let user = library
            .add_entry(
                "Recovered User".to_string(),
                "Keep me".to_string(),
                vec!["pad".to_string()],
                [
                    "Brightness".to_string(),
                    "Timbre".to_string(),
                    "Time".to_string(),
                    "Movement".to_string(),
                ],
                serde_json::json!({ "schemaVersion": 1 }),
            )
            .unwrap();
        library.set_starred(&user.id, true).unwrap();
        library.initialization_error = Some("forced degraded mode".to_string());

        let backup_path = library.rebuild().unwrap();
        let records = library.list_records(None).unwrap();

        assert!(backup_path.exists());
        assert!(records.iter().any(|record| {
            record.entry.id == user.id && record.entry.description == "Keep me" && record.favorite
        }));
    }

    #[test]
    fn rebuild_replaces_corrupt_database_with_factory_only_library() {
        let sqlite_path = temp_db_path("rebuild-corrupt");
        std::fs::write(&sqlite_path, b"not a sqlite database").unwrap();

        let mut library = PresetLibrary {
            storage: StorageLocation::Path(sqlite_path.clone()),
            factory_entries: vec![sample_entry("factory-1")],
            initialization_error: Some(
                "preset library database error: file is not a database".to_string(),
            ),
        };

        let backup_path = library.rebuild().unwrap();
        let records = library.list_records(None).unwrap();

        assert!(backup_path.exists());
        assert_eq!(
            std::fs::read(&backup_path).unwrap(),
            b"not a sqlite database"
        );
        assert!(library.initialization_error().is_none());
        assert_eq!(records.len(), 1);
        assert_eq!(records[0].entry.id, "factory-1");
        assert!(!records[0].favorite);
    }

    #[test]
    fn list_entries_returns_error_free_result() {
        let lib = open_temp_library(vec![sample_entry("f1")]);
        assert_eq!(lib.list_entries(None).unwrap().len(), 1);
    }

    #[test]
    fn merge_factory_preserves_favorites_across_refresh() {
        let library = open_temp_library(vec![sample_entry("f1"), sample_entry("f2")]);
        let mut conn = library.open_connection().unwrap();
        {
            let tx = conn.transaction().unwrap();
            upsert_favorite(&tx, "f1").unwrap();
            tx.commit().unwrap();
        }

        merge_factory_entries(&conn, &[sample_entry("f1"), sample_entry("f3")]).unwrap();
        let records = list_records(&conn, None).unwrap();
        assert!(
            records
                .iter()
                .any(|record| record.entry.id == "f1" && record.favorite)
        );
        assert!(
            records
                .iter()
                .any(|record| record.entry.id == "f3" && !record.favorite)
        );
    }

    #[test]
    fn merge_factory_reconciles_stale_factory_rows_without_deleting_users() {
        let library = open_temp_library(vec![sample_entry("factory-old"), sample_entry("f1")]);
        let mut conn = library.open_connection().unwrap();
        let user = user_entry("user-1");
        upsert_entry(&conn, &user).unwrap();
        {
            let tx = conn.transaction().unwrap();
            upsert_favorite(&tx, "factory-old").unwrap();
            upsert_favorite(&tx, "f1").unwrap();
            upsert_favorite(&tx, "user-1").unwrap();
            tx.commit().unwrap();
        }

        merge_factory_entries(&conn, &[sample_entry("f1"), sample_entry("f2")]).unwrap();

        assert!(load_entry(&conn, "factory-old").unwrap().is_none());
        assert!(load_entry(&conn, "user-1").unwrap().is_some());
        let favorite_ids = list_favorite_ids(&conn).unwrap();
        assert!(!favorite_ids.iter().any(|id| id == "factory-old"));
        assert!(favorite_ids.iter().any(|id| id == "f1"));
        assert!(favorite_ids.iter().any(|id| id == "user-1"));
    }

    #[test]
    fn startup_preset_uses_starred_sort_index_order() {
        let library = open_temp_library(vec![
            PresetLibraryEntry {
                id: "factory-b".to_string(),
                name: "Bliss".to_string(),
                starred: true,
                sort_index: 1,
                ..sample_entry("factory-b")
            },
            PresetLibraryEntry {
                id: "factory-a".to_string(),
                name: "Zebra".to_string(),
                starred: true,
                sort_index: 0,
                ..sample_entry("factory-a")
            },
        ]);
        let user = PresetLibraryEntry {
            id: "user-a".to_string(),
            name: "Aether".to_string(),
            starred: true,
            ..user_entry("user-a")
        };
        let mut conn = library.open_connection().unwrap();
        let tx = conn.transaction().unwrap();
        upsert_entry(&tx, &user).unwrap();
        tx.commit().unwrap();

        let startup = library.find_startup_preset().unwrap().unwrap();
        assert_eq!(startup.id, "factory-a");
        assert!(startup.starred);

        conn.execute("UPDATE presets SET starred = 0 WHERE id = 'factory-a'", [])
            .unwrap();
        let startup = library.find_startup_preset().unwrap().unwrap();
        assert_eq!(startup.id, "factory-b");
    }

    #[test]
    fn list_entries_uses_display_order_for_starred_factory_presets() {
        let library = open_temp_library(vec![
            PresetLibraryEntry {
                id: "factory-b".to_string(),
                name: "Bliss".to_string(),
                starred: true,
                sort_index: 1,
                ..sample_entry("factory-b")
            },
            PresetLibraryEntry {
                id: "factory-a".to_string(),
                name: "Zebra".to_string(),
                starred: true,
                sort_index: 0,
                ..sample_entry("factory-a")
            },
            PresetLibraryEntry {
                id: "factory-c".to_string(),
                name: "Aether".to_string(),
                starred: false,
                ..sample_entry("factory-c")
            },
        ]);

        let ids = library
            .list_entries(None)
            .unwrap()
            .into_iter()
            .map(|entry| entry.id)
            .collect::<Vec<_>>();

        assert_eq!(ids, vec!["factory-a", "factory-b", "factory-c"]);
    }

    #[test]
    fn startup_preset_returns_none_when_no_starred_presets_exist() {
        let library = open_temp_library(vec![sample_entry("f1")]);
        assert!(library.find_startup_preset().unwrap().is_none());
    }

    #[test]
    fn list_entries_exposes_bank_metadata() {
        let library = open_temp_library(vec![sample_entry("f1")]);
        let entry = library.list_entries(None).unwrap().pop().unwrap();
        assert_eq!(entry.bank_id.as_deref(), Some("cosmo-factory"));
        assert_eq!(entry.bank_name.as_deref(), Some("Cosmo Factory Library"));
    }

    #[test]
    fn import_bank_replaces_stale_entries_within_same_bank() {
        let mut library = open_temp_library(vec![sample_entry("f1")]);
        library
            .import_bank(PresetBankBundle {
                r#type: "preset-bank".to_string(),
                schema_version: 1,
                bank: PresetBankMetadata {
                    id: "addon-bank".to_string(),
                    name: "Addon Bank".to_string(),
                    source: "addon".to_string(),
                },
                presets: vec![PresetBankEntry {
                    id: "addon-a".to_string(),
                    name: "Addon A".to_string(),
                    author: "Addon".to_string(),
                    description: "Addon A description".to_string(),
                    starred: false,
                    tags: vec!["pad".to_string()],
                    data: serde_json::json!({ "schemaVersion": 1, "params": { "volume": 0.5 } }),
                }],
            })
            .unwrap();
        library.set_starred("addon-a", true).unwrap();
        library
            .import_bank(PresetBankBundle {
                r#type: "preset-bank".to_string(),
                schema_version: 1,
                bank: PresetBankMetadata {
                    id: "addon-bank".to_string(),
                    name: "Addon Bank".to_string(),
                    source: "addon".to_string(),
                },
                presets: vec![PresetBankEntry {
                    id: "addon-b".to_string(),
                    name: "Addon B".to_string(),
                    author: "Addon".to_string(),
                    description: String::new(),
                    starred: false,
                    tags: vec!["bass".to_string()],
                    data: serde_json::json!({ "schemaVersion": 1, "params": { "volume": 0.6 } }),
                }],
            })
            .unwrap();

        let records = library.list_records(None).unwrap();
        assert!(records.iter().any(|record| record.entry.id == "addon-b"));
        assert!(!records.iter().any(|record| record.entry.id == "addon-a"));
    }

    #[test]
    fn import_bank_preserves_macro_labels_from_preset_payload() {
        let mut library = open_temp_library(vec![sample_entry("f1")]);
        library
            .import_bank(PresetBankBundle {
                r#type: "preset-bank".to_string(),
                schema_version: 1,
                bank: PresetBankMetadata {
                    id: "addon-bank".to_string(),
                    name: "Addon Bank".to_string(),
                    source: "addon".to_string(),
                },
                presets: vec![PresetBankEntry {
                    id: "addon-macro".to_string(),
                    name: "Addon Macro".to_string(),
                    author: "Addon".to_string(),
                    description: String::new(),
                    starred: false,
                    tags: vec![],
                    data: serde_json::json!({
                        "schemaVersion": 1,
                        "params": {
                            "volume": 0.5,
                            "macroLabels": ["A", "B", "C", "D"]
                        }
                    }),
                }],
            })
            .unwrap();

        let imported = library.get_entry("addon-macro").unwrap().unwrap();
        assert_eq!(imported.macro_labels, ["A", "B", "C", "D"]);
    }

    #[test]
    fn fx_module_presets_round_trip_in_sqlite() {
        let mut library = open_temp_library(vec![sample_entry("f1")]);
        let saved = library
            .save_fx_module_preset(
                "Wide Delay".to_string(),
                "delay".to_string(),
                serde_json::json!({ "delay": { "enabled": true, "mix": 0.4 } }),
            )
            .unwrap();

        let listed = library.list_fx_module_presets("delay").unwrap();
        assert_eq!(listed.len(), 1);
        assert_eq!(listed[0].id, saved.id);
        assert_eq!(listed[0].module_type, "delay");

        assert!(library.delete_fx_module_preset(&saved.id).unwrap());
        assert!(library.list_fx_module_presets("delay").unwrap().is_empty());

        let envelope = library
            .save_fx_module_preset(
                "Envelope Shape".to_string(),
                "envelope".to_string(),
                serde_json::json!({
                    "envelope": {
                        "steps": [],
                        "sustainStep": 0,
                        "stepCount": 1,
                        "loop": false
                    }
                }),
            )
            .unwrap();
        let envelope_list = library.list_fx_module_presets("envelope").unwrap();
        assert_eq!(envelope_list.len(), 1);
        assert_eq!(envelope_list[0].id, envelope.id);
        assert_eq!(envelope_list[0].module_type, "envelope");
    }
}
