use crate::params::{
    EnvStep, LineParams, ModDestination, ModMatrixCache, NUM_ENV_STEPS, StepEnvData,
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
            cache.get_by_index(ModDestination::Line2AlgoParam1 as usize, sources),
            cache.get_by_index(ModDestination::Line2AlgoParam2 as usize, sources),
            cache.get_by_index(ModDestination::Line2AlgoParam3 as usize, sources),
            cache.get_by_index(ModDestination::Line2AlgoParam4 as usize, sources),
            cache.get_by_index(ModDestination::Line2AlgoParam5 as usize, sources),
            cache.get_by_index(ModDestination::Line2AlgoParam6 as usize, sources),
            cache.get_by_index(ModDestination::Line2AlgoParam7 as usize, sources),
            cache.get_by_index(ModDestination::Line2AlgoParam8 as usize, sources),
        ]
    } else {
        [
            cache.get_by_index(ModDestination::Line1AlgoParam1 as usize, sources),
            cache.get_by_index(ModDestination::Line1AlgoParam2 as usize, sources),
            cache.get_by_index(ModDestination::Line1AlgoParam3 as usize, sources),
            cache.get_by_index(ModDestination::Line1AlgoParam4 as usize, sources),
            cache.get_by_index(ModDestination::Line1AlgoParam5 as usize, sources),
            cache.get_by_index(ModDestination::Line1AlgoParam6 as usize, sources),
            cache.get_by_index(ModDestination::Line1AlgoParam7 as usize, sources),
            cache.get_by_index(ModDestination::Line1AlgoParam8 as usize, sources),
        ]
    }
}

#[derive(Debug, Clone, Copy)]
enum EnvKindKey {
    Dco,
    Dcw,
    Dca,
}

impl EnvKindKey {
    #[inline(always)]
    const fn index(self) -> usize {
        match self {
            Self::Dco => 0,
            Self::Dcw => 1,
            Self::Dca => 2,
        }
    }
}

const LINE1_DCO_LEVEL_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line1DcoEnvStep1Level as usize,
    ModDestination::Line1DcoEnvStep2Level as usize,
    ModDestination::Line1DcoEnvStep3Level as usize,
    ModDestination::Line1DcoEnvStep4Level as usize,
    ModDestination::Line1DcoEnvStep5Level as usize,
    ModDestination::Line1DcoEnvStep6Level as usize,
    ModDestination::Line1DcoEnvStep7Level as usize,
    ModDestination::Line1DcoEnvStep8Level as usize,
];
const LINE1_DCO_RATE_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line1DcoEnvStep1Rate as usize,
    ModDestination::Line1DcoEnvStep2Rate as usize,
    ModDestination::Line1DcoEnvStep3Rate as usize,
    ModDestination::Line1DcoEnvStep4Rate as usize,
    ModDestination::Line1DcoEnvStep5Rate as usize,
    ModDestination::Line1DcoEnvStep6Rate as usize,
    ModDestination::Line1DcoEnvStep7Rate as usize,
    ModDestination::Line1DcoEnvStep8Rate as usize,
];
const LINE1_DCW_LEVEL_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line1DcwEnvStep1Level as usize,
    ModDestination::Line1DcwEnvStep2Level as usize,
    ModDestination::Line1DcwEnvStep3Level as usize,
    ModDestination::Line1DcwEnvStep4Level as usize,
    ModDestination::Line1DcwEnvStep5Level as usize,
    ModDestination::Line1DcwEnvStep6Level as usize,
    ModDestination::Line1DcwEnvStep7Level as usize,
    ModDestination::Line1DcwEnvStep8Level as usize,
];
const LINE1_DCW_RATE_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line1DcwEnvStep1Rate as usize,
    ModDestination::Line1DcwEnvStep2Rate as usize,
    ModDestination::Line1DcwEnvStep3Rate as usize,
    ModDestination::Line1DcwEnvStep4Rate as usize,
    ModDestination::Line1DcwEnvStep5Rate as usize,
    ModDestination::Line1DcwEnvStep6Rate as usize,
    ModDestination::Line1DcwEnvStep7Rate as usize,
    ModDestination::Line1DcwEnvStep8Rate as usize,
];
const LINE1_DCA_LEVEL_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line1DcaEnvStep1Level as usize,
    ModDestination::Line1DcaEnvStep2Level as usize,
    ModDestination::Line1DcaEnvStep3Level as usize,
    ModDestination::Line1DcaEnvStep4Level as usize,
    ModDestination::Line1DcaEnvStep5Level as usize,
    ModDestination::Line1DcaEnvStep6Level as usize,
    ModDestination::Line1DcaEnvStep7Level as usize,
    ModDestination::Line1DcaEnvStep8Level as usize,
];
const LINE1_DCA_RATE_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line1DcaEnvStep1Rate as usize,
    ModDestination::Line1DcaEnvStep2Rate as usize,
    ModDestination::Line1DcaEnvStep3Rate as usize,
    ModDestination::Line1DcaEnvStep4Rate as usize,
    ModDestination::Line1DcaEnvStep5Rate as usize,
    ModDestination::Line1DcaEnvStep6Rate as usize,
    ModDestination::Line1DcaEnvStep7Rate as usize,
    ModDestination::Line1DcaEnvStep8Rate as usize,
];
const LINE2_DCO_LEVEL_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line2DcoEnvStep1Level as usize,
    ModDestination::Line2DcoEnvStep2Level as usize,
    ModDestination::Line2DcoEnvStep3Level as usize,
    ModDestination::Line2DcoEnvStep4Level as usize,
    ModDestination::Line2DcoEnvStep5Level as usize,
    ModDestination::Line2DcoEnvStep6Level as usize,
    ModDestination::Line2DcoEnvStep7Level as usize,
    ModDestination::Line2DcoEnvStep8Level as usize,
];
const LINE2_DCO_RATE_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line2DcoEnvStep1Rate as usize,
    ModDestination::Line2DcoEnvStep2Rate as usize,
    ModDestination::Line2DcoEnvStep3Rate as usize,
    ModDestination::Line2DcoEnvStep4Rate as usize,
    ModDestination::Line2DcoEnvStep5Rate as usize,
    ModDestination::Line2DcoEnvStep6Rate as usize,
    ModDestination::Line2DcoEnvStep7Rate as usize,
    ModDestination::Line2DcoEnvStep8Rate as usize,
];
const LINE2_DCW_LEVEL_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line2DcwEnvStep1Level as usize,
    ModDestination::Line2DcwEnvStep2Level as usize,
    ModDestination::Line2DcwEnvStep3Level as usize,
    ModDestination::Line2DcwEnvStep4Level as usize,
    ModDestination::Line2DcwEnvStep5Level as usize,
    ModDestination::Line2DcwEnvStep6Level as usize,
    ModDestination::Line2DcwEnvStep7Level as usize,
    ModDestination::Line2DcwEnvStep8Level as usize,
];
const LINE2_DCW_RATE_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line2DcwEnvStep1Rate as usize,
    ModDestination::Line2DcwEnvStep2Rate as usize,
    ModDestination::Line2DcwEnvStep3Rate as usize,
    ModDestination::Line2DcwEnvStep4Rate as usize,
    ModDestination::Line2DcwEnvStep5Rate as usize,
    ModDestination::Line2DcwEnvStep6Rate as usize,
    ModDestination::Line2DcwEnvStep7Rate as usize,
    ModDestination::Line2DcwEnvStep8Rate as usize,
];
const LINE2_DCA_LEVEL_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line2DcaEnvStep1Level as usize,
    ModDestination::Line2DcaEnvStep2Level as usize,
    ModDestination::Line2DcaEnvStep3Level as usize,
    ModDestination::Line2DcaEnvStep4Level as usize,
    ModDestination::Line2DcaEnvStep5Level as usize,
    ModDestination::Line2DcaEnvStep6Level as usize,
    ModDestination::Line2DcaEnvStep7Level as usize,
    ModDestination::Line2DcaEnvStep8Level as usize,
];
const LINE2_DCA_RATE_DESTS: [usize; NUM_ENV_STEPS] = [
    ModDestination::Line2DcaEnvStep1Rate as usize,
    ModDestination::Line2DcaEnvStep2Rate as usize,
    ModDestination::Line2DcaEnvStep3Rate as usize,
    ModDestination::Line2DcaEnvStep4Rate as usize,
    ModDestination::Line2DcaEnvStep5Rate as usize,
    ModDestination::Line2DcaEnvStep6Rate as usize,
    ModDestination::Line2DcaEnvStep7Rate as usize,
    ModDestination::Line2DcaEnvStep8Rate as usize,
];

#[inline(always)]
fn env_step_destination_indices(
    line_index: u8,
    env_kind: EnvKindKey,
) -> (
    &'static [usize; NUM_ENV_STEPS],
    &'static [usize; NUM_ENV_STEPS],
) {
    match (line_index, env_kind) {
        (2, EnvKindKey::Dco) => (&LINE2_DCO_LEVEL_DESTS, &LINE2_DCO_RATE_DESTS),
        (2, EnvKindKey::Dcw) => (&LINE2_DCW_LEVEL_DESTS, &LINE2_DCW_RATE_DESTS),
        (2, EnvKindKey::Dca) => (&LINE2_DCA_LEVEL_DESTS, &LINE2_DCA_RATE_DESTS),
        (_, EnvKindKey::Dco) => (&LINE1_DCO_LEVEL_DESTS, &LINE1_DCO_RATE_DESTS),
        (_, EnvKindKey::Dcw) => (&LINE1_DCW_LEVEL_DESTS, &LINE1_DCW_RATE_DESTS),
        (_, EnvKindKey::Dca) => (&LINE1_DCA_LEVEL_DESTS, &LINE1_DCA_RATE_DESTS),
    }
}

fn apply_env_step_modulation(
    env: &StepEnvData,
    line_index: u8,
    env_kind: EnvKindKey,
    cache: &ModMatrixCache,
    sources: &ModSources,
) -> StepEnvData {
    let mut modded = *env;
    let (level_dests, rate_dests) = env_step_destination_indices(line_index, env_kind);
    let kind_index = env_kind.index();
    let mut active_step_mask =
        cache.env_level_mask(line_index, kind_index) | cache.env_rate_mask(line_index, kind_index);

    while active_step_mask != 0 {
        let step_index = active_step_mask.trailing_zeros() as usize;
        let step_bit = 1u8 << step_index;
        active_step_mask &= !step_bit;

        let level_mod = if cache.env_level_mask(line_index, kind_index) & step_bit != 0 {
            cache.get_by_index(level_dests[step_index], sources)
        } else {
            0.0
        };
        let rate_mod = if cache.env_rate_mask(line_index, kind_index) & step_bit != 0 {
            cache.get_by_index(rate_dests[step_index], sources)
        } else {
            0.0
        };

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
