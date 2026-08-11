use super::parameters::PdLineParams;
use crate::dsp_utils::pow01;
use crate::envelope::EnvelopeBank;
use crate::envelope::{EnvelopeTimingCache, StepEnvelopeTiming};
use crate::params::{LineEnvelopeParams, StepEnvData, SynthParams};

/// CZ-101 envelope kind — determines which conversion formula to use.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EnvelopeKind {
    Dco,
    Dcw,
    Dca,
}

#[inline]
fn trunc_div(num: u32, den: u32) -> u8 {
    (num / den) as u8
}

/// Convert a human-readable rate value [0, 99] to the internal raw rate [0, 127].
#[inline]
pub fn human_rate_to_raw(kind: EnvelopeKind, human: u8) -> u8 {
    let a = human.min(99) as u32;
    match kind {
        EnvelopeKind::Dco => trunc_div(a * 127, 99),
        EnvelopeKind::Dcw => trunc_div(a * 119, 99) + 8,
        EnvelopeKind::Dca => trunc_div(a * 119, 99),
    }
}

/// Convert an internal raw rate [0, 127] back to human [0, 99].
#[inline]
pub fn raw_rate_to_human(kind: EnvelopeKind, raw: u8) -> u8 {
    let b = raw.min(127) as u32;
    match kind {
        EnvelopeKind::Dco => {
            if b == 0 {
                0
            } else if b == 127 {
                99
            } else {
                trunc_div(b * 99, 127) + 1
            }
        }
        EnvelopeKind::Dcw => {
            if b <= 8 {
                0
            } else if b >= 127 {
                99
            } else {
                trunc_div((b - 8) * 99, 119) + 1
            }
        }
        EnvelopeKind::Dca => {
            if b == 0 {
                0
            } else if b >= 119 {
                99
            } else {
                trunc_div(b * 99, 119) + 1
            }
        }
    }
}

/// Convert a human-readable level value [0, 99] to the internal raw level [0, 127].
#[inline]
pub fn human_level_to_raw(kind: EnvelopeKind, human: u8) -> u8 {
    let a = human.min(99);
    match kind {
        EnvelopeKind::Dco => {
            if a > 63 {
                a.saturating_add(4)
            } else {
                a
            }
        }
        EnvelopeKind::Dcw => trunc_div((a as u32) * 127, 99),
        EnvelopeKind::Dca => {
            if a == 0 {
                0
            } else {
                a.saturating_add(28)
            }
        }
    }
}

/// Convert an internal raw level [0, 127] back to human [0, 99].
#[inline]
pub fn raw_level_to_human(kind: EnvelopeKind, raw: u8) -> u8 {
    let b = raw.min(127);
    match kind {
        EnvelopeKind::Dco => {
            if b > 63 {
                b.saturating_sub(4)
            } else {
                b
            }
        }
        EnvelopeKind::Dcw => {
            if b == 0 {
                0
            } else if b == 127 {
                99
            } else {
                trunc_div((b as u32) * 99, 127) + 1
            }
        }
        EnvelopeKind::Dca => {
            if b == 0 {
                0
            } else {
                b.saturating_sub(28)
            }
        }
    }
}

/// Normalize authored PD envelope values into the raw representation consumed
/// by the PD envelope adapter.
pub fn normalize_synth_params_envelopes_to_raw_if_human(params: &mut SynthParams) {
    normalize_env_to_raw_if_human(
        EnvelopeKind::Dco,
        params.line1.envelopes.pitch.as_step_mut(),
    );
    normalize_env_to_raw_if_human(
        EnvelopeKind::Dcw,
        params.line1.envelopes.timbre.as_step_mut(),
    );
    normalize_env_to_raw_if_human(
        EnvelopeKind::Dca,
        params.line1.envelopes.amplitude.as_step_mut(),
    );
    normalize_env_to_raw_if_human(
        EnvelopeKind::Dco,
        params.line2.envelopes.pitch.as_step_mut(),
    );
    normalize_env_to_raw_if_human(
        EnvelopeKind::Dcw,
        params.line2.envelopes.timbre.as_step_mut(),
    );
    normalize_env_to_raw_if_human(
        EnvelopeKind::Dca,
        params.line2.envelopes.amplitude.as_step_mut(),
    );
}

fn normalize_env_to_raw_if_human(kind: EnvelopeKind, env: &mut StepEnvData) {
    const INV_99: f32 = 1.0 / 99.0;
    for step in env.steps.iter_mut() {
        step.level = human_level_to_raw(kind, step.level);
        step.rate = human_rate_to_raw(kind, step.rate);
        step.level_norm = raw_level_to_human(kind, step.level) as f32 * INV_99;
    }
}

/// Recompute normalized levels after a caller has supplied raw PD values.
pub fn compute_env_level_norms(params: &mut SynthParams) {
    update_norms(
        EnvelopeKind::Dco,
        params.line1.envelopes.pitch.as_step_mut(),
    );
    update_norms(
        EnvelopeKind::Dcw,
        params.line1.envelopes.timbre.as_step_mut(),
    );
    update_norms(
        EnvelopeKind::Dca,
        params.line1.envelopes.amplitude.as_step_mut(),
    );
    update_norms(
        EnvelopeKind::Dco,
        params.line2.envelopes.pitch.as_step_mut(),
    );
    update_norms(
        EnvelopeKind::Dcw,
        params.line2.envelopes.timbre.as_step_mut(),
    );
    update_norms(
        EnvelopeKind::Dca,
        params.line2.envelopes.amplitude.as_step_mut(),
    );
}

fn update_norms(kind: EnvelopeKind, env: &mut StepEnvData) {
    const INV_99: f32 = 1.0 / 99.0;
    for step in env.steps.iter_mut() {
        step.level_norm = raw_level_to_human(kind, step.level) as f32 * INV_99;
    }
}

/// Build the PD-specific timing curves for the three generic envelope slots.
pub fn timing_cache(sample_rate: f32) -> EnvelopeTimingCache {
    let dco = timing_table(EnvelopeKind::Dco, sample_rate);
    let dcw = timing_table(EnvelopeKind::Dcw, sample_rate);
    let dca = timing_table(EnvelopeKind::Dca, sample_rate);
    EnvelopeTimingCache::from_slots([dco, dcw, dca])
}

pub fn advance_envelopes(
    params: &PdLineParams,
    envelopes: &LineEnvelopeParams,
    state: &mut EnvelopeBank,
    timing: &EnvelopeTimingCache,
    note: u8,
) -> [f32; 3] {
    state.slots[0].advance(envelopes.pitch.as_step(), timing.slot(0), 1.0);
    state.slots[1].advance(envelopes.timbre.as_step(), timing.slot(1), 1.0);
    state.slots[2].advance(
        envelopes.amplitude.as_step(),
        timing.slot(2),
        dca_key_follow_duration_scale(params.dca_key_follow, note),
    );

    [
        state.slots[0].output,
        state.slots[1].output,
        state.slots[2].output,
    ]
}

pub fn start_envelope_release(envelopes: &LineEnvelopeParams, state: &mut EnvelopeBank) {
    state.slots[0].start_release(envelopes.pitch.as_step());
    state.slots[1].start_release(envelopes.timbre.as_step());
    state.slots[2].start_release(envelopes.amplitude.as_step());
}

pub fn line_frequency(
    base_frequency: f32,
    octave: f32,
    detune_note: f32,
    detune_fine: f32,
    pitch_envelope: f32,
) -> f32 {
    base_frequency
        * (2.0_f32).powf(octave + detune_note / 12.0 + detune_fine / 720.0)
        * (2.0_f32).powf(dco_env_semitones(pitch_envelope) / 12.0)
}

pub fn dcw_base_output(base: f32, key_follow: f32, timbre_envelope: f32, note: u8) -> f32 {
    base * dcw_env_depth(timbre_envelope) * dcw_key_follow_scale(key_follow, note)
}

pub fn dco_env_semitones(pitch_envelope: f32) -> f32 {
    let level = pitch_envelope.clamp(0.0, 1.0) * 99.0;
    if level <= 64.0 {
        level / 8.0
    } else {
        8.0 + (level - 64.0) * 2.0
    }
}

pub fn dca_env_gain(amplitude_envelope: f32) -> f32 {
    pow01(amplitude_envelope.clamp(0.0, 1.0), 1.5)
}

pub fn dcw_env_depth(timbre_envelope: f32) -> f32 {
    pow01(timbre_envelope.clamp(0.0, 1.0), 0.8)
}

pub fn dcw_key_follow_scale(key_follow_amount: f32, note: u8) -> f32 {
    const REFERENCE_NOTE: f32 = 60.0;
    const SEMITONE_SPAN: f32 = 48.0;
    const MAX_ATTENUATION: f32 = 0.85;
    const MIN_SCALE: f32 = 0.15;

    let key_follow = (key_follow_amount / 9.0).clamp(0.0, 1.0);
    if key_follow <= 0.0 {
        return 1.0;
    }

    let pitch_progress = ((note as f32 - REFERENCE_NOTE) / SEMITONE_SPAN).clamp(0.0, 1.0);
    (1.0 - key_follow * pitch_progress * MAX_ATTENUATION).clamp(MIN_SCALE, 1.0)
}

const KEY_FOLLOW_REFERENCE_NOTE: f32 = 48.0;
const DCA_KEY_FOLLOW_SEMITONE_SPAN: f32 = 48.0;
const DCA_KEY_FOLLOW_MIN_DURATION_SCALE: f32 = 0.01;

fn dca_key_follow_duration_scale(key_follow_amount: f32, note: u8) -> f32 {
    let key_follow = (key_follow_amount / 9.0).clamp(0.0, 1.0);
    if key_follow <= 0.0 {
        return 1.0;
    }

    let pitch_progress =
        ((note as f32 - KEY_FOLLOW_REFERENCE_NOTE) / DCA_KEY_FOLLOW_SEMITONE_SPAN).clamp(0.0, 1.0);
    (1.0 - key_follow * pitch_progress).clamp(DCA_KEY_FOLLOW_MIN_DURATION_SCALE, 1.0)
}

fn timing_table(kind: EnvelopeKind, sample_rate: f32) -> StepEnvelopeTiming {
    let mut rate_samples = [0_u32; 128];
    for (raw_rate, samples) in rate_samples.iter_mut().enumerate() {
        *samples = rate_to_samples(kind, raw_rate as u8, sample_rate);
    }
    StepEnvelopeTiming::from_rate_samples(rate_samples)
}

fn rate_to_seconds(kind: EnvelopeKind, rate: u8) -> f32 {
    let normalized_rate = rate.min(99) as f32 / 99.0;

    match kind {
        EnvelopeKind::Dca | EnvelopeKind::Dcw => {
            104.04_f32 * (0.004_f32 / 104.04_f32).powf(normalized_rate)
        }
        EnvelopeKind::Dco => {
            const DCO_EXP_K: f32 = -13.984;
            235.64_f32 * (DCO_EXP_K * normalized_rate).exp()
        }
    }
}

fn rate_to_samples(kind: EnvelopeKind, rate: u8, sample_rate: f32) -> u32 {
    (sample_rate * rate_to_seconds(kind, rate)).max(1.0).round() as u32
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dco_rate_mapping_matches_spec() {
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dco, 0), 0);
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dco, 99), 127);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dco, 0), 0);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dco, 127), 99);
    }

    #[test]
    fn dco_level_mapping_matches_spec() {
        assert_eq!(human_level_to_raw(EnvelopeKind::Dco, 63), 63);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dco, 64), 68);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dco, 99), 103);
        assert_eq!(raw_level_to_human(EnvelopeKind::Dco, 63), 63);
        assert_eq!(raw_level_to_human(EnvelopeKind::Dco, 68), 64);
    }

    #[test]
    fn dcw_mapping_matches_spec() {
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dcw, 0), 8);
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dcw, 99), 127);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dcw, 99), 127);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dcw, 8), 0);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dcw, 127), 99);
    }

    #[test]
    fn dca_mapping_matches_spec() {
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dca, 0), 0);
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dca, 99), 119);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dca, 0), 0);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dca, 1), 29);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dca, 99), 127);
        assert_eq!(raw_level_to_human(EnvelopeKind::Dca, 127), 99);
    }

    #[test]
    fn pd_timing_curves_match_reference_points() {
        let expected = [
            (EnvelopeKind::Dca, 0, 104.04_f32),
            (EnvelopeKind::Dca, 50, 0.544_f32),
            (EnvelopeKind::Dca, 99, 0.004_f32),
            (EnvelopeKind::Dco, 0, 235.64_f32),
            (EnvelopeKind::Dco, 50, 0.20_f32),
            (EnvelopeKind::Dco, 99, 0.0002_f32),
        ];

        for (kind, rate, seconds) in expected {
            let actual = rate_to_seconds(kind, rate);
            let relative_error = (actual - seconds).abs() / seconds;
            assert!(relative_error <= 0.20, "rate {rate}: {actual}s");
        }
    }
}
