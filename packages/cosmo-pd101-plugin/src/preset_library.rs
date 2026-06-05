use std::path::PathBuf;

use rusqlite::{Connection, OptionalExtension, params};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::preset_library_path;

const DEFAULT_SORT_INDEX: u32 = u32::MAX;
const LIBRARY_SCHEMA_VERSION: u32 = 4;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PresetLibraryEntry {
    pub id: String,
    pub name: String,
    pub source: String,
    pub author: String,
    pub starred: bool,
    pub sort_index: u32,
    pub tags: Vec<String>,
    pub macro_labels: [String; 4],
    pub factory_version: u32,
    pub data: serde_json::Value,
}

#[derive(Clone, Debug, PartialEq)]
pub struct PresetLibraryRecord {
    pub entry: PresetLibraryEntry,
    pub favorite: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FxModulePresetEntry {
    pub id: String,
    pub name: String,
    pub module_type: String,
    pub patch: serde_json::Value,
    pub created_at_unix_ms: i64,
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
}

impl PresetLibrary {
    pub fn from_embedded_factory(factory_json: &str) -> Self {
        Self {
            storage: StorageLocation::Memory,
            factory_entries: parse_factory_entries(factory_json).unwrap_or_default(),
        }
    }

    pub fn load_or_init(factory_json: &str) -> Result<Self, String> {
        let factory_entries = parse_factory_entries(factory_json)?;
        let storage = StorageLocation::Path(Self::library_path());
        let library = Self {
            storage,
            factory_entries,
        };
        library.initialize()?;
        Ok(library)
    }

    pub fn add_entry(
        &mut self,
        name: String,
        tags: Vec<String>,
        macro_labels: [String; 4],
        data: serde_json::Value,
    ) -> Result<PresetLibraryEntry, String> {
        let entry = PresetLibraryEntry {
            id: Uuid::new_v4().to_string(),
            name,
            source: "user".to_string(),
            author: String::new(),
            starred: false,
            sort_index: DEFAULT_SORT_INDEX,
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
        self.with_connection(|conn| load_entry(conn, id))
    }

    pub fn get_entry_data(&self, id: &str) -> Result<Option<serde_json::Value>, String> {
        self.get_entry(id).map(|entry| entry.map(|e| e.data))
    }

    pub fn list_entries(
        &self,
        source_filter: Option<&str>,
    ) -> Result<Vec<PresetLibraryEntry>, String> {
        self.with_connection(|conn| list_entries(conn, source_filter))
    }

    pub fn list_records(
        &self,
        source_filter: Option<&str>,
    ) -> Result<Vec<PresetLibraryRecord>, String> {
        self.with_connection(|conn| list_records(conn, source_filter))
    }

    pub fn find_startup_preset(&self) -> Result<Option<PresetLibraryEntry>, String> {
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

    pub fn save_fx_module_preset(
        &mut self,
        name: String,
        module_type: String,
        patch: serde_json::Value,
    ) -> Result<FxModulePresetEntry, String> {
        let entry = FxModulePresetEntry {
            id: Uuid::new_v4().to_string(),
            name,
            module_type,
            patch,
            created_at_unix_ms: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_millis() as i64)
                .unwrap_or_default(),
        };
        self.with_connection_mut(|conn| upsert_fx_module_preset(conn, &entry))?;
        Ok(entry)
    }

    pub fn list_fx_module_presets(
        &self,
        module_type: &str,
    ) -> Result<Vec<FxModulePresetEntry>, String> {
        self.with_connection(|conn| list_fx_module_presets(conn, module_type))
    }

    pub fn delete_fx_module_preset(&mut self, id: &str) -> Result<bool, String> {
        self.with_connection_mut(|conn| {
            let deleted = conn
                .execute("DELETE FROM fx_module_presets WHERE id = ?1", [id])
                .map_err(db_err)?;
            Ok(deleted > 0)
        })
    }

    fn initialize(&self) -> Result<(), String> {
        self.with_connection_mut(|conn| {
            let previous_schema_version = read_schema_version(conn)?;
            migrate_schema(conn)?;
            migrate_legacy_json_if_needed(conn, &self.storage)?;
            if previous_schema_version < 2 {
                migrate_starred_state_to_favorites(conn)?;
            }
            if previous_schema_version < 3 {
                migrate_sort_index_column(conn)?;
            }
            if previous_schema_version < 4 {
                migrate_fx_module_presets_table(conn)?;
            }
            merge_factory_entries(conn, &self.factory_entries)?;
            Ok(())
        })
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
    serde_json::from_str(factory_json)
        .map_err(|error| format!("failed to parse embedded factory presets: {error}"))
}

fn db_err(error: rusqlite::Error) -> String {
    format!("preset library database error: {error}")
}

fn migrate_schema(conn: &Connection) -> Result<(), String> {
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
            starred INTEGER NOT NULL DEFAULT 0,
            sort_index INTEGER NOT NULL DEFAULT 4294967295,
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

        CREATE INDEX IF NOT EXISTS idx_presets_source ON presets(source);
        ",
    )
    .map_err(db_err)?;

    conn.execute(
        "INSERT INTO meta(key, value) VALUES('schema_version', ?1)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        [LIBRARY_SCHEMA_VERSION.to_string()],
    )
    .map_err(db_err)?;
    Ok(())
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
    let has_sort_index = conn
        .prepare("PRAGMA table_info(presets)")
        .map_err(db_err)?
        .query_map([], |row| row.get::<_, String>(1))
        .map_err(db_err)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(db_err)?
        .into_iter()
        .any(|column| column == "sort_index");

    if !has_sort_index {
        conn.execute(
            "ALTER TABLE presets ADD COLUMN sort_index INTEGER NOT NULL DEFAULT 4294967295",
            [],
        )
        .map_err(db_err)?;
    }

    Ok(())
}

fn migrate_fx_module_presets_table(conn: &Connection) -> Result<(), String> {
    let has_table = conn
        .query_row(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'fx_module_presets'",
            [],
            |_| Ok(()),
        )
        .optional()
        .map_err(db_err)?
        .is_some();

    if !has_table {
        conn.execute_batch(
            "
            CREATE TABLE fx_module_presets (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                module_type TEXT NOT NULL,
                patch_json TEXT NOT NULL,
                created_at_unix_ms INTEGER NOT NULL DEFAULT 0
            );

            CREATE INDEX IF NOT EXISTS idx_fx_module_presets_type ON fx_module_presets(module_type);
            ",
        )
        .map_err(db_err)?;
    }

    Ok(())
}

fn merge_factory_entries(
    conn: &Connection,
    factory_entries: &[PresetLibraryEntry],
) -> Result<(), String> {
    conn.execute("DELETE FROM presets WHERE source != 'user'", [])
        .map_err(db_err)?;

    for entry in factory_entries {
        upsert_entry(conn, entry)?;
    }

    conn.execute(
        "DELETE FROM preset_favorites
         WHERE preset_id NOT IN (SELECT id FROM presets)",
        [],
    )
    .map_err(db_err)?;

    Ok(())
}

fn load_entry(conn: &Connection, id: &str) -> Result<Option<PresetLibraryEntry>, String> {
    conn.query_row(
        "SELECT id, name, source, author, starred, sort_index, tags_json, macro_labels_json, factory_version, data_json
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
        "SELECT id, name, source, author, starred, sort_index, tags_json, macro_labels_json, factory_version, data_json
         FROM presets
         WHERE source = ?1
         ORDER BY
            CASE WHEN source = 'user' THEN 1 ELSE 0 END,
            CASE WHEN starred THEN 0 ELSE 1 END,
            CASE WHEN starred THEN sort_index ELSE 4294967295 END,
            name COLLATE NOCASE,
            id"
    } else {
        "SELECT id, name, source, author, starred, sort_index, tags_json, macro_labels_json, factory_version, data_json
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
        "SELECT p.id, p.name, p.source, p.author, p.starred, p.sort_index, p.tags_json,
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
            id, name, source, author, starred, sort_index, tags_json,
            macro_labels_json, factory_version, data_json, revision,
            updated_at_unix_ms
         ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 0, ?11)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            source = excluded.source,
            author = excluded.author,
            starred = excluded.starred,
            sort_index = excluded.sort_index,
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
            if entry.starred { 1_i64 } else { 0_i64 },
            i64::from(entry.sort_index),
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

fn upsert_fx_module_preset(conn: &Connection, entry: &FxModulePresetEntry) -> Result<(), String> {
    let patch_json = serde_json::to_string(&entry.patch)
        .map_err(|error| format!("failed to serialize fx module preset patch: {error}"))?;

    conn.execute(
        "INSERT INTO fx_module_presets (id, name, module_type, patch_json, created_at_unix_ms)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            module_type = excluded.module_type,
            patch_json = excluded.patch_json,
            created_at_unix_ms = excluded.created_at_unix_ms",
        params![
            entry.id,
            entry.name,
            entry.module_type,
            patch_json,
            entry.created_at_unix_ms
        ],
    )
    .map_err(db_err)?;
    Ok(())
}

fn list_fx_module_presets(
    conn: &Connection,
    module_type: &str,
) -> Result<Vec<FxModulePresetEntry>, String> {
    let mut statement = conn
        .prepare(
            "SELECT id, name, module_type, patch_json, created_at_unix_ms
             FROM fx_module_presets
             WHERE module_type = ?1
             ORDER BY created_at_unix_ms ASC",
        )
        .map_err(db_err)?;

    let rows = statement
        .query_map(params![module_type], map_fx_module_row)
        .map_err(db_err)?
        .collect::<Result<Vec<_>, _>>()
        .map_err(db_err)?;
    Ok(rows)
}

fn map_fx_module_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<FxModulePresetEntry> {
    let patch_json: String = row.get(3)?;
    let patch = serde_json::from_str(&patch_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(3, rusqlite::types::Type::Text, Box::new(error))
    })?;

    Ok(FxModulePresetEntry {
        id: row.get(0)?,
        name: row.get(1)?,
        module_type: row.get(2)?,
        patch,
        created_at_unix_ms: row.get(4)?,
    })
}

fn map_entry_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<PresetLibraryEntry> {
    let tags_json: String = row.get(6)?;
    let macro_labels_json: String = row.get(7)?;
    let data_json: String = row.get(9)?;

    let tags = serde_json::from_str(&tags_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(6, rusqlite::types::Type::Text, Box::new(error))
    })?;
    let macro_labels = serde_json::from_str(&macro_labels_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(7, rusqlite::types::Type::Text, Box::new(error))
    })?;
    let data = serde_json::from_str(&data_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(9, rusqlite::types::Type::Text, Box::new(error))
    })?;

    Ok(PresetLibraryEntry {
        id: row.get(0)?,
        name: row.get(1)?,
        source: row.get(2)?,
        author: row.get(3)?,
        starred: row.get::<_, i64>(4)? != 0,
        sort_index: row.get::<_, i64>(5)? as u32,
        tags,
        macro_labels,
        factory_version: row.get::<_, i64>(8)? as u32,
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

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_entry(id: &str) -> PresetLibraryEntry {
        PresetLibraryEntry {
            id: id.to_string(),
            name: format!("Preset {id}"),
            source: "cosmo-factory".to_string(),
            author: "Factory".to_string(),
            starred: false,
            sort_index: DEFAULT_SORT_INDEX,
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
            starred: false,
            sort_index: DEFAULT_SORT_INDEX,
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
    fn list_entries_filters_by_source() {
        let mut lib = open_temp_library(vec![sample_entry("cf1")]);
        let _ = lib
            .add_entry(
                "User".to_string(),
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
    fn fx_module_preset_crud_round_trip() {
        let mut lib = open_temp_library(vec![]);
        let patch = serde_json::json!({ "mix": 0.5, "rate": 0.3 });
        let saved = lib
            .save_fx_module_preset("My Chorus".to_string(), "chorus".to_string(), patch.clone())
            .unwrap();
        assert_eq!(saved.name, "My Chorus");
        assert_eq!(saved.module_type, "chorus");
        assert_eq!(saved.patch, patch);
        assert!(saved.created_at_unix_ms > 0);

        let all = lib.list_fx_module_presets("chorus").unwrap();
        assert_eq!(all.len(), 1);
        assert_eq!(all[0].id, saved.id);
        assert_eq!(all[0].name, "My Chorus");

        let none = lib.list_fx_module_presets("reverb").unwrap();
        assert!(none.is_empty());

        assert!(lib.delete_fx_module_preset(&saved.id).unwrap());
        let after = lib.list_fx_module_presets("chorus").unwrap();
        assert!(after.is_empty());
    }

    #[test]
    fn fx_module_preset_list_ordered_by_created_at() {
        let mut lib = open_temp_library(vec![]);
        let a = lib
            .save_fx_module_preset(
                "First".to_string(),
                "delay".to_string(),
                serde_json::json!({}),
            )
            .unwrap();
        let b = lib
            .save_fx_module_preset(
                "Second".to_string(),
                "delay".to_string(),
                serde_json::json!({}),
            )
            .unwrap();

        let all = lib.list_fx_module_presets("delay").unwrap();
        assert_eq!(all.len(), 2);
        assert_eq!(all[0].id, a.id);
        assert_eq!(all[1].id, b.id);
    }

    #[test]
    fn fx_module_preset_delete_unknown_id_returns_false() {
        let mut lib = open_temp_library(vec![]);
        assert!(!lib.delete_fx_module_preset("nonexistent").unwrap());
    }

    #[test]
    fn fx_module_preset_migration_creates_table() {
        let lib = open_temp_library(vec![]);
        let conn = lib.open_connection().unwrap();
        let has_table: bool = conn
            .query_row(
                "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'fx_module_presets'",
                [],
                |row| row.get(0),
            )
            .unwrap_or(false);
        assert!(has_table, "fx_module_presets table should exist");
    }
}
