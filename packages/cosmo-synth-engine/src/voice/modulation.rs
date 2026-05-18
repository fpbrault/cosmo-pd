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

pub(crate) fn algo_param_slot_mods_for_line(
    line_index: u8,
    cache: &ModMatrixCache,
    sources: &ModSources,
) -> [f32; 8] {
    if line_index == 2 {
        [
            cache.get(ModDestination::Line2AlgoParam1, sources),
            cache.get(ModDestination::Line2AlgoParam2, sources),
            cache.get(ModDestination::Line2AlgoParam3, sources),
            cache.get(ModDestination::Line2AlgoParam4, sources),
            cache.get(ModDestination::Line2AlgoParam5, sources),
            cache.get(ModDestination::Line2AlgoParam6, sources),
            cache.get(ModDestination::Line2AlgoParam7, sources),
            cache.get(ModDestination::Line2AlgoParam8, sources),
        ]
    } else {
        [
            cache.get(ModDestination::Line1AlgoParam1, sources),
            cache.get(ModDestination::Line1AlgoParam2, sources),
            cache.get(ModDestination::Line1AlgoParam3, sources),
            cache.get(ModDestination::Line1AlgoParam4, sources),
            cache.get(ModDestination::Line1AlgoParam5, sources),
            cache.get(ModDestination::Line1AlgoParam6, sources),
            cache.get(ModDestination::Line1AlgoParam7, sources),
            cache.get(ModDestination::Line1AlgoParam8, sources),
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
    cache: &ModMatrixCache,
    sources: &ModSources,
) -> StepEnvData {
    let mut modded = *env;

    for step_index in 0..NUM_ENV_STEPS {
        let level_dest = env_step_level_destination(line_index, env_kind, step_index);
        let rate_dest = env_step_rate_destination(line_index, env_kind, step_index);
        let level_mod = cache.get(level_dest, sources);
        let rate_mod = cache.get(rate_dest, sources);

        let step: &mut EnvStep = &mut modded.steps[step_index];
        let next_level = (step.level as f32 + level_mod * 127.0)
            .round()
            .clamp(0.0, 127.0) as u8;
        let next_rate = (step.rate as f32 + rate_mod * 127.0)
            .round()
            .clamp(0.0, 127.0) as u8;
        step.level = next_level;
        step.rate = next_rate;
    }

    modded
}

pub(crate) fn modulated_line_params(
    line: &LineParams,
    scratch: &mut LineParams,
    line_index: u8,
    cache: &ModMatrixCache,
    sources: &ModSources,
) {
    let algo_blend_dest = if line_index == 2 {
        ModDestination::Line2AlgoBlend
    } else {
        ModDestination::Line1AlgoBlend
    };

    let algo_blend_mod = cache.get(algo_blend_dest, sources);

    *scratch = *line;
    scratch.algo_blend = (line.algo_blend + algo_blend_mod).clamp(0.0, 1.0);
    if cache.has_env_step_routes {
        scratch.dco_env =
            apply_env_step_modulation(&line.dco_env, line_index, EnvKindKey::Dco, cache, sources);
        scratch.dcw_env =
            apply_env_step_modulation(&line.dcw_env, line_index, EnvKindKey::Dcw, cache, sources);
        scratch.dca_env =
            apply_env_step_modulation(&line.dca_env, line_index, EnvKindKey::Dca, cache, sources);
    }
}
// ---------------------------------------------------------------------------
// LineEnvs — per-line group of three envelope generators
// ---------------------------------------------------------------------------
