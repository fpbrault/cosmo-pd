use super::*;

pub(super) fn handle(
    context: &IpcContext,
    method: &str,
    args: &[serde_json::Value],
) -> Result<serde_json::Value, String> {
    let synth_params = &context.shared_state.synth.synth_params;
    let rt_synth_params = &context.shared_state.synth.rt_synth_params;
    let synth_params_version = &context.shared_state.synth.synth_params_version;
    let params = context.params.as_ref();
    let preset_session = &context.shared_state.presets.session;
    let preset_library = &context.shared_state.presets.library;
    match method {
        "setPresetName" => {
            let name = args
                .first()
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetName expects a string argument".to_string())?;
            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = name.to_string();
            }
            Ok(serde_json::Value::Null)
        }
        "getPresetName" => {
            let name = preset_session
                .lock()
                .map(|session| session.active_preset_name_base.clone())
                .unwrap_or_default();
            Ok(serde_json::Value::String(name))
        }
        "getPresetSession" => {
            let session = preset_session
                .lock()
                .map(|session| session.clone())
                .map_err(|e| e.to_string())?;
            serde_json::to_value(session).map_err(|e| e.to_string())
        }
        "setPresetSession" => {
            let payload = args
                .first()
                .ok_or_else(|| "setPresetSession expects an object payload".to_string())?;
            let session: crate::session_state::PresetSession =
                serde_json::from_value(payload.clone())
                    .map_err(|e| format!("invalid PresetSession: {e}"))?;
            if let Ok(mut stored) = preset_session.lock() {
                *stored = session;
            }
            Ok(serde_json::Value::Null)
        }
        "getPresetLibrary" => {
            let source_filter = args
                .first()
                .and_then(serde_json::Value::as_object)
                .and_then(|o| o.get("source"))
                .and_then(serde_json::Value::as_str);
            let lib = preset_library.lock().map_err(|e| e.to_string())?;
            let status = lib
                .initialization_error()
                .map(|message| {
                    serde_json::json!({
                        "state": "degraded",
                        "message": message,
                    })
                })
                .unwrap_or_else(|| serde_json::json!({ "state": "ready" }));
            let entries: Vec<serde_json::Value> = lib
                .list_records(source_filter)
                .map_err(|e| e.to_string())?
                .iter()
                .map(|e| {
                    serde_json::json!({
                        "id": e.entry.id,
                        "name": e.entry.name,
                        "source": e.entry.source,
                        "author": e.entry.author,
                        "description": e.entry.description,
                        "starred": e.entry.starred,
                        "sortIndex": e.entry.sort_index,
                        "bankId": e.entry.bank_id,
                        "bankName": e.entry.bank_name,
                        "favorite": e.favorite,
                        "tags": e.entry.tags,
                    })
                })
                .collect();
            Ok(serde_json::json!({ "entries": entries, "status": status }))
        }
        "retryPresetLibrary" => {
            let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
            lib.retry()?;
            Ok(serde_json::json!({ "status": { "state": "ready" } }))
        }
        "repairPresetLibrary" => {
            let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
            let backup_path = lib.repair()?;
            Ok(serde_json::json!({
                "status": { "state": "ready" },
                "backupPath": backup_path,
            }))
        }
        "rebuildPresetLibrary" => {
            let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
            let backup_path = lib.rebuild()?;
            Ok(serde_json::json!({
                "status": { "state": "ready" },
                "backupPath": backup_path,
            }))
        }
        "loadPresetData" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "loadPresetData expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "loadPresetData payload missing id".to_string())?;

            let (entry_data, preset_name_val, entry_macro_labels): (
                serde_json::Value,
                String,
                Option<[String; 4]>,
            ) = {
                let lib = preset_library.lock().map_err(|e| e.to_string())?;
                let entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                let data = entry.data.clone();
                let name = entry.name;
                let labels = Some(entry.macro_labels);
                (data, name, labels)
            };

            let mut new_sp: SynthParams = if let Some(params_value) = entry_data.get("params") {
                serde_json::from_value(params_value.clone())
                    .map_err(|e| format!("Failed to deserialize preset: {e}"))?
            } else {
                serde_json::from_value(entry_data)
                    .map_err(|e| format!("Failed to deserialize preset: {e}"))?
            };

            // Override macro_labels with the entry's stored labels (handles
            // presets saved before macro_labels was added to SynthParams).
            if let Some(labels) = entry_macro_labels {
                new_sp.macro_labels = labels;
            }

            sync_all_daw_params_from_synth(params, &new_sp);
            let rt_params = build_rt_synth_params(&new_sp);
            synth_params.store(Arc::new(new_sp));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);

            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = preset_name_val.clone();
                stored.loaded_preset_id = Some(id.to_string());
                stored.is_dirty = false;
            }

            Ok(serde_json::json!({ "preset_name": preset_name_val }))
        }
        "addPreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "addPreset expects an object payload as first argument".to_string()
                })?;
            let name = payload
                .get("name")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "addPreset payload missing name".to_string())?
                .to_string();
            let tags: Vec<String> = payload
                .get("tags")
                .and_then(|v| v.as_array())
                .map(|a| {
                    a.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect()
                })
                .unwrap_or_default();
            let description = payload
                .get("description")
                .and_then(serde_json::Value::as_str)
                .unwrap_or_default()
                .trim()
                .to_string();
            let macro_labels: [String; 4] = payload
                .get("macroLabels")
                .and_then(|v| serde_json::from_value(v.clone()).ok())
                .unwrap_or_else(|| SynthParams::default().macro_labels);

            let params_val = synth_params.load();
            let data = serde_json::to_value(&**params_val).map_err(|e| e.to_string())?;

            let id = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let entry = lib
                    .add_entry(name, description, tags, macro_labels, data)
                    .map_err(|e| e.to_string())?;
                entry.id.clone()
            };

            Ok(serde_json::json!({ "id": id }))
        }
        "savePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "savePreset expects an object payload as first argument".to_string()
                })?;
            let name = payload
                .get("name")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "savePreset payload missing name".to_string())?
                .to_string();
            let author = payload
                .get("author")
                .and_then(serde_json::Value::as_str)
                .unwrap_or_default()
                .to_string();
            let description = payload
                .get("description")
                .and_then(serde_json::Value::as_str)
                .map(|value| value.trim().to_string());
            let tags: Vec<String> = payload
                .get("tags")
                .and_then(|v| v.as_array())
                .map(|a| {
                    a.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect()
                })
                .unwrap_or_default();
            let macro_labels: [String; 4] = payload
                .get("macroLabels")
                .and_then(|v| serde_json::from_value(v.clone()).ok())
                .unwrap_or_else(|| SynthParams::default().macro_labels);
            let payload_id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .filter(|value| !value.is_empty())
                .map(|value| value.to_string());

            let data = if let Some(data_value) = payload.get("data") {
                data_value.clone()
            } else {
                let params_val = synth_params.load();
                serde_json::to_value(&**params_val).map_err(|e| e.to_string())?
            };

            let saved_entry = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = if let Some(id) = payload_id.clone() {
                    lib.get_entry(&id)
                        .map_err(|e| e.to_string())?
                        .ok_or_else(|| "Preset not found".to_string())?
                } else {
                    crate::preset_library::PresetLibraryEntry {
                        id: Uuid::new_v4().to_string(),
                        name: String::new(),
                        source: "user".to_string(),
                        author: String::new(),
                        description: String::new(),
                        starred: false,
                        sort_index: u32::MAX,
                        bank_id: None,
                        bank_name: None,
                        tags: vec![],
                        macro_labels: SynthParams::default().macro_labels,
                        factory_version: 0,
                        data: serde_json::Value::Null,
                    }
                };

                entry.name = name.clone();
                entry.source = "user".to_string();
                entry.bank_id = None;
                entry.bank_name = None;
                entry.author = if author.trim().is_empty() {
                    DEFAULT_USER_PRESET_AUTHOR.to_string()
                } else {
                    author
                };
                if let Some(description) = description {
                    entry.description = description;
                }
                entry.tags = tags;
                entry.macro_labels = macro_labels;
                entry.data = data;

                lib.save_entry(entry).map_err(|e| e.to_string())?
            };

            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = saved_entry.name.clone();
                stored.loaded_preset_id = Some(saved_entry.id.clone());
                stored.is_dirty = false;
            }

            Ok(serde_json::json!({
                "id": saved_entry.id,
                "name": saved_entry.name,
            }))
        }
        "deletePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "deletePreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "deletePreset payload missing id".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.delete_entry(id).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "renamePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "renamePreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "renamePreset payload missing id".to_string())?;
            let new_name = payload
                .get("newName")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "renamePreset payload missing newName".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.rename_entry(id, new_name).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "toggleStarred" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "toggleStarred expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "toggleStarred payload missing id".to_string())?;
            let starred = payload
                .get("starred")
                .and_then(serde_json::Value::as_bool)
                .ok_or_else(|| "toggleStarred payload missing starred".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                // Keep the legacy RPC name, but persist user favorites separately
                // from authored factory star metadata.
                let _ = lib.set_starred(id, starred).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "setPresetAuthor" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "setPresetAuthor expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetAuthor payload missing id".to_string())?;
            let author = payload
                .get("author")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetAuthor payload missing author".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.author = author.to_string();
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "setPresetDescription" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "setPresetDescription expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetDescription payload missing id".to_string())?;
            let description = payload
                .get("description")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetDescription payload missing description".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.description = description.trim().to_string();
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "setPresetTags" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "setPresetTags expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetTags payload missing id".to_string())?;
            let tags: Vec<String> = payload
                .get("tags")
                .and_then(|v| v.as_array())
                .map(|a| {
                    a.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect()
                })
                .unwrap_or_default();

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.tags = tags;
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "importPresetBank" => {
            let payload = args
                .first()
                .ok_or_else(|| "importPresetBank expects an object payload".to_string())?;
            let bundle: crate::preset_library::PresetBankBundle =
                serde_json::from_value(payload.clone())
                    .map_err(|e| format!("invalid preset bank bundle: {e}"))?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.import_bank(bundle).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "listFxModulePresets" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "listFxModulePresets expects an object payload as first argument".to_string()
                })?;
            let module_type = payload
                .get("moduleType")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "listFxModulePresets payload missing moduleType".to_string())?;

            let lib = preset_library.lock().map_err(|e| e.to_string())?;
            serde_json::to_value(
                lib.list_fx_module_presets(module_type)
                    .map_err(|e| e.to_string())?,
            )
            .map_err(|e| e.to_string())
        }
        "saveFxModulePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "saveFxModulePreset expects an object payload as first argument".to_string()
                })?;
            let name = payload
                .get("name")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "saveFxModulePreset payload missing name".to_string())?
                .to_string();
            let module_type = payload
                .get("moduleType")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "saveFxModulePreset payload missing moduleType".to_string())?
                .to_string();
            let patch = payload
                .get("patch")
                .cloned()
                .ok_or_else(|| "saveFxModulePreset payload missing patch".to_string())?;

            let saved = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.save_fx_module_preset(name, module_type, patch)
                    .map_err(|e| e.to_string())?
            };

            serde_json::to_value(saved).map_err(|e| e.to_string())
        }
        "deleteFxModulePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "deleteFxModulePreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "deleteFxModulePreset payload missing id".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.delete_fx_module_preset(id).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "exportPreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "exportPreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "exportPreset payload missing id".to_string())?;

            let entry = {
                let lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?
            };

            let json = serde_json::to_string_pretty(&serde_json::json!({
                "id": entry.id,
                "name": entry.name,
                "source": entry.source,
                "bankId": entry.bank_id,
                "bankName": entry.bank_name,
                "author": entry.author,
                "description": entry.description,
                "starred": entry.starred,
                "tags": entry.tags,
                "data": entry.data,
            }))
            .map_err(|e| e.to_string())?;

            Ok(serde_json::json!({
                "filename": format!("{}.json", entry.name),
                "json": json,
            }))
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
