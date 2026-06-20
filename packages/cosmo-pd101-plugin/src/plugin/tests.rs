use std::fs;
use std::path::PathBuf;
use std::sync::RwLock;
use std::time::{SystemTime, UNIX_EPOCH};

use super::*;
use crate::diagnostics::set_test_log_level;
use crate::runtime_state::SCOPE_CAPACITY;
use cosmo_pd101_bridge_types::{MidiLearnBinding, PluginIpcRequest, SavePresetPayload};

fn clear_test_global_settings() {
    let path = crate::global_settings::get_global_settings_path();
    let _ = fs::remove_file(path);
    crate::global_settings::reset_global_settings_cache();
}

fn with_test_data_dir<T>(test_fn: impl FnOnce(PathBuf) -> T) -> T {
    let _guard = crate::global_settings::TEST_DATA_DIR_LOCK
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    let unique = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    let path = std::env::temp_dir().join(format!("cosmo-pd101-test-{}", unique));
    fs::create_dir_all(&path).unwrap();
    unsafe {
        std::env::set_var("COSMO_PD101_DATA_DIR", &path);
    }
    let result = test_fn(path.clone());
    unsafe {
        std::env::remove_var("COSMO_PD101_DATA_DIR");
    }
    let _ = fs::remove_dir_all(path);
    result
}

fn synth_params_json(params: &SynthParams) -> serde_json::Value {
    serde_json::to_value(params).unwrap()
}

fn set_plugin_midi_learn_state(plugin: &CzPlugin, state: crate::session_state::MidiLearnState) {
    *plugin.shared_state.midi_learn.state.lock().unwrap() = state;
    plugin.shared_state.midi_learn.publish_mapping_snapshot();
}

#[test]
fn debug_logs_follow_global_settings_log_level() {
    with_test_data_dir(|_| {
        let _ = fs::remove_file(plugin_log_path());
        set_test_log_level(crate::global_settings::PluginLogLevel::Info);
        append_log_debug("debug-hidden");

        let info_contents = fs::read_to_string(plugin_log_path()).unwrap_or_default();
        assert!(!info_contents.contains("debug-hidden"));

        set_test_log_level(crate::global_settings::PluginLogLevel::Debug);
        append_log_debug("debug-visible");

        let debug_contents = fs::read_to_string(plugin_log_path()).unwrap_or_default();
        assert!(debug_contents.contains("level=DEBUG"));
        assert!(debug_contents.contains("debug-visible"));

        set_test_log_level(crate::global_settings::PluginLogLevel::Error);
    });
}

#[allow(clippy::type_complexity)]
fn make_handler_state() -> (
    SharedSynthParams,
    SharedRtSynthParams,
    SharedRuntimeModSources,
    SharedRuntimeVoiceStates,
    SharedTransportSnapshot,
    SynthParamsVersion,
    ScopeBuffer,
    UiInputQueue,
    Arc<CzPluginParams>,
    SharedPresetSession,
    Arc<Mutex<PresetLibrary>>,
    SharedEditorState,
    SharedMidiMappings,
) {
    let sp = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
    let rsp = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
    let rms: SharedRuntimeModSources = Arc::new(RwLock::new(RuntimeModSources::default()));
    let rvs: SharedRuntimeVoiceStates = Arc::new(RwLock::new(Vec::new()));
    let ts = Arc::new(TransportSnapshot::default());
    let ver = Arc::new(AtomicU64::new(0));
    let sc: ScopeBuffer = Arc::new(RwLock::new(ScopeFrame::default()));
    let q: UiInputQueue = Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY));
    let params = Arc::new(CzPluginParams::new());
    let ps: SharedPresetSession =
        Arc::new(Mutex::new(crate::session_state::PresetSession::default()));
    let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
    let pl: Arc<Mutex<PresetLibrary>> = Arc::new(Mutex::new(PresetLibrary::from_embedded_factory(
        factory_json,
    )));
    let es: SharedEditorState = Arc::new(Mutex::new(None));
    let mm: SharedMidiMappings =
        Arc::new(Mutex::new(crate::session_state::MidiLearnState::default()));
    (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm)
}

#[test]
fn scope_frame_keeps_samples_in_chronological_order_after_wrap() {
    let mut frame = ScopeFrame::default();
    let initial: Vec<f32> = (0..SCOPE_CAPACITY).map(|sample| sample as f32).collect();
    frame.push_block(&initial, 48_000.0, 110.0);
    frame.push_block(&[4096.0, 4097.0, 4098.0], 48_000.0, 220.0);

    let linear = frame.to_linear();
    assert_eq!(linear.len(), SCOPE_CAPACITY);
    assert_eq!(&linear[..3], &[3.0, 4.0, 5.0]);
    assert_eq!(&linear[linear.len() - 3..], &[4096.0, 4097.0, 4098.0]);
    assert_eq!(frame.sample_rate(), 48_000.0);
    assert_eq!(frame.hz(), 220.0);
}

#[test]
fn set_params_rpc_updates_synth_params() {
    let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();

    let new_params = SynthParams {
        volume: 0.42,
        ..Default::default()
    };
    let result = handle_ipc_invoke(
        PluginIpcRequest::SetParams(Box::new(new_params)),
        &sp,
        &rsp,
        &rms,
        &rvs,
        &ts,
        &ver,
        &sc,
        &q,
        &params,
        &ps,
        &pl,
        &es,
        &mm,
    );
    assert!(result.is_ok());
    let current = sp.load();
    assert_eq!(current.volume, 0.42);
    let rt_current = rsp.load();
    assert_eq!(rt_current.volume, 0.42);
}

#[allow(clippy::field_reassign_with_default)]
#[test]
fn get_params_rpc_returns_current_synth_params() {
    let mut initial = SynthParams::default();
    initial.volume = 0.77;
    let sp: SharedSynthParams = Arc::new(ArcSwap::new(Arc::new(initial)));
    let rsp = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
    let rms: SharedRuntimeModSources = Arc::new(RwLock::new(RuntimeModSources::default()));
    let rvs: SharedRuntimeVoiceStates = Arc::new(RwLock::new(Vec::new()));
    let ts = Arc::new(TransportSnapshot::default());
    let ver = Arc::new(AtomicU64::new(0));
    let sc: ScopeBuffer = Arc::new(RwLock::new(ScopeFrame::default()));
    let q: UiInputQueue = Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY));
    let params = Arc::new(CzPluginParams::new());
    let ps: SharedPresetSession =
        Arc::new(Mutex::new(crate::session_state::PresetSession::default()));
    let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
    let pl: Arc<Mutex<PresetLibrary>> = Arc::new(Mutex::new(PresetLibrary::from_embedded_factory(
        factory_json,
    )));
    let es: SharedEditorState = Arc::new(Mutex::new(None));
    let mm: SharedMidiMappings =
        Arc::new(Mutex::new(crate::session_state::MidiLearnState::default()));

    let result = handle_ipc_invoke(
        PluginIpcRequest::GetParams,
        &sp,
        &rsp,
        &rms,
        &rvs,
        &ts,
        &ver,
        &sc,
        &q,
        &params,
        &ps,
        &pl,
        &es,
        &mm,
    );
    assert!(result.is_ok());
    let val = result.unwrap();
    let volume = val["volume"].as_f64().unwrap();
    assert!((volume - 0.77).abs() < 1.0e-6);
}

#[test]
fn note_on_rpc_enqueues_ui_input_event() {
    let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();

    let result = handle_ipc_invoke(
        PluginIpcRequest::NoteOn {
            note: 60,
            velocity: 0.75,
        },
        &sp,
        &rsp,
        &rms,
        &rvs,
        &ts,
        &ver,
        &sc,
        &q,
        &params,
        &ps,
        &pl,
        &es,
        &mm,
    );

    assert!(result.is_ok());
    match q.pop() {
        Some(CosmoInputEvent::NoteOn { note, velocity }) => {
            assert_eq!(note, 60);
            assert!((velocity - 0.75).abs() < f32::EPSILON);
        }
        other => panic!("unexpected queued event: {other:?}"),
    }
}

#[allow(clippy::field_reassign_with_default)]
#[test]
fn set_params_rpc_syncs_daw_float_params() {
    let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
    assert_eq!(params.volume.value(), 1.0); // default

    let mut new_params = SynthParams::default();
    new_params.volume = 0.33;
    new_params.line1.dcw_base = 0.61;
    let result = handle_ipc_invoke(
        PluginIpcRequest::SetParams(Box::new(new_params)),
        &sp,
        &rsp,
        &rms,
        &rvs,
        &ts,
        &ver,
        &sc,
        &q,
        &params,
        &ps,
        &pl,
        &es,
        &mm,
    );
    assert!(result.is_ok());
    assert!((params.volume.value() - 0.33).abs() < 0.000_001);
    assert!((params.warp_a_amount.value() - 0.61).abs() < 0.000_001);
}

#[test]
fn transport_snapshot_round_trips_values() {
    let snapshot = TransportSnapshot::default();
    let transport = TransportInfo {
        playing: true,
        recording: false,
        tempo: 138.5,
        time_sig_num: 7,
        time_sig_den: 8,
        position_samples: 123_456,
        position_seconds: 12.75,
        position_beats: 42.5,
        bar_start_beats: 35.0,
        loop_active: true,
        loop_start_beats: 32.0,
        loop_end_beats: 48.0,
    };

    snapshot.store(&transport);
    let loaded = snapshot.load();

    assert_eq!(loaded.playing, transport.playing);
    assert_eq!(loaded.recording, transport.recording);
    assert_eq!(loaded.tempo, transport.tempo);
    assert_eq!(loaded.time_sig_num, transport.time_sig_num);
    assert_eq!(loaded.time_sig_den, transport.time_sig_den);
    assert_eq!(loaded.position_samples, transport.position_samples);
    assert_eq!(loaded.position_seconds, transport.position_seconds);
    assert_eq!(loaded.position_beats, transport.position_beats);
    assert_eq!(loaded.bar_start_beats, transport.bar_start_beats);
    assert_eq!(loaded.loop_active, transport.loop_active);
    assert_eq!(loaded.loop_start_beats, transport.loop_start_beats);
    assert_eq!(loaded.loop_end_beats, transport.loop_end_beats);
}

#[test]
fn get_transport_info_rpc_returns_current_snapshot() {
    let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
    ts.store(&TransportInfo {
        playing: true,
        recording: true,
        tempo: 120.25,
        time_sig_num: 3,
        time_sig_den: 4,
        position_samples: 4096,
        position_seconds: 2.5,
        position_beats: 5.0,
        bar_start_beats: 4.0,
        loop_active: true,
        loop_start_beats: 4.0,
        loop_end_beats: 8.0,
    });

    let result = handle_ipc_invoke(
        PluginIpcRequest::GetTransportInfo,
        &sp,
        &rsp,
        &rms,
        &rvs,
        &ts,
        &ver,
        &sc,
        &q,
        &params,
        &ps,
        &pl,
        &es,
        &mm,
    )
    .unwrap();

    assert_eq!(result["playing"], serde_json::Value::Bool(true));
    assert_eq!(result["recording"], serde_json::Value::Bool(true));
    assert_eq!(result["tempo"].as_f64(), Some(120.25));
    assert_eq!(result["timeSigNum"].as_u64(), Some(3));
    assert_eq!(result["timeSigDen"].as_u64(), Some(4));
    assert_eq!(result["positionSamples"].as_f64(), Some(4096.0));
    assert_eq!(result["positionBeats"].as_f64(), Some(5.0));
    assert_eq!(result["loopActive"], serde_json::Value::Bool(true));
    assert_eq!(result["loopEndBeats"].as_f64(), Some(8.0));
}

#[test]
fn truce_driver_renders_with_transport_and_block_snapshots() {
    use std::time::Duration;
    use truce_test::{TransportSpec, assertions, driver};

    let result = driver!(Plugin)
        .duration(Duration::from_millis(20))
        .capture_block_snapshots(true)
        .transport(TransportSpec {
            bpm: 138.0,
            playing: true,
            position_beats: 16.5,
            time_signature: (7, 8),
        })
        .script(|script| {
            script.note_on(60, 100.0 / 127.0);
        })
        .run();

    assertions::assert_nonzero(&result);
    assertions::assert_no_nans(&result);
    assert!(!result.block_snapshots.is_empty());
}

#[test]
fn host_event_processing_respects_sample_offsets() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(params);
    plugin.reset(48_000.0, 64);

    let mut events = EventList::default();
    events.push(Event {
        sample_offset: 32,
        body: EventBody::NoteOn {
            group: 0,
            channel: 0,
            note: 60,
            velocity: 127,
        },
    });

    plugin.audio.mono_output.resize(64, 0.0);
    plugin.process_host_events_into_buffer(&events, 64);
    let mono = &plugin.audio.mono_output[..64];

    let pre_event_peak = mono[..32]
        .iter()
        .fold(0.0_f32, |peak, sample| peak.max(sample.abs()));
    let post_event_peak = mono[32..]
        .iter()
        .fold(0.0_f32, |peak, sample| peak.max(sample.abs()));

    assert!(
        pre_event_peak <= 1.0e-6,
        "expected silence before note-on offset, got peak {pre_event_peak}"
    );
    assert!(
        post_event_peak > 1.0e-4,
        "expected audible output after note-on offset, got peak {post_event_peak}"
    );
}

#[test]
fn program_change_applies_factory_preset() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);
    let expected = crate::ffi::factory_preset_params(0).unwrap().clone();
    let (expected_id, expected_name) = crate::ffi::factory_preset_identity(0).unwrap();

    params.volume.set_value(0.123);
    assert!((params.volume.value() - expected.volume).abs() > 0.000_001);

    plugin.handle_host_event(&EventBody::ProgramChange {
        group: 0,
        channel: 0,
        program: 0,
    });

    assert!((params.volume.value() - expected.volume).abs() > 0.000_001);
    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );

    assert!((params.volume.value() - expected.volume).abs() < 0.000_001);
    let synth_params = plugin.shared_state.synth.synth_params.load();
    assert_eq!(synth_params.line_select, expected.line_select);
    assert!((synth_params.portamento.time - expected.portamento.time).abs() < 0.000_001);
    let session = plugin.shared_state.presets.session.lock().unwrap().clone();
    assert_eq!(session.loaded_preset_id.as_deref(), Some(expected_id));
    assert_eq!(session.active_preset_name_base, expected_name);
}

#[test]
fn program_change_is_audio_effective_before_control_drain() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(params);
    plugin.reset(48_000.0, 64);
    let current = synth_params_json(&plugin.audio.processor.as_ref().unwrap().params);
    let (program, expected) = (0..crate::ffi::factory_preset_count())
        .find_map(|index| {
            let preset = crate::ffi::factory_preset_params(index)?;
            (synth_params_json(preset) != current).then_some((index as u8, preset))
        })
        .expect("expected at least one factory preset to differ from defaults");

    plugin.handle_host_event(&EventBody::ProgramChange {
        group: 0,
        channel: 0,
        program,
    });

    assert_eq!(
        synth_params_json(&plugin.audio.processor.as_ref().unwrap().params),
        synth_params_json(expected)
    );
}

#[test]
fn midi_mapping_applies_in_plugin_core_without_editor() {
    clear_test_global_settings();
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);
    set_plugin_midi_learn_state(
        &plugin,
        crate::session_state::MidiLearnState {
            bindings: vec![crate::session_state::MidiLearnBinding {
                param_key: "macro1".to_string(),
                channel: 0,
                cc: 74,
            }],
            ..Default::default()
        },
    );

    let baseline = plugin.audio.processor.as_ref().unwrap().params.macro1;

    plugin.handle_host_event(&EventBody::ControlChange {
        group: 0,
        channel: 0,
        cc: 74,
        value: 127,
    });

    assert!((plugin.audio.processor.as_ref().unwrap().params.macro1 - 1.0).abs() < 0.000_001);
    assert!((plugin.shared_state.synth.synth_params.load().macro1 - baseline).abs() < 0.000_001);
    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );
    assert!((plugin.shared_state.synth.synth_params.load().macro1 - 1.0).abs() < 0.000_001);
}

#[test]
fn midi_mapping_matches_exact_channel() {
    with_test_data_dir(|_| {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);
        set_plugin_midi_learn_state(
            &plugin,
            crate::session_state::MidiLearnState {
                bindings: vec![crate::session_state::MidiLearnBinding {
                    param_key: "macro1".to_string(),
                    channel: 2,
                    cc: 74,
                }],
                ..Default::default()
            },
        );
        let baseline = plugin.shared_state.synth.synth_params.load().macro1;

        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 1,
            cc: 74,
            value: 127,
        });

        assert!(
            (plugin.shared_state.synth.synth_params.load().macro1 - baseline).abs() < 0.000_001
        );
    });
}

#[test]
fn midi_mapping_applies_to_all_bindings_for_same_cc() {
    clear_test_global_settings();
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);
    set_plugin_midi_learn_state(
        &plugin,
        crate::session_state::MidiLearnState {
            bindings: vec![
                crate::session_state::MidiLearnBinding {
                    param_key: "macro1".to_string(),
                    channel: 0,
                    cc: 74,
                },
                crate::session_state::MidiLearnBinding {
                    param_key: "macro2".to_string(),
                    channel: 0,
                    cc: 74,
                },
            ],
            ..Default::default()
        },
    );

    plugin.handle_host_event(&EventBody::ControlChange {
        group: 0,
        channel: 0,
        cc: 74,
        value: 127,
    });

    let rt_params = &plugin.audio.processor.as_ref().unwrap().params;
    assert!((rt_params.macro1 - 1.0).abs() < 0.000_001);
    assert!((rt_params.macro2 - 1.0).abs() < 0.000_001);

    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );
    let synth_params = plugin.shared_state.synth.synth_params.load();
    assert!((synth_params.macro1 - 1.0).abs() < 0.000_001);
    assert!((synth_params.macro2 - 1.0).abs() < 0.000_001);
}

#[test]
fn midi_mapping_syncs_daw_backed_plugin_params() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);
    set_plugin_midi_learn_state(
        &plugin,
        crate::session_state::MidiLearnState {
            bindings: vec![crate::session_state::MidiLearnBinding {
                param_key: "warpAAmount".to_string(),
                channel: 0,
                cc: 55,
            }],
            ..Default::default()
        },
    );

    plugin.handle_host_event(&EventBody::ControlChange {
        group: 0,
        channel: 0,
        cc: 55,
        value: 64,
    });

    let rt_value = plugin
        .audio
        .processor
        .as_ref()
        .unwrap()
        .params
        .line1
        .dcw_base;
    assert!((rt_value - 64.0 / 127.0).abs() < 0.000_001);
    assert!((params.warp_a_amount.value() - 64.0 / 127.0).abs() > 0.000_001);
    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );
    assert!(
        (plugin.shared_state.synth.synth_params.load().line1.dcw_base - 64.0 / 127.0).abs()
            < 0.000_001
    );
    assert!((params.warp_a_amount.value() - 64.0 / 127.0).abs() < 0.000_001);
}

#[test]
fn vst3_midi_mapping_resolves_default_macro_binding() {
    clear_test_global_settings();
    let params = Arc::new(CzPluginParams::new());
    let plugin = CzPlugin::new(Arc::clone(&params));

    assert_eq!(
        plugin.vst3_midi_mapping_param_id(0, 0, 8),
        Some(CzPluginParamsParamId::Macro1 as u32)
    );
}

#[test]
fn host_param_value_drift_updates_runtime_snapshot_and_version() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);

    let initial_version = plugin
        .shared_state
        .synth
        .synth_params_version
        .load(Ordering::Acquire);
    params.line1_level.set_value(0.37);

    process_test_block(&mut plugin, &EventList::default());

    assert!(
        (plugin
            .audio
            .processor
            .as_ref()
            .unwrap()
            .params
            .line1
            .dca_base
            - 0.37)
            .abs()
            < 0.000_001
    );
    assert_eq!(
        plugin
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire),
        initial_version
    );
    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );
    assert!(
        plugin
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire)
            > initial_version
    );
}

#[test]
fn host_side_midi_learn_keeps_mode_and_pending_target_enabled() {
    clear_test_global_settings();
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);
    set_plugin_midi_learn_state(
        &plugin,
        crate::session_state::MidiLearnState {
            learn_mode: true,
            pending_param_key: Some("macro1".to_string()),
            ..Default::default()
        },
    );

    plugin.handle_host_event(&EventBody::ControlChange {
        group: 0,
        channel: 0,
        cc: 74,
        value: 64,
    });

    let state = plugin.shared_state.midi_learn.state.lock().unwrap().clone();
    assert!(state.learn_mode);
    assert_eq!(state.pending_param_key.as_deref(), Some("macro1"));
    assert!(!state.bindings.iter().any(|binding| {
        binding.param_key == "macro1" && binding.channel == 0 && binding.cc == 74
    }));
    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );

    let state = plugin.shared_state.midi_learn.state.lock().unwrap().clone();
    assert!(state.learn_mode);
    assert_eq!(state.pending_param_key.as_deref(), Some("macro1"));
    assert!(state.bindings.iter().any(|binding| {
        binding.param_key == "macro1" && binding.channel == 0 && binding.cc == 74
    }));
}

#[test]
fn host_side_midi_learn_persists_only_after_control_drain() {
    with_test_data_dir(|_| {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);
        set_plugin_midi_learn_state(
            &plugin,
            crate::session_state::MidiLearnState {
                learn_mode: true,
                pending_param_key: Some("macro1".to_string()),
                ..Default::default()
            },
        );

        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 0,
            cc: 74,
            value: 64,
        });

        let saved = crate::global_settings::load_or_init_global_settings().unwrap();
        assert!(!saved.midi_learn_bindings.iter().any(|binding| {
            binding.param_key == "macro1" && binding.channel == 0 && binding.cc == 74
        }));

        crate::audio_runtime::drain_render_control_events(
            &crate::rt_safety::ControlContext::new(),
            &plugin.shared_state,
            &params,
        );

        let saved = crate::global_settings::load_or_init_global_settings().unwrap();
        assert!(saved.midi_learn_bindings.iter().any(|binding| {
            binding.param_key == "macro1" && binding.channel == 0 && binding.cc == 74
        }));
    });
}

#[test]
fn host_cc_forwarding_reaches_webview_queue_only_after_control_drain() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);

    plugin.handle_host_event(&EventBody::ControlChange {
        group: 0,
        channel: 3,
        cc: 74,
        value: 99,
    });

    assert!(plugin.shared_state.ui.midi_cc_queue.is_empty());
    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );
    assert_eq!(
        plugin.shared_state.ui.midi_cc_queue.pop(),
        Some((3, 74, 99))
    );
}

#[test]
fn render_control_queue_overflow_drops_newest_events_and_counts() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);

    for value in 0..=255u8 {
        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 0,
            cc: 74,
            value,
        });
    }
    // Push extra events beyond 256 capacity (now 1 event/CC instead of 2)
    for value in 0..44u8 {
        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 0,
            cc: 74,
            value,
        });
    }

    assert!(
        plugin
            .shared_state
            .ui
            .render_control_diagnostics
            .queue_overflows
            .load(Ordering::Acquire)
            > 0
    );
    crate::audio_runtime::drain_render_control_events(
        &crate::rt_safety::ControlContext::new(),
        &plugin.shared_state,
        &params,
    );
    assert!(plugin.shared_state.ui.render_control_queue.is_empty());
}

fn process_test_block(plugin: &mut CzPlugin, events: &EventList) -> ProcessStatus {
    let mut left = [0.0; 64];
    let mut right = [0.0; 64];
    let inputs: [&[f32]; 0] = [];
    let mut outputs: [&mut [f32]; 2] = [&mut left, &mut right];
    let mut buffer = AudioBuffer::from_slices_checked(&inputs, &mut outputs, 64);
    let transport = TransportInfo::default();
    let mut output_events = EventList::default();
    let mut context = ProcessContext::new(&transport, 48_000.0, 64, &mut output_events);
    <CzPlugin as PluginLogic>::process(plugin, &mut buffer, events, &mut context)
}

#[cfg(debug_assertions)]
#[test]
fn audio_thread_does_not_allocate_processing_empty_block() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(params);
    plugin.reset(48_000.0, 64);

    let events = EventList::default();

    assert_no_alloc(|| {
        process_test_block(&mut plugin, &events);
    });
}

#[cfg(debug_assertions)]
#[test]
fn render_block_does_not_allocate_with_param_changes() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);

    let mut events = EventList::with_capacity(4);
    events.push(Event {
        sample_offset: 0,
        body: EventBody::ParamChange { id: 0, value: 0.5 },
    });
    events.push(Event {
        sample_offset: 16,
        body: EventBody::ParamChange { id: 1, value: 1.0 },
    });

    assert_no_alloc(|| {
        process_test_block(&mut plugin, &events);
    });
}

#[cfg(debug_assertions)]
#[test]
fn audio_thread_does_not_allocate_note_on_and_off() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(params);
    plugin.reset(48_000.0, 64);

    let mut events = EventList::default();
    events.push(Event {
        sample_offset: 0,
        body: EventBody::NoteOn {
            group: 0,
            channel: 0,
            note: 60,
            velocity: 100,
        },
    });
    events.push(Event {
        sample_offset: 32,
        body: EventBody::NoteOff {
            group: 0,
            channel: 0,
            note: 60,
            velocity: 0,
        },
    });

    assert_no_alloc(|| {
        process_test_block(&mut plugin, &events);
    });
}

#[cfg(debug_assertions)]
#[test]
fn audio_thread_does_not_allocate_for_host_parameter_polling() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);
    params.volume.set_value(0.42);

    assert_no_alloc(|| {
        process_test_block(&mut plugin, &EventList::default());
    });
}

#[cfg(debug_assertions)]
#[test]
fn audio_thread_does_not_allocate_for_ui_snapshot_and_preset_reset() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(params);
    plugin.reset(48_000.0, 64);
    let next = SynthParams {
        macro1: 0.75,
        ..SynthParams::default()
    };
    plugin
        .shared_state
        .synth
        .rt_synth_params
        .store(Arc::new(build_rt_synth_params(&next)));
    plugin
        .shared_state
        .synth
        .synth_params_version
        .fetch_add(1, Ordering::Release);
    plugin
        .shared_state
        .preset_reset_pending
        .store(true, Ordering::Release);

    assert_no_alloc(|| {
        process_test_block(&mut plugin, &EventList::default());
    });
    assert!(
        !plugin
            .shared_state
            .preset_reset_pending
            .load(Ordering::Acquire)
    );
    assert!((plugin.audio.processor.as_ref().unwrap().params.macro1 - 0.75).abs() < 0.000_001);
}

#[test]
fn rejected_realtime_snapshot_is_retried_until_it_copies() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(params);
    plugin.reset(48_000.0, 64);

    let mut oversized = SynthParams::default();
    oversized.macro_labels[0] = "x".repeat(300);
    plugin
        .shared_state
        .synth
        .rt_synth_params
        .store(Arc::new(build_rt_synth_params(&oversized)));
    plugin
        .shared_state
        .synth
        .synth_params_version
        .fetch_add(1, Ordering::Release);

    let rejection = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        process_test_block(&mut plugin, &EventList::default());
    }));
    assert!(
        rejection.is_err(),
        "oversized realtime snapshots should trip the debug assertion"
    );

    assert_eq!(
        plugin.audio.cached_synth_params_version, 0,
        "rejected snapshots must not advance the cached version"
    );
    assert_eq!(
        plugin
            .shared_state
            .ui
            .render_control_diagnostics
            .parameter_snapshot_rejections
            .load(Ordering::Acquire),
        1
    );

    let accepted = SynthParams {
        macro1: 0.75,
        ..SynthParams::default()
    };
    plugin
        .shared_state
        .synth
        .rt_synth_params
        .store(Arc::new(build_rt_synth_params(&accepted)));

    process_test_block(&mut plugin, &EventList::default());

    assert_eq!(plugin.audio.cached_synth_params_version, 1);
    assert!((plugin.audio.processor.as_ref().unwrap().params.macro1 - 0.75).abs() < 0.000_001);
}

#[cfg(debug_assertions)]
#[test]
fn audio_thread_does_not_allocate_for_mapped_dense_cc_input() {
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(params);
    plugin.reset(48_000.0, 64);
    set_plugin_midi_learn_state(
        &plugin,
        crate::session_state::MidiLearnState {
            bindings: vec![crate::session_state::MidiLearnBinding {
                param_key: "macro1".to_string(),
                channel: 0,
                cc: 74,
            }],
            ..Default::default()
        },
    );
    let mut events = EventList::with_capacity(128);
    for index in 0..128 {
        events.push(Event {
            sample_offset: index % 64,
            body: EventBody::ControlChange {
                group: 0,
                channel: 0,
                cc: 74,
                value: index as u8,
            },
        });
    }

    assert_no_alloc(|| {
        process_test_block(&mut plugin, &events);
    });
    assert_eq!(
        plugin
            .shared_state
            .ui
            .render_control_diagnostics
            .block_event_overflows
            .load(Ordering::Acquire),
        0
    );
}

#[test]
fn save_preset_defaults_new_user_author_to_user() {
    with_test_data_dir(|_| {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, _pl, es, mm) = make_handler_state();
        let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
        let pl = Arc::new(Mutex::new(
            PresetLibrary::load_or_init(factory_json).unwrap(),
        ));

        let result = handle_ipc_invoke(
            PluginIpcRequest::SavePreset(SavePresetPayload {
                name: "New Preset".to_string(),
                author: String::new(),
                tags: vec![],
                ..Default::default()
            }),
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &params,
            &ps,
            &pl,
            &es,
            &mm,
        )
        .unwrap();

        let id = result["id"].as_str().unwrap();
        let saved = pl.lock().unwrap().get_entry(id).unwrap().unwrap();
        assert_eq!(saved.author, crate::ipc::DEFAULT_USER_PRESET_AUTHOR);
    });
}

#[test]
fn param_change_applies_at_event_offset() {
    with_test_data_dir(|_| {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        let previous_volume = plugin.audio.cached_rt_synth_params.volume;
        let next_volume = if (previous_volume - 0.2).abs() < 0.000_001 {
            0.73
        } else {
            0.2
        };

        params.volume.set_value(next_volume);

        let mut events = EventList::default();
        events.push(Event {
            sample_offset: 32,
            body: EventBody::ParamChange {
                id: CzPluginParamsParamId::Volume as u32,
                value: next_volume,
            },
        });

        process_test_block(&mut plugin, &events);

        let volume_after = plugin.audio.cached_rt_synth_params.volume;
        assert!((volume_after - previous_volume).abs() < 0.000_001);
        assert!(
            (plugin.audio.processor.as_ref().unwrap().params.volume - next_volume as f32).abs()
                < 0.000_001
        );
    });
}

#[test]
fn set_preset_name_rpc_stores_name() {
    let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();

    let result = handle_ipc_invoke(
        PluginIpcRequest::SetPresetName("Warm Pad".to_string()),
        &sp,
        &rsp,
        &rms,
        &rvs,
        &ts,
        &ver,
        &sc,
        &q,
        &params,
        &ps,
        &pl,
        &es,
        &mm,
    );
    assert!(result.is_ok());
    let stored = ps.lock().unwrap();
    assert_eq!(stored.active_preset_name_base, "Warm Pad");
}

#[test]
fn get_preset_name_rpc_returns_current_name() {
    let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
    {
        let mut stored = ps.lock().unwrap();
        stored.active_preset_name_base = "Factory Brass".to_string();
    }

    let result = handle_ipc_invoke(
        PluginIpcRequest::GetPresetName,
        &sp,
        &rsp,
        &rms,
        &rvs,
        &ts,
        &ver,
        &sc,
        &q,
        &params,
        &ps,
        &pl,
        &es,
        &mm,
    );
    assert!(result.is_ok());
    assert_eq!(
        result.unwrap(),
        serde_json::Value::String("Factory Brass".to_string())
    );
}

#[test]
fn save_state_includes_preset_name() {
    clear_test_global_settings();
    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);

    plugin
        .shared_state
        .presets
        .session
        .lock()
        .unwrap()
        .active_preset_name_base = "Resonant Pad".to_string();
    plugin.shared_state.presets.session.lock().unwrap().is_dirty = true;

    let state = plugin.save_state();
    assert!(!state.is_empty());

    let parsed: serde_json::Value =
        serde_json::from_slice(&state).expect("state should be valid JSON");
    assert_eq!(
        parsed["presetSession"]["activePresetNameBase"],
        "Resonant Pad"
    );
    assert_eq!(parsed["presetSession"]["isDirty"], true);
    assert!(parsed.get("synthParams").is_some());
    assert!(parsed.get("midiLearnState").is_none());
}

#[test]
fn load_state_restores_preset_name() {
    with_test_data_dir(|_| {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        // Save state with a preset name
        plugin
            .shared_state
            .presets
            .session
            .lock()
            .unwrap()
            .active_preset_name_base = "Bright Piano".to_string();
        plugin.shared_state.presets.session.lock().unwrap().is_dirty = true;
        let state = plugin.save_state();

        // Create new plugin and load state
        let params2 = Arc::new(CzPluginParams::new());
        let mut plugin2 = CzPlugin::new(Arc::clone(&params2));
        plugin2.reset(48_000.0, 64);
        assert_ne!(
            plugin2
                .shared_state
                .presets
                .session
                .lock()
                .unwrap()
                .active_preset_name_base,
            "Bright Piano"
        );

        let result = plugin2.load_state(&state);
        assert!(result.is_ok());
        let restored = plugin2.shared_state.presets.session.lock().unwrap().clone();
        assert_eq!(restored.active_preset_name_base, "Bright Piano");
        assert!(!restored.is_dirty);
    });
}

#[test]
fn load_state_falls_back_to_old_format() {
    clear_test_global_settings();
    // Old format: flat SynthParams JSON (no wrapper)
    let synth = SynthParams::default();
    let data = serde_json::to_vec(&synth).unwrap();

    let params = Arc::new(CzPluginParams::new());
    let mut plugin = CzPlugin::new(Arc::clone(&params));
    plugin.reset(48_000.0, 64);

    // Set a name to verify it's not overwritten
    plugin
        .shared_state
        .presets
        .session
        .lock()
        .unwrap()
        .active_preset_name_base = "Existing Name".to_string();

    let result = plugin.load_state(&data);
    assert!(result.is_ok());
    // Old format should not touch preset_name
    assert_eq!(
        plugin
            .shared_state
            .presets
            .session
            .lock()
            .unwrap()
            .active_preset_name_base,
        "Existing Name"
    );
}

#[test]
fn cold_start_loads_plugin_startup_preset() {
    with_test_data_dir(|_| {
        clear_test_global_settings();

        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        let stored = plugin.shared_state.presets.session.lock().unwrap().clone();
        let expected = plugin
            .shared_state
            .presets
            .library
            .lock()
            .unwrap()
            .get_entry(
                stored
                    .loaded_preset_id
                    .as_deref()
                    .expect("startup preset should populate loaded preset id"),
            )
            .unwrap()
            .unwrap();
        let expected_params: SynthParams = if let Some(value) = expected.data.get("params") {
            serde_json::from_value(value.clone()).unwrap()
        } else {
            serde_json::from_value(expected.data.clone()).unwrap()
        };

        assert_eq!(stored.loaded_preset_id, Some(expected.id.clone()));
        assert_eq!(stored.active_preset_name_base, expected.name);
        assert!(!stored.is_dirty);
        assert_eq!(
            synth_params_json(plugin.shared_state.synth.synth_params.load().as_ref()),
            synth_params_json(&expected_params)
        );
    });
}

#[test]
fn cold_start_without_user_favorites_uses_factory_startup_preset_when_present() {
    with_test_data_dir(|_| {
        clear_test_global_settings();

        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));

        plugin.reset(48_000.0, 64);

        let stored = plugin.shared_state.presets.session.lock().unwrap().clone();
        assert!(!stored.is_dirty);
        if let Some(entry_id) = stored.loaded_preset_id.clone() {
            let entry = plugin
                .shared_state
                .presets
                .library
                .lock()
                .unwrap()
                .get_entry(&entry_id)
                .unwrap()
                .unwrap();
            let expected_params: SynthParams = if let Some(value) = entry.data.get("params") {
                serde_json::from_value(value.clone()).unwrap()
            } else {
                serde_json::from_value(entry.data.clone()).unwrap()
            };
            assert_eq!(stored.active_preset_name_base, entry.name);
            assert_eq!(
                synth_params_json(plugin.shared_state.synth.synth_params.load().as_ref()),
                synth_params_json(&expected_params)
            );
        } else {
            let mut expected = SynthParams::default();
            apply_daw_params(&mut expected, &params);
            assert!(stored.active_preset_name_base.is_empty());
            assert!(stored.loaded_preset_id.is_none());
            assert_eq!(
                synth_params_json(plugin.shared_state.synth.synth_params.load().as_ref()),
                synth_params_json(&expected)
            );
        }
    });
}

#[test]
fn restored_state_survives_later_resets_without_reapplying_startup_preset() {
    with_test_data_dir(|_| {
        clear_test_global_settings();

        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        {
            let mut library = plugin.shared_state.presets.library.lock().unwrap();
            let record = library
                .list_records(None)
                .unwrap()
                .into_iter()
                .next()
                .unwrap();
            library.set_starred(&record.entry.id, true).unwrap();
        }
        plugin.reset(48_000.0, 64);
        assert!(
            plugin
                .shared_state
                .presets
                .session
                .lock()
                .unwrap()
                .loaded_preset_id
                .is_some()
        );

        let restored_params = SynthParams {
            volume: 0.11,
            ..SynthParams::default()
        };
        let restored_state = crate::session_state::PluginSessionState {
            synth_params: restored_params.clone(),
            preset_session: crate::session_state::PresetSession {
                active_preset_name_base: "Saved Preset".to_string(),
                loaded_preset_id: Some("saved-id".to_string()),
                is_dirty: false,
            },
            editor_state: None,
        };
        let bytes = serde_json::to_vec(&restored_state).unwrap();

        plugin.load_state(&bytes).unwrap();
        plugin.reset(48_000.0, 64);

        let restored_session = plugin.shared_state.presets.session.lock().unwrap().clone();
        assert_eq!(restored_session.active_preset_name_base, "Saved Preset");
        assert_eq!(
            restored_session.loaded_preset_id.as_deref(),
            Some("saved-id")
        );
        assert_eq!(
            synth_params_json(plugin.shared_state.synth.synth_params.load().as_ref()),
            synth_params_json(&restored_params)
        );
    });
}

#[test]
fn plugin_startup_seeds_default_global_midi_settings() {
    with_test_data_dir(|_| {
        clear_test_global_settings();

        let params = Arc::new(CzPluginParams::new());
        let plugin = CzPlugin::new(Arc::clone(&params));
        let state = plugin.shared_state.midi_learn.state.lock().unwrap().clone();
        let saved = crate::global_settings::load_or_init_global_settings().unwrap();

        assert_eq!(
            state.bindings,
            crate::session_state::default_midi_bindings()
        );
        assert_eq!(
            saved.midi_learn_bindings,
            crate::session_state::default_midi_bindings()
        );
    });
}

#[test]
fn plugin_global_midi_settings_persist_across_instances() {
    with_test_data_dir(|_| {
        clear_test_global_settings();

        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
        {
            let mut state = mm.lock().unwrap();
            state.bindings = plugin
                .shared_state
                .midi_learn
                .state
                .lock()
                .unwrap()
                .bindings
                .clone();
        }

        let result = handle_ipc_invoke(
            PluginIpcRequest::AddMidiBinding {
                param_key: "macro1".to_string(),
                channel: 2,
                cc: 74,
            },
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &params,
            &ps,
            &pl,
            &es,
            &mm,
        );
        assert!(result.is_ok());
        *plugin.shared_state.midi_learn.state.lock().unwrap() = mm.lock().unwrap().clone();

        let params2 = Arc::new(CzPluginParams::new());
        let plugin2 = CzPlugin::new(Arc::clone(&params2));
        let bindings = plugin2
            .shared_state
            .midi_learn
            .state
            .lock()
            .unwrap()
            .bindings
            .clone();
        assert!(bindings.iter().any(|binding| {
            binding.param_key == "macro1" && binding.channel == 2 && binding.cc == 74
        }));

        let remove_result = handle_ipc_invoke(
            PluginIpcRequest::RemoveMidiBinding(MidiLearnBinding {
                param_key: "macro1".to_string(),
                channel: 2,
                cc: 74,
            }),
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &params,
            &ps,
            &pl,
            &es,
            &mm,
        );
        assert!(remove_result.is_ok());

        let params3 = Arc::new(CzPluginParams::new());
        let plugin3 = CzPlugin::new(Arc::clone(&params3));
        let bindings = plugin3
            .shared_state
            .midi_learn
            .state
            .lock()
            .unwrap()
            .bindings
            .clone();
        assert!(!bindings.iter().any(|binding| {
            binding.param_key == "macro1" && binding.channel == 2 && binding.cc == 74
        }));

        let clear_result = handle_ipc_invoke(
            PluginIpcRequest::ClearMidiLearnBindings,
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &params,
            &ps,
            &pl,
            &es,
            &mm,
        );
        assert!(clear_result.is_ok());

        let params4 = Arc::new(CzPluginParams::new());
        let plugin4 = CzPlugin::new(Arc::clone(&params4));
        assert!(
            plugin4
                .shared_state
                .midi_learn
                .state
                .lock()
                .unwrap()
                .bindings
                .is_empty()
        );
    });
}
