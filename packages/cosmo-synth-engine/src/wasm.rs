//! wasm-bindgen glue for the Cosmo PD-101 DSP engine.
//!
//! Exposes `CzSynthProcessor` to JavaScript — used by `czSynthWorklet.js`
//! which runs inside an AudioWorklet scope.
//!
//! Compile with:
//!   wasm-pack build --target no-modules --out-dir $(pwd)/public \
//!     -- --features wasm

use wasm_bindgen::prelude::*;

use crate::params::{FxSlotType, SynthParams};
use crate::processor::{CosmoProcessor, RuntimeModSources};

/// WebAssembly wrapper around [`CosmoProcessor`].
///
/// All public methods map 1-to-1 to the messages the AudioWorklet receives
/// from the main thread so the JS worklet shim stays minimal.
#[wasm_bindgen]
pub struct CzSynthProcessor {
    inner: CosmoProcessor,
}

#[wasm_bindgen]
impl CzSynthProcessor {
    /// Create a new processor at the given sample rate.
    #[wasm_bindgen(constructor)]
    pub fn new(sample_rate: f32) -> CzSynthProcessor {
        CzSynthProcessor {
            inner: CosmoProcessor::new(sample_rate),
        }
    }

    /// Replace all synthesis parameters from a JSON string.
    ///
    /// The caller serializes `SynthParams` with `JSON.stringify` and passes
    /// the result here; we parse it with `serde_json` on the Rust side.
    #[wasm_bindgen(js_name = setParams)]
    pub fn set_params(&mut self, json: &str) {
        match serde_json::from_str::<SynthParams>(json) {
            Ok(p) => self.inner.set_params(p),
            Err(e) => {
                web_sys::console::error_1(
                    &format!("[cosmo-synth-engine] setParams parse error: {e}").into(),
                );
            }
        }
    }

    /// Apply a named module preset directly in the engine.
    ///
    /// Returns `true` when the module/preset pair is recognized.
    #[wasm_bindgen(js_name = applyModulePreset)]
    pub fn apply_module_preset(&mut self, module: &str, preset: &str) -> bool {
        self.inner.apply_module_preset(module, preset)
    }

    /// Trigger a note-on event.
    ///
    /// * `note`      — MIDI note number (0-127)
    /// * `velocity`  — normalised 0.0-1.0
    #[wasm_bindgen(js_name = noteOn)]
    pub fn note_on(&mut self, note: u8, velocity: f32) {
        self.inner.note_on(note, velocity);
    }

    /// Trigger a note-off event.
    #[wasm_bindgen(js_name = noteOff)]
    pub fn note_off(&mut self, note: u8) {
        self.inner.note_off(note);
    }

    /// Set the sustain (damper) pedal state.
    #[wasm_bindgen(js_name = setSustain)]
    pub fn set_sustain(&mut self, on: bool) {
        self.inner.set_sustain(on);
    }

    /// Set pitch bend. `value` is normalised [-1.0, 1.0] (MIDI 14-bit mapped to this range).
    /// Actual pitch shift in semitones = value * params.pitchBendRange.
    #[wasm_bindgen(js_name = setPitchBend)]
    pub fn set_pitch_bend(&mut self, value: f32) {
        self.inner.set_pitch_bend(value);
    }

    /// Set mod wheel value. `value` is normalised [0.0, 1.0] (CC1 / 127).
    #[wasm_bindgen(js_name = setModWheel)]
    pub fn set_mod_wheel(&mut self, value: f32) {
        self.inner.set_mod_wheel(value);
    }

    /// Set aftertouch/channel pressure value. `value` is normalised [0.0, 1.0].
    #[wasm_bindgen(js_name = setAftertouch)]
    pub fn set_aftertouch(&mut self, value: f32) {
        self.inner.set_aftertouch(value);
    }

    /// Enable or disable MIDI learn mode in the engine.
    #[wasm_bindgen(js_name = setMidiLearnEnabled)]
    pub fn set_midi_learn_enabled(&mut self, enabled: bool) {
        self.inner.set_midi_learn_enabled(enabled);
    }

    /// Set the active MIDI learn target in the engine.
    ///
    /// `target_key` must match a supported engine parameter key.
    /// Returns `true` when accepted.
    #[wasm_bindgen(js_name = setMidiLearnTarget)]
    pub fn set_midi_learn_target(
        &mut self,
        target_key: &str,
        min: f32,
        max: f32,
        curve: &str,
    ) -> bool {
        self.inner
            .set_midi_learn_target(target_key, min, max, curve)
    }

    /// Forward an incoming MIDI CC message to the engine mapping/runtime.
    #[wasm_bindgen(js_name = midiCc)]
    pub fn midi_cc(&mut self, channel: u8, controller: u8, value: u8) {
        self.inner.midi_control_change(channel, controller, value);
    }

    /// Return active engine MIDI mappings as JSON telemetry.
    #[wasm_bindgen(js_name = getMidiMappings)]
    pub fn get_midi_mappings(&self) -> String {
        match serde_json::to_string(&self.inner.midi_mappings()) {
            Ok(json) => json,
            Err(_) => String::from("[]"),
        }
    }

    /// Set which effect type occupies a given FX slot (0–5).
    ///
    /// `type_name` is the camelCase string representation of `FxSlotType`
    /// (e.g. `"chorus"`, `"reverb"`, `"compressor"`, `"eq5Band"`, …).
    /// Returns `true` on success, `false` when `slot ≥ 6` or type is unknown.
    #[wasm_bindgen(js_name = setFxSlotType)]
    pub fn set_fx_slot_type(&mut self, slot: usize, type_name: &str) -> bool {
        if slot >= 6 {
            return false;
        }
        match serde_json::from_value::<FxSlotType>(serde_json::Value::String(type_name.to_owned()))
        {
            Ok(slot_type) => {
                self.inner.set_fx_slot_type(slot, slot_type);
                true
            }
            Err(_) => false,
        }
    }

    /// Return the current FX slot layout as a JSON array of camelCase strings.
    #[wasm_bindgen(js_name = getFxSlotTypes)]
    pub fn get_fx_slot_types(&self) -> String {
        match serde_json::to_string(&self.inner.get_fx_slot_types()) {
            Ok(json) => json,
            Err(_) => String::from("[]"),
        }
    }

    /// Return the latest runtime modulation-source values as JSON for UI telemetry.
    #[wasm_bindgen(js_name = getRuntimeModSources)]
    pub fn get_runtime_mod_sources(&self) -> String {
        match serde_json::to_string(&self.inner.runtime_mod_sources()) {
            Ok(json) => json,
            Err(e) => {
                web_sys::console::error_1(
                    &format!("[cosmo-synth-engine] getRuntimeModSources serialize error: {e}")
                        .into(),
                );
                serde_json::to_string(&RuntimeModSources::default())
                    .unwrap_or_else(|_| String::from("{}"))
            }
        }
    }

    /// Return the latest per-voice envelope state as JSON for UI telemetry.
    #[wasm_bindgen(js_name = getRuntimeVoiceStates)]
    pub fn get_runtime_voice_states(&self) -> String {
        match serde_json::to_string(&self.inner.runtime_voice_debug_state()) {
            Ok(json) => json,
            Err(e) => {
                web_sys::console::error_1(
                    &format!("[cosmo-synth-engine] getRuntimeVoiceStates serialize error: {e}")
                        .into(),
                );
                String::from("[]")
            }
        }
    }

    /// Return output-level telemetry (peak and RMS) as JSON.
    ///
    /// Resets the level meter accumulator after reading so each call returns
    /// the level for the most recent window of samples.
    ///
    /// JS shape: `{ "peak": number, "rms": number }`
    #[wasm_bindgen(js_name = getLevelTelemetry)]
    pub fn get_level_telemetry(&mut self) -> String {
        let peak = self.inner.telemetry.peak();
        let rms = self.inner.telemetry.rms();
        self.inner.telemetry.reset_level();
        format!(r#"{{"peak":{peak},"rms":{rms}}}"#)
    }

    /// Fill `output` with mono samples rendered by the DSP engine.
    ///
    /// The caller passes a `Float32Array` slice backed by WASM linear memory.
    /// The entire slice is filled; returns nothing — same as the JS worklet
    /// `process()` contract.
    #[wasm_bindgen]
    pub fn process(&mut self, output: &mut [f32]) {
        self.inner.process(output);
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn midi_note_to_freq(note: u8) -> f32 {
    440.0 * libm::powf(2.0_f32, (note as f32 - 69.0) / 12.0)
}
