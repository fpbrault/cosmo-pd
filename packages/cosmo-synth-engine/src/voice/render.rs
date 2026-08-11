use crate::dsp_utils::{lfo_output, pow01, wrap01};
use crate::envelope::EnvelopeTimingCache;
use crate::params::{
    LfoRateMode, LfoWaveform, LineParams, LineSelect, ModDestination, ModEnvRetrigMode,
    ModMatrixCache, ModMode, PortamentoMode, SynthParams,
};
use crate::processor::render_plan::CompiledPdLinePlan;
use crate::synthesis::pd::algorithms::PER_LINE_HEADROOM;
use crate::synthesis::{
    LineClockFrame, LineEngineContext, LineEngineFrame, LineEnvelopeFrame, LineModulationFrame,
    LinePhaseContext, LineSynthesisRuntime,
};

use super::modulation::{ModSources, algo_control_slot_mods_for_line};
use super::{
    ANTI_CLICK_ATTACK_SAMPLES, ANTI_CLICK_FADE_MAX_SAMPLES, ANTI_CLICK_FADE_SAMPLES,
    DCW_DEZIPPER_TIME_SECONDS, DEFAULT_BASE_FREQ, DUAL_LINE_MIX_GAIN, POP_SUPPRESS_DELTA_THRESHOLD,
    POP_SUPPRESS_EXCESS_KEEP, RELEASE_TAIL_LEVEL_THRESHOLD, RELEASE_TAIL_LEVEL_TIME_SECONDS,
    SILENCE_THRESHOLD, Voice, ZERO_CROSS_STOP_MAX_WAIT_SAMPLES, ZERO_CROSS_STOP_THRESHOLD,
};

/// Envelope values snapshot for one render step.
struct EnvelopeSnapshot {
    pitch1: f32,
    pitch2: f32,
    amplitude1: f32,
    amplitude2: f32,
    timbre1: f32,
    timbre2: f32,
}

/// Intermediate signal state during render.
#[derive(Debug, Clone, Copy)]
struct SignalState {
    effective_freq1: f32,
    effective_freq2: f32,
    final_dcw1: f32,
    final_dcw2: f32,
    final_dca1: f32,
    final_dca2: f32,
}

/// Phase computation result for both oscillators.
#[derive(Debug, Clone, Copy)]
struct PhaseFrame {
    phi1: f32,
    phi2: f32,
    pm_delta: f32,
    phase_a_post: f32,
    phase_b_post: f32,
    pm_post_mod: f32,
}

#[derive(Clone, Copy)]
struct PrimeRenderFrame<'a> {
    line1: &'a LineParams,
    line2: &'a LineParams,
    line1_plan: &'a CompiledPdLinePlan,
    line2_plan: &'a CompiledPdLinePlan,
    line1_input: LineEngineFrame,
    line2_input: LineEngineFrame,
}

#[derive(Clone, Copy)]
struct RenderedLines {
    line1: f32,
    line2: f32,
    prime: Option<f32>,
}

#[derive(Clone, Copy)]
pub struct VoiceRenderContext<'a> {
    pub p: &'a SynthParams,
    pub lfo_mod_val: f32,
    pub lfo2_mod_val: f32,
    pub random_mod_val: f32,
    pub line1_modded: &'a LineParams,
    pub line2_modded: &'a LineParams,
    pub sr: f32,
    pub timing: &'a EnvelopeTimingCache,
    pub pitch_bend_semitones: f32,
    pub mod_wheel: f32,
    pub macro1: f32,
    pub macro2: f32,
    pub macro3: f32,
    pub macro4: f32,
    pub cache: &'a ModMatrixCache,
    pub modulation_active: bool,
    pub effective_tempo_bpm: f32,
    pub line1_plan: &'a CompiledPdLinePlan,
    pub line2_plan: &'a CompiledPdLinePlan,
    pub shared_mod_env_val: f32,
}

///
/// Returns `0.0` when the voice is silent.
///
/// # Arguments
/// * `voice`       – mutable reference to the voice state
/// * `p`           – current synth parameters
/// * `lfo_mod_val` – pre-computed LFO output value for this sample
/// * `lfo2_mod_val` – pre-computed LFO2 output value for this sample
/// * `sr`          – sample rate in Hz
pub fn render_voice(voice: &mut Voice, ctx: &VoiceRenderContext<'_>) -> f32 {
    let p = ctx.p;
    let line1_modded = ctx.line1_modded;
    let line2_modded = ctx.line2_modded;
    let sr = ctx.sr;
    let timing = ctx.timing;
    let pitch_bend_semitones = ctx.pitch_bend_semitones;
    let mod_wheel = ctx.mod_wheel;
    let aftertouch = voice.aftertouch;
    let cache = ctx.cache;
    let modulation_active = ctx.modulation_active;
    let line1_plan = ctx.line1_plan;
    let line2_plan = ctx.line2_plan;
    let base_freq = base_voice_frequency(voice);

    let env = advance_envelopes(voice, line1_modded, line2_modded, timing);
    let line1_active = uses_line1(p.line_select);
    let line2_active = uses_line2(p.line_select);
    let env_gate_open = (line1_active && (env.amplitude1).abs() >= SILENCE_THRESHOLD)
        || (line2_active && (env.amplitude2).abs() >= SILENCE_THRESHOLD);
    let env_gate_closed = (!line1_active || (env.amplitude1).abs() < SILENCE_THRESHOLD)
        && (!line2_active || (env.amplitude2).abs() < SILENCE_THRESHOLD);
    let active_dca_non_loop = (!line1_active || !line1_modded.envelopes.amplitude.as_step().loop_)
        && (!line2_active || !line2_modded.envelopes.amplitude.as_step().loop_);

    if env_gate_open {
        voice.gate_was_open = true;
    }

    if !voice.is_releasing
        && !voice.sustained
        && active_dca_non_loop
        && voice.gate_was_open
        && env_gate_closed
    {
        voice.is_releasing = true;
    }

    if voice.is_silent {
        advance_silent_voice(voice, line1_modded, line2_modded, p, sr, base_freq);
        voice.last_output_sample = 0.0;
        voice.release_tail_level = 0.0;
        voice.anti_click_fade_len = 0;
        voice.voice_steal_fade_sample = 0.0;
        voice.voice_steal_fade = 0;
        voice.voice_steal_fade_len = 0;
        voice.zero_cross_stop_pending = false;
        voice.zero_cross_stop_wait = 0;
        return 0.0;
    }

    // Advance per-voice ADSR mod envelope (Poly) or use shared env (Mono/Legato).
    let mod_env_val = if p.mod_env.retrig_mode != ModEnvRetrigMode::Poly {
        voice.mod_env.output = ctx.shared_mod_env_val;
        ctx.shared_mod_env_val
    } else {
        voice.mod_env.advance(&p.mod_env, sr)
    };

    let mod_sources = ModSources::new(
        ctx.lfo_mod_val,
        ctx.lfo2_mod_val,
        ctx.random_mod_val,
        mod_env_val,
        voice.velocity,
        mod_wheel,
        aftertouch,
        ctx.macro1,
        ctx.macro2,
        ctx.macro3,
        ctx.macro4,
    );
    let line1_algo_param_mods = if modulation_active {
        algo_control_slot_mods_for_line(1, cache, &mod_sources)
    } else {
        [0.0; 8]
    };
    let line2_algo_param_mods = if modulation_active {
        algo_control_slot_mods_for_line(2, cache, &mod_sources)
    } else {
        [0.0; 8]
    };
    let mut signal = build_signal_state(
        voice,
        line1_modded,
        line2_modded,
        cache,
        modulation_active,
        &env,
        base_freq,
        &mod_sources,
    );
    apply_dcw_dezipper(voice, sr, &mut signal);
    apply_pitch_and_lfo_modulation(
        voice,
        p,
        cache,
        sr,
        base_freq,
        pitch_bend_semitones,
        &mod_sources,
        modulation_active,
        ctx.effective_tempo_bpm,
        &mut signal,
    );

    let phase = build_phase_frame(
        voice,
        &voice.line1_synthesis,
        p,
        cache,
        modulation_active,
        sr,
        base_freq,
        &mod_sources,
    );
    let line1_input = LineEngineFrame {
        clock: LineClockFrame {
            cycle_count: voice.cycle_count1,
            oscillator_phase: phase.phi1,
            shaped_phase: phase.phase_a_post,
        },
        envelopes: LineEnvelopeFrame {
            values: [env.pitch1, signal.final_dcw1, signal.final_dca1],
        },
        modulation: LineModulationFrame {
            values: line1_algo_param_mods,
        },
        phase_modulation: phase.pm_post_mod,
    };
    let line2_input = LineEngineFrame {
        clock: LineClockFrame {
            cycle_count: voice.cycle_count2,
            oscillator_phase: phase.phi2,
            shaped_phase: phase.phase_b_post,
        },
        envelopes: LineEnvelopeFrame {
            values: [env.pitch2, signal.final_dcw2, signal.final_dca2],
        },
        modulation: LineModulationFrame {
            values: line2_algo_param_mods,
        },
        phase_modulation: phase.pm_post_mod,
    };
    let line1_output = voice.line1_synthesis.render_primary(
        line1_modded,
        LineEngineContext {
            frequency: signal.effective_freq1,
            sample_rate: sr,
        },
        line1_input,
        line1_plan,
    );
    let line2_output = voice.line2_synthesis.render_primary(
        line2_modded,
        LineEngineContext {
            frequency: signal.effective_freq2,
            sample_rate: sr,
        },
        line2_input,
        line2_plan,
    );
    let mod_mode = effective_mod_mode(p);
    let noise_step = if mod_mode == ModMode::Noise {
        let step = voice.noise_step;
        voice.noise_step = voice.noise_step.wrapping_add(1);
        step
    } else {
        0
    };

    let prime_output = render_selected_prime(
        voice,
        p.line_select,
        mod_mode,
        phase.phi2,
        PrimeRenderFrame {
            line1: line1_modded,
            line2: line2_modded,
            line1_plan,
            line2_plan,
            line1_input,
            line2_input,
        },
    );

    let sample = mix_line_outputs(
        p,
        mod_mode,
        noise_step,
        RenderedLines {
            line1: line1_output.sample,
            line2: line2_output.sample,
            prime: prime_output,
        },
        signal,
    );

    // Apply volume modulation from mod matrix
    let volume_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::Volume,
        &mod_sources,
    );
    let mut sample = sample * (1.0 + volume_mod);

    let tail_alpha = 1.0 - (-1.0 / (RELEASE_TAIL_LEVEL_TIME_SECONDS * sr.max(1.0))).exp();
    voice.release_tail_level += ((sample).abs() - voice.release_tail_level) * tail_alpha;

    // Start a short fade when the release tail is near silence.
    // Use both envelope and signal-level checks: the signal check catches
    // cases where release was initiated via sustain pedal and residual filter
    // energy does not track DCA envelope level perfectly.
    if voice.is_releasing && voice.anti_click_fade == 0 && !voice.zero_cross_stop_pending {
        let env_near_silence = (!line1_active || (env.amplitude1).abs() < SILENCE_THRESHOLD)
            && (!line2_active || (env.amplitude2).abs() < SILENCE_THRESHOLD);
        let tail_near_silence = voice.release_tail_level < RELEASE_TAIL_LEVEL_THRESHOLD;
        let instant_near_silence = (sample).abs() < RELEASE_TAIL_LEVEL_THRESHOLD * 2.0;

        if (env_near_silence || tail_near_silence) && instant_near_silence {
            let min_freq = signal.effective_freq1.min(signal.effective_freq2).max(20.0);
            let half_cycle_samples = (sr / min_freq / 2.0).round() as u32;
            let fade_len = half_cycle_samples
                .clamp(ANTI_CLICK_FADE_SAMPLES, ANTI_CLICK_FADE_MAX_SAMPLES)
                .max(1);
            voice.anti_click_fade = fade_len;
            voice.anti_click_fade_len = fade_len;
            voice.zero_cross_stop_pending = false;
            voice.zero_cross_stop_wait = 0;
        }
    }

    if voice.anti_click_attack > 0 {
        let ramp = 1.0 - (voice.anti_click_attack as f32 / ANTI_CLICK_ATTACK_SAMPLES as f32);
        sample *= ramp;
        voice.anti_click_attack -= 1;
    }

    if voice.voice_steal_fade > 0 {
        let fade_len = voice.voice_steal_fade_len.max(1);
        let old_mix = voice.voice_steal_fade as f32 / fade_len as f32;
        let new_mix = 1.0 - old_mix;
        sample = sample * new_mix + voice.voice_steal_fade_sample * old_mix;
        voice.voice_steal_fade -= 1;
        if voice.voice_steal_fade == 0 {
            voice.voice_steal_fade_sample = 0.0;
            voice.voice_steal_fade_len = 0;
        }
    }

    sample = suppress_sample_discontinuity(
        voice.last_output_sample,
        sample,
        POP_SUPPRESS_DELTA_THRESHOLD,
    );

    advance_voice_phase(
        voice,
        sr,
        signal.effective_freq1,
        signal.effective_freq2,
        phase.pm_delta,
    );

    // Apply anti-click fade and silence the voice when the fade completes.
    if voice.anti_click_fade > 0 {
        voice.anti_click_fade -= 1;
        let fade_len = voice.anti_click_fade_len.max(1);
        let fade = voice.anti_click_fade as f32 / fade_len as f32;
        let faded = sample * fade;

        if voice.anti_click_fade == 0 {
            voice.zero_cross_stop_pending = true;
            voice.zero_cross_stop_wait = ZERO_CROSS_STOP_MAX_WAIT_SAMPLES;
            // Store the post-fade sample so the subsequent zero-cross detector
            // can compare sign changes on the same processed signal it will
            // continue to receive (not a pre-fade "raw" value).
            voice.last_output_sample = sample;
            return 0.0;
        }

        voice.last_output_sample = faded;
        return faded;
    }

    if voice.zero_cross_stop_pending {
        let prev_raw = voice.last_output_sample;
        let near_zero = (sample).abs() <= ZERO_CROSS_STOP_THRESHOLD;
        let crossed_zero = (prev_raw > 0.0 && sample <= 0.0) || (prev_raw < 0.0 && sample >= 0.0);

        voice.last_output_sample = sample;

        if near_zero || crossed_zero || voice.zero_cross_stop_wait == 0 {
            return finalize_voice_silence(voice);
        }

        voice.zero_cross_stop_wait -= 1;
        return 0.0;
    }

    voice.last_output_sample = sample;
    sample
}

fn finalize_voice_silence(voice: &mut Voice) -> f32 {
    voice.is_silent = true;
    voice.note = None;
    voice.env_note = 60;
    voice.gate_was_open = false;
    voice.line1_envelopes.slots[2].output = 0.0;
    voice.line2_envelopes.slots[2].output = 0.0;
    voice.mod_env.reset();
    voice.last_output_sample = 0.0;
    voice.release_tail_level = 0.0;
    voice.anti_click_fade = 0;
    voice.anti_click_fade_len = 0;
    voice.voice_steal_fade_sample = 0.0;
    voice.voice_steal_fade = 0;
    voice.voice_steal_fade_len = 0;
    voice.zero_cross_stop_pending = false;
    voice.zero_cross_stop_wait = 0;
    0.0
}

#[inline]
fn uses_line1(line_select: LineSelect) -> bool {
    matches!(
        line_select,
        LineSelect::L1 | LineSelect::L1PlusL1Prime | LineSelect::L1PlusL2Prime
    )
}

#[inline]
fn uses_line2(line_select: LineSelect) -> bool {
    matches!(line_select, LineSelect::L2 | LineSelect::L1PlusL2Prime)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn base_voice_frequency(voice: &Voice) -> f32 {
    if voice.frequency > 0.0 {
        voice.frequency
    } else {
        DEFAULT_BASE_FREQ
    }
}

fn advance_envelopes(
    voice: &mut Voice,
    line1: &LineParams,
    line2: &LineParams,
    timing: &EnvelopeTimingCache,
) -> EnvelopeSnapshot {
    let note = voice.env_note;

    let line1_frame =
        voice
            .line1_synthesis
            .advance_envelopes(line1, &mut voice.line1_envelopes, timing, note);
    let line2_frame =
        voice
            .line2_synthesis
            .advance_envelopes(line2, &mut voice.line2_envelopes, timing, note);

    EnvelopeSnapshot {
        pitch1: line1_frame.values[0],
        pitch2: line2_frame.values[0],
        amplitude1: line1_frame.values[2],
        amplitude2: line2_frame.values[2],
        timbre1: line1_frame.values[1],
        timbre2: line2_frame.values[1],
    }
}

fn advance_silent_voice(
    voice: &mut Voice,
    line1: &LineParams,
    line2: &LineParams,
    p: &SynthParams,
    sr: f32,
    base_freq: f32,
) {
    let freq1 = voice
        .line1_synthesis
        .prepare_signal(line1, base_freq, [0.0; 3], voice.env_note, 0.0, 0.0)
        .frequency;
    let freq2 = voice
        .line2_synthesis
        .prepare_signal(line2, base_freq, [0.0; 3], voice.env_note, 0.0, 0.0)
        .frequency;
    let pm_delta = voice
        .line1_synthesis
        .phase_frame(LinePhaseContext {
            params: p,
            phi1: wrap01(voice.phi1),
            phi2: wrap01(voice.phi2),
            pm_phi: wrap01(voice.pm_phi),
            base_frequency: base_freq,
            sample_rate: sr,
            ratio_modulation: 0.0,
        })
        .pm_delta;

    advance_voice_phase(voice, sr, freq1, freq2, pm_delta);
}

fn build_signal_state(
    voice: &Voice,
    line1: &LineParams,
    line2: &LineParams,
    cache: &ModMatrixCache,
    modulation_active: bool,
    env: &EnvelopeSnapshot,
    base_freq: f32,
    sources: &ModSources,
) -> SignalState {
    // Mod matrix offsets for DCW/DCA (O(1) cache lookup, not O(routes) scan)
    let dcw1_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::Line1DcwBase,
        sources,
    );
    let dcw2_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::Line2DcwBase,
        sources,
    );
    let dca1_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::Line1DcaBase,
        sources,
    );
    let dca2_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::Line2DcaBase,
        sources,
    );

    let line1_signal = voice.line1_synthesis.prepare_signal(
        line1,
        base_freq,
        [env.pitch1, env.timbre1, env.amplitude1],
        voice.env_note,
        dcw1_mod,
        dca1_mod,
    );
    let line2_signal = voice.line2_synthesis.prepare_signal(
        line2,
        base_freq,
        [env.pitch2, env.timbre2, env.amplitude2],
        voice.env_note,
        dcw2_mod,
        dca2_mod,
    );

    SignalState {
        effective_freq1: line1_signal.frequency,
        effective_freq2: line2_signal.frequency,
        final_dcw1: line1_signal.timbre,
        final_dcw2: line2_signal.timbre,
        final_dca1: line1_signal.amplitude,
        final_dca2: line2_signal.amplitude,
    }
}

fn apply_dcw_dezipper(voice: &mut Voice, sr: f32, signal: &mut SignalState) {
    let safe_sr = sr.max(1.0);
    let alpha = 1.0 - (-1.0 / (DCW_DEZIPPER_TIME_SECONDS * safe_sr)).exp();

    voice.smoothed_dcw1 += (signal.final_dcw1 - voice.smoothed_dcw1) * alpha;
    voice.smoothed_dcw2 += (signal.final_dcw2 - voice.smoothed_dcw2) * alpha;

    signal.final_dcw1 = voice.smoothed_dcw1.clamp(0.0, 1.0);
    signal.final_dcw2 = voice.smoothed_dcw2.clamp(0.0, 1.0);
}

#[inline]
pub(crate) fn suppress_sample_discontinuity(
    prev_sample: f32,
    sample: f32,
    delta_threshold: f32,
) -> f32 {
    let delta = sample - prev_sample;
    let delta_abs = (delta).abs();
    if delta_abs <= delta_threshold {
        return sample;
    }

    let excess = delta_abs - delta_threshold;
    let allowed = delta_threshold + excess * POP_SUPPRESS_EXCESS_KEEP;
    prev_sample + delta.signum() * allowed
}

#[allow(clippy::too_many_arguments)]
fn apply_pitch_and_lfo_modulation(
    voice: &mut Voice,
    p: &SynthParams,
    cache: &ModMatrixCache,
    sr: f32,
    base_freq: f32,
    pitch_bend_semitones: f32,
    sources: &ModSources,
    modulation_active: bool,
    effective_tempo_bpm: f32,
    signal: &mut SignalState,
) {
    apply_portamento(voice, &p.portamento, sr, base_freq, signal);
    apply_pitch_bend(pitch_bend_semitones, signal);
    apply_vibrato(
        voice,
        p,
        cache,
        modulation_active,
        sr,
        sources,
        effective_tempo_bpm,
        signal,
    );
    // Pitch modulation from mod matrix (O(1) cache lookup)
    let pitch_mod = get_mod_if_active(modulation_active, cache, ModDestination::Pitch, sources);
    if pitch_mod != 0.0 {
        let ratio = (2.0_f32).powf(pitch_mod * 2.0 / 12.0); // ±2 semitones max
        signal.effective_freq1 *= ratio;
        signal.effective_freq2 *= ratio;
    }
}

fn apply_portamento(
    voice: &mut Voice,
    port: &crate::params::PortamentoParams,
    sr: f32,
    base_freq: f32,
    signal: &mut SignalState,
) {
    if !port.enabled || (voice.target_freq - voice.current_freq).abs() <= 1e-6 {
        return;
    }

    match port.mode {
        PortamentoMode::Rate => {
            let t = (port.rate / 99.0).clamp(0.0, 1.0);
            let time_const = 3.0 * (1.0 - t) * (1.0 - t) + 0.001;
            let alpha = 1.0 - (-1.0 / (time_const * sr)).exp();
            voice.current_freq += (voice.target_freq - voice.current_freq) * alpha;
        }
        PortamentoMode::Time => {
            voice.glide_progress += 1.0 / (port.time * sr);
            if voice.glide_progress >= 1.0 {
                voice.current_freq = voice.target_freq;
            } else {
                let t = voice.glide_progress;
                voice.current_freq =
                    voice.glide_start_freq + (voice.target_freq - voice.glide_start_freq) * t;
            }
        }
    }

    let ratio = voice.current_freq / base_freq;
    signal.effective_freq1 *= ratio;
    signal.effective_freq2 *= ratio;
}

fn apply_pitch_bend(pitch_bend_semitones: f32, signal: &mut SignalState) {
    if pitch_bend_semitones == 0.0 {
        return;
    }

    let bend_ratio = (2.0_f32).powf(pitch_bend_semitones / 12.0);
    signal.effective_freq1 *= bend_ratio;
    signal.effective_freq2 *= bend_ratio;
}

#[allow(clippy::too_many_arguments)]
fn apply_vibrato(
    voice: &mut Voice,
    p: &SynthParams,
    cache: &ModMatrixCache,
    modulation_active: bool,
    sr: f32,
    sources: &ModSources,
    effective_tempo_bpm: f32,
    signal: &mut SignalState,
) {
    let Some(vibrato) = p.vibrato_params() else {
        return;
    };
    if !vibrato.enabled {
        return;
    }

    if voice.vibrato_delay_counter > 0 {
        voice.vibrato_delay_counter -= 1;
        return;
    }

    let vibrato_rate_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::VibratoRate,
        sources,
    );
    let effective_rate = match vibrato.rate_mode {
        LfoRateMode::Hz => (vibrato.rate + vibrato_rate_mod * 99.0).clamp(0.1, 200.0),
        LfoRateMode::Sync => {
            (effective_tempo_bpm.max(1.0) / 60.0) * vibrato.sync_division.cycles_per_beat()
        }
    };
    voice.vibrato_phase += (effective_rate * 0.1) / sr;
    if voice.vibrato_phase >= 1.0 {
        voice.vibrato_phase -= 1.0;
    }

    let vib_waveform = vibrato_waveform(vibrato.waveform);
    let lfo_val = lfo_output(voice.vibrato_phase, vib_waveform);
    let vibrato_depth_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::VibratoDepth,
        sources,
    );
    let effective_depth = (vibrato.depth + vibrato_depth_mod * 99.0).clamp(0.0, 99.0);
    let pitch_mod = 1.0 + lfo_val * (effective_depth / 1000.0);
    signal.effective_freq1 *= pitch_mod;
    signal.effective_freq2 *= pitch_mod;
}

fn vibrato_waveform(waveform: u8) -> LfoWaveform {
    match waveform {
        2 => LfoWaveform::Saw,
        3 => LfoWaveform::InvertedSaw,
        4 => LfoWaveform::Square,
        _ => LfoWaveform::Triangle,
    }
}

fn build_phase_frame(
    voice: &Voice,
    engine: &LineSynthesisRuntime,
    p: &SynthParams,
    cache: &ModMatrixCache,
    modulation_active: bool,
    sr: f32,
    base_freq: f32,
    sources: &ModSources,
) -> PhaseFrame {
    let int_pm_ratio_mod = get_mod_if_active(
        modulation_active,
        cache,
        ModDestination::IntPmRatio,
        sources,
    );
    let phi1 = wrap01(voice.phi1);
    let phi2 = wrap01(voice.phi2);
    let pm_phi = wrap01(voice.pm_phi);
    let engine_frame = engine.phase_frame(LinePhaseContext {
        params: p,
        phi1,
        phi2,
        pm_phi,
        base_frequency: base_freq,
        sample_rate: sr,
        ratio_modulation: int_pm_ratio_mod,
    });

    PhaseFrame {
        phi1,
        phi2,
        pm_delta: engine_frame.pm_delta,
        phase_a_post: engine_frame.phase_a_post,
        phase_b_post: engine_frame.phase_b_post,
        pm_post_mod: engine_frame.pm_post_mod,
    }
}

#[inline(always)]
fn render_selected_prime(
    voice: &mut Voice,
    line_select: LineSelect,
    mod_mode: ModMode,
    prime_phase: f32,
    frame: PrimeRenderFrame<'_>,
) -> Option<f32> {
    if mod_mode == ModMode::Noise {
        return None;
    }

    let context = LineEngineContext {
        frequency: 0.0,
        sample_rate: 1.0,
    };
    match line_select {
        LineSelect::L1PlusL1Prime => {
            let input = LineEngineFrame {
                clock: LineClockFrame {
                    oscillator_phase: prime_phase,
                    shaped_phase: prime_phase,
                    ..frame.line1_input.clock
                },
                phase_modulation: 0.0,
                ..frame.line1_input
            };
            Some(
                voice
                    .line1_synthesis
                    .render_primary(frame.line1, context, input, frame.line1_plan)
                    .sample,
            )
        }
        LineSelect::L1PlusL2Prime => {
            let input = LineEngineFrame {
                clock: LineClockFrame {
                    oscillator_phase: prime_phase,
                    shaped_phase: prime_phase,
                    ..frame.line2_input.clock
                },
                phase_modulation: 0.0,
                ..frame.line2_input
            };
            Some(
                voice
                    .line2_synthesis
                    .render_primary(frame.line2, context, input, frame.line2_plan)
                    .sample,
            )
        }
        LineSelect::L1 | LineSelect::L2 => None,
    }
}

fn mix_line_outputs(
    p: &SynthParams,
    mod_mode: ModMode,
    noise_step: u32,
    lines: RenderedLines,
    signal: SignalState,
) -> f32 {
    match mod_mode {
        ModMode::Ring => {
            let (mix_a, mix_b) = select_line_sources(p, lines.line1, lines.line2, lines.prime);
            mix_a * mix_b * p.ring_gain.max(0.0)
        }
        ModMode::Noise => {
            let (mix_a, mix_b) = select_noise_line_sources(
                p,
                noise_step,
                lines.line1,
                lines.line2,
                signal.final_dcw1,
                signal.final_dcw2,
                signal.final_dca1,
                signal.final_dca2,
            );
            (mix_a + mix_b) * DUAL_LINE_MIX_GAIN
        }
        ModMode::Normal => {
            let (mix_a, mix_b) = select_line_sources(p, lines.line1, lines.line2, lines.prime);
            match p.line_select {
                LineSelect::L1 => mix_a,
                LineSelect::L2 => mix_b,
                _ => (mix_a + mix_b) * DUAL_LINE_MIX_GAIN,
            }
        }
    }
}

#[inline]
fn effective_mod_mode(p: &SynthParams) -> ModMode {
    match p.line_select {
        LineSelect::L1 | LineSelect::L2 => ModMode::Normal,
        _ => p.mod_mode,
    }
}

fn select_line_sources(p: &SynthParams, s1: f32, s2: f32, prime_output: Option<f32>) -> (f32, f32) {
    match p.line_select {
        LineSelect::L1PlusL1Prime | LineSelect::L1PlusL2Prime => (s1, prime_output.unwrap_or(0.0)),
        _ => (s1, s2),
    }
}

#[allow(clippy::too_many_arguments)]
fn select_noise_line_sources(
    p: &SynthParams,
    noise_step: u32,
    s1: f32,
    s2: f32,
    final_dcw1: f32,
    final_dcw2: f32,
    final_dca1: f32,
    final_dca2: f32,
) -> (f32, f32) {
    match p.line_select {
        LineSelect::L1PlusL1Prime => (
            s1,
            render_noise_line_sample(final_dcw1, final_dca1, noise_step),
        ),
        LineSelect::L1PlusL2Prime => (
            s1,
            render_noise_line_sample(final_dcw2, final_dca2, noise_step.wrapping_add(17_219)),
        ),
        LineSelect::L1 => (s1, 0.0),
        LineSelect::L2 => (0.0, s2),
    }
}

fn render_noise_line_sample(final_dcw: f32, final_dca: f32, noise_step: u32) -> f32 {
    let white_noise = noise_hash_signed(noise_step);
    let dcw = final_dcw.clamp(0.0, 1.0);
    let drive = 1.8 - dcw * 1.35;
    let gain = 0.25 + dcw * 0.75;
    let shaped = white_noise.signum() * pow01(white_noise.abs(), drive);
    shaped * gain * final_dca.max(0.0) * PER_LINE_HEADROOM
}

#[inline]
fn noise_hash_signed(step: u32) -> f32 {
    let mut bits = step.wrapping_mul(747_796_405).wrapping_add(2_891_336_453);
    bits = ((bits >> ((bits >> 28) + 4)) ^ bits).wrapping_mul(277_803_737);
    bits = (bits >> 22) ^ bits;
    (bits as f32 / u32::MAX as f32) * 2.0 - 1.0
}

#[inline(always)]
fn get_mod_if_active(
    active: bool,
    cache: &ModMatrixCache,
    destination: ModDestination,
    sources: &ModSources,
) -> f32 {
    if active {
        cache.get(destination, sources)
    } else {
        0.0
    }
}

fn advance_voice_phase(
    voice: &mut Voice,
    sr: f32,
    effective_freq1: f32,
    effective_freq2: f32,
    pm_delta: f32,
) {
    voice.phi1 += effective_freq1 / sr;
    voice.phi2 += effective_freq2 / sr;
    voice.pm_phi += pm_delta;
    wrap_voice_phase(&mut voice.phi1, &mut voice.cycle_count1);
    wrap_voice_phase(&mut voice.phi2, &mut voice.cycle_count2);
    if voice.pm_phi >= 1.0 {
        voice.pm_phi -= 1.0;
    }
}

fn wrap_voice_phase(phase: &mut f32, cycle_count: &mut u32) {
    while *phase >= 1.0 {
        *phase -= 1.0;
        *cycle_count = cycle_count.wrapping_add(1);
    }
}
