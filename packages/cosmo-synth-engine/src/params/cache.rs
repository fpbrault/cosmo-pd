use crate::params::modulation::{ModDestination, ModMatrix, ModSource};
use crate::params::{ENV_STEP_DEST_FIRST, ENV_STEP_DEST_LAST, NUM_MOD_DESTINATIONS};
use crate::voice::ModSources;

#[derive(Debug, Clone)]
pub(crate) struct ModMatrixCache {
    pub values: [f32; NUM_MOD_DESTINATIONS],
    pub ref_mod_env: f32,
    pub ref_velocity: f32,
    pub has_env_step_routes: bool,
    env_level_masks: [[u8; 3]; 2],
    env_rate_masks: [[u8; 3]; 2],
    amounts_by_source: [[f32; NUM_MOD_DESTINATIONS]; 11],
    active_destinations: [usize; NUM_MOD_DESTINATIONS],
    active_destination_count: usize,
    per_voice_mod_env_amounts: [f32; NUM_MOD_DESTINATIONS],
    per_voice_velocity_amounts: [f32; NUM_MOD_DESTINATIONS],
}

impl ModMatrixCache {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn rebuild_routes(&mut self, matrix: &ModMatrix) {
        self.values.fill(0.0);
        for source_amounts in &mut self.amounts_by_source {
            source_amounts.fill(0.0);
        }
        self.active_destination_count = 0;
        self.per_voice_mod_env_amounts.fill(0.0);
        self.per_voice_velocity_amounts.fill(0.0);
        self.has_env_step_routes = false;
        self.env_level_masks = [[0; 3]; 2];
        self.env_rate_masks = [[0; 3]; 2];

        let mut active_marks = [false; NUM_MOD_DESTINATIONS];

        for route in &matrix.routes {
            if !route.enabled {
                continue;
            }
            let idx = route.destination as usize;
            self.amounts_by_source[source_index(route.source)][idx] += route.amount;
            if !active_marks[idx] {
                active_marks[idx] = true;
                self.active_destinations[self.active_destination_count] = idx;
                self.active_destination_count += 1;
            }
            if !self.has_env_step_routes
                && (ENV_STEP_DEST_FIRST..=ENV_STEP_DEST_LAST).contains(&idx)
            {
                self.has_env_step_routes = true;
            }
            if (ENV_STEP_DEST_FIRST..=ENV_STEP_DEST_LAST).contains(&idx) {
                let relative = idx - ENV_STEP_DEST_FIRST;
                let line_index = relative / 48;
                let kind_index = (relative % 48) / 16;
                let step_index = (relative % 16) / 2;
                let step_bit = 1u8 << step_index;
                if relative & 1 == 0 {
                    self.env_level_masks[line_index][kind_index] |= step_bit;
                } else {
                    self.env_rate_masks[line_index][kind_index] |= step_bit;
                }
            }

            if route.source == ModSource::ModEnv || route.source == ModSource::Velocity {
                if route.source == ModSource::ModEnv {
                    self.per_voice_mod_env_amounts[idx] += route.amount;
                } else {
                    self.per_voice_velocity_amounts[idx] += route.amount;
                }
            }
        }
    }

    pub fn compute(&mut self, sources: &ModSources) {
        for idx in self.active_destinations[..self.active_destination_count]
            .iter()
            .copied()
        {
            self.values[idx] = (self.amounts_by_source[source_index(ModSource::Lfo1)][idx]
                * sources.lfo1
                + self.amounts_by_source[source_index(ModSource::Lfo2)][idx] * sources.lfo2
                + self.amounts_by_source[source_index(ModSource::Random)][idx] * sources.random
                + self.amounts_by_source[source_index(ModSource::ModEnv)][idx] * sources.mod_env
                + self.amounts_by_source[source_index(ModSource::Velocity)][idx]
                    * sources.velocity
                + self.amounts_by_source[source_index(ModSource::ModWheel)][idx]
                    * sources.mod_wheel
                + self.amounts_by_source[source_index(ModSource::Aftertouch)][idx]
                    * sources.aftertouch
                + self.amounts_by_source[source_index(ModSource::Macro1)][idx] * sources.macro1
                + self.amounts_by_source[source_index(ModSource::Macro2)][idx] * sources.macro2
                + self.amounts_by_source[source_index(ModSource::Macro3)][idx] * sources.macro3
                + self.amounts_by_source[source_index(ModSource::Macro4)][idx] * sources.macro4)
                .clamp(-1.0, 1.0);
        }

        self.ref_mod_env = sources.mod_env;
        self.ref_velocity = sources.velocity;
    }

    #[inline]
    pub fn get(&self, dest: ModDestination, sources: &ModSources) -> f32 {
        self.get_by_index(dest as usize, sources)
    }

    #[inline]
    pub fn get_by_index(&self, idx: usize, sources: &ModSources) -> f32 {
        let mut v = self.values[idx];
        let env_amt = self.per_voice_mod_env_amounts[idx];
        if env_amt != 0.0 {
            v += env_amt * (sources.mod_env - self.ref_mod_env);
        }
        let vel_amt = self.per_voice_velocity_amounts[idx];
        if vel_amt != 0.0 {
            v += vel_amt * (sources.velocity - self.ref_velocity);
        }

        v.clamp(-1.0, 1.0)
    }

    #[inline]
    pub fn env_level_mask(&self, line_index: u8, env_kind_index: usize) -> u8 {
        self.env_level_masks[(line_index.saturating_sub(1)) as usize][env_kind_index]
    }

    #[inline]
    pub fn env_rate_mask(&self, line_index: u8, env_kind_index: usize) -> u8 {
        self.env_rate_masks[(line_index.saturating_sub(1)) as usize][env_kind_index]
    }
}

impl Default for ModMatrixCache {
    fn default() -> Self {
        Self {
            values: [0.0; NUM_MOD_DESTINATIONS],
            ref_mod_env: 0.0,
            ref_velocity: 0.0,
            has_env_step_routes: false,
            env_level_masks: [[0; 3]; 2],
            env_rate_masks: [[0; 3]; 2],
            amounts_by_source: [[0.0; NUM_MOD_DESTINATIONS]; 11],
            active_destinations: [0; NUM_MOD_DESTINATIONS],
            active_destination_count: 0,
            per_voice_mod_env_amounts: [0.0; NUM_MOD_DESTINATIONS],
            per_voice_velocity_amounts: [0.0; NUM_MOD_DESTINATIONS],
        }
    }
}

#[inline(always)]
fn source_index(source: ModSource) -> usize {
    match source {
        ModSource::Lfo1 => 0,
        ModSource::Lfo2 => 1,
        ModSource::Random => 2,
        ModSource::ModEnv => 3,
        ModSource::Velocity => 4,
        ModSource::ModWheel => 5,
        ModSource::Aftertouch => 6,
        ModSource::Macro1 => 7,
        ModSource::Macro2 => 8,
        ModSource::Macro3 => 9,
        ModSource::Macro4 => 10,
    }
}
