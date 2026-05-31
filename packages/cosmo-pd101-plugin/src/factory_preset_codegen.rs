use std::collections::{BTreeMap, BTreeSet};
use std::ffi::OsStr;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use cosmo_synth_engine::fx::{FX_DEFINITIONS_V1, FxControlKindV1};
use cosmo_synth_engine::generators::{ALGO_DEFINITIONS_V1, AlgoControlKindV1};
use cosmo_synth_engine::params::engine_param_ranges_v1;
use cosmo_synth_engine::preset_wire::SynthPresetV1;
use serde::Deserialize;
use serde::Serialize;
use serde_json::{Map, Value};

const DEFAULT_MACRO_LABELS: [&str; 4] = ["Brightness", "Timbre", "Time", "Movement"];
const PRESET_TAG_OPTIONS: [&str; 16] = [
    "bass", "bell", "brass", "drum", "effect", "guitar", "keys", "lead", "organ", "pad", "piano",
    "pluck", "string", "synth", "voice", "wind",
];

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
struct AuthoredCzPresetFile {
    name: String,
    #[serde(default)]
    tags: Vec<String>,
    data: Value,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct LibraryPresetOutput {
    id: String,
    name: String,
    source: String,
    author: String,
    starred: bool,
    data: SynthPresetV1,
    tags: Vec<String>,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct FactoryPresetEntry {
    id: String,
    name: String,
    source: String,
    author: String,
    starred: bool,
    tags: Vec<String>,
    macro_labels: Vec<String>,
    factory_version: u32,
    data: SynthPresetV1,
}

#[derive(Debug, Clone)]
struct CzPresetSource {
    name: String,
    tags: Vec<String>,
    data: SynthPresetV1,
}

pub fn generate_factory_presets(plugin_manifest_dir: &Path) -> Result<(), String> {
    emit_rerun_if_changed(plugin_manifest_dir)?;

    let cosmo_pd101_dir = plugin_manifest_dir.join("../cosmo-pd101");
    let synth_dir = cosmo_pd101_dir.join("src/lib/synth");
    let authored_dir = synth_dir.join("factory-cz-presets");
    let cz_presets = load_cz_presets_from_dir(&authored_dir)?;
    let cosmo_entries = load_cosmo_factory_entries(&cosmo_pd101_dir)?;

    let generated_ts = render_factory_cz_presets_ts(&cz_presets)?;
    let mut aggregate_entries = cosmo_entries;
    aggregate_entries.extend(cz_presets.iter().map(build_factory_entry));
    let generated_json = to_pretty_json_string(&aggregate_entries)
        .map(|json| format!("{json}\n"))
        .map_err(|error| format!("failed to serialize aggregate factory preset JSON: {error}"))?;

    write_atomic(&synth_dir.join("factoryCzPresets.ts"), &generated_ts)?;
    write_atomic(&synth_dir.join("factory_presets.json"), &generated_json)?;
    format_generated_outputs(&cosmo_pd101_dir)?;

    Ok(())
}

fn emit_rerun_if_changed(plugin_manifest_dir: &Path) -> Result<(), String> {
    let cosmo_pd101_dir = plugin_manifest_dir.join("../cosmo-pd101");
    let authored_dir = cosmo_pd101_dir.join("src/lib/synth/factory-cz-presets");
    println!(
        "cargo:rerun-if-changed={}",
        plugin_manifest_dir
            .join("src/factory_preset_codegen.rs")
            .display()
    );
    println!("cargo:rerun-if-changed={}", authored_dir.display());
    if authored_dir.is_dir() {
        for path in sorted_json_files(&authored_dir)? {
            println!("cargo:rerun-if-changed={}", path.display());
        }
    }
    println!(
        "cargo:rerun-if-changed={}",
        cosmo_pd101_dir
            .join("src/lib/synth/defaultPresets.ts")
            .display()
    );
    println!(
        "cargo:rerun-if-changed={}",
        cosmo_pd101_dir
            .join("scripts/emit-cosmo-factory-presets.ts")
            .display()
    );
    Ok(())
}

fn load_cz_presets_from_dir(dir: &Path) -> Result<Vec<CzPresetSource>, String> {
    let mut presets = Vec::new();
    for path in sorted_json_files(dir)? {
        let file_name = path
            .file_name()
            .and_then(OsStr::to_str)
            .ok_or_else(|| format!("invalid preset file name: {}", path.display()))?
            .to_string();
        let raw = fs::read_to_string(&path)
            .map_err(|error| format!("failed to read {}: {error}", path.display()))?;
        let authored_value: Value = serde_json::from_str(&raw)
            .map_err(|error| format!("failed to parse {}: {error}", path.display()))?;
        let authored: AuthoredCzPresetFile = serde_json::from_value(authored_value.clone())
            .map_err(|error| format!("failed to decode {}: {error}", path.display()))?;
        validate_tags(&authored.tags, &file_name)?;
        validate_authored_preset_data(&authored.data, &file_name)?;
        let data: SynthPresetV1 =
            serde_json::from_value(authored.data.clone()).map_err(|error| {
                format!(
                    "failed to decode preset data in {}: {error}",
                    path.display()
                )
            })?;
        let canonical = serde_json::to_value(&data).map_err(|error| {
            format!(
                "failed to canonicalize preset data in {}: {error}",
                path.display()
            )
        })?;
        assert_no_unknown_fields(&authored.data, &canonical, "data", &file_name)?;
        presets.push(CzPresetSource {
            name: authored.name,
            tags: authored.tags,
            data,
        });
    }
    if presets.is_empty() {
        return Err(format!("no preset JSON files found in {}", dir.display()));
    }
    Ok(presets)
}

fn sorted_json_files(dir: &Path) -> Result<Vec<PathBuf>, String> {
    let mut paths = fs::read_dir(dir)
        .map_err(|error| format!("failed to read preset directory {}: {error}", dir.display()))?
        .filter_map(|entry| entry.ok().map(|value| value.path()))
        .filter(|path| path.extension().and_then(OsStr::to_str) == Some("json"))
        .collect::<Vec<_>>();
    paths.sort();
    Ok(paths)
}

fn validate_tags(tags: &[String], file_name: &str) -> Result<(), String> {
    let valid = PRESET_TAG_OPTIONS.into_iter().collect::<BTreeSet<_>>();
    for tag in tags {
        if !valid.contains(tag.as_str()) {
            return Err(format!("{file_name}: invalid preset tag '{tag}'"));
        }
    }
    Ok(())
}

fn validate_authored_preset_data(data: &Value, file_name: &str) -> Result<(), String> {
    validate_all_numbers_are_finite(data, "data", file_name)?;
    validate_step_envs(data, file_name)?;
    validate_numeric_range(data, &["params", "octave"], -2.0, 2.0, true, file_name)?;
    validate_line_octaves(data, file_name)?;
    validate_relative_line2_octave(data, file_name)?;
    validate_numeric_range(
        data,
        &["params", "line1", "detuneNote"],
        -11.0,
        11.0,
        true,
        file_name,
    )?;
    validate_numeric_range(
        data,
        &["params", "line2", "detuneNote"],
        -11.0,
        11.0,
        true,
        file_name,
    )?;
    validate_numeric_range(
        data,
        &["params", "line1", "detuneFine"],
        -60.0,
        60.0,
        true,
        file_name,
    )?;
    validate_numeric_range(
        data,
        &["params", "line2", "detuneFine"],
        -60.0,
        60.0,
        true,
        file_name,
    )?;
    for path in [
        ["params", "line1", "dcwKeyFollow"],
        ["params", "line1", "dcaKeyFollow"],
        ["params", "line2", "dcwKeyFollow"],
        ["params", "line2", "dcaKeyFollow"],
    ] {
        validate_numeric_range(data, &path, 0.0, 9.0, true, file_name)?;
    }
    validate_engine_param_ranges(data, file_name)?;
    validate_algo_controls(data, file_name)?;
    validate_fx_slots(data, file_name)?;
    Ok(())
}

fn validate_all_numbers_are_finite(
    value: &Value,
    path: &str,
    file_name: &str,
) -> Result<(), String> {
    match value {
        Value::Number(number) => {
            let Some(parsed) = number.as_f64() else {
                return Err(format!("{file_name}: unsupported number at {path}"));
            };
            if !parsed.is_finite() {
                return Err(format!("{file_name}: non-finite number at {path}"));
            }
        }
        Value::Array(items) => {
            for (index, item) in items.iter().enumerate() {
                validate_all_numbers_are_finite(item, &format!("{path}[{index}]"), file_name)?;
            }
        }
        Value::Object(object) => {
            for (key, entry) in object {
                validate_all_numbers_are_finite(entry, &format!("{path}.{key}"), file_name)?;
            }
        }
        _ => {}
    }
    Ok(())
}

fn validate_step_envs(data: &Value, file_name: &str) -> Result<(), String> {
    for line in ["line1", "line2"] {
        for env in ["dcoEnv", "dcwEnv", "dcaEnv"] {
            let path = ["params", line, env];
            let env_value = get_value(data, &path)
                .ok_or_else(|| format!("{file_name}: missing {}", dot_path(&path)))?;
            let env_object = env_value
                .as_object()
                .ok_or_else(|| format!("{file_name}: {} must be an object", dot_path(&path)))?;
            let steps = env_object
                .get("steps")
                .and_then(Value::as_array)
                .ok_or_else(|| {
                    format!("{file_name}: {}.steps must be an array", dot_path(&path))
                })?;
            if steps.len() > 8 {
                return Err(format!(
                    "{file_name}: {}.steps has {} entries; max is 8",
                    dot_path(&path),
                    steps.len()
                ));
            }
            for (index, step) in steps.iter().enumerate() {
                let step_object = step.as_object().ok_or_else(|| {
                    format!(
                        "{file_name}: {}.steps[{index}] must be an object",
                        dot_path(&path)
                    )
                })?;
                validate_step_value(
                    step_object.get("level"),
                    &format!("{}.steps[{index}].level", dot_path(&path)),
                    file_name,
                )?;
                validate_step_value(
                    step_object.get("rate"),
                    &format!("{}.steps[{index}].rate", dot_path(&path)),
                    file_name,
                )?;
            }
            let step_count = env_object
                .get("stepCount")
                .and_then(as_f64)
                .ok_or_else(|| {
                    format!(
                        "{file_name}: {}.stepCount must be a number",
                        dot_path(&path)
                    )
                })?;
            validate_integer_in_range(
                step_count,
                1.0,
                8.0,
                &format!("{}.stepCount", dot_path(&path)),
                file_name,
            )?;
            let sustain_step = env_object
                .get("sustainStep")
                .and_then(as_f64)
                .ok_or_else(|| {
                    format!(
                        "{file_name}: {}.sustainStep must be a number",
                        dot_path(&path)
                    )
                })?;
            validate_integer_in_range(
                sustain_step,
                0.0,
                step_count - 1.0,
                &format!("{}.sustainStep", dot_path(&path)),
                file_name,
            )?;
        }
    }
    Ok(())
}

fn validate_step_value(value: Option<&Value>, path: &str, file_name: &str) -> Result<(), String> {
    let Some(parsed) = value.and_then(as_f64) else {
        return Err(format!("{file_name}: {path} must be a number"));
    };
    validate_integer_in_range(parsed, 0.0, 127.0, path, file_name)
}

fn validate_line_octaves(data: &Value, file_name: &str) -> Result<(), String> {
    validate_numeric_range(
        data,
        &["params", "line1", "octave"],
        -2.0,
        2.0,
        true,
        file_name,
    )?;
    Ok(())
}

fn validate_relative_line2_octave(data: &Value, file_name: &str) -> Result<(), String> {
    let line1 = get_required_number(data, &["params", "line1", "octave"], file_name)?;
    let line2 = get_required_number(data, &["params", "line2", "octave"], file_name)?;
    let relative = line2 - line1;
    validate_integer_in_range(
        relative,
        -3.0,
        3.0,
        "data.params.line2.octaveRelative",
        file_name,
    )
}

fn validate_engine_param_ranges(data: &Value, file_name: &str) -> Result<(), String> {
    let mut path_map = BTreeMap::new();
    path_map.insert("tempoBpm", vec!["params", "tempoBpm"]);
    path_map.insert("randomRate", vec!["params", "random", "rate"]);
    for range in engine_param_ranges_v1() {
        if let Some(path) = path_map.get(range.key)
            && get_value(data, path).is_some()
        {
            validate_numeric_range(
                data,
                path,
                f64::from(range.min),
                f64::from(range.max),
                false,
                file_name,
            )?;
        }
    }
    Ok(())
}

fn validate_algo_controls(data: &Value, file_name: &str) -> Result<(), String> {
    for line in ["line1", "line2"] {
        let Some(line_value) = get_value(data, &["params", line]) else {
            continue;
        };
        let algo_a = get_required_string(line_value, &["algo"], file_name)?;
        validate_algo_control_entries(
            line_value,
            &["algoControlsA"],
            algo_a,
            &format!("data.params.{line}.algoControlsA"),
            file_name,
        )?;
        if let Some(algo_b) = get_optional_string(line_value, &["algo2"])? {
            validate_algo_control_entries(
                line_value,
                &["algoControlsB"],
                algo_b,
                &format!("data.params.{line}.algoControlsB"),
                file_name,
            )?;
        } else if let Some(entries) =
            get_value(line_value, &["algoControlsB"]).and_then(Value::as_array)
            && !entries.is_empty()
        {
            return Err(format!(
                "{file_name}: data.params.{line}.algoControlsB requires a non-null algo2"
            ));
        }
    }
    Ok(())
}

fn validate_algo_control_entries(
    line_value: &Value,
    controls_path: &[&str],
    algo_id: &str,
    path_label: &str,
    file_name: &str,
) -> Result<(), String> {
    let definition = ALGO_DEFINITIONS_V1
        .iter()
        .find(|entry| {
            serde_json::to_value(entry.id)
                .ok()
                .and_then(|value| value.as_str().map(str::to_string))
                .as_deref()
                == Some(algo_id)
        })
        .ok_or_else(|| format!("{file_name}: unknown algorithm '{algo_id}' for {path_label}"))?;
    let controls = get_value(line_value, controls_path)
        .and_then(Value::as_array)
        .ok_or_else(|| format!("{file_name}: {path_label} must be an array"))?;
    for (index, control) in controls.iter().enumerate() {
        let object = control
            .as_object()
            .ok_or_else(|| format!("{file_name}: {path_label}[{index}] must be an object"))?;
        let control_id = object
            .get("id")
            .and_then(Value::as_str)
            .ok_or_else(|| format!("{file_name}: {path_label}[{index}].id must be a string"))?;
        let metadata = definition
            .controls
            .iter()
            .find(|entry| entry.id == control_id)
            .ok_or_else(|| format!("{file_name}: {path_label}[{index}] references unknown control '{control_id}' for algo '{algo_id}'"))?;
        let Some(value) = object.get("value") else {
            return Err(format!(
                "{file_name}: {path_label}[{index}].value is required"
            ));
        };
        if value.is_null() {
            continue;
        }
        let numeric = value.as_f64().ok_or_else(|| {
            format!("{file_name}: {path_label}[{index}].value must be numeric or null")
        })?;
        match metadata.kind {
            AlgoControlKindV1::Number => validate_numeric_control_value(
                numeric,
                metadata.min.map(f64::from),
                metadata.max.map(f64::from),
                &format!("{path_label}[{index}].value"),
                file_name,
            )?,
            AlgoControlKindV1::Toggle => validate_integer_in_range(
                numeric,
                0.0,
                1.0,
                &format!("{path_label}[{index}].value"),
                file_name,
            )?,
            AlgoControlKindV1::Select => {
                let max_index = metadata.options.len().saturating_sub(1) as f64;
                validate_integer_in_range(
                    numeric,
                    0.0,
                    max_index,
                    &format!("{path_label}[{index}].value"),
                    file_name,
                )?;
            }
        }
    }
    Ok(())
}

fn validate_numeric_control_value(
    value: f64,
    min: Option<f64>,
    max: Option<f64>,
    path: &str,
    file_name: &str,
) -> Result<(), String> {
    if let Some(minimum) = min
        && value < minimum
    {
        return Err(format!(
            "{file_name}: {path}={value} is below min {minimum}"
        ));
    }
    if let Some(maximum) = max
        && value > maximum
    {
        return Err(format!(
            "{file_name}: {path}={value} is above max {maximum}"
        ));
    }
    Ok(())
}

fn validate_fx_slots(data: &Value, file_name: &str) -> Result<(), String> {
    let slots = get_value(data, &["params", "fxSlots"])
        .and_then(Value::as_array)
        .ok_or_else(|| format!("{file_name}: data.params.fxSlots must be an array"))?;
    if slots.len() > 6 {
        return Err(format!(
            "{file_name}: data.params.fxSlots has {} entries; max is 6",
            slots.len()
        ));
    }
    for (index, slot) in slots.iter().enumerate() {
        let object = slot.as_object().ok_or_else(|| {
            format!("{file_name}: data.params.fxSlots[{index}] must be an object")
        })?;
        let slot_type = object.get("type").and_then(Value::as_str).ok_or_else(|| {
            format!("{file_name}: data.params.fxSlots[{index}].type must be a string")
        })?;
        if slot_type == "empty" {
            continue;
        }
        let Some(definition) = FX_DEFINITIONS_V1.iter().find(|entry| {
            serde_json::to_value(entry.slot_type)
                .ok()
                .and_then(|value| value.as_str().map(str::to_string))
                .as_deref()
                == Some(slot_type)
        }) else {
            return Err(format!(
                "{file_name}: data.params.fxSlots[{index}] has unknown type '{slot_type}'"
            ));
        };
        let path_label = format!("data.params.fxSlots[{index}]");
        let params = object
            .get("params")
            .and_then(Value::as_object)
            .ok_or_else(|| format!("{file_name}: {path_label}.params must be an object"))?;
        let effect_enabled = params
            .get("enabled")
            .and_then(Value::as_bool)
            .unwrap_or(true);
        if !effect_enabled {
            continue;
        }
        for control in definition.controls {
            let Some(raw_value) = params.get(control.id) else {
                continue;
            };
            match control.kind {
                FxControlKindV1::Knob => {
                    let numeric = raw_value.as_f64().ok_or_else(|| {
                        format!(
                            "{file_name}: {path_label}.params.{} must be numeric",
                            control.id
                        )
                    })?;
                    validate_numeric_control_value(
                        numeric,
                        control.min.map(f64::from),
                        control.max.map(f64::from),
                        &format!("{path_label}.params.{}", control.id),
                        file_name,
                    )?;
                }
                FxControlKindV1::ButtonGroup => {
                    let numeric = raw_value.as_f64().ok_or_else(|| {
                        format!(
                            "{file_name}: {path_label}.params.{} must be numeric",
                            control.id
                        )
                    })?;
                    let valid_values = control
                        .options
                        .iter()
                        .map(|entry| f64::from(entry.value))
                        .collect::<Vec<_>>();
                    if !is_integer_like(numeric)
                        || !valid_values
                            .iter()
                            .any(|value| (*value - numeric).abs() < f64::EPSILON)
                    {
                        return Err(format!(
                            "{file_name}: {path_label}.params.{}={numeric} is not one of the allowed option values",
                            control.id
                        ));
                    }
                }
                FxControlKindV1::Toggle => {
                    if !raw_value.is_boolean() {
                        return Err(format!(
                            "{file_name}: {path_label}.params.{} must be a boolean",
                            control.id
                        ));
                    }
                }
            }
        }
    }
    Ok(())
}

fn validate_numeric_range(
    data: &Value,
    path: &[&str],
    min: f64,
    max: f64,
    integer_like: bool,
    file_name: &str,
) -> Result<(), String> {
    let value = get_required_number(data, path, file_name)?;
    if integer_like {
        validate_integer_in_range(value, min, max, &dot_path(path), file_name)
    } else {
        if value < min || value > max {
            return Err(format!(
                "{file_name}: {}={value} is outside [{min}, {max}]",
                dot_path(path)
            ));
        }
        Ok(())
    }
}

fn get_required_number(data: &Value, path: &[&str], file_name: &str) -> Result<f64, String> {
    get_value(data, path)
        .and_then(as_f64)
        .ok_or_else(|| format!("{file_name}: {} must be a number", dot_path(path)))
}

fn get_required_string<'a>(
    data: &'a Value,
    path: &[&str],
    file_name: &str,
) -> Result<&'a str, String> {
    get_value(data, path)
        .and_then(Value::as_str)
        .ok_or_else(|| format!("{file_name}: {} must be a string", dot_path(path)))
}

fn get_optional_string<'a>(data: &'a Value, path: &[&str]) -> Result<Option<&'a str>, String> {
    let Some(value) = get_value(data, path) else {
        return Ok(None);
    };
    if value.is_null() {
        return Ok(None);
    }
    value
        .as_str()
        .map(Some)
        .ok_or_else(|| format!("{} must be a string or null", dot_path(path)))
}

fn get_value<'a>(value: &'a Value, path: &[&str]) -> Option<&'a Value> {
    let mut current = value;
    for segment in path {
        current = current.as_object()?.get(*segment)?;
    }
    Some(current)
}

fn as_f64(value: &Value) -> Option<f64> {
    value.as_f64()
}

fn dot_path(path: &[&str]) -> String {
    path.join(".")
}

fn validate_integer_in_range(
    value: f64,
    min: f64,
    max: f64,
    path: &str,
    file_name: &str,
) -> Result<(), String> {
    if !is_integer_like(value) {
        return Err(format!("{file_name}: {path}={value} must be integer-like"));
    }
    if value < min || value > max {
        return Err(format!(
            "{file_name}: {path}={value} is outside [{min}, {max}]"
        ));
    }
    Ok(())
}

fn is_integer_like(value: f64) -> bool {
    (value.round() - value).abs() < 1e-9
}

fn assert_no_unknown_fields(
    raw: &Value,
    canonical: &Value,
    path: &str,
    file_name: &str,
) -> Result<(), String> {
    match (raw, canonical) {
        (Value::Object(raw_map), Value::Object(canonical_map)) => {
            for (key, raw_value) in raw_map {
                let Some(canonical_value) = canonical_map.get(key) else {
                    return Err(format!("{file_name}: unknown field {path}.{key}"));
                };
                assert_no_unknown_fields(
                    raw_value,
                    canonical_value,
                    &format!("{path}.{key}"),
                    file_name,
                )?;
            }
        }
        (Value::Array(raw_items), Value::Array(canonical_items)) => {
            if raw_items.len() > canonical_items.len() {
                return Err(format!(
                    "{file_name}: {path} has {} entries; canonical schema allows {}",
                    raw_items.len(),
                    canonical_items.len()
                ));
            }
            for (index, raw_item) in raw_items.iter().enumerate() {
                if let Some(canonical_item) = canonical_items.get(index) {
                    assert_no_unknown_fields(
                        raw_item,
                        canonical_item,
                        &format!("{path}[{index}]"),
                        file_name,
                    )?;
                }
            }
        }
        _ => {}
    }
    Ok(())
}

fn load_cosmo_factory_entries(cosmo_pd101_dir: &Path) -> Result<Vec<FactoryPresetEntry>, String> {
    let script_path = cosmo_pd101_dir.join("scripts/emit-cosmo-factory-presets.ts");
    let output = Command::new("bun")
        .arg(&script_path)
        .current_dir(cosmo_pd101_dir)
        .output()
        .map_err(|error| {
            format!(
                "failed to execute {} with bun: {error}",
                script_path.display()
            )
        })?;
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "failed to generate cosmo factory entries from {}: {}",
            script_path.display(),
            stderr.trim()
        ));
    }
    serde_json::from_slice::<Vec<FactoryPresetEntry>>(&output.stdout)
        .map_err(|error| format!("failed to parse Bun-generated cosmo factory entries: {error}"))
}

fn format_generated_outputs(cosmo_pd101_dir: &Path) -> Result<(), String> {
    let synth_dir = cosmo_pd101_dir.join("src/lib/synth");
    let output = Command::new("bunx")
        .current_dir(cosmo_pd101_dir)
        .arg("biome")
        .arg("format")
        .arg("--write")
        .arg(synth_dir.join("factoryCzPresets.ts"))
        .arg(synth_dir.join("factory_presets.json"))
        .output()
        .map_err(|error| format!("failed to run biome on generated factory presets: {error}"))?;
    if !output.status.success() {
        return Err(format!(
            "biome format failed for generated factory presets: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        ));
    }
    Ok(())
}

fn render_factory_cz_presets_ts(presets: &[CzPresetSource]) -> Result<String, String> {
    let entries = presets.iter().map(build_library_preset).collect::<Vec<_>>();
    let json = to_pretty_json_string(&entries)
        .map(|value| json_to_ts_object_literal(&value))
        .map(|value| add_trailing_commas(&value))
        .map_err(|error| {
            format!("failed to serialize generated FACTORY_CZ_PRESETS TS data: {error}")
        })?;
    Ok(format!(
        "import type {{ LibraryPreset }} from \"@/features/synth/types/libraryPreset\";\n\n// Generated by generate-factory-presets. Do not edit manually.\nexport const FACTORY_CZ_PRESETS: LibraryPreset[] = {json};\n"
    ))
}

fn build_library_preset(preset: &CzPresetSource) -> LibraryPresetOutput {
    LibraryPresetOutput {
        id: create_preset_id(
            &preset.name,
            "cz-factory",
            "Temple of CZ",
            false,
            &preset.tags,
            &preset.data,
        )
        .expect("preset id generation should not fail for validated data"),
        name: preset.name.clone(),
        source: "cz-factory".to_string(),
        author: "Temple of CZ".to_string(),
        starred: false,
        data: preset.data.clone(),
        tags: preset.tags.clone(),
    }
}

fn build_factory_entry(preset: &CzPresetSource) -> FactoryPresetEntry {
    FactoryPresetEntry {
        id: create_preset_id(
            &preset.name,
            "cz-factory",
            "Temple of CZ",
            false,
            &preset.tags,
            &preset.data,
        )
        .expect("preset id generation should not fail for validated data"),
        name: preset.name.clone(),
        source: "cz-factory".to_string(),
        author: "Temple of CZ".to_string(),
        starred: false,
        tags: preset.tags.clone(),
        macro_labels: DEFAULT_MACRO_LABELS
            .iter()
            .map(|label| (*label).to_string())
            .collect(),
        factory_version: 1,
        data: preset.data.clone(),
    }
}

fn create_preset_id(
    name: &str,
    source: &str,
    author: &str,
    starred: bool,
    tags: &[String],
    data: &SynthPresetV1,
) -> Result<String, String> {
    let canonical = normalize_canonical_value(serde_json::json!({
        "name": name,
        "source": source,
        "author": author,
        "starred": starred,
        "tags": tags,
        "data": data,
    }));
    let serialized = serde_json::to_string(&canonical)
        .map_err(|error| format!("failed to serialize canonical preset identity: {error}"))?;
    Ok(format!("preset_{:016x}", fnv1a64(&serialized)))
}

fn normalize_canonical_value(value: Value) -> Value {
    match value {
        Value::Array(entries) => {
            Value::Array(entries.into_iter().map(normalize_canonical_value).collect())
        }
        Value::Object(object) => {
            let mut normalized = Map::new();
            let mut keys = object
                .into_iter()
                .filter(|(key, _)| key != "id")
                .collect::<Vec<_>>();
            keys.sort_by(|(left, _), (right, _)| left.cmp(right));
            for (key, entry) in keys {
                normalized.insert(key, normalize_canonical_value(entry));
            }
            Value::Object(normalized)
        }
        Value::Number(number) => {
            let value = number.as_f64().unwrap_or_default();
            if value == 0.0 {
                Value::from(0)
            } else {
                Value::Number(number)
            }
        }
        Value::Null | Value::Bool(_) | Value::String(_) => value,
    }
}

fn fnv1a64(input: &str) -> u64 {
    let mut hash = 0xcbf29ce484222325u64;
    for byte in input.as_bytes() {
        hash ^= u64::from(*byte);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    hash
}

fn to_pretty_json_string<T: Serialize>(value: &T) -> Result<String, serde_json::Error> {
    let mut bytes = Vec::new();
    let formatter = serde_json::ser::PrettyFormatter::with_indent(b"\t");
    let mut serializer = serde_json::Serializer::with_formatter(&mut bytes, formatter);
    value.serialize(&mut serializer)?;
    String::from_utf8(bytes).map_err(|error| {
        serde_json::Error::io(std::io::Error::new(std::io::ErrorKind::InvalidData, error))
    })
}

fn json_to_ts_object_literal(json: &str) -> String {
    json.lines()
        .map(|line| {
            let trimmed = line.trim_start();
            let indent_len = line.len() - trimmed.len();
            if let Some(remainder) = trimmed.strip_prefix('"')
                && let Some((key, tail)) = remainder.split_once("\":")
                && key
                    .chars()
                    .next()
                    .is_some_and(|first| first == '_' || first.is_ascii_alphabetic())
                && key
                    .chars()
                    .all(|ch| ch == '_' || ch.is_ascii_alphanumeric())
            {
                return format!("{}{}:{}", &line[..indent_len], key, tail);
            }
            line.to_string()
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn add_trailing_commas(value: &str) -> String {
    let lines = value.lines().collect::<Vec<_>>();
    lines
        .iter()
        .enumerate()
        .map(|(index, line)| {
            let trimmed = line.trim();
            let next_trimmed = lines
                .iter()
                .skip(index + 1)
                .map(|entry| entry.trim())
                .find(|entry| !entry.is_empty())
                .unwrap_or("");
            if !trimmed.is_empty()
                && !trimmed.ends_with([',', '{', '[', ';'])
                && !trimmed.starts_with("//")
                && (next_trimmed.starts_with('}') || next_trimmed.starts_with(']'))
            {
                format!("{line},")
            } else {
                (*line).to_string()
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn write_atomic(path: &Path, contents: &str) -> Result<(), String> {
    let parent = path
        .parent()
        .ok_or_else(|| format!("output path has no parent: {}", path.display()))?;
    fs::create_dir_all(parent)
        .map_err(|error| format!("failed to create {}: {error}", parent.display()))?;
    let temp_path = path.with_extension(format!(
        "{}.tmp",
        path.extension().and_then(OsStr::to_str).unwrap_or("tmp")
    ));
    fs::write(&temp_path, contents)
        .map_err(|error| format!("failed to write {}: {error}", temp_path.display()))?;
    fs::rename(&temp_path, path)
        .map_err(|error| format!("failed to replace {}: {error}", path.display()))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn temp_dir(label: &str) -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("time should be monotonic")
            .as_nanos();
        let dir = std::env::temp_dir().join(format!("factory-preset-codegen-{label}-{nonce}"));
        fs::create_dir_all(&dir).expect("temp dir should be creatable");
        dir
    }

    fn default_preset_value() -> Value {
        let fixture: Value = serde_json::from_str(include_str!(
            "../../cosmo-pd101/src/lib/synth/factory-cz-presets/001-2l-pluck-brss.json"
        ))
        .expect("fixture preset should parse");
        fixture
            .get("data")
            .cloned()
            .expect("fixture preset should contain data")
    }

    fn write_preset(dir: &Path, file_name: &str, data: Value) {
        let wrapper = serde_json::json!({
            "name": "Test Preset",
            "tags": ["pad"],
            "data": data,
        });
        fs::write(
            dir.join(file_name),
            to_pretty_json_string(&wrapper).unwrap(),
        )
        .unwrap();
    }

    #[test]
    fn loads_valid_single_preset_and_renders_outputs() {
        let dir = temp_dir("valid");
        write_preset(&dir, "001-test.json", default_preset_value());
        let presets = load_cz_presets_from_dir(&dir).expect("valid preset should load");
        assert_eq!(presets.len(), 1);
        assert_eq!(presets[0].name, "Test Preset");
        let ts = render_factory_cz_presets_ts(&presets).expect("ts should render");
        assert!(ts.contains("FACTORY_CZ_PRESETS"));
        let aggregate = to_pretty_json_string(&vec![build_factory_entry(&presets[0])]).unwrap();
        assert!(aggregate.contains("Temple of CZ"));
    }

    #[test]
    fn rejects_envelope_value_above_range() {
        let dir = temp_dir("bad-env");
        let mut data = default_preset_value();
        data["params"]["line1"]["dcoEnv"]["steps"][0]["level"] = Value::from(222);
        write_preset(&dir, "001-test.json", data);
        let error = load_cz_presets_from_dir(&dir).unwrap_err();
        assert!(error.contains("level"));
    }

    #[test]
    fn rejects_invalid_step_count_and_sustain_step() {
        let dir = temp_dir("bad-steps");
        let mut data = default_preset_value();
        data["params"]["line1"]["dcoEnv"]["stepCount"] = Value::from(9);
        data["params"]["line1"]["dcoEnv"]["sustainStep"] = Value::from(9);
        write_preset(&dir, "001-test.json", data);
        let error = load_cz_presets_from_dir(&dir).unwrap_err();
        assert!(error.contains("stepCount") || error.contains("sustainStep"));
    }

    #[test]
    fn rejects_invalid_enum_string() {
        let dir = temp_dir("bad-enum");
        let mut data = default_preset_value();
        data["params"]["lineSelect"] = Value::from("nope");
        write_preset(&dir, "001-test.json", data);
        let error = load_cz_presets_from_dir(&dir).unwrap_err();
        assert!(error.contains("unknown variant") || error.contains("expected"));
    }

    #[test]
    fn rejects_invalid_algo_control() {
        let dir = temp_dir("bad-algo");
        let mut data = default_preset_value();
        data["params"]["line1"]["algoControlsA"] = serde_json::json!([
            { "id": "waveform1", "value": 99 }
        ]);
        write_preset(&dir, "001-test.json", data);
        let error = load_cz_presets_from_dir(&dir).unwrap_err();
        assert!(error.contains("algoControlsA"));
    }

    #[test]
    fn rejects_invalid_fx_payload() {
        let dir = temp_dir("bad-fx");
        let mut data = default_preset_value();
        data["params"]["fxSlots"][3] = serde_json::json!({
            "type": "vibrato",
            "params": {
                "enabled": true,
                "waveform": 999,
                "rate": 55.0,
                "depth": 8.0,
                "delay": 120.0
            }
        });
        write_preset(&dir, "001-test.json", data);
        let error = load_cz_presets_from_dir(&dir).unwrap_err();
        assert!(error.contains("fxSlots[3]"));
    }

    #[test]
    fn rejects_unknown_field() {
        let dir = temp_dir("unknown-field");
        let mut data = default_preset_value();
        data["params"]["line1"]["mystery"] = Value::from(1);
        write_preset(&dir, "001-test.json", data);
        let error = load_cz_presets_from_dir(&dir).unwrap_err();
        assert!(error.contains("unknown field"));
    }
}
