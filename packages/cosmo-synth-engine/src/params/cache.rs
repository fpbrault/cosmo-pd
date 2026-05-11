use crate::params::modulation::{ModDestination, ModMatrix, ModSource};
use crate::params::{ENV_STEP_DEST_FIRST, ENV_STEP_DEST_LAST, NUM_MOD_DESTINATIONS};
use crate::voice::ModSources;

pub(crate) struct ModMatrixCache {
    pub values: [f32; NUM_MOD_DESTINATIONS],
    pub ref_mod_env: f32,
    pub ref_velocity: f32,
    pub has_env_step_routes: bool,
    per_voice_mod_env_amounts: [f32; NUM_MOD_DESTINATIONS],
    per_voice_velocity_amounts: [f32; NUM_MOD_DESTINATIONS],
}

impl ModMatrixCache {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn compute(&mut self, matrix: &ModMatrix, sources: &ModSources) {
        self.values.fill(0.0);
        self.per_voice_mod_env_amounts.fill(0.0);
        self.per_voice_velocity_amounts.fill(0.0);
        self.has_env_step_routes = false;

        for route in &matrix.routes {
            if !route.enabled {
                continue;
            }
            let idx = route.destination as usize;
            self.values[idx] += route.amount * sources.source_value(route.source);
            if !self.has_env_step_routes && idx >= ENV_STEP_DEST_FIRST && idx <= ENV_STEP_DEST_LAST
            {
                self.has_env_step_routes = true;
            }

            if route.source == ModSource::ModEnv || route.source == ModSource::Velocity {
                if route.source == ModSource::ModEnv {
                    self.per_voice_mod_env_amounts[idx] += route.amount;
                } else {
                    self.per_voice_velocity_amounts[idx] += route.amount;
                }
            }
        }

        for v in &mut self.values {
            *v = v.clamp(-1.0, 1.0);
        }

        self.ref_mod_env = sources.mod_env;
        self.ref_velocity = sources.velocity;
    }

    #[inline]
    pub fn get(&self, dest: ModDestination, sources: &ModSources) -> f32 {
        let idx = dest as usize;
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
}

impl Default for ModMatrixCache {
    fn default() -> Self {
        Self {
            values: [0.0; NUM_MOD_DESTINATIONS],
            ref_mod_env: 0.0,
            ref_velocity: 0.0,
            has_env_step_routes: false,
            per_voice_mod_env_amounts: [0.0; NUM_MOD_DESTINATIONS],
            per_voice_velocity_amounts: [0.0; NUM_MOD_DESTINATIONS],
        }
    }
}
