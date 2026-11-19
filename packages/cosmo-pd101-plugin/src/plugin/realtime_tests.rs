use super::*;

fn process_test_block(plugin: &mut CzPluginDspState, events: &EventList) -> ProcessStatus {
    let mut left = [0.0_f32; 64];
    let mut right = [0.0_f32; 64];
    let inputs: [&[f32]; 0] = [];
    let mut outputs: [&mut [f32]; 2] = [&mut left, &mut right];
    let mut buffer = AudioBuffer::from_slices_checked(&inputs, &mut outputs, 64);
    let transport = TransportInfo::default();
    let mut output_events = EventList::default();
    let mut context = ProcessContext::new(&transport, 48_000.0, 64, &mut output_events);
    let params = plugin.test_params();
    <CzPlugin as PluginLogic>::process(plugin, params.as_ref(), &mut buffer, events, &mut context)
}

fn host_events(events: impl IntoIterator<Item = (u32, EventBody)>) -> EventList {
    let mut list = EventList::default();
    for (sample_offset, body) in events {
        list.push(Event {
            sample_offset,
            port: 0,
            body,
        });
    }
    list
}

#[cfg(debug_assertions)]
fn note_on() -> EventBody {
    EventBody::NoteOn {
        group: 0,
        channel: 0,
        note: 60,
        velocity: 127,
    }
}

#[cfg(debug_assertions)]
#[test]
fn allocation_guard_rejects_heap_allocation() {
    use std::{hint::black_box, process::Command};

    const CHILD: &str = "COSMO_TEST_ALLOCATOR_NEGATIVE_CONTROL";
    if std::env::var_os(CHILD).is_some() {
        assert_no_alloc::assert_no_alloc(|| {
            black_box(vec![0_u8; 4096]);
        });
        return;
    }

    let result = Command::new(std::env::current_exe().unwrap())
        .args([
            "--exact",
            concat!(module_path!(), "::allocation_guard_rejects_heap_allocation")
                .split_once("::")
                .unwrap()
                .1,
        ])
        .arg("--nocapture")
        .env(CHILD, "1")
        .output()
        .unwrap();
    let stderr = String::from_utf8_lossy(&result.stderr);
    assert!(
        !result.status.success() && stderr.contains("memory allocation of 4096 bytes failed"),
        "expected the child allocator to abort, got {} with stderr: {stderr}",
        result.status
    );
}

#[cfg(debug_assertions)]
#[test]
fn midi_notes_and_telemetry_do_not_allocate() {
    with_test_data_dir(|_| {
        clear_test_global_settings();
        let mut plugin = CzPlugin::new(Arc::new(CzPluginParams::new()));
        plugin.reset(48_000.0, 64);

        let events = host_events([
            (16, note_on()),
            (
                48,
                EventBody::NoteOff {
                    group: 0,
                    channel: 0,
                    note: 60,
                    velocity: 0,
                },
            ),
        ]);

        assert_no_alloc::assert_no_alloc(|| process_test_block(&mut plugin, &events));
        assert!(
            plugin.audio.mono_output[..16]
                .iter()
                .all(|&sample| sample == 0.0)
        );
        assert!(
            plugin.audio.mono_output[16..48]
                .iter()
                .any(|&sample| sample.abs() > 1.0e-4)
        );
        assert!(plugin.shared_state.telemetry.drain_latest());
    });
}

#[cfg(debug_assertions)]
#[test]
#[ignore = "host automation currently allocates; see issue #410"]
fn automation_does_not_allocate() {
    with_test_data_dir(|_| {
        clear_test_global_settings();
        let mut plugin = CzPlugin::new(Arc::new(CzPluginParams::new()));
        plugin.reset(48_000.0, 64);
        let events = host_events([
            (0, note_on()),
            (
                32,
                EventBody::ParamChange {
                    id: CzPluginParamsParamId::Volume as u32,
                    value: 0.25,
                },
            ),
        ]);

        assert_no_alloc::assert_no_alloc(|| process_test_block(&mut plugin, &events));
        assert_eq!(plugin.audio.cached_rt_synth_params.volume, 0.25);
    });
}

#[cfg(debug_assertions)]
#[test]
#[ignore = "factory program changes currently allocate; see issue #410"]
fn program_change_does_not_allocate() {
    with_test_data_dir(|_| {
        clear_test_global_settings();
        let mut plugin = CzPlugin::new(Arc::new(CzPluginParams::new()));
        plugin.reset(48_000.0, 64);
        let (preset_id, _) = crate::ffi::factory_preset_identity(0).unwrap();
        let events = host_events([(
            0,
            EventBody::ProgramChange {
                group: 0,
                channel: 0,
                program: 0,
            },
        )]);

        assert_no_alloc::assert_no_alloc(|| process_test_block(&mut plugin, &events));
        let session = plugin.shared_state.presets.session.load();
        assert_eq!(session.loaded_preset_id.as_deref(), Some(preset_id));
    });
}

#[test]
fn midi_learn_currently_writes_settings_from_the_callback() {
    use crate::global_settings::{PluginGlobalSettings, get_global_settings_path};

    with_test_data_dir(|_| {
        clear_test_global_settings();
        let mut plugin = CzPlugin::new(Arc::new(CzPluginParams::new()));
        plugin.reset(48_000.0, 64);
        let midi_learn = &plugin.shared_state.midi_learn;
        midi_learn.set_learn_mode(true);
        midi_learn.set_pending_param_key(Some("macro1".to_owned()));

        let settings_path = get_global_settings_path();
        let before = fs::read(&settings_path).unwrap();
        let events = host_events([(
            16,
            EventBody::ControlChange {
                group: 0,
                channel: 0,
                cc: 74,
                value: 64,
            },
        )]);
        process_test_block(&mut plugin, &events);

        let after = fs::read(settings_path).unwrap();
        assert_ne!(before, after);
        let settings: PluginGlobalSettings = serde_json::from_slice(&after).unwrap();
        assert!(settings.midi_learn_bindings.iter().any(|binding| {
            binding.param_key == "macro1" && binding.channel == 0 && binding.cc == 74
        }));
        clear_test_global_settings();
    });
}
