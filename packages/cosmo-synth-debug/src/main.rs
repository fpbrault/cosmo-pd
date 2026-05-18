use std::collections::HashSet;
use std::sync::atomic::{AtomicU32, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Instant;

use cosmo_synth_engine::processor::{CosmoProcessor, midi_note_to_freq};
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use eframe::egui;

mod scenarios;

const BASE_NOTE: i32 = 60;
const OCTAVE_MIN: i32 = -2;
const OCTAVE_MAX: i32 = 2;

#[derive(Clone, Copy)]
struct KeyBinding {
    key: egui::Key,
    semitone: i32,
    black: bool,
    label: &'static str,
}

const KEY_BINDINGS: &[KeyBinding] = &[
    KeyBinding {
        key: egui::Key::Z,
        semitone: 0,
        black: false,
        label: "Z",
    },
    KeyBinding {
        key: egui::Key::S,
        semitone: 1,
        black: true,
        label: "S",
    },
    KeyBinding {
        key: egui::Key::X,
        semitone: 2,
        black: false,
        label: "X",
    },
    KeyBinding {
        key: egui::Key::D,
        semitone: 3,
        black: true,
        label: "D",
    },
    KeyBinding {
        key: egui::Key::C,
        semitone: 4,
        black: false,
        label: "C",
    },
    KeyBinding {
        key: egui::Key::V,
        semitone: 5,
        black: false,
        label: "V",
    },
    KeyBinding {
        key: egui::Key::G,
        semitone: 6,
        black: true,
        label: "G",
    },
    KeyBinding {
        key: egui::Key::B,
        semitone: 7,
        black: false,
        label: "B",
    },
    KeyBinding {
        key: egui::Key::H,
        semitone: 8,
        black: true,
        label: "H",
    },
    KeyBinding {
        key: egui::Key::N,
        semitone: 9,
        black: false,
        label: "N",
    },
    KeyBinding {
        key: egui::Key::J,
        semitone: 10,
        black: true,
        label: "J",
    },
    KeyBinding {
        key: egui::Key::M,
        semitone: 11,
        black: false,
        label: "M",
    },
    KeyBinding {
        key: egui::Key::Q,
        semitone: 12,
        black: false,
        label: "Q",
    },
    KeyBinding {
        key: egui::Key::Num2,
        semitone: 13,
        black: true,
        label: "2",
    },
    KeyBinding {
        key: egui::Key::W,
        semitone: 14,
        black: false,
        label: "W",
    },
    KeyBinding {
        key: egui::Key::Num3,
        semitone: 15,
        black: true,
        label: "3",
    },
    KeyBinding {
        key: egui::Key::E,
        semitone: 16,
        black: false,
        label: "E",
    },
    KeyBinding {
        key: egui::Key::R,
        semitone: 17,
        black: false,
        label: "R",
    },
    KeyBinding {
        key: egui::Key::Num5,
        semitone: 18,
        black: true,
        label: "5",
    },
    KeyBinding {
        key: egui::Key::T,
        semitone: 19,
        black: false,
        label: "T",
    },
    KeyBinding {
        key: egui::Key::Num6,
        semitone: 20,
        black: true,
        label: "6",
    },
    KeyBinding {
        key: egui::Key::Y,
        semitone: 21,
        black: false,
        label: "Y",
    },
    KeyBinding {
        key: egui::Key::Num7,
        semitone: 22,
        black: true,
        label: "7",
    },
    KeyBinding {
        key: egui::Key::U,
        semitone: 23,
        black: false,
        label: "U",
    },
];

struct DebugApp {
    processor: Arc<Mutex<CosmoProcessor>>,
    _stream: Option<cpal::Stream>,
    presets: Vec<(&'static str, cosmo_synth_engine::params::SynthParams)>,
    selected_preset: usize,
    octave_offset: i32,
    prev_keys: HashSet<egui::Key>,
    sample_rate: f32,
    peak_bits: Arc<AtomicU32>,
    block_ns: Arc<AtomicU64>,
    block_samples: Arc<AtomicU32>,
    audio_error: Option<String>,
}

fn key_to_midi(binding: KeyBinding, octave_offset: i32) -> Option<u8> {
    let note = BASE_NOTE + binding.semitone + octave_offset * 12;
    if (0..=127).contains(&note) {
        Some(note as u8)
    } else {
        None
    }
}

impl DebugApp {
    fn new() -> Self {
        let host = cpal::default_host();
        let mut audio_error = None;
        let mut stream = None;
        let mut sample_rate = 48_000.0;

        let processor = Arc::new(Mutex::new(CosmoProcessor::new(sample_rate)));
        let peak_bits = Arc::new(AtomicU32::new(0));
        let block_ns = Arc::new(AtomicU64::new(0));
        let block_samples = Arc::new(AtomicU32::new(0));

        match build_audio_stream(
            &host,
            Arc::clone(&processor),
            Arc::clone(&peak_bits),
            Arc::clone(&block_ns),
            Arc::clone(&block_samples),
        ) {
            Ok((s, sr)) => {
                sample_rate = sr;
                if let Ok(mut proc) = processor.lock() {
                    *proc = CosmoProcessor::new(sample_rate);
                }
                if let Err(err) = s.play() {
                    audio_error = Some(format!("Failed to start audio stream: {err}"));
                }
                stream = Some(s);
            }
            Err(err) => {
                audio_error = Some(err);
            }
        }

        let presets = scenarios::presets();
        if let Ok(mut proc) = processor.lock() {
            proc.set_params(presets[0].1.clone());
            proc.reset_audio_state();
        }

        Self {
            processor,
            _stream: stream,
            presets,
            selected_preset: 0,
            octave_offset: 0,
            prev_keys: HashSet::new(),
            sample_rate,
            peak_bits,
            block_ns,
            block_samples,
            audio_error,
        }
    }

    fn release_all_active_keys(&mut self, octave_offset: i32) {
        if let Ok(mut proc) = self.processor.lock() {
            for binding in KEY_BINDINGS {
                if self.prev_keys.contains(&binding.key)
                    && let Some(note) = key_to_midi(*binding, octave_offset) {
                        proc.note_off(note);
                    }
            }
        }
    }

    fn handle_keyboard(&mut self, ctx: &egui::Context) -> HashSet<u8> {
        let mut held_notes = HashSet::new();
        let mut current_keys = HashSet::new();

        if let Ok(mut proc) = self.processor.lock() {
            for binding in KEY_BINDINGS {
                let down = ctx.input(|i| i.key_down(binding.key));
                if down {
                    current_keys.insert(binding.key);
                }

                if let Some(note) = key_to_midi(*binding, self.octave_offset) {
                    if down {
                        held_notes.insert(note);
                    }
                    let was_down = self.prev_keys.contains(&binding.key);
                    if down && !was_down {
                        proc.note_on(note, midi_note_to_freq(note), 0.9);
                    } else if !down && was_down {
                        proc.note_off(note);
                    }
                }
            }
        }

        self.prev_keys = current_keys;
        held_notes
    }

    fn apply_selected_preset(&mut self) {
        if let Ok(mut proc) = self.processor.lock() {
            proc.set_params(self.presets[self.selected_preset].1.clone());
            proc.reset_audio_state();
        }
    }
}

impl eframe::App for DebugApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        ctx.request_repaint();

        let held_notes = self.handle_keyboard(ctx);

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("Cosmo Synth Debug");
            ui.label("Minimal native harness to profile engine cost without browser overhead.");
            ui.separator();

            if let Some(err) = &self.audio_error {
                ui.colored_label(egui::Color32::RED, err);
                ui.separator();
            }

            let mut preset_changed = false;
            egui::ComboBox::from_label("Preset")
                .selected_text(self.presets[self.selected_preset].0)
                .show_ui(ui, |ui| {
                    for (idx, (name, _)) in self.presets.iter().enumerate() {
                        if ui
                            .selectable_value(&mut self.selected_preset, idx, *name)
                            .changed()
                        {
                            preset_changed = true;
                        }
                    }
                });

            if preset_changed {
                self.apply_selected_preset();
            }

            ui.horizontal(|ui| {
                ui.label("Octave");
                if ui.button("-").clicked() && self.octave_offset > OCTAVE_MIN {
                    let old = self.octave_offset;
                    self.release_all_active_keys(old);
                    self.prev_keys.clear();
                    self.octave_offset -= 1;
                }
                ui.label(format!("{}", self.octave_offset));
                if ui.button("+").clicked() && self.octave_offset < OCTAVE_MAX {
                    let old = self.octave_offset;
                    self.release_all_active_keys(old);
                    self.prev_keys.clear();
                    self.octave_offset += 1;
                }
            });

            let peak = f32::from_bits(self.peak_bits.load(Ordering::Relaxed)).clamp(0.0, 1.0);
            let block_ns = self.block_ns.load(Ordering::Relaxed);
            let block_samples = self.block_samples.load(Ordering::Relaxed) as f32;
            let rt_percent = if block_samples > 0.0 {
                let real_time_ns = (block_samples / self.sample_rate) as f64 * 1_000_000_000.0;
                if real_time_ns > 0.0 {
                    (block_ns as f64 / real_time_ns * 100.0) as f32
                } else {
                    0.0
                }
            } else {
                0.0
            };

            ui.label(format!("Sample rate: {:.0} Hz", self.sample_rate));
            ui.label(format!(
                "Block time: {:.3} ms",
                block_ns as f64 / 1_000_000.0
            ));
            ui.label(format!("RT load: {:.1}%", rt_percent));
            ui.add(
                egui::ProgressBar::new((rt_percent / 100.0).clamp(0.0, 1.0))
                    .text("Real-time budget"),
            );
            ui.add(egui::ProgressBar::new(peak).text("Peak level"));
            ui.separator();

            let desired_size = egui::vec2(ui.available_width().max(300.0), 140.0);
            let (rect, _resp) = ui.allocate_exact_size(desired_size, egui::Sense::hover());
            let painter = ui.painter_at(rect);

            let white_bindings: Vec<_> = KEY_BINDINGS.iter().filter(|k| !k.black).collect();
            let black_bindings: Vec<_> = KEY_BINDINGS.iter().filter(|k| k.black).collect();

            let white_w = rect.width() / white_bindings.len() as f32;
            let white_h = rect.height();
            let black_w = white_w * 0.62;
            let black_h = white_h * 0.62;

            for (idx, binding) in white_bindings.iter().enumerate() {
                let x = rect.left() + idx as f32 * white_w;
                let r = egui::Rect::from_min_size(
                    egui::pos2(x, rect.top()),
                    egui::vec2(white_w - 2.0, white_h),
                );
                let held = key_to_midi(**binding, self.octave_offset)
                    .map(|n| held_notes.contains(&n))
                    .unwrap_or(false);
                let fill = if held {
                    egui::Color32::from_rgb(180, 230, 200)
                } else {
                    egui::Color32::from_gray(245)
                };
                painter.rect_filled(r, 2.0, fill);
                painter.rect_stroke(
                    r,
                    2.0,
                    egui::Stroke::new(1.0, egui::Color32::from_gray(80)),
                    egui::StrokeKind::Inside,
                );
                painter.text(
                    egui::pos2(r.center().x, r.bottom() - 14.0),
                    egui::Align2::CENTER_CENTER,
                    binding.label,
                    egui::FontId::monospace(12.0),
                    egui::Color32::from_gray(30),
                );
            }

            for binding in black_bindings {
                let semitone = binding.semitone.rem_euclid(12);
                let left_white = match semitone {
                    1 => 0,
                    3 => 1,
                    6 => 3,
                    8 => 4,
                    10 => 5,
                    _ => continue,
                };
                let octave = binding.semitone / 12;
                let white_index = octave * 7 + left_white;
                let x = rect.left() + (white_index as f32 + 1.0) * white_w - black_w * 0.5;
                let r = egui::Rect::from_min_size(
                    egui::pos2(x, rect.top()),
                    egui::vec2(black_w, black_h),
                );
                let held = key_to_midi(*binding, self.octave_offset)
                    .map(|n| held_notes.contains(&n))
                    .unwrap_or(false);
                let fill = if held {
                    egui::Color32::from_rgb(90, 140, 120)
                } else {
                    egui::Color32::from_gray(30)
                };
                painter.rect_filled(r, 2.0, fill);
                painter.rect_stroke(
                    r,
                    2.0,
                    egui::Stroke::new(1.0, egui::Color32::from_gray(10)),
                    egui::StrokeKind::Inside,
                );
                painter.text(
                    egui::pos2(r.center().x, r.bottom() - 12.0),
                    egui::Align2::CENTER_CENTER,
                    binding.label,
                    egui::FontId::monospace(11.0),
                    egui::Color32::from_gray(235),
                );
            }
        });
    }
}

fn build_audio_stream(
    host: &cpal::Host,
    processor: Arc<Mutex<CosmoProcessor>>,
    peak_bits: Arc<AtomicU32>,
    block_ns: Arc<AtomicU64>,
    block_samples: Arc<AtomicU32>,
) -> Result<(cpal::Stream, f32), String> {
    let device = host
        .default_output_device()
        .ok_or_else(|| "No default output audio device found".to_string())?;
    let supported_config = device
        .default_output_config()
        .map_err(|e| format!("Failed to query default output config: {e}"))?;
    let sample_rate = supported_config.sample_rate().0 as f32;
    let config: cpal::StreamConfig = supported_config.config();
    let channels = config.channels as usize;

    let stream = match supported_config.sample_format() {
        cpal::SampleFormat::F32 => build_output_stream_f32(
            &device,
            &config,
            channels,
            processor,
            peak_bits,
            block_ns,
            block_samples,
        )?,
        cpal::SampleFormat::I16 => build_output_stream_i16(
            &device,
            &config,
            channels,
            processor,
            peak_bits,
            block_ns,
            block_samples,
        )?,
        cpal::SampleFormat::U16 => build_output_stream_u16(
            &device,
            &config,
            channels,
            processor,
            peak_bits,
            block_ns,
            block_samples,
        )?,
        other => {
            return Err(format!("Unsupported sample format: {other:?}"));
        }
    };

    Ok((stream, sample_rate))
}

fn render_block(
    processor: &Arc<Mutex<CosmoProcessor>>,
    peak_bits: &AtomicU32,
    block_ns: &AtomicU64,
    block_samples: &AtomicU32,
    frames: usize,
) -> Vec<f32> {
    let mut mono = vec![0.0_f32; frames];
    let start = Instant::now();

    if let Ok(mut proc) = processor.try_lock() {
        proc.process(&mut mono);
    }

    let peak = mono
        .iter()
        .fold(0.0_f32, |acc, x| acc.max(x.abs()))
        .clamp(0.0, 1.0);
    peak_bits.store(peak.to_bits(), Ordering::Relaxed);
    block_ns.store(start.elapsed().as_nanos() as u64, Ordering::Relaxed);
    block_samples.store(frames as u32, Ordering::Relaxed);

    mono
}

fn build_output_stream_f32(
    device: &cpal::Device,
    config: &cpal::StreamConfig,
    channels: usize,
    processor: Arc<Mutex<CosmoProcessor>>,
    peak_bits: Arc<AtomicU32>,
    block_ns: Arc<AtomicU64>,
    block_samples: Arc<AtomicU32>,
) -> Result<cpal::Stream, String> {
    let err_fn = |err| eprintln!("Audio stream error: {err}");
    device
        .build_output_stream(
            config,
            move |data: &mut [f32], _| {
                let frames = data.len() / channels;
                let mono = render_block(&processor, &peak_bits, &block_ns, &block_samples, frames);
                for (idx, frame) in data.chunks_mut(channels).enumerate() {
                    let s = mono[idx];
                    for out in frame {
                        *out = s;
                    }
                }
            },
            err_fn,
            None,
        )
        .map_err(|e| format!("Failed to build output stream: {e}"))
}

fn build_output_stream_i16(
    device: &cpal::Device,
    config: &cpal::StreamConfig,
    channels: usize,
    processor: Arc<Mutex<CosmoProcessor>>,
    peak_bits: Arc<AtomicU32>,
    block_ns: Arc<AtomicU64>,
    block_samples: Arc<AtomicU32>,
) -> Result<cpal::Stream, String> {
    let err_fn = |err| eprintln!("Audio stream error: {err}");
    device
        .build_output_stream(
            config,
            move |data: &mut [i16], _| {
                let frames = data.len() / channels;
                let mono = render_block(&processor, &peak_bits, &block_ns, &block_samples, frames);
                for (idx, frame) in data.chunks_mut(channels).enumerate() {
                    let s = (mono[idx].clamp(-1.0, 1.0) * i16::MAX as f32) as i16;
                    for out in frame {
                        *out = s;
                    }
                }
            },
            err_fn,
            None,
        )
        .map_err(|e| format!("Failed to build output stream: {e}"))
}

fn build_output_stream_u16(
    device: &cpal::Device,
    config: &cpal::StreamConfig,
    channels: usize,
    processor: Arc<Mutex<CosmoProcessor>>,
    peak_bits: Arc<AtomicU32>,
    block_ns: Arc<AtomicU64>,
    block_samples: Arc<AtomicU32>,
) -> Result<cpal::Stream, String> {
    let err_fn = |err| eprintln!("Audio stream error: {err}");
    device
        .build_output_stream(
            config,
            move |data: &mut [u16], _| {
                let frames = data.len() / channels;
                let mono = render_block(&processor, &peak_bits, &block_ns, &block_samples, frames);
                for (idx, frame) in data.chunks_mut(channels).enumerate() {
                    let s = ((mono[idx].clamp(-1.0, 1.0) * 0.5 + 0.5) * u16::MAX as f32) as u16;
                    for out in frame {
                        *out = s;
                    }
                }
            },
            err_fn,
            None,
        )
        .map_err(|e| format!("Failed to build output stream: {e}"))
}

fn main() -> eframe::Result {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([900.0, 380.0])
            .with_min_inner_size([640.0, 320.0]),
        ..Default::default()
    };

    eframe::run_native(
        "Cosmo Synth Debug",
        options,
        Box::new(|_cc| Ok(Box::new(DebugApp::new()))),
    )
}
