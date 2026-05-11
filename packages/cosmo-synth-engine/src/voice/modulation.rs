use crate::params::{
    EnvStep, LineParams, ModDestination, ModMatrix, ModMatrixCache, ModSource, StepEnvData,
    NUM_ENV_STEPS,
};
use crate::simd::SimdBackend;

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
}

impl ModSources {
    pub(crate) fn new(
        lfo1: f32,
        lfo2: f32,
        random: f32,
        mod_env: f32,
        velocity: f32,
        mod_wheel: f32,
        aftertouch: f32,
    ) -> Self {
        Self {
            lfo1,
            lfo2,
            random,
            mod_env,
            velocity,
            mod_wheel,
            aftertouch,
        }
    }

    pub(crate) fn source_value(&self, source: ModSource) -> f32 {
        match source {
            ModSource::Lfo1 => self.lfo1,
            ModSource::Lfo2 => self.lfo2,
            ModSource::Random => self.random,
            ModSource::ModEnv => self.mod_env,
            ModSource::Velocity => self.velocity,
            ModSource::ModWheel => self.mod_wheel,
            ModSource::Aftertouch => self.aftertouch,
        }
    }
}

/// Sum all enabled routes targeting `dest`, clamping the total to [-1, 1].
#[allow(dead_code)]
pub(crate) fn mod_value_for(dest: ModDestination, matrix: &ModMatrix, sources: &ModSources) -> f32 {
    let mut total = 0.0_f32;
    for route in &matrix.routes {
        if route.enabled && route.destination == dest {
            total += route.amount * sources.source_value(route.source);
        }
    }
    total.clamp(-1.0, 1.0)
}

#[allow(dead_code)]
pub(crate) fn mod_values_for_destinations4(
    destinations: [ModDestination; 4],
    matrix: &ModMatrix,
    sources: &ModSources,
    backend: SimdBackend,
) -> [f32; 4] {
    let mut totals = [0.0_f32; 4];

    for route in &matrix.routes {
        if !route.enabled {
            continue;
        }

        let scaled = route.amount * sources.source_value(route.source);
        let values = [scaled; 4];
        let mask = [
            if route.destination == destinations[0] {
                1.0
            } else {
                0.0
            },
            if route.destination == destinations[1] {
                1.0
            } else {
                0.0
            },
            if route.destination == destinations[2] {
                1.0
            } else {
                0.0
            },
            if route.destination == destinations[3] {
                1.0
            } else {
                0.0
            },
        ];

        totals = backend.add4(totals, backend.mul4(values, mask));
    }

    backend.clamp4(totals, -1.0, 1.0)
}

#[allow(dead_code)]
pub(crate) fn mod_values_for_destinations8(
    destinations: [ModDestination; 8],
    matrix: &ModMatrix,
    sources: &ModSources,
    backend: SimdBackend,
) -> [f32; 8] {
    let first = mod_values_for_destinations4(
        [
            destinations[0],
            destinations[1],
            destinations[2],
            destinations[3],
        ],
        matrix,
        sources,
        backend,
    );
    let second = mod_values_for_destinations4(
        [
            destinations[4],
            destinations[5],
            destinations[6],
            destinations[7],
        ],
        matrix,
        sources,
        backend,
    );

    [
        first[0], first[1], first[2], first[3], second[0], second[1], second[2], second[3],
    ]
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

fn env_step_level_destination(
    line_index: u8,
    env_kind: EnvKindKey,
    step_index: usize,
) -> ModDestination {
    match (line_index, env_kind, step_index) {
        (1, EnvKindKey::Dco, 0) => ModDestination::Line1DcoEnvStep1Level,
        (1, EnvKindKey::Dco, 1) => ModDestination::Line1DcoEnvStep2Level,
        (1, EnvKindKey::Dco, 2) => ModDestination::Line1DcoEnvStep3Level,
        (1, EnvKindKey::Dco, 3) => ModDestination::Line1DcoEnvStep4Level,
        (1, EnvKindKey::Dco, 4) => ModDestination::Line1DcoEnvStep5Level,
        (1, EnvKindKey::Dco, 5) => ModDestination::Line1DcoEnvStep6Level,
        (1, EnvKindKey::Dco, 6) => ModDestination::Line1DcoEnvStep7Level,
        (1, EnvKindKey::Dco, 7) => ModDestination::Line1DcoEnvStep8Level,
        (1, EnvKindKey::Dcw, 0) => ModDestination::Line1DcwEnvStep1Level,
        (1, EnvKindKey::Dcw, 1) => ModDestination::Line1DcwEnvStep2Level,
        (1, EnvKindKey::Dcw, 2) => ModDestination::Line1DcwEnvStep3Level,
        (1, EnvKindKey::Dcw, 3) => ModDestination::Line1DcwEnvStep4Level,
        (1, EnvKindKey::Dcw, 4) => ModDestination::Line1DcwEnvStep5Level,
        (1, EnvKindKey::Dcw, 5) => ModDestination::Line1DcwEnvStep6Level,
        (1, EnvKindKey::Dcw, 6) => ModDestination::Line1DcwEnvStep7Level,
        (1, EnvKindKey::Dcw, 7) => ModDestination::Line1DcwEnvStep8Level,
        (1, EnvKindKey::Dca, 0) => ModDestination::Line1DcaEnvStep1Level,
        (1, EnvKindKey::Dca, 1) => ModDestination::Line1DcaEnvStep2Level,
        (1, EnvKindKey::Dca, 2) => ModDestination::Line1DcaEnvStep3Level,
        (1, EnvKindKey::Dca, 3) => ModDestination::Line1DcaEnvStep4Level,
        (1, EnvKindKey::Dca, 4) => ModDestination::Line1DcaEnvStep5Level,
        (1, EnvKindKey::Dca, 5) => ModDestination::Line1DcaEnvStep6Level,
        (1, EnvKindKey::Dca, 6) => ModDestination::Line1DcaEnvStep7Level,
        (1, EnvKindKey::Dca, 7) => ModDestination::Line1DcaEnvStep8Level,
        (2, EnvKindKey::Dco, 0) => ModDestination::Line2DcoEnvStep1Level,
        (2, EnvKindKey::Dco, 1) => ModDestination::Line2DcoEnvStep2Level,
        (2, EnvKindKey::Dco, 2) => ModDestination::Line2DcoEnvStep3Level,
        (2, EnvKindKey::Dco, 3) => ModDestination::Line2DcoEnvStep4Level,
        (2, EnvKindKey::Dco, 4) => ModDestination::Line2DcoEnvStep5Level,
        (2, EnvKindKey::Dco, 5) => ModDestination::Line2DcoEnvStep6Level,
        (2, EnvKindKey::Dco, 6) => ModDestination::Line2DcoEnvStep7Level,
        (2, EnvKindKey::Dco, 7) => ModDestination::Line2DcoEnvStep8Level,
        (2, EnvKindKey::Dcw, 0) => ModDestination::Line2DcwEnvStep1Level,
        (2, EnvKindKey::Dcw, 1) => ModDestination::Line2DcwEnvStep2Level,
        (2, EnvKindKey::Dcw, 2) => ModDestination::Line2DcwEnvStep3Level,
        (2, EnvKindKey::Dcw, 3) => ModDestination::Line2DcwEnvStep4Level,
        (2, EnvKindKey::Dcw, 4) => ModDestination::Line2DcwEnvStep5Level,
        (2, EnvKindKey::Dcw, 5) => ModDestination::Line2DcwEnvStep6Level,
        (2, EnvKindKey::Dcw, 6) => ModDestination::Line2DcwEnvStep7Level,
        (2, EnvKindKey::Dcw, 7) => ModDestination::Line2DcwEnvStep8Level,
        (2, EnvKindKey::Dca, 0) => ModDestination::Line2DcaEnvStep1Level,
        (2, EnvKindKey::Dca, 1) => ModDestination::Line2DcaEnvStep2Level,
        (2, EnvKindKey::Dca, 2) => ModDestination::Line2DcaEnvStep3Level,
        (2, EnvKindKey::Dca, 3) => ModDestination::Line2DcaEnvStep4Level,
        (2, EnvKindKey::Dca, 4) => ModDestination::Line2DcaEnvStep5Level,
        (2, EnvKindKey::Dca, 5) => ModDestination::Line2DcaEnvStep6Level,
        (2, EnvKindKey::Dca, 6) => ModDestination::Line2DcaEnvStep7Level,
        (2, EnvKindKey::Dca, 7) => ModDestination::Line2DcaEnvStep8Level,
        _ => ModDestination::Volume,
    }
}

fn env_step_rate_destination(
    line_index: u8,
    env_kind: EnvKindKey,
    step_index: usize,
) -> ModDestination {
    match (line_index, env_kind, step_index) {
        (1, EnvKindKey::Dco, 0) => ModDestination::Line1DcoEnvStep1Rate,
        (1, EnvKindKey::Dco, 1) => ModDestination::Line1DcoEnvStep2Rate,
        (1, EnvKindKey::Dco, 2) => ModDestination::Line1DcoEnvStep3Rate,
        (1, EnvKindKey::Dco, 3) => ModDestination::Line1DcoEnvStep4Rate,
        (1, EnvKindKey::Dco, 4) => ModDestination::Line1DcoEnvStep5Rate,
        (1, EnvKindKey::Dco, 5) => ModDestination::Line1DcoEnvStep6Rate,
        (1, EnvKindKey::Dco, 6) => ModDestination::Line1DcoEnvStep7Rate,
        (1, EnvKindKey::Dco, 7) => ModDestination::Line1DcoEnvStep8Rate,
        (1, EnvKindKey::Dcw, 0) => ModDestination::Line1DcwEnvStep1Rate,
        (1, EnvKindKey::Dcw, 1) => ModDestination::Line1DcwEnvStep2Rate,
        (1, EnvKindKey::Dcw, 2) => ModDestination::Line1DcwEnvStep3Rate,
        (1, EnvKindKey::Dcw, 3) => ModDestination::Line1DcwEnvStep4Rate,
        (1, EnvKindKey::Dcw, 4) => ModDestination::Line1DcwEnvStep5Rate,
        (1, EnvKindKey::Dcw, 5) => ModDestination::Line1DcwEnvStep6Rate,
        (1, EnvKindKey::Dcw, 6) => ModDestination::Line1DcwEnvStep7Rate,
        (1, EnvKindKey::Dcw, 7) => ModDestination::Line1DcwEnvStep8Rate,
        (1, EnvKindKey::Dca, 0) => ModDestination::Line1DcaEnvStep1Rate,
        (1, EnvKindKey::Dca, 1) => ModDestination::Line1DcaEnvStep2Rate,
        (1, EnvKindKey::Dca, 2) => ModDestination::Line1DcaEnvStep3Rate,
        (1, EnvKindKey::Dca, 3) => ModDestination::Line1DcaEnvStep4Rate,
        (1, EnvKindKey::Dca, 4) => ModDestination::Line1DcaEnvStep5Rate,
        (1, EnvKindKey::Dca, 5) => ModDestination::Line1DcaEnvStep6Rate,
        (1, EnvKindKey::Dca, 6) => ModDestination::Line1DcaEnvStep7Rate,
        (1, EnvKindKey::Dca, 7) => ModDestination::Line1DcaEnvStep8Rate,
        (2, EnvKindKey::Dco, 0) => ModDestination::Line2DcoEnvStep1Rate,
        (2, EnvKindKey::Dco, 1) => ModDestination::Line2DcoEnvStep2Rate,
        (2, EnvKindKey::Dco, 2) => ModDestination::Line2DcoEnvStep3Rate,
        (2, EnvKindKey::Dco, 3) => ModDestination::Line2DcoEnvStep4Rate,
        (2, EnvKindKey::Dco, 4) => ModDestination::Line2DcoEnvStep5Rate,
        (2, EnvKindKey::Dco, 5) => ModDestination::Line2DcoEnvStep6Rate,
        (2, EnvKindKey::Dco, 6) => ModDestination::Line2DcoEnvStep7Rate,
        (2, EnvKindKey::Dco, 7) => ModDestination::Line2DcoEnvStep8Rate,
        (2, EnvKindKey::Dcw, 0) => ModDestination::Line2DcwEnvStep1Rate,
        (2, EnvKindKey::Dcw, 1) => ModDestination::Line2DcwEnvStep2Rate,
        (2, EnvKindKey::Dcw, 2) => ModDestination::Line2DcwEnvStep3Rate,
        (2, EnvKindKey::Dcw, 3) => ModDestination::Line2DcwEnvStep4Rate,
        (2, EnvKindKey::Dcw, 4) => ModDestination::Line2DcwEnvStep5Rate,
        (2, EnvKindKey::Dcw, 5) => ModDestination::Line2DcwEnvStep6Rate,
        (2, EnvKindKey::Dcw, 6) => ModDestination::Line2DcwEnvStep7Rate,
        (2, EnvKindKey::Dcw, 7) => ModDestination::Line2DcwEnvStep8Rate,
        (2, EnvKindKey::Dca, 0) => ModDestination::Line2DcaEnvStep1Rate,
        (2, EnvKindKey::Dca, 1) => ModDestination::Line2DcaEnvStep2Rate,
        (2, EnvKindKey::Dca, 2) => ModDestination::Line2DcaEnvStep3Rate,
        (2, EnvKindKey::Dca, 3) => ModDestination::Line2DcaEnvStep4Rate,
        (2, EnvKindKey::Dca, 4) => ModDestination::Line2DcaEnvStep5Rate,
        (2, EnvKindKey::Dca, 5) => ModDestination::Line2DcaEnvStep6Rate,
        (2, EnvKindKey::Dca, 6) => ModDestination::Line2DcaEnvStep7Rate,
        (2, EnvKindKey::Dca, 7) => ModDestination::Line2DcaEnvStep8Rate,
        _ => ModDestination::Volume,
    }
}

fn apply_env_step_modulation(
    env: &StepEnvData,
    line_index: u8,
    env_kind: EnvKindKey,
    cache: &ModMatrixCache,
    sources: &ModSources,
) -> StepEnvData {
    let mut modded = env.clone();

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
    line_index: u8,
    cache: &ModMatrixCache,
    sources: &ModSources,
) -> LineParams {
    let algo_blend_dest = if line_index == 2 {
        ModDestination::Line2AlgoBlend
    } else {
        ModDestination::Line1AlgoBlend
    };

    let algo_blend_mod = cache.get(algo_blend_dest, sources);

    let mut modded = line.clone();
    modded.algo_blend = (line.algo_blend + algo_blend_mod).clamp(0.0, 1.0);
    if cache.has_env_step_routes {
        modded.dco_env =
            apply_env_step_modulation(&line.dco_env, line_index, EnvKindKey::Dco, cache, sources);
        modded.dcw_env =
            apply_env_step_modulation(&line.dcw_env, line_index, EnvKindKey::Dcw, cache, sources);
        modded.dca_env =
            apply_env_step_modulation(&line.dca_env, line_index, EnvKindKey::Dca, cache, sources);
    }
    modded
}
// ---------------------------------------------------------------------------
// LineEnvs — per-line group of three envelope generators
// ---------------------------------------------------------------------------
