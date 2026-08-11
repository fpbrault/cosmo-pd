use crate::params::{
    ENV_STEP_DEST_FIRST, ENV_STEP_DEST_LAST, EnvStep, EnvelopeProgramV1, LineParams,
    ModDestination, NUM_ENV_STEPS,
};

use super::envelope_map::{
    EnvelopeKind, human_level_to_raw, human_rate_to_raw, raw_level_to_human, raw_rate_to_human,
};

#[derive(Debug, Clone, Copy)]
enum PdEnvelopeSlot {
    Pitch,
    Timbre,
    Amplitude,
}

const ENV_DEST_KIND_OFFSET: [u16; 3] = [0, 16, 32];

fn env_destination(
    line_index: u8,
    slot: PdEnvelopeSlot,
    step_index: usize,
    level: bool,
) -> ModDestination {
    let slot_index = match slot {
        PdEnvelopeSlot::Pitch => 0,
        PdEnvelopeSlot::Timbre => 1,
        PdEnvelopeSlot::Amplitude => 2,
    };
    let idx = ENV_STEP_DEST_FIRST as u16
        + u16::from(line_index.saturating_sub(1)) * 48
        + ENV_DEST_KIND_OFFSET[slot_index]
        + (step_index as u16) * 2
        + u16::from(!level);

    if usize::from(idx) <= ENV_STEP_DEST_LAST {
        ModDestination::try_from(idx).unwrap_or(ModDestination::Volume)
    } else {
        ModDestination::Volume
    }
}

fn apply_env_step_modulation(
    env: &crate::params::StepEnvData,
    line_index: u8,
    slot: PdEnvelopeSlot,
    mod_values: &[f32],
) -> crate::params::StepEnvData {
    let mut modded = *env;
    let kind = match slot {
        PdEnvelopeSlot::Pitch => EnvelopeKind::Dco,
        PdEnvelopeSlot::Timbre => EnvelopeKind::Dcw,
        PdEnvelopeSlot::Amplitude => EnvelopeKind::Dca,
    };

    for step_index in 0..NUM_ENV_STEPS {
        let level_dest = env_destination(line_index, slot, step_index, true);
        let rate_dest = env_destination(line_index, slot, step_index, false);
        let level_mod = mod_values[level_dest as usize];
        let rate_mod = mod_values[rate_dest as usize];

        let step: &mut EnvStep = &mut modded.steps[step_index];
        let next_level = (raw_level_to_human(kind, step.level) as f32 + level_mod * 99.0)
            .round()
            .clamp(0.0, 99.0) as u8;
        let next_rate = (raw_rate_to_human(kind, step.rate) as f32 + rate_mod * 99.0)
            .round()
            .clamp(0.0, 99.0) as u8;
        step.level = human_level_to_raw(kind, next_level);
        step.level_norm = next_level as f32 * (1.0 / 99.0);
        step.rate = human_rate_to_raw(kind, next_rate);
    }

    modded
}

pub(crate) fn apply_line_mods(
    output: &mut LineParams,
    base: &LineParams,
    line_index: u8,
    mod_values: &[f32],
    has_env_step_routes: bool,
) {
    *output = *base;

    if line_index == 1 {
        output.pd.algo_blend = (base.pd.algo_blend
            + mod_values[ModDestination::Line1AlgoBlend as usize])
            .clamp(0.0, 1.0);
        output.octave =
            (base.octave + mod_values[ModDestination::Line1Octave as usize] * 4.0).clamp(-2.0, 2.0);
    } else {
        output.pd.algo_blend = (base.pd.algo_blend
            + mod_values[ModDestination::Line2AlgoBlend as usize])
            .clamp(0.0, 1.0);
        output.octave = (base.octave
            + mod_values[ModDestination::Line2DetuneOctave as usize] * 6.0)
            .clamp(-5.0, 5.0);
        output.detune_note = (base.detune_note
            + mod_values[ModDestination::Line2DetuneNote as usize] * 22.0)
            .clamp(-11.0, 11.0);
        output.detune_fine = (base.detune_fine
            + mod_values[ModDestination::Line2DetuneFine as usize] * 120.0)
            .clamp(-60.0, 60.0);
    }

    if !has_env_step_routes {
        return;
    }

    output.envelopes.pitch = EnvelopeProgramV1::Step(apply_env_step_modulation(
        base.envelopes.pitch.as_step(),
        line_index,
        PdEnvelopeSlot::Pitch,
        mod_values,
    ));
    output.envelopes.timbre = EnvelopeProgramV1::Step(apply_env_step_modulation(
        base.envelopes.timbre.as_step(),
        line_index,
        PdEnvelopeSlot::Timbre,
        mod_values,
    ));
    output.envelopes.amplitude = EnvelopeProgramV1::Step(apply_env_step_modulation(
        base.envelopes.amplitude.as_step(),
        line_index,
        PdEnvelopeSlot::Amplitude,
        mod_values,
    ));
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::synthesis::pd::default_envelopes::default_dca_env;

    #[test]
    fn envelope_step_level_modulation_updates_dsp_level() {
        let base = default_dca_env();
        let mut mod_values = vec![0.0; crate::params::NUM_MOD_DESTINATIONS];
        mod_values[ModDestination::Line1DcaEnvStep2Level as usize] = -0.5;

        let modded = apply_env_step_modulation(&base, 1, PdEnvelopeSlot::Amplitude, &mod_values);

        assert_eq!(
            raw_level_to_human(EnvelopeKind::Dca, modded.steps[1].level),
            30
        );
        assert!((modded.steps[1].level_norm - 30.0 / 99.0).abs() < f32::EPSILON);
    }

    #[test]
    fn envelope_step_rate_modulation_uses_human_rate_range() {
        let base = default_dca_env();
        let mut mod_values = vec![0.0; crate::params::NUM_MOD_DESTINATIONS];
        mod_values[ModDestination::Line1DcaEnvStep2Rate as usize] = -0.5;

        let modded = apply_env_step_modulation(&base, 1, PdEnvelopeSlot::Amplitude, &mod_values);

        assert_eq!(
            raw_rate_to_human(EnvelopeKind::Dca, modded.steps[1].rate),
            31
        );
    }
}
