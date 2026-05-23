use std::sync::LazyLock;

use crate::generators::catalog::{
    ALGO_DEFINITIONS_V1, AlgoControlKindV1,
};
use crate::params::{Algo, AlgoControlSlots};
use crate::generators::{bend, cheby, clip, cz101, fof, fold, mirror, pinch, ripple, skew, stutter, sync, terrain, twist};

static ALGO_DEFAULT_VALUES: LazyLock<[[f32; 8]; 256]> = LazyLock::new(|| {
    let mut table = [[0.0; 8]; 256];
    for def in &ALGO_DEFINITIONS_V1 {
        let mut slot = 0usize;
        for ctrl in def.controls {
            if ctrl.kind == AlgoControlKindV1::Number {
                table[def.id as usize][slot] = ctrl.default.unwrap_or(0.0);
                slot += 1;
                if slot >= 8 {
                    break;
                }
            }
        }
    }
    table
});

/// Build a `[f32; 8]` from `ALGO_DEFINITIONS_V1` defaults, then apply any
/// preset-level overrides from `algo_controls`. String lookups happen here
/// (at config-build time) instead of inside `warp_phase` (per-sample).
#[inline(always)]
pub fn pre_resolve_controls(algo: Algo, controls: &AlgoControlSlots) -> [f32; 8] {
    let mut values = ALGO_DEFAULT_VALUES[algo as usize];
    for entry in controls.iter().flatten() {
        if let Some(slot) = algo_control_slot_index(algo, entry.id.as_str()) {
            values[slot] = entry.value;
        }
    }
    values
}

#[inline]
pub(crate) fn algo_control_slot_index(algo: Algo, id: &str) -> Option<usize> {
    Some(match (algo, id) {
        (Algo::Bend, "bendCurve") => 0,
        (Algo::Bend, "bendBias") => 1,
        (Algo::Bend, "bendKnee") => 2,
        (Algo::Sync, "syncRatio") => 0,
        (Algo::Sync, "syncPhase") => 1,
        (Algo::Sync, "syncCurve") => 2,
        (Algo::Sync, "syncWindow") => 3,
        (Algo::Pinch, "pinchFocus") => 0,
        (Algo::Pinch, "pinchAsym") => 1,
        (Algo::Pinch, "pinchCurve") => 2,
        (Algo::Pinch, "pinchDrive") => 3,
        (Algo::Fold, "foldStages") => 0,
        (Algo::Fold, "foldTilt") => 1,
        (Algo::Fold, "foldSymmetry") => 2,
        (Algo::Fold, "foldSoftness") => 3,
        (Algo::Skew, "skewBias") => 0,
        (Algo::Skew, "skewCurve") => 1,
        (Algo::Skew, "skewSpread") => 2,
        (Algo::Skew, "skewTilt") => 3,
        (Algo::Twist, "twistHarmonics") => 0,
        (Algo::Twist, "twistDepth") => 1,
        (Algo::Twist, "twistPhase") => 2,
        (Algo::Twist, "twistShape") => 3,
        (Algo::Clip, "clipDrive") => 0,
        (Algo::Clip, "clipShape") => 1,
        (Algo::Clip, "clipBias") => 2,
        (Algo::Clip, "clipSoft") => 3,
        (Algo::Ripple, "rippleFreq") => 0,
        (Algo::Ripple, "rippleDepth") => 1,
        (Algo::Ripple, "ripplePhase") => 2,
        (Algo::Ripple, "rippleShape") => 3,
        (Algo::Mirror, "mirrorCenter") => 0,
        (Algo::Mirror, "mirrorBlend") => 1,
        (Algo::Mirror, "mirrorClip") => 2,
        (Algo::Mirror, "mirrorSkew") => 3,
        (Algo::Fof, "fofRatio") => 0,
        (Algo::Fof, "fofTightness") => 1,
        (Algo::Fof, "fofOffset") => 2,
        (Algo::Fof, "fofSkew") => 3,
        (Algo::Karpunk, "karpunkDamp") => 0,
        (Algo::Karpunk, "karpunkBright") => 1,
        (Algo::Karpunk, "karpunkDecay") => 2,
        (Algo::Karpunk, "karpunkExcite") => 3,
        (Algo::Terrain, "terrainRatio") => 0,
        (Algo::Terrain, "terrainDepth") => 1,
        (Algo::Terrain, "terrainFmPhase") => 2,
        (Algo::Terrain, "terrainShape") => 3,
        (Algo::Stutter, "stutterSegs") => 0,
        (Algo::Stutter, "stutterReverse") => 1,
        (Algo::Stutter, "stutterSlip") => 2,
        (Algo::Stutter, "stutterSpacing") => 3,
        (Algo::Cheby, "chebyOrder") => 0,
        (Algo::Cheby, "chebyTilt") => 1,
        (Algo::Cheby, "chebyWarp") => 2,
        _ => return None,
    })
}

pub fn warp_phase(
    algo: Algo,
    phase: f32,
    amt: f32,
    control_values: &[f32; 8],
    algo_param_mods: &[f32; 8],
) -> f32 {
    if amt == 0.0 && !algo.is_cz_waveform() {
        return phase;
    }

    let c = |i: usize| control_values[i] + algo_param_mods[i];

    match algo {
        Algo::Saw => cz101::warp_phase_for_waveform(crate::params::CzWaveform::Saw, phase, amt),
        Algo::Square => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::Square, phase, amt)
        }
        Algo::Pulse => cz101::warp_phase_for_waveform(crate::params::CzWaveform::Pulse, phase, amt),
        Algo::Null => cz101::warp_phase_for_waveform(crate::params::CzWaveform::Null, phase, amt),
        Algo::SinePulse => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::SinePulse, phase, amt)
        }
        Algo::SawPulse => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::SawPulse, phase, amt)
        }
        Algo::MultiSine => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::MultiSine, phase, amt)
        }
        Algo::Pulse2 => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::Pulse2, phase, amt)
        }
        Algo::Cz101 => cz101::warp_phase(phase, amt),
        Algo::Bend => bend::warp_phase(phase, amt, c(0), c(1), c(2)),
        Algo::Sync => sync::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Pinch => pinch::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Fold => fold::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Skew => skew::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Twist => twist::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Clip => clip::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Ripple => ripple::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Mirror => mirror::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Fof => fof::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Karpunk => phase,
        Algo::Terrain => terrain::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Stutter => stutter::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Cheby => cheby::warp_phase(phase, amt, c(0), c(1), c(2)),
    }
}
