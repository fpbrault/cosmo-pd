use crate::envelope_map::{
    EnvelopeKind, human_level_to_raw, human_rate_to_raw, raw_level_to_human, raw_rate_to_human,
};
use crate::params::{
    ENV_STEP_DEST_FIRST, ENV_STEP_DEST_LAST, EnvStep, LineParams, ModDestination, ModMatrixCache,
    NUM_ENV_STEPS, StepEnvData,
};

// Modulation helpers
// ---------------------------------------------------------------------------

/// Pre-computed modulation source values for one render call.
#[derive(Debug, Clone, Copy)]
pub(crate) struct ModSources {
    pub lfo1: f32,
    pub lfo2: f32,
    pub random: f32,
    pub mod_env: f32,
    pub velocity: f32,
    pub mod_wheel: f32,
    /// Aftertouch — stub, always 0.0 this phase.
    pub aftertouch: f32,
    pub macro1: f32,
    pub macro2: f32,
    pub macro3: f32,
    pub macro4: f32,
}

impl ModSources {
    #[allow(clippy::too_many_arguments)]
    pub(crate) fn new(
        lfo1: f32,
        lfo2: f32,
        random: f32,
        mod_env: f32,
        velocity: f32,
        mod_wheel: f32,
        aftertouch: f32,
        macro1: f32,
        macro2: f32,
        macro3: f32,
        macro4: f32,
    ) -> Self {
        Self {
            lfo1,
            lfo2,
            random,
            mod_env,
            velocity,
            mod_wheel,
            aftertouch,
            macro1,
            macro2,
            macro3,
            macro4,
        }
    }
}

pub(crate) fn algo_control_slot_mods_for_line(
    line_index: u8,
    cache: &ModMatrixCache,
    sources: &ModSources,
) -> [f32; 8] {
    if line_index == 2 {
        [
            cache.get(ModDestination::Line2AlgoControl1, sources),
            cache.get(ModDestination::Line2AlgoControl2, sources),
            cache.get(ModDestination::Line2AlgoControl3, sources),
            cache.get(ModDestination::Line2AlgoControl4, sources),
            cache.get(ModDestination::Line2AlgoControl5, sources),
            cache.get(ModDestination::Line2AlgoControl6, sources),
            cache.get(ModDestination::Line2AlgoControl7, sources),
            cache.get(ModDestination::Line2AlgoControl8, sources),
        ]
    } else {
        [
            cache.get(ModDestination::Line1AlgoControl1, sources),
            cache.get(ModDestination::Line1AlgoControl2, sources),
            cache.get(ModDestination::Line1AlgoControl3, sources),
            cache.get(ModDestination::Line1AlgoControl4, sources),
            cache.get(ModDestination::Line1AlgoControl5, sources),
            cache.get(ModDestination::Line1AlgoControl6, sources),
            cache.get(ModDestination::Line1AlgoControl7, sources),
            cache.get(ModDestination::Line1AlgoControl8, sources),
        ]
    }
}

#[derive(Debug, Clone, Copy)]
enum EnvKindKey {
    Dco,
    Dcw,
    Dca,
}

const ENV_DEST_KIND_OFFSET: [u16; 3] = [0, 16, 32];

fn env_destination(
    line_index: u8,
    env_kind: EnvKindKey,
    step_index: usize,
    level: bool,
) -> ModDestination {
    let idx = ENV_STEP_DEST_FIRST as u16
        + u16::from(line_index.saturating_sub(1)) * 48
        + ENV_DEST_KIND_OFFSET[env_kind as u8 as usize]
        + (step_index as u16) * 2
        + u16::from(!level);

    if usize::from(idx) <= ENV_STEP_DEST_LAST {
        ModDestination::try_from(idx).unwrap_or(ModDestination::Volume)
    } else {
        ModDestination::Volume
    }
}

fn env_step_level_destination(
    line_index: u8,
    env_kind: EnvKindKey,
    step_index: usize,
) -> ModDestination {
    env_destination(line_index, env_kind, step_index, true)
}

fn env_step_rate_destination(
    line_index: u8,
    env_kind: EnvKindKey,
    step_index: usize,
) -> ModDestination {
    env_destination(line_index, env_kind, step_index, false)
}

fn apply_env_step_modulation(
    env: &StepEnvData,
    line_index: u8,
    env_kind: EnvKindKey,
    mod_values: &[f32],
) -> StepEnvData {
    let mut modded = *env;
    let envelope_kind = match env_kind {
        EnvKindKey::Dco => EnvelopeKind::Dco,
        EnvKindKey::Dcw => EnvelopeKind::Dcw,
        EnvKindKey::Dca => EnvelopeKind::Dca,
    };

    for step_index in 0..NUM_ENV_STEPS {
        let level_dest = env_step_level_destination(line_index, env_kind, step_index);
        let rate_dest = env_step_rate_destination(line_index, env_kind, step_index);
        let level_mod = mod_values[level_dest as usize];
        let rate_mod = mod_values[rate_dest as usize];

        let step: &mut EnvStep = &mut modded.steps[step_index];
        let next_level = (raw_level_to_human(envelope_kind, step.level) as f32 + level_mod * 99.0)
            .round()
            .clamp(0.0, 99.0) as u8;
        let next_rate = (raw_rate_to_human(envelope_kind, step.rate) as f32 + rate_mod * 99.0)
            .round()
            .clamp(0.0, 99.0) as u8;
        step.level = human_level_to_raw(envelope_kind, next_level);
        step.level_norm = next_level as f32 * (1.0 / 99.0);
        step.rate = human_rate_to_raw(envelope_kind, next_rate);
    }

    modded
}

impl LineParams {
    pub(crate) fn apply_line1_mods(
        &mut self,
        base: &Self,
        mod_values: &[f32],
        has_env_step_routes: bool,
    ) {
        *self = *base;

        self.algo_blend =
            (base.algo_blend + mod_values[ModDestination::Line1AlgoBlend as usize]).clamp(0.0, 1.0);
        self.octave =
            (base.octave + mod_values[ModDestination::Line1Octave as usize] * 4.0).clamp(-2.0, 2.0);

        if has_env_step_routes {
            self.dco_env = apply_env_step_modulation(&base.dco_env, 1, EnvKindKey::Dco, mod_values);
            self.dcw_env = apply_env_step_modulation(&base.dcw_env, 1, EnvKindKey::Dcw, mod_values);
            self.dca_env = apply_env_step_modulation(&base.dca_env, 1, EnvKindKey::Dca, mod_values);
        }
    }

    pub(crate) fn apply_line2_mods(
        &mut self,
        base: &Self,
        mod_values: &[f32],
        has_env_step_routes: bool,
    ) {
        *self = *base;

        self.algo_blend =
            (base.algo_blend + mod_values[ModDestination::Line2AlgoBlend as usize]).clamp(0.0, 1.0);
        self.octave = (base.octave + mod_values[ModDestination::Line2DetuneOctave as usize] * 6.0)
            .clamp(-5.0, 5.0);
        self.detune_note = (base.detune_note
            + mod_values[ModDestination::Line2DetuneNote as usize] * 22.0)
            .clamp(-11.0, 11.0);
        self.detune_fine = (base.detune_fine
            + mod_values[ModDestination::Line2DetuneFine as usize] * 120.0)
            .clamp(-60.0, 60.0);

        if has_env_step_routes {
            self.dco_env = apply_env_step_modulation(&base.dco_env, 2, EnvKindKey::Dco, mod_values);
            self.dcw_env = apply_env_step_modulation(&base.dcw_env, 2, EnvKindKey::Dcw, mod_values);
            self.dca_env = apply_env_step_modulation(&base.dca_env, 2, EnvKindKey::Dca, mod_values);
        }
    }
}
// ---------------------------------------------------------------------------
// LineEnvs — per-line group of three envelope generators
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use crate::default_envelopes::default_dca_env;

    #[test]
    fn envelope_step_level_modulation_updates_dsp_level() {
        let base = default_dca_env();
        let mut mod_values = vec![0.0; crate::params::NUM_MOD_DESTINATIONS];
        mod_values[ModDestination::Line1DcaEnvStep2Level as usize] = -0.5;

        let modded = apply_env_step_modulation(&base, 1, EnvKindKey::Dca, &mod_values);

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

        let modded = apply_env_step_modulation(&base, 1, EnvKindKey::Dca, &mod_values);

        assert_eq!(
            raw_rate_to_human(EnvelopeKind::Dca, modded.steps[1].rate),
            31
        );
    }
}
