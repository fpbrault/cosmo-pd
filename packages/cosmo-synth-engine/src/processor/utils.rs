const SOFT_CLIP_THRESHOLD: f32 = 0.9;

/// Standard MIDI note → frequency conversion.
#[inline]
pub fn midi_note_to_freq(note: u8) -> f32 {
    440.0 * (2.0_f32).powf((note as f32 - 69.0) / 12.0)
}

/// Soft clip using tanh for smooth saturation.
#[inline]
pub(crate) fn soft_clip_tanh(sample: f32, drive: f32) -> f32 {
    if drive <= 0.0 {
        return sample;
    }

    let abs_sample = (sample).abs();
    if abs_sample <= SOFT_CLIP_THRESHOLD {
        return sample;
    }

    let norm = (drive).tanh();
    if norm <= 0.0 {
        return sample;
    }

    let clipped = (sample * drive).tanh() / norm;
    let blend = ((abs_sample - SOFT_CLIP_THRESHOLD) / (1.0 - SOFT_CLIP_THRESHOLD)).clamp(0.0, 1.0);
    sample + (clipped - sample) * blend
}

/// Signed power function for waveshaping.
#[inline]
pub(crate) fn signed_pow(value: f32, gamma: f32) -> f32 {
    value.signum() * (value).abs().powf(gamma.max(0.0001))
}

/// One-pole low-pass filter.
#[inline]
pub(crate) fn one_pole_lp(input: f32, state: &mut f32, cutoff_hz: f32, sample_rate: f32) -> f32 {
    let safe_cutoff = cutoff_hz.clamp(1.0, sample_rate * 0.49);
    let g = 1.0 - (-2.0 * core::f32::consts::PI * safe_cutoff / sample_rate.max(1.0)).exp();
    *state += (input - *state) * g;
    *state
}

/// One-pole high-pass filter (LP subtraction).
#[inline]
pub(crate) fn one_pole_hp(input: f32, state: &mut f32, cutoff_hz: f32, sample_rate: f32) -> f32 {
    let low = one_pole_lp(input, state, cutoff_hz, sample_rate);
    input - low
}
