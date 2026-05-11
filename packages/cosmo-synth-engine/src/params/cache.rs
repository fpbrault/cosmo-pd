use crate::params::modulation::{ModDestination, ModMatrix, ModSource};
use crate::params::{ENV_STEP_DEST_FIRST, ENV_STEP_DEST_LAST, NUM_MOD_DESTINATIONS};
use crate::voice::ModSources;

pub(crate) struct ModMatrixCache {
    pub values: [f32; NUM_MOD_DESTINATIONS],
    pub ref_mod_env: f32,
    pub ref_velocity: f32,
    pub has_env_step_routes: bool,
    per_voice_dests: [(usize, f32, f32); 16],
    num_per_voice: usize,
}

impl ModMatrixCache {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn compute(&mut self, matrix: &ModMatrix, sources: &ModSources) {
        self.values.fill(0.0);
        self.num_per_voice = 0;
        self.has_env_step_routes = false;

        for route in &matrix.routes {
            if !route.enabled {
                continue;
            }
            let idx = route.destination as usize;
            self.values[idx] += route.amount * sources.source_value(route.source);
            if !self.has_env_step_routes && idx >= ENV_STEP_DEST_FIRST && idx <= ENV_STEP_DEST_LAST {
                self.has_env_step_routes = true;
            }

            if route.source == ModSource::ModEnv || route.source == ModSource::Velocity {
                let env_amt = if route.source == ModSource::ModEnv {
                    route.amount
                } else {
                    0.0
                };
                let vel_amt = if route.source == ModSource::Velocity {
                    route.amount
                } else {
                    0.0
                };
                let mut found = false;
                for i in 0..self.num_per_voice {
                    if self.per_voice_dests[i].0 == idx {
                        self.per_voice_dests[i].1 += env_amt;
                        self.per_voice_dests[i].2 += vel_amt;
                        found = true;
                        break;
                    }
                }
                if !found && self.num_per_voice < 16 {
                    self.per_voice_dests[self.num_per_voice] = (idx, env_amt, vel_amt);
                    self.num_per_voice += 1;
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

        let mut i = 0;
        while i < self.num_per_voice {
            let (d, env_amt, vel_amt) = self.per_voice_dests[i];
            if d == idx {
                if env_amt != 0.0 {
                    v += env_amt * (sources.mod_env - self.ref_mod_env);
                }
                if vel_amt != 0.0 {
                    v += vel_amt * (sources.velocity - self.ref_velocity);
                }
                break;
            }
            i += 1;
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
            per_voice_dests: [(0, 0.0, 0.0); 16],
            num_per_voice: 0,
        }
    }
}
