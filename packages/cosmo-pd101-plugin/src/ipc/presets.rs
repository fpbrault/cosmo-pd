use super::*;
use cosmo_pd101_bridge_types::{
    AddPresetResponse, ExportPresetResponse, LoadPresetResponse, PresetLibraryActionResponse,
    PresetLibraryResponse, PresetLibraryStatus, PresetLibrarySummaryEntry, SavePresetResponse,
};

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    let synth_params = &context.shared_state.synth.synth_params;
    let rt_synth_params = &context.shared_state.synth.rt_synth_params;
    let synth_params_version = &context.shared_state.synth.synth_params_version;
    let params = context.params.as_ref();
    let preset_session = &context.shared_state.presets.session;
    let preset_library = &context.shared_state.presets.library;
    match req {
        PluginIpcRequest::SetPresetName(name) => {
            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = name.clone();
            }
            publish_state_snapshot(context.shared_state.as_ref());
            Ok(PluginIpcResponse::SetPresetName)
        }
        PluginIpcRequest::GetPresetName => {
            let name = preset_session
                .lock()
                .map(|session| session.active_preset_name_base.clone())
                .unwrap_or_default();
            Ok(PluginIpcResponse::GetPresetName(name))
        }
        PluginIpcRequest::GetPresetSession => {
            let session = preset_session
                .lock()
                .map(|session| session.clone())
                .map_err(|e| e.to_string())?;
            Ok(PluginIpcResponse::GetPresetSession(session))
        }
        PluginIpcRequest::SetPresetSession(session) => {
            if let Ok(mut stored) = preset_session.lock() {
                *stored = session.clone();
            }
            publish_state_snapshot(context.shared_state.as_ref());
            Ok(PluginIpcResponse::SetPresetSession)
        }
        PluginIpcRequest::GetPresetLibrary { source } => {
            let lib = preset_library.lock().map_err(|e| e.to_string())?;
            let status = lib
                .initialization_error()
                .map(|message| PresetLibraryStatus {
                    state: "degraded".to_string(),
                    message: Some(message.to_string()),
                })
                .unwrap_or_else(|| PresetLibraryStatus {
                    state: "ready".to_string(),
                    message: None,
                });
            let entries: Vec<PresetLibrarySummaryEntry> = lib
                .list_records(source.as_deref())
                .map_err(|e| e.to_string())?
                .iter()
                .map(|record| PresetLibrarySummaryEntry {
                    id: record.entry.id.clone(),
                    name: record.entry.name.clone(),
                    source: record.entry.source.clone(),
                    author: record.entry.author.clone(),
                    description: record.entry.description.clone(),
                    starred: record.entry.starred,
                    sort_index: record.entry.sort_index,
                    bank_id: record.entry.bank_id.clone(),
                    bank_name: record.entry.bank_name.clone(),
                    favorite: record.favorite,
                    tags: record.entry.tags.clone(),
                })
                .collect();
            Ok(PluginIpcResponse::GetPresetLibrary(PresetLibraryResponse {
                entries,
                status,
            }))
        }
        PluginIpcRequest::RetryPresetLibrary => {
            let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
            lib.retry()?;
            Ok(PluginIpcResponse::RetryPresetLibrary(
                PresetLibraryActionResponse {
                    status: PresetLibraryStatus {
                        state: "ready".to_string(),
                        message: None,
                    },
                    backup_path: None,
                },
            ))
        }
        PluginIpcRequest::RepairPresetLibrary => {
            let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
            let backup_path = lib.repair()?;
            Ok(PluginIpcResponse::RepairPresetLibrary(
                PresetLibraryActionResponse {
                    status: PresetLibraryStatus {
                        state: "ready".to_string(),
                        message: None,
                    },
                    backup_path: Some(backup_path.display().to_string()),
                },
            ))
        }
        PluginIpcRequest::RebuildPresetLibrary => {
            let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
            let backup_path = lib.rebuild()?;
            Ok(PluginIpcResponse::RebuildPresetLibrary(
                PresetLibraryActionResponse {
                    status: PresetLibraryStatus {
                        state: "ready".to_string(),
                        message: None,
                    },
                    backup_path: Some(backup_path.display().to_string()),
                },
            ))
        }
        PluginIpcRequest::LoadPreset(payload) => {
            let (entry_data, preset_name_val, entry_macro_labels): (
                serde_json::Value,
                String,
                Option<[String; 4]>,
            ) = {
                let lib = preset_library.lock().map_err(|e| e.to_string())?;
                let entry = lib
                    .get_entry(&payload.preset_id)
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

            if let Some(labels) = entry_macro_labels {
                new_sp.macro_labels = labels;
            }

            sync_all_daw_params_from_synth(params, &new_sp);
            let rt_params = build_rt_synth_params(&new_sp);

            // Signal the audio thread to reset state during the sync pass that observes
            // this new preset snapshot. sync_runtime_params_from_host() consumes this
            // before calling processor.set_shared_params(...).
            context
                .shared_state
                .preset_reset_pending
                .store(true, Ordering::Release);

            synth_params.store(Arc::new(new_sp));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);

            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = preset_name_val.clone();
                stored.loaded_preset_id = Some(payload.preset_id.clone());
                stored.is_dirty = false;
            }
            publish_state_snapshot(context.shared_state.as_ref());

            Ok(PluginIpcResponse::LoadPreset(LoadPresetResponse {
                preset_name: preset_name_val,
            }))
        }
        PluginIpcRequest::AddPreset(payload) => {
            let name = payload.name.clone();
            let tags = payload.tags.clone();
            let description = payload.description.trim().to_string();
            let macro_labels: [String; 4] = payload
                .macro_labels
                .as_ref()
                .and_then(|v| serde_json::from_value(serde_json::to_value(v).ok()?).ok())
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

            Ok(PluginIpcResponse::AddPreset(AddPresetResponse { id }))
        }
        PluginIpcRequest::SavePreset(payload) => {
            let name = payload.name.clone();
            let author = payload.author.clone();
            let description = if payload.description.is_empty() {
                None
            } else {
                Some(payload.description.trim().to_string())
            };
            let tags = payload.tags.clone();
            let macro_labels: [String; 4] = payload
                .macro_labels
                .as_ref()
                .and_then(|v| serde_json::from_value(serde_json::to_value(v).ok()?).ok())
                .unwrap_or_else(|| SynthParams::default().macro_labels);
            let payload_id = payload
                .id
                .as_deref()
                .filter(|value| !value.is_empty())
                .map(|value| value.to_string());

            let data = if let Some(data_value) = &payload.data {
                data_value.clone()
            } else {
                let params_val = synth_params.load();
                serde_json::to_value(&**params_val).map_err(|e| e.to_string())?
            };

            let saved_entry = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = if let Some(id) = payload_id.as_deref() {
                    lib.get_entry(id)
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
            publish_state_snapshot(context.shared_state.as_ref());

            Ok(PluginIpcResponse::SavePreset(SavePresetResponse {
                id: saved_entry.id,
                name: saved_entry.name,
            }))
        }
        PluginIpcRequest::DeletePreset { id } => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.delete_entry(id).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::DeletePreset)
        }
        PluginIpcRequest::RenamePreset { id, new_name } => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.rename_entry(id, new_name).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::RenamePreset)
        }
        PluginIpcRequest::ToggleStarred { id, starred } => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.set_starred(id, *starred).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::ToggleStarred)
        }
        PluginIpcRequest::SetPresetAuthor { id, author } => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.author = author.clone();
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::SetPresetAuthor)
        }
        PluginIpcRequest::SetPresetDescription { id, description } => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.description = description.trim().to_string();
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::SetPresetDescription)
        }
        PluginIpcRequest::SetPresetTags { id, tags } => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.tags = tags.clone();
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::SetPresetTags)
        }
        PluginIpcRequest::ImportPresetBank(bundle) => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.import_bank(bundle.clone()).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::ImportPresetBank)
        }
        PluginIpcRequest::ExportPreset { id } => {
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

            Ok(PluginIpcResponse::ExportPreset(ExportPresetResponse {
                filename: format!("{}.json", entry.name),
                json,
            }))
        }
        PluginIpcRequest::ListFxModulePresets { module_type } => {
            let lib = preset_library.lock().map_err(|e| e.to_string())?;
            Ok(PluginIpcResponse::ListFxModulePresets(
                lib.list_fx_module_presets(module_type)
                    .map_err(|e| e.to_string())?,
            ))
        }
        PluginIpcRequest::SaveFxModulePreset(payload) => {
            let name = payload.name.clone();
            let module_type = payload.module_type.clone();
            let patch = payload.patch.clone();

            let saved = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.save_fx_module_preset(name, module_type, patch)
                    .map_err(|e| e.to_string())?
            };

            Ok(PluginIpcResponse::SaveFxModulePreset(saved))
        }
        PluginIpcRequest::DeleteFxModulePreset { id } => {
            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.delete_fx_module_preset(id).map_err(|e| e.to_string())?;
            }
            Ok(PluginIpcResponse::DeleteFxModulePreset)
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
