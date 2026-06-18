use crate::dsp_utils::{TWO_PI, lfo_output, pow01, wrap01};
use crate::envelope::EnvelopeKind;
use crate::envelope::EnvelopeTimingCache;
use crate::generators::{self, LineRenderConfig, PER_LINE_HEADROOM};
use crate::params::{
    LfoRateMode, LfoWaveform, LineParams, LineSelect, ModDestination, ModMatrixCache, ModMode,
    PortamentoMode, SynthParams,
};
use crate::render_cache::CompiledLinePlan;

use super::modulation::{ModSources, algo_param_slot_mods_for_line};
use super::{
    ANTI_CLICK_ATTACK_SAMPLES, ANTI_CLICK_FADE_MAX_SAMPLES, ANTI_CLICK_FADE_SAMPLES,
    DCA_LEVEL_CURVE_EXPONENT, DCW_DEZIPPER_TIME_SECONDS, DCW_LEVEL_CURVE_EXPONENT,
    DEFAULT_BASE_FREQ, DUAL_LINE_MIX_GAIN, POP_SUPPRESS_DELTA_THRESHOLD, POP_SUPPRESS_EXCESS_KEEP,
    RELEASE_TAIL_LEVEL_THRESHOLD, RELEASE_TAIL_LEVEL_TIME_SECONDS, SILENCE_THRESHOLD, Voice,
    ZERO_CROSS_STOP_MAX_WAIT_SAMPLES, ZERO_CROSS_STOP_THRESHOLD,
};

const DCW_KEY_FOLLOW_REFERENCE_NOTE: f32 = 60.0;
const DCW_KEY_FOLLOW_SEMITONE_SPAN: f32 = 48.0;
const DCW_KEY_FOLLOW_MAX_ATTENUATION: f32 = 0.85;
const DCW_KEY_FOLLOW_MIN_SCALE: f32 = 0.15;

/// Envelope values snapshot for one render step.
struct EnvelopeSnapshot {
    dco1_env: f32,
    dco2_env: f32,
    dca1: f32,
    dca2: f32,
    dcw1: f32,
    dcw2: f32,
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
    pub line1_plan: &'a CompiledLinePlan,
    pub line2_plan: &'a CompiledLinePlan,
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
    let env_gate_open = (line1_active && (env.dca1).abs() >= SILENCE_THRESHOLD)
        || (line2_active && (env.dca2).abs() >= SILENCE_THRESHOLD);
    let env_gate_closed = (!line1_active || (env.dca1).abs() < SILENCE_THRESHOLD)
        && (!line2_active || (env.dca2).abs() < SILENCE_THRESHOLD);
    let active_dca_non_loop = (!line1_active || !line1_modded.dca_env.loop_)
        && (!line2_active || !line2_modded.dca_env.loop_);

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

    // Advance per-voice ADSR mod envelope.
    let mod_env_val = voice.mod_env.advance(&p.mod_env, sr);

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
        algo_param_slot_mods_for_line(1, cache, &mod_sources)
    } else {
        [0.0; 8]
    };
    let line2_algo_param_mods = if modulation_active {
        algo_param_slot_mods_for_line(2, cache, &mod_sources)
    } else {
        [0.0; 8]
    };
    let mut signal = build_signal_state(
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
        p,
        cache,
        modulation_active,
        sr,
        base_freq,
        &mod_sources,
    );
    let (s1, karpunk_raw_sample1) =
        voice
            .algo_runtime
            .render_line1(LineRenderConfig::from_compiled_line(
                line1_plan,
                line1_modded,
                voice.cycle_count1,
                phase.phi1,
                phase.phase_a_post,
                signal.final_dcw1,
                signal.final_dca1,
                signal.effective_freq1,
                sr,
                line1_algo_param_mods,
                phase.pm_post_mod,
            ));
    let (s2, karpunk_raw_sample2) =
        voice
            .algo_runtime
            .render_line2(LineRenderConfig::from_compiled_line(
                line2_plan,
                line2_modded,
                voice.cycle_count2,
                phase.phi2,
                phase.phase_b_post,
                signal.final_dcw2,
                signal.final_dca2,
                signal.effective_freq2,
                sr,
                line2_algo_param_mods,
                phase.pm_post_mod,
            ));
    let mod_mode = effective_mod_mode(p);
    let noise_step = if mod_mode == ModMode::Noise {
        let step = voice.noise_step;
        voice.noise_step = voice.noise_step.wrapping_add(1);
        step
    } else {
        0
    };

    let sample = mix_line_outputs(
        p,
        mod_mode,
        phase.phi1,
        phase.phi2,
        noise_step,
        s1,
        s2,
        line1_modded,
        line2_modded,
        voice.cycle_count1,
        voice.cycle_count2,
        karpunk_raw_sample1,
        karpunk_raw_sample2,
        signal.final_dcw1,
        signal.final_dcw2,
        signal.final_dca1,
        signal.final_dca2,
        line1_algo_param_mods,
        line2_algo_param_mods,
        line1_plan,
        line2_plan,
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
        let env_near_silence = (!line1_active || (env.dca1).abs() < SILENCE_THRESHOLD)
            && (!line2_active || (env.dca2).abs() < SILENCE_THRESHOLD);
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
    voice.line1_env.dca.output = 0.0;
    voice.line2_env.dca.output = 0.0;
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

    voice
        .line1_env
        .dco
        .advance(EnvelopeKind::Dco, &line1.dco_env, timing, 0.0, note);
    voice
        .line1_env
        .dcw
        .advance(EnvelopeKind::Dcw, &line1.dcw_env, timing, 0.0, note);
    voice.line1_env.dca.advance(
        EnvelopeKind::Dca,
        &line1.dca_env,
        timing,
        line1.dca_key_follow,
        note,
    );
    voice
        .line2_env
        .dco
        .advance(EnvelopeKind::Dco, &line2.dco_env, timing, 0.0, note);
    voice
        .line2_env
        .dcw
        .advance(EnvelopeKind::Dcw, &line2.dcw_env, timing, 0.0, note);
    voice.line2_env.dca.advance(
        EnvelopeKind::Dca,
        &line2.dca_env,
        timing,
        line2.dca_key_follow,
        note,
    );

    EnvelopeSnapshot {
        dco1_env: voice.line1_env.dco.output,
        dco2_env: voice.line2_env.dco.output,
        dca1: voice.line1_env.dca.output,
        dca2: voice.line2_env.dca.output,
        dcw1: line1.dcw_base
            * cz_dcw_env_depth(voice.line1_env.dcw.output)
            * dcw_key_follow_scale(line1.dcw_key_follow, note),
        dcw2: line2.dcw_base
            * cz_dcw_env_depth(voice.line2_env.dcw.output)
            * dcw_key_follow_scale(line2.dcw_key_follow, note),
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
    let freq1 = line_frequency(base_freq, line1, 0.0);
    let freq2 = line_frequency(base_freq, line2, 0.0);
    let pm_delta = match p.phase_mod_params() {
        Some(pm) => (base_freq * pm.ratio) / sr,
        None => base_freq / sr,
    };

    advance_voice_phase(voice, sr, freq1, freq2, pm_delta);
}

fn build_signal_state(
    line1: &LineParams,
    line2: &LineParams,
    cache: &ModMatrixCache,
    modulation_active: bool,
    env: &EnvelopeSnapshot,
    base_freq: f32,
    sources: &ModSources,
) -> SignalState {
    let dca1_level = line1.dca_base * cz_dca_env_gain(env.dca1);
    let dca2_level = line2.dca_base * cz_dca_env_gain(env.dca2);

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

    SignalState {
        effective_freq1: line_frequency(base_freq, line1, env.dco1_env),
        effective_freq2: line_frequency(base_freq, line2, env.dco2_env),
        final_dcw1: (env.dcw1 + dcw1_mod).clamp(0.0, 1.0),
        final_dcw2: (env.dcw2 + dcw2_mod).clamp(0.0, 1.0),
        final_dca1: (dca1_level + dca1_mod).max(0.0),
        final_dca2: (dca2_level + dca2_mod).max(0.0),
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

/// Maps a normalized DCO envelope output (0.0–1.0) to an absolute semitone
/// offset using the CZ-101 piecewise non-linear pitch curve.
///
/// The CZ-101 display levels 0–99 map to pitch as follows:
///   - Levels  0–64: linear, 1 semitone per 8 levels  (max 8 st)
///   - Levels >64: each increment raises pitch by a whole tone (+2 semitones)
///     (max 8 + 35*2 = 78 st at level 99)
///
/// This function returns a semitone offset in [0.0, 78.0].
/// The input is clamped to [0.0, 1.0] before conversion.
pub(crate) fn cz_dco_env_semitones(dco_env: f32) -> f32 {
    let level = dco_env.clamp(0.0, 1.0) * 99.0;
    if level <= 64.0 {
        level / 8.0
    } else {
        8.0 + (level - 64.0) * 2.0
    }
}

#[inline]
pub(crate) fn cz_dca_env_gain(dca_env: f32) -> f32 {
    let level = dca_env.clamp(0.0, 1.0);
    pow01(level, DCA_LEVEL_CURVE_EXPONENT)
}

#[inline]
pub(crate) fn cz_dcw_env_depth(dcw_env: f32) -> f32 {
    let level = dcw_env.clamp(0.0, 1.0);
    pow01(level, DCW_LEVEL_CURVE_EXPONENT)
}

#[inline]
pub(crate) fn dcw_key_follow_scale(key_follow_amount: f32, note: u8) -> f32 {
    let key_follow = (key_follow_amount / 9.0).clamp(0.0, 1.0);
    if key_follow <= 0.0 {
        return 1.0;
    }

    let pitch_progress = ((note as f32 - DCW_KEY_FOLLOW_REFERENCE_NOTE)
        / DCW_KEY_FOLLOW_SEMITONE_SPAN)
        .clamp(0.0, 1.0);
    let attenuation = key_follow * pitch_progress * DCW_KEY_FOLLOW_MAX_ATTENUATION;
    (1.0 - attenuation).clamp(DCW_KEY_FOLLOW_MIN_SCALE, 1.0)
}

pub(crate) fn line_frequency(base_freq: f32, line: &LineParams, dco_env: f32) -> f32 {
    let dco_semitones = cz_dco_env_semitones(dco_env);
    base_freq
        * (2.0_f32).powf(line.octave + line.detune_note / 12.0 + line.detune_fine / 720.0)
        * (2.0_f32).powf(dco_semitones / 12.0)
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
    let (int_pm_enabled, int_pm_amount_raw, int_pm_ratio_raw, pm_pre) = p
        .phase_mod_params()
        .map(|pm| (pm.enabled, pm.amount, pm.ratio, pm.pm_pre))
        .unwrap_or((false, 0.0, 1.0, false));
    let int_pm_amount = if int_pm_enabled {
        (int_pm_amount_raw).clamp(-1.0, 1.0)
    } else {
        0.0
    };
    let effective_int_pm_ratio = (int_pm_ratio_raw + int_pm_ratio_mod * 7.5).clamp(0.5, 8.0);
    let pm_delta = (base_freq * effective_int_pm_ratio) / sr;
    let phi1 = wrap01(voice.phi1);
    let phi2 = wrap01(voice.phi2);
    let pm_phi = wrap01(voice.pm_phi);
    let pm_mod = int_pm_amount * 10.0 * (TWO_PI * pm_phi).sin();

    // pm_pre=true:  PM applied before warp shaping (phase_a_post = phi+pm_mod, pm_post_mod=0)
    // pm_pre=false: PM applied after warp shaping  (phase_a_post = phi,         pm_post_mod=pm_mod)
    let (phase_a_post, phase_b_post, pm_post_mod) = if pm_pre {
        (wrap01(phi1 + pm_mod), wrap01(phi2 + pm_mod), 0.0_f32)
    } else {
        (phi1, phi2, pm_mod)
    };

    PhaseFrame {
        phi1,
        phi2,
        pm_delta,
        phase_a_post,
        phase_b_post,
        pm_post_mod,
    }
}

#[allow(clippy::too_many_arguments)]
fn mix_line_outputs(
    p: &SynthParams,
    mod_mode: ModMode,
    phi1: f32,
    phi2: f32,
    noise_step: u32,
    s1: f32,
    s2: f32,
    l1: &LineParams,
    l2: &LineParams,
    cycle_count1: u32,
    cycle_count2: u32,
    karpunk_raw_sample1: Option<f32>,
    karpunk_raw_sample2: Option<f32>,
    final_dcw1: f32,
    final_dcw2: f32,
    final_dca1: f32,
    final_dca2: f32,
    line1_algo_param_mods: [f32; 8],
    line2_algo_param_mods: [f32; 8],
    line1_plan: &CompiledLinePlan,
    line2_plan: &CompiledLinePlan,
) -> f32 {
    match mod_mode {
        ModMode::Ring => {
            let (mix_a, mix_b) = select_line_sources(
                p,
                phi1,
                phi2,
                s1,
                s2,
                l1,
                l2,
                cycle_count1,
                cycle_count2,
                karpunk_raw_sample1,
                karpunk_raw_sample2,
                final_dcw1,
                final_dcw2,
                final_dca1,
                final_dca2,
                line1_algo_param_mods,
                line2_algo_param_mods,
                line1_plan,
                line2_plan,
            );
            mix_a * mix_b * p.ring_gain.max(0.0)
        }
        ModMode::Noise => {
            let (mix_a, mix_b) = select_noise_line_sources(
                p, noise_step, s1, s2, final_dcw1, final_dcw2, final_dca1, final_dca2,
            );
            (mix_a + mix_b) * DUAL_LINE_MIX_GAIN
        }
        ModMode::Normal => {
            let (mix_a, mix_b) = select_line_sources(
                p,
                phi1,
                phi2,
                s1,
                s2,
                l1,
                l2,
                cycle_count1,
                cycle_count2,
                karpunk_raw_sample1,
                karpunk_raw_sample2,
                final_dcw1,
                final_dcw2,
                final_dca1,
                final_dca2,
                line1_algo_param_mods,
                line2_algo_param_mods,
                line1_plan,
                line2_plan,
            );
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

#[allow(clippy::too_many_arguments)]
fn select_line_sources(
    p: &SynthParams,
    _phi1: f32,
    phi2: f32,
    s1: f32,
    s2: f32,
    l1: &LineParams,
    l2: &LineParams,
    cycle_count1: u32,
    cycle_count2: u32,
    karpunk_raw_sample1: Option<f32>,
    karpunk_raw_sample2: Option<f32>,
    final_dcw1: f32,
    final_dcw2: f32,
    final_dca1: f32,
    final_dca2: f32,
    line1_algo_param_mods: [f32; 8],
    line2_algo_param_mods: [f32; 8],
    line1_plan: &CompiledLinePlan,
    line2_plan: &CompiledLinePlan,
) -> (f32, f32) {
    match p.line_select {
        LineSelect::L1PlusL1Prime => {
            let cfg = LineRenderConfig::from_compiled_line(
                line1_plan,
                l1,
                cycle_count1,
                phi2,
                phi2,
                final_dcw1,
                final_dca1,
                0.0,
                1.0,
                line1_algo_param_mods,
                0.0,
            );
            let s1_prime = render_prime_line_sample(cfg, karpunk_raw_sample1);
            (s1, s1_prime)
        }
        LineSelect::L1PlusL2Prime => {
            let cfg = LineRenderConfig::from_compiled_line(
                line2_plan,
                l2,
                cycle_count2,
                phi2,
                phi2,
                final_dcw2,
                final_dca2,
                0.0,
                1.0,
                line2_algo_param_mods,
                0.0,
            );
            let s2_prime = render_prime_line_sample(cfg, karpunk_raw_sample2);
            (s1, s2_prime)
        }
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

fn render_prime_line_sample(cfg: LineRenderConfig, karpunk_raw_sample: Option<f32>) -> f32 {
    generators::render_sample_from_config(&cfg, karpunk_raw_sample)
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
