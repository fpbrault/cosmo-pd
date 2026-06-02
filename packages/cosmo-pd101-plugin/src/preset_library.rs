use std::path::PathBuf;

use rusqlite::{Connection, OptionalExtension, params};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::preset_library_path;

const LIBRARY_SCHEMA_VERSION: u32 = 2;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
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
        data: serde_json::Value,
    ) -> Result<PresetLibraryEntry, String> {
        let entry = PresetLibraryEntry {
            id: Uuid::new_v4().to_string(),
            name,
            source: "user".to_string(),
            author: String::new(),
            starred: false,
            tags,
            macro_labels: default_macro_labels(),
            factory_version: 0,
            data,
        };
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

    fn initialize(&self) -> Result<(), String> {
        self.with_connection_mut(|conn| {
            let previous_schema_version = read_schema_version(conn)?;
            migrate_schema(conn)?;
            migrate_legacy_json_if_needed(conn, &self.storage)?;
            if previous_schema_version < 2 {
                migrate_starred_state_to_favorites(conn)?;
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

fn default_macro_labels() -> [String; 4] {
    [
        "Brightness".to_string(),
        "Timbre".to_string(),
        "Time".to_string(),
        "Movement".to_string(),
    ]
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
        "SELECT id, name, source, author, starred, tags_json, macro_labels_json, factory_version, data_json
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
        "SELECT id, name, source, author, starred, tags_json, macro_labels_json, factory_version, data_json
         FROM presets
         WHERE source = ?1
         ORDER BY
            CASE WHEN source = 'user' THEN 1 ELSE 0 END,
            name COLLATE NOCASE,
            id"
    } else {
        "SELECT id, name, source, author, starred, tags_json, macro_labels_json, factory_version, data_json
         FROM presets
         ORDER BY
            CASE WHEN source = 'user' THEN 1 ELSE 0 END,
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
            id, name, source, author, starred, tags_json, macro_labels_json,
            factory_version, data_json, revision, updated_at_unix_ms
         ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 0, ?10)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            source = excluded.source,
            author = excluded.author,
            starred = excluded.starred,
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
    let tags_json: String = row.get(5)?;
    let macro_labels_json: String = row.get(6)?;
    let data_json: String = row.get(8)?;

    let tags = serde_json::from_str(&tags_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(5, rusqlite::types::Type::Text, Box::new(error))
    })?;
    let macro_labels = serde_json::from_str(&macro_labels_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(6, rusqlite::types::Type::Text, Box::new(error))
    })?;
    let data = serde_json::from_str(&data_json).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(8, rusqlite::types::Type::Text, Box::new(error))
    })?;

    Ok(PresetLibraryEntry {
        id: row.get(0)?,
        name: row.get(1)?,
        source: row.get(2)?,
        author: row.get(3)?,
        starred: row.get::<_, i64>(4)? != 0,
        tags,
        macro_labels,
        factory_version: row.get::<_, i64>(7)? as u32,
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
            tags: vec![],
            macro_labels: default_macro_labels(),
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
            tags: vec!["bass".to_string()],
            macro_labels: default_macro_labels(),
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
            .add_entry("User".to_string(), vec![], serde_json::json!({}))
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
}
