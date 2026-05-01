use crate::engine::Frame;

#[inline]
pub fn gain(sample: f32, gain: f32) -> f32 {
    sample * gain
}

#[inline]
pub fn soft_clip(sample: f32) -> f32 {
    let sample = sample.clamp(-3.0, 3.0);
    sample * (1.0 - sample * sample / 9.0)
}

#[inline]
pub fn equal_power_crossfade(a: f32, b: f32, mix: f32) -> f32 {
    let angle = mix.clamp(0.0, 1.0) * core::f32::consts::FRAC_PI_2;
    a * libm::cosf(angle) + b * libm::sinf(angle)
}

#[inline]
pub fn dry_wet(dry: f32, wet: f32, mix: f32) -> f32 {
    dry + (wet - dry) * mix.clamp(0.0, 1.0)
}

#[inline]
pub fn sum_frames(frames: &[Frame]) -> Frame {
    frames
        .iter()
        .copied()
        .fold(Frame::SILENCE, |sum, frame| sum.add(frame))
}

#[inline]
pub fn normalize_voice_sum(sample: f32, active_voice_count: usize) -> f32 {
    sample / libm::sqrtf(active_voice_count.max(1) as f32)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sum_frames_adds_channels() {
        let sum = sum_frames(&[
            Frame {
                left: 1.0,
                right: 0.25,
            },
            Frame {
                left: -0.5,
                right: 0.75,
            },
        ]);

        assert_eq!(sum.left, 0.5);
        assert_eq!(sum.right, 1.0);
    }
}
