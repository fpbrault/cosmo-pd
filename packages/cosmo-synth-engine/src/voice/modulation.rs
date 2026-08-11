use crate::params::{ModDestination, ModMatrixCache};

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
