use std::sync::{Arc, Mutex};

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use eframe::egui::{self, Color32, Pos2, RichText, Sense, Stroke, Vec2};
use midir::{Ignore, MidiInput, MidiInputConnection};
use purr_synth_core::envelope::AdsrParams;
use purr_synth_core::event::{NoteId, SynthEvent};
use purr_synth_core::examples::minimoog::patch::{MiniModSource, MiniModTarget, OscPatch};
use purr_synth_core::examples::minimoog::{MiniPatch, MiniSynth, MiniVoice};
use purr_synth_core::lfo::LfoWaveform;
use purr_synth_core::midi_mapping::{
    ControlChange, MidiControlEvent, MidiControlSource, MidiLearnState, MidiMappingTable,
};
use purr_synth_core::modulation::ModRoute;
use purr_synth_core::oscillator::BasicWaveform;
use purr_synth_core::runtime::{SynthRuntime, VoiceMode};
use purr_synth_core::telemetry::{LevelMeter, ScopeCapture};

const DEFAULT_NOTE: u8 = 60;
const SCOPE_CAPACITY: usize = 256;
const SCOPE_DECIMATION: usize = 32;
const PANEL_BG: Color32 = Color32::from_rgb(23, 28, 36);
const PANEL_ALT: Color32 = Color32::from_rgb(31, 37, 48);
const LABEL_CREAM: Color32 = Color32::from_rgb(238, 228, 201);
const LABEL_GOLD: Color32 = Color32::from_rgb(219, 175, 88);
const ACCENT_TEAL: Color32 = Color32::from_rgb(87, 171, 160);
const ACCENT_ORANGE: Color32 = Color32::from_rgb(224, 111, 59);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum UiMidiTarget {
    FilterCutoff,
}

#[derive(Debug, Clone)]
struct SharedUiState {
    patch: MiniPatch,
    active_notes: Vec<u8>,
    pending_events: Vec<SynthEvent>,
    midi_note: u8,
    velocity: f32,
    midi_cc_value: u8,
    midi_mappings: MidiMappingTable<UiMidiTarget>,
    midi_port_name: Option<String>,
    scope_samples: Vec<f32>,
    peak: f32,
    rms: f32,
    status: String,
}

impl Default for SharedUiState {
    fn default() -> Self {
        Self {
            patch: MiniPatch::default(),
            active_notes: Vec::new(),
            pending_events: Vec::new(),
            midi_note: DEFAULT_NOTE,
            velocity: 0.8,
            midi_cc_value: 100,
            midi_mappings: MidiMappingTable::new(),
            midi_port_name: None,
            scope_samples: vec![0.0; SCOPE_CAPACITY],
            peak: 0.0,
            rms: 0.0,
            status: String::from("Audio idle"),
        }
    }
}

struct MinimoogUiApp {
    shared: Arc<Mutex<SharedUiState>>,
    _stream: Option<cpal::Stream>,
    _midi_connection: Option<MidiInputConnection<()>>,
}

impl MinimoogUiApp {
    fn new() -> Self {
        let shared = Arc::new(Mutex::new(SharedUiState::default()));
        let stream = match start_audio(shared.clone()) {
            Ok(stream) => {
                if let Ok(mut state) = shared.lock() {
                    state.status = String::from("Audio running");
                }
                Some(stream)
            }
            Err(error) => {
                if let Ok(mut state) = shared.lock() {
                    state.status = format!("Audio unavailable: {error}");
                }
                None
            }
        };

        let midi_connection = match start_midi_input(shared.clone()) {
            Ok(connection) => Some(connection),
            Err(error) => {
                if let Ok(mut state) = shared.lock() {
                    state.status = match state.status.as_str() {
                        "Audio running" => format!("Audio running, MIDI unavailable: {error}"),
                        current => format!("{current}; MIDI unavailable: {error}"),
                    };
                }
                None
            }
        };

        Self {
            shared,
            _stream: stream,
            _midi_connection: midi_connection,
        }
    }

    fn with_state<R>(&self, f: impl FnOnce(&mut SharedUiState) -> R) -> R {
        let mut state = self.shared.lock().expect("shared UI state mutex poisoned");
        f(&mut state)
    }

    fn send_simulated_cc(&self) {
        self.with_state(|state| {
            let event = MidiControlEvent::ControlChange {
                channel: 0,
                controller: 74,
                value: state.midi_cc_value,
            };

            if state.midi_mappings.learn_state().is_some() {
                let Some(mapping) = state.midi_mappings.learn_from_event(event) else {
                    state.status = String::from("MIDI learn was cancelled before capture");
                    return;
                };

                state.status = format!(
                    "Learned controller {} for cutoff",
                    describe_source(mapping.source)
                );
            }

            let changes = state.midi_mappings.evaluate(event);
            if changes.is_empty() {
                state.status = String::from("Sent CC74 with no active mapping");
            }

            for change in changes {
                apply_control_change(&mut state.patch, change);
                state.status = format!(
                    "Applied {} via MIDI learn ({:.0} Hz)",
                    describe_target(change.target),
                    state.patch.filter.cutoff_hz
                );
            }
        });
    }
}

impl eframe::App for MinimoogUiApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        ctx.request_repaint();
        apply_simple_style(ctx);

        let mut send_cc = false;

        egui::TopBottomPanel::top("status_bar").show(ctx, |ui| {
            let (status, peak, rms) = self.with_state(|state| {
                let status = if let Some(port_name) = &state.midi_port_name {
                    format!("{} | MIDI: {}", state.status, port_name)
                } else {
                    state.status.clone()
                };
                (status, state.peak, state.rms)
            });

            ui.horizontal(|ui| {
                ui.label(RichText::new(status).color(LABEL_CREAM));
                ui.separator();
                ui.label(RichText::new(format!("Peak {:.2}", peak)).color(ACCENT_TEAL));
                ui.label(RichText::new(format!("RMS {:.2}", rms)).color(ACCENT_ORANGE));
            });
        });

        egui::CentralPanel::default().show(ctx, |ui| {
            self.with_state(|state| {
                ui.heading("Minimoog Validation UI");
                ui.label("Simple native validation surface for patch wiring, MIDI learn, and runtime telemetry.");

                ui.add_space(8.0);

                ui.columns(2, |columns| {
                    let (left_columns, right_columns) = columns.split_at_mut(1);
                    let left = &mut left_columns[0];
                    let right = &mut right_columns[0];

                    left.group(|ui| {
                        ui.heading("Note + Output");
                        knob_u8(ui, "MIDI note", &mut state.midi_note, 36..=84, DEFAULT_NOTE);
                        knob_f32(ui, "Velocity", &mut state.velocity, 0.1..=1.0, "", 0.8);
                        knob_f32(ui, "Volume", &mut state.patch.volume, 0.0..=1.0, "", MiniPatch::default().volume);
                        ui.label(format!("Held notes: {:?}", state.active_notes));
                        if let Some(port_name) = &state.midi_port_name {
                            ui.label(format!("Keyboard input: {}", port_name));
                        } else {
                            ui.label("Keyboard input: not connected");
                        }

                        ui.horizontal(|ui| {
                            if ui.button("Note On").clicked() {
                                queue_note_on(state, state.midi_note, state.velocity);
                                state.status = format!("Holding note {}", state.midi_note);
                            }
                            if ui.button("Note Off").clicked() {
                                queue_note_off(state, state.midi_note);
                                state.status = format!("Released note {}", state.midi_note);
                            }
                        });

                        ui.separator();
                        ui.label("Runtime meter");
                        ui.add(egui::ProgressBar::new(state.peak).text("Peak"));
                        ui.add(egui::ProgressBar::new(state.rms).text("RMS"));
                    });

                    left.add_space(8.0);

                    left.group(|ui| {
                        ui.heading("Oscillators");
                        let default_patch = MiniPatch::default();
                        oscillator_ui(ui, "Osc 1", &mut state.patch.osc1, default_patch.osc1);
                        ui.separator();
                        oscillator_ui(ui, "Osc 2", &mut state.patch.osc2, default_patch.osc2);
                        ui.separator();
                        oscillator_ui(ui, "Osc 3", &mut state.patch.osc3, default_patch.osc3);
                    });

                    right.group(|ui| {
                        ui.heading("Filter + LFO");
                        let default_patch = MiniPatch::default();
                        knob_f32(ui, "Cutoff", &mut state.patch.filter.cutoff_hz, 40.0..=8_000.0, "Hz", default_patch.filter.cutoff_hz);
                        knob_f32(ui, "Resonance", &mut state.patch.filter.resonance, 0.0..=1.0, "", default_patch.filter.resonance);
                        knob_f32(ui, "Env amount", &mut state.patch.filter.envelope_amount, 0.0..=6_000.0, "Hz", default_patch.filter.envelope_amount);
                        knob_f32(ui, "Key track", &mut state.patch.filter.keyboard_track, 0.0..=1.0, "", default_patch.filter.keyboard_track);
                        waveform_selector(ui, "LFO waveform", &mut state.patch.lfo.waveform);
                        let default_patch = MiniPatch::default();
                        knob_f32(ui, "LFO rate", &mut state.patch.lfo.rate_hz, 0.1..=12.0, "Hz", default_patch.lfo.rate_hz);
                        knob_f32(ui, "LFO depth", &mut state.patch.lfo.depth, 0.0..=1.0, "", default_patch.lfo.depth);
                    });

                    right.add_space(8.0);

                    right.group(|ui| {
                        ui.heading("Envelopes");
                        let default_patch = MiniPatch::default();
                        adsr_ui(ui, "Amp", &mut state.patch.amp_env, default_patch.amp_env);
                        ui.separator();
                        adsr_ui(ui, "Filter", &mut state.patch.filter_env, default_patch.filter_env);
                    });

                    right.add_space(8.0);

                    right.group(|ui| {
                        ui.heading("MIDI Learn");
                        ui.label("Maps CC74 or the next incoming controller to filter cutoff.");

                        ui.horizontal(|ui| {
                            if ui.button("Learn cutoff from next CC").clicked() {
                                state.midi_mappings.begin_learn(
                                    MidiLearnState::new(UiMidiTarget::FilterCutoff)
                                        .with_range(40.0, 8_000.0),
                                );
                                state.status = String::from("Waiting for next MIDI control event");
                            }
                            if ui.button("Clear cutoff mapping").clicked() {
                                state.midi_mappings.clear_target(UiMidiTarget::FilterCutoff);
                                state.status = String::from("Cleared cutoff mapping");
                            }
                        });

                        knob_u8(ui, "Sim CC74", &mut state.midi_cc_value, 0..=127, 100);
                        ui.horizontal(|ui| {
                            if ui.button("Send simulated CC74").clicked() {
                                send_cc = true;
                            }
                        });

                        if let Some(learn_state) = state.midi_mappings.learn_state() {
                            ui.colored_label(
                                Color32::YELLOW,
                                format!("Learning {} from next MIDI event", describe_target(learn_state.target)),
                            );
                        }

                        for mapping in state.midi_mappings.mappings() {
                            ui.label(format!(
                                "{} -> {} ({:.0}..{:.0})",
                                describe_source(mapping.source),
                                describe_target(mapping.target),
                                mapping.min,
                                mapping.max
                            ));
                        }
                    });
                });

                ui.add_space(8.0);
                ui.group(|ui| {
                    ui.heading("Scope");
                    draw_scope(ui, &state.scope_samples);
                });
            });
        });

        if send_cc {
            self.send_simulated_cc();
        }
    }
}

fn apply_simple_style(ctx: &egui::Context) {
    let mut visuals = egui::Visuals::dark();
    visuals.window_fill = PANEL_BG;
    visuals.panel_fill = PANEL_BG;
    visuals.extreme_bg_color = PANEL_BG;
    visuals.faint_bg_color = PANEL_ALT;
    visuals.widgets.noninteractive.bg_fill = PANEL_BG;
    visuals.widgets.noninteractive.fg_stroke = Stroke::new(1.0, LABEL_CREAM);
    visuals.widgets.inactive.bg_fill = PANEL_ALT;
    visuals.widgets.inactive.fg_stroke = Stroke::new(1.0, LABEL_CREAM);
    visuals.widgets.hovered.bg_fill = Color32::from_rgb(52, 61, 76);
    visuals.widgets.hovered.fg_stroke = Stroke::new(1.2, LABEL_CREAM);
    visuals.widgets.active.bg_fill = Color32::from_rgb(63, 74, 94);
    visuals.selection.bg_fill = ACCENT_TEAL;
    visuals.override_text_color = Some(LABEL_CREAM);
    ctx.set_visuals(visuals);
}

fn knob_f32(
    ui: &mut egui::Ui,
    label: &str,
    value: &mut f32,
    range: std::ops::RangeInclusive<f32>,
    unit: &str,
    _reset_value: f32,
) -> egui::Response {
    let span = *range.end() - *range.start();
    let decimals = if span > 100.0 { 0 } else { 2 };
    ui.add(
        egui::Slider::new(value, range)
            .text(label)
            .fixed_decimals(decimals)
            .suffix(unit),
    )
}

fn knob_u8(
    ui: &mut egui::Ui,
    label: &str,
    value: &mut u8,
    range: std::ops::RangeInclusive<u8>,
    _reset_value: u8,
) -> egui::Response {
    let mut as_u32 = *value as u32;
    let resp = ui.add(
        egui::Slider::new(&mut as_u32, *range.start() as u32..=*range.end() as u32).text(label),
    );
    *value = as_u32.clamp(*range.start() as u32, *range.end() as u32) as u8;
    resp
}

fn knob_i8(
    ui: &mut egui::Ui,
    label: &str,
    value: &mut i8,
    range: std::ops::RangeInclusive<i8>,
    _reset_value: i8,
) -> egui::Response {
    let mut as_i32 = *value as i32;
    let resp = ui.add(
        egui::Slider::new(&mut as_i32, *range.start() as i32..=*range.end() as i32).text(label),
    );
    *value = as_i32.clamp(*range.start() as i32, *range.end() as i32) as i8;
    resp
}

fn waveform_selector(ui: &mut egui::Ui, label: &str, waveform: &mut LfoWaveform) {
    egui::ComboBox::from_label(label)
        .selected_text(lfo_waveform_label(*waveform))
        .show_ui(ui, |ui| {
            for option in [
                LfoWaveform::Sine,
                LfoWaveform::Triangle,
                LfoWaveform::SawUp,
                LfoWaveform::SawDown,
                LfoWaveform::Square,
                LfoWaveform::SampleHold,
            ] {
                ui.selectable_value(waveform, option, lfo_waveform_label(option));
            }
        });
}

fn oscillator_ui(ui: &mut egui::Ui, label: &str, osc: &mut OscPatch, reset_osc: OscPatch) {
    ui.label(RichText::new(label).strong().color(LABEL_GOLD));
    ui.horizontal(|ui| {
        egui::ComboBox::from_id_salt(label)
            .selected_text(osc_waveform_label(osc.waveform))
            .show_ui(ui, |ui| {
                for waveform in [
                    BasicWaveform::Saw,
                    BasicWaveform::Square,
                    BasicWaveform::Triangle,
                    BasicWaveform::Sine,
                ] {
                    ui.selectable_value(&mut osc.waveform, waveform, osc_waveform_label(waveform));
                }
            });
        ui.checkbox(&mut osc.kbd_track, "Keyboard tracking");
    });
    knob_f32(ui, "Level", &mut osc.level, 0.0..=1.0, "", reset_osc.level);
    knob_i8(
        ui,
        "Range",
        &mut osc.semitones,
        -24..=24,
        reset_osc.semitones,
    );
    knob_f32(
        ui,
        "Fine",
        &mut osc.cents,
        -50.0..=50.0,
        "c",
        reset_osc.cents,
    );
}

fn adsr_ui(ui: &mut egui::Ui, label: &str, env: &mut AdsrParams, reset_env: AdsrParams) {
    ui.label(RichText::new(label).strong().color(LABEL_GOLD));
    knob_f32(
        ui,
        "Attack",
        &mut env.attack_seconds,
        0.001..=2.0,
        "s",
        reset_env.attack_seconds,
    );
    knob_f32(
        ui,
        "Decay",
        &mut env.decay_seconds,
        0.01..=3.0,
        "s",
        reset_env.decay_seconds,
    );
    knob_f32(
        ui,
        "Sustain",
        &mut env.sustain_level,
        0.0..=1.0,
        "",
        reset_env.sustain_level,
    );
    knob_f32(
        ui,
        "Release",
        &mut env.release_seconds,
        0.01..=3.0,
        "s",
        reset_env.release_seconds,
    );
}

fn draw_scope(ui: &mut egui::Ui, samples: &[f32]) {
    let desired_size = Vec2::new(ui.available_width(), 140.0);
    let (rect, _) = ui.allocate_exact_size(desired_size, Sense::hover());
    let painter = ui.painter_at(rect);

    painter.rect_stroke(
        rect,
        4.0,
        Stroke::new(1.0, Color32::from_gray(70)),
        egui::StrokeKind::Outside,
    );

    if samples.len() < 2 {
        return;
    }

    let center_y = rect.center().y;
    painter.line_segment(
        [
            Pos2::new(rect.left(), center_y),
            Pos2::new(rect.right(), center_y),
        ],
        Stroke::new(1.0, Color32::from_gray(50)),
    );

    let width = rect.width().max(1.0);
    let height = rect.height().max(1.0);
    let last_index = (samples.len() - 1).max(1) as f32;

    let points: Vec<Pos2> = samples
        .iter()
        .enumerate()
        .map(|(index, sample)| {
            let x = rect.left() + width * (index as f32 / last_index);
            let y = rect.center().y - sample.clamp(-1.0, 1.0) * (height * 0.45);
            Pos2::new(x, y)
        })
        .collect();

    painter.add(egui::Shape::line(
        points,
        Stroke::new(1.5, Color32::LIGHT_GREEN),
    ));
}

fn apply_control_change(patch: &mut MiniPatch, change: ControlChange<UiMidiTarget>) {
    match change.target {
        UiMidiTarget::FilterCutoff => patch.filter.cutoff_hz = change.value,
    }
}

fn start_midi_input(shared: Arc<Mutex<SharedUiState>>) -> Result<MidiInputConnection<()>, String> {
    let mut midi_input = MidiInput::new("purr-synth-core minimoog input")
        .map_err(|error| format!("failed to initialize MIDI input: {error}"))?;
    midi_input.ignore(Ignore::None);

    let ports = midi_input.ports();
    let Some(port) = ports.first() else {
        return Err(String::from("no MIDI input ports found"));
    };

    let port_name = midi_input
        .port_name(port)
        .map_err(|error| format!("failed to read MIDI port name: {error}"))?;

    let callback_shared = shared.clone();
    let connection = midi_input
        .connect(
            port,
            "purr-synth-core minimoog listener",
            move |_timestamp, message, _| handle_midi_message(&callback_shared, message),
            (),
        )
        .map_err(|error| format!("failed to connect MIDI input: {error}"))?;

    if let Ok(mut state) = shared.lock() {
        state.midi_port_name = Some(port_name.clone());
        state.status = match state.status.as_str() {
            "Audio running" => String::from("Audio + MIDI running"),
            current => format!("{current}; MIDI connected"),
        };
    }

    Ok(connection)
}

fn handle_midi_message(shared: &Arc<Mutex<SharedUiState>>, message: &[u8]) {
    if message.is_empty() {
        return;
    }

    let status = message[0];
    let message_type = status & 0xF0;
    let channel = status & 0x0F;
    let data1 = *message.get(1).unwrap_or(&0);
    let data2 = *message.get(2).unwrap_or(&0);

    let Ok(mut state) = shared.lock() else {
        return;
    };

    match message_type {
        0x90 => {
            if data2 == 0 {
                queue_note_off(&mut state, data1);
                state.status = format!("MIDI note off {}", data1);
            } else {
                queue_note_on(&mut state, data1, (data2 as f32 / 127.0).clamp(0.0, 1.0));
                state.midi_note = data1;
                state.velocity = (data2 as f32 / 127.0).clamp(0.0, 1.0);
                state.status = format!("MIDI note on {} vel {}", data1, data2);
            }
        }
        0x80 => {
            queue_note_off(&mut state, data1);
            state.status = format!("MIDI note off {}", data1);
        }
        0xB0 => {
            let event = MidiControlEvent::ControlChange {
                channel,
                controller: data1,
                value: data2,
            };
            apply_midi_control_event(&mut state, event);
        }
        _ => {}
    }
}

fn apply_midi_control_event(state: &mut SharedUiState, event: MidiControlEvent) {
    if state.midi_mappings.learn_state().is_some() {
        if let Some(mapping) = state.midi_mappings.learn_from_event(event) {
            state.status = format!(
                "Learned controller {} for cutoff",
                describe_source(mapping.source)
            );
        }
    }

    let changes = state.midi_mappings.evaluate(event);
    for change in changes {
        apply_control_change(&mut state.patch, change);
        state.status = format!(
            "Applied {} via MIDI ({:.0} Hz)",
            describe_target(change.target),
            state.patch.filter.cutoff_hz
        );
    }
}

fn start_audio(shared: Arc<Mutex<SharedUiState>>) -> Result<cpal::Stream, String> {
    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .ok_or_else(|| String::from("no default output device available"))?;
    let config = device
        .default_output_config()
        .map_err(|error| format!("default output config failed: {error}"))?;
    let sample_rate = config.sample_rate().0 as f32;
    let channels = config.channels() as usize;

    let mut runtime = build_runtime(sample_rate);
    let mut meter = LevelMeter::default();
    let mut scope = ScopeCapture::new(SCOPE_CAPACITY, SCOPE_DECIMATION);

    let err_shared = shared.clone();
    let error_callback = move |error| {
        if let Ok(mut state) = err_shared.lock() {
            state.status = format!("Audio stream error: {error}");
        }
    };

    let stream = match config.sample_format() {
        cpal::SampleFormat::F32 => device
            .build_output_stream(
                &config.clone().into(),
                move |data: &mut [f32], _| {
                    write_output(
                        data,
                        channels,
                        &shared,
                        &mut runtime,
                        &mut meter,
                        &mut scope,
                    )
                },
                error_callback,
                None,
            )
            .map_err(|error| format!("failed to build f32 output stream: {error}"))?,
        cpal::SampleFormat::I16 => device
            .build_output_stream(
                &config.clone().into(),
                move |data: &mut [i16], _| {
                    write_output_i16(
                        data,
                        channels,
                        &shared,
                        &mut runtime,
                        &mut meter,
                        &mut scope,
                    )
                },
                error_callback,
                None,
            )
            .map_err(|error| format!("failed to build i16 output stream: {error}"))?,
        cpal::SampleFormat::U16 => device
            .build_output_stream(
                &config.clone().into(),
                move |data: &mut [u16], _| {
                    write_output_u16(
                        data,
                        channels,
                        &shared,
                        &mut runtime,
                        &mut meter,
                        &mut scope,
                    )
                },
                error_callback,
                None,
            )
            .map_err(|error| format!("failed to build u16 output stream: {error}"))?,
        sample_format => {
            return Err(format!("unsupported sample format: {sample_format:?}"));
        }
    };

    stream
        .play()
        .map_err(|error| format!("failed to start audio stream: {error}"))?;
    Ok(stream)
}

fn build_runtime(sample_rate: f32) -> SynthRuntime<MiniSynth, MiniVoice> {
    let voices = vec![MiniVoice::new(sample_rate)];
    let mut runtime = SynthRuntime::new(MiniPatch::default(), voices, sample_rate);
    runtime.set_voice_mode(VoiceMode::Monophonic { legato: true });
    runtime.modulation_mut().push(ModRoute::new(
        MiniModSource::FilterEnvelope,
        MiniModTarget::FilterCutoff,
        1.0,
    ));
    runtime.modulation_mut().push(ModRoute::new(
        MiniModSource::Lfo,
        MiniModTarget::FilterCutoff,
        0.25,
    ));
    runtime.modulation_mut().push(ModRoute::new(
        MiniModSource::Lfo,
        MiniModTarget::Osc1Pitch,
        0.08,
    ));
    runtime.modulation_mut().push(ModRoute::new(
        MiniModSource::Lfo,
        MiniModTarget::Osc2Pitch,
        0.08,
    ));
    runtime.modulation_mut().push(ModRoute::new(
        MiniModSource::Lfo,
        MiniModTarget::Osc3Pitch,
        0.08,
    ));
    runtime
}

fn write_output(
    data: &mut [f32],
    channels: usize,
    shared: &Arc<Mutex<SharedUiState>>,
    runtime: &mut SynthRuntime<MiniSynth, MiniVoice>,
    meter: &mut LevelMeter,
    scope: &mut ScopeCapture,
) {
    let (patch, pending_events) = {
        let mut state = shared.lock().expect("shared UI state mutex poisoned");
        let pending_events = state.pending_events.drain(..).collect::<Vec<_>>();
        (state.patch.clone(), pending_events)
    };

    *runtime.patch_mut() = patch;
    for event in pending_events {
        runtime.handle_event(event);
    }
    meter.reset();

    for frame in data.chunks_mut(channels.max(1)) {
        let rendered = runtime.render_frame();
        let mono = (rendered.left + rendered.right) * 0.5;
        meter.push(mono);
        scope.push(mono);

        for (channel_index, sample) in frame.iter_mut().enumerate() {
            *sample = if channel_index % 2 == 0 {
                rendered.left
            } else {
                rendered.right
            };
        }
    }

    let scope_snapshot: Vec<f32> = (0..SCOPE_CAPACITY)
        .rev()
        .map(|delay| scope.latest(delay))
        .collect();

    if let Ok(mut state) = shared.lock() {
        state.peak = meter.peak().clamp(0.0, 1.0);
        state.rms = meter.rms().clamp(0.0, 1.0);
        state.scope_samples = scope_snapshot;
    }
}

fn write_output_i16(
    data: &mut [i16],
    channels: usize,
    shared: &Arc<Mutex<SharedUiState>>,
    runtime: &mut SynthRuntime<MiniSynth, MiniVoice>,
    meter: &mut LevelMeter,
    scope: &mut ScopeCapture,
) {
    let mut scratch = vec![0.0_f32; data.len()];
    write_output(&mut scratch, channels, shared, runtime, meter, scope);
    for (dst, src) in data.iter_mut().zip(scratch.into_iter()) {
        *dst = (src.clamp(-1.0, 1.0) * i16::MAX as f32) as i16;
    }
}

fn write_output_u16(
    data: &mut [u16],
    channels: usize,
    shared: &Arc<Mutex<SharedUiState>>,
    runtime: &mut SynthRuntime<MiniSynth, MiniVoice>,
    meter: &mut LevelMeter,
    scope: &mut ScopeCapture,
) {
    let mut scratch = vec![0.0_f32; data.len()];
    write_output(&mut scratch, channels, shared, runtime, meter, scope);
    for (dst, src) in data.iter_mut().zip(scratch.into_iter()) {
        let normalized = (src.clamp(-1.0, 1.0) + 1.0) * 0.5;
        *dst = (normalized * u16::MAX as f32) as u16;
    }
}

fn queue_note_on(state: &mut SharedUiState, midi_note: u8, velocity: f32) {
    state.active_notes.retain(|note| *note != midi_note);
    state.active_notes.push(midi_note);
    state
        .pending_events
        .push(SynthEvent::NoteOn(NoteId::new(midi_note, velocity)));
}

fn queue_note_off(state: &mut SharedUiState, midi_note: u8) {
    state.active_notes.retain(|note| *note != midi_note);
    state.pending_events.push(SynthEvent::NoteOff { midi_note });
}

fn describe_source(source: MidiControlSource) -> String {
    match source {
        MidiControlSource::ControlChange {
            channel,
            controller,
        } => match channel {
            Some(channel) => format!("CC{controller} ch{}", channel + 1),
            None => format!("CC{controller} any channel"),
        },
        MidiControlSource::PitchBend { channel } => match channel {
            Some(channel) => format!("Pitch bend ch{}", channel + 1),
            None => String::from("Pitch bend any channel"),
        },
        MidiControlSource::ChannelPressure { channel } => match channel {
            Some(channel) => format!("Aftertouch ch{}", channel + 1),
            None => String::from("Aftertouch any channel"),
        },
        MidiControlSource::PolyPressure { channel, note } => {
            format!("Poly pressure ch{:?} note{:?}", channel, note)
        }
    }
}

fn describe_target(target: UiMidiTarget) -> &'static str {
    match target {
        UiMidiTarget::FilterCutoff => "filter cutoff",
    }
}

fn osc_waveform_label(waveform: BasicWaveform) -> &'static str {
    match waveform {
        BasicWaveform::Sine => "Sine",
        BasicWaveform::Saw => "Saw",
        BasicWaveform::Square => "Square",
        BasicWaveform::Triangle => "Triangle",
    }
}

fn lfo_waveform_label(waveform: LfoWaveform) -> &'static str {
    match waveform {
        LfoWaveform::Sine => "Sine",
        LfoWaveform::Triangle => "Triangle",
        LfoWaveform::SawUp => "Saw up",
        LfoWaveform::SawDown => "Saw down",
        LfoWaveform::Square => "Square",
        LfoWaveform::SampleHold => "Sample + hold",
    }
}

fn main() -> eframe::Result<()> {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([1080.0, 860.0]),
        ..Default::default()
    };

    eframe::run_native(
        "Purr Synth Core - Minimoog UI",
        options,
        Box::new(|_creation_context| Ok(Box::new(MinimoogUiApp::new()))),
    )
}
