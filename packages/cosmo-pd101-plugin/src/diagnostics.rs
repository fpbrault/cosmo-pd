use std::fs::OpenOptions;
use std::io::Write;
#[cfg(not(test))]
use std::path::PathBuf;
#[cfg(not(test))]
use std::sync::Mutex;
use std::sync::Once;
#[cfg(not(test))]
use std::sync::OnceLock;
#[cfg(test)]
use std::sync::atomic::{AtomicU32, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

#[cfg(not(test))]
use std::fs;

use crate::global_settings::PluginLogLevel;

const PLUGIN_LOG_PATH: &str = "/tmp/cosmo-plugin.log";

#[cfg(not(test))]
#[derive(Clone)]
struct LogLevelCache {
    settings_path: Option<PathBuf>,
    settings_modified_at: Option<SystemTime>,
    settings_len: Option<u64>,
    level: PluginLogLevel,
}

#[cfg(not(test))]
impl Default for LogLevelCache {
    fn default() -> Self {
        Self {
            settings_path: None,
            settings_modified_at: None,
            settings_len: None,
            level: PluginLogLevel::Info,
        }
    }
}

#[cfg(not(test))]
static LOG_LEVEL_CACHE: OnceLock<Mutex<LogLevelCache>> = OnceLock::new();

#[cfg(test)]
static TEST_LOG_LEVEL: AtomicU32 = AtomicU32::new(PluginLogLevel::Error as u32);

static PANIC_HOOK_INIT: Once = Once::new();

fn log_timestamp_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or_default()
}

pub fn append_log(message: &str) {
    append_log_at_level(PluginLogLevel::Info, message);
}

pub fn append_log_debug(message: &str) {
    append_log_at_level(PluginLogLevel::Debug, message);
}

pub fn append_log_warn(message: &str) {
    append_log_at_level(PluginLogLevel::Warn, message);
}

pub fn append_log_error(message: &str) {
    append_log_at_level(PluginLogLevel::Error, message);
}

#[cfg(not(test))]
fn cached_log_level() -> PluginLogLevel {
    let cache = LOG_LEVEL_CACHE.get_or_init(|| Mutex::new(LogLevelCache::default()));
    let settings_path = crate::global_settings::get_global_settings_path();
    let settings_metadata = fs::metadata(&settings_path).ok();
    let settings_modified_at = settings_metadata
        .as_ref()
        .and_then(|metadata| metadata.modified().ok());
    let settings_len = settings_metadata.as_ref().map(|metadata| metadata.len());

    let mut cache = cache.lock().unwrap();
    let path_changed = cache
        .settings_path
        .as_ref()
        .map(|path| path != &settings_path)
        .unwrap_or(true);
    let modified_changed = cache.settings_modified_at != settings_modified_at;
    let len_changed = cache.settings_len != settings_len;

    if path_changed || modified_changed || len_changed {
        cache.level = crate::global_settings::load_or_init_global_settings()
            .map(|settings| settings.log_level)
            .unwrap_or(PluginLogLevel::Info);
        cache.settings_path = Some(settings_path);
        cache.settings_modified_at = settings_modified_at;
        cache.settings_len = settings_len;
    }

    cache.level
}

#[cfg(test)]
pub(crate) fn set_test_log_level(level: PluginLogLevel) {
    TEST_LOG_LEVEL.store(level as u32, Ordering::Relaxed);
}

#[cfg(test)]
fn cached_log_level() -> PluginLogLevel {
    match TEST_LOG_LEVEL.load(Ordering::Relaxed) {
        value if value == PluginLogLevel::Error as u32 => PluginLogLevel::Error,
        value if value == PluginLogLevel::Warn as u32 => PluginLogLevel::Warn,
        value if value == PluginLogLevel::Info as u32 => PluginLogLevel::Info,
        value if value == PluginLogLevel::Debug as u32 => PluginLogLevel::Debug,
        _ => PluginLogLevel::Error,
    }
}

fn should_log(level: PluginLogLevel) -> bool {
    level <= cached_log_level()
}

fn log_level_label(level: PluginLogLevel) -> &'static str {
    match level {
        PluginLogLevel::Error => "ERROR",
        PluginLogLevel::Warn => "WARN",
        PluginLogLevel::Info => "INFO",
        PluginLogLevel::Debug => "DEBUG",
    }
}

fn append_log_at_level(level: PluginLogLevel, message: &str) {
    if !should_log(level) {
        return;
    }
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(PLUGIN_LOG_PATH)
    {
        let _ = writeln!(
            file,
            "[rust level={} pid={} ts_ms={}] {}",
            log_level_label(level),
            std::process::id(),
            log_timestamp_ms(),
            message
        );
    }
}

pub fn plugin_log_path() -> &'static str {
    PLUGIN_LOG_PATH
}

pub fn init_panic_hook() {
    PANIC_HOOK_INIT.call_once(|| {
        let default_hook = std::panic::take_hook();
        std::panic::set_hook(Box::new(move |info| {
            let payload = info.payload();
            let msg = if let Some(s) = payload.downcast_ref::<&str>() {
                s.to_string()
            } else if let Some(s) = payload.downcast_ref::<String>() {
                s.clone()
            } else {
                format!("{:?}", payload)
            };
            let location = info
                .location()
                .map(|l| format!(" at {}:{}", l.file(), l.line()))
                .unwrap_or_default();
            append_log_error(&format!("PANIC: {}{}", msg, location));
            eprintln!("[cosmo-pd101] PANIC: {}{}", msg, location);
            default_hook(info);
        }));
    });
}
