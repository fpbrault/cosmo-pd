use crate::params::FxSlotConfig;
use crate::params::FxSlotType;
use crate::params::ModMatrixCache;
use crate::params::SynthParams;

use super::bitcrusher::BitcrusherFx;
use super::chorus::ChorusFx;
use super::compressor::CompressorFx;
use super::delay::DelayFx;
use super::distortion::DistortionFx;
use super::eq::EqFx;
use super::grain_delay::GrainDelayFx;
use super::juno_chorus::JunoChorusFx;
use super::lofi::LoFiFx;
use super::phaser::PhaserFx;
use super::reverb::FdnReverb;
use super::ring_mod::RingModFx;
use super::shimmer_verb::ShimmerVerbFx;
use super::tremolo::TremoloFx;
use super::wavefolder::WavefolderFx;

// ---------------------------------------------------------------------------
// Dispatch macros — reduce boilerplate for the 5 match-site patterns.
// Adding a new effect: add one entry to each macro invocation below.
// ---------------------------------------------------------------------------

/// Generates the FxSlotProcessors struct fields and constructor.
/// `sr` is generated internally by the macro to avoid hygiene issues.
macro_rules! fx_processors_struct_and_new {
    (
        with_sr: [$($field:ident: $fx_type:ty),* $(,)?]
        no_args: [$($nofield:ident: $no_type:ty),* $(,)?]
    ) => {
        struct FxSlotProcessors {
            $( $field: $fx_type, )*
            $( $nofield: $no_type, )*
        }

        impl FxSlotProcessors {
            fn new(sr: f32) -> Self {
                Self {
                    $( $field: <$fx_type>::new(sr), )*
                    $( $nofield: <$no_type>::new(), )*
                }
            }
        }
    };
}

/// Generates the process() dispatch match on FxSlotType.
macro_rules! fx_process_dispatch {
    (
        standard: [$(($variant:ident, $field:ident)),* $(,)?]
        guarded: [$(($gvariant:ident, $gfield:ident)),* $(,)?]
        passthrough: [$($pvariant:ident),* $(,)?]
    ) => {
        fn process(&mut self, effect_type: FxSlotType, sample: f32) -> f32 {
            match effect_type {
                $( FxSlotType::$variant => self.$field.process(sample), )*
                $(
                    FxSlotType::$gvariant => {
                        if !self.$gfield.enabled {
                            sample
                        } else {
                            self.$gfield.process(sample)
                        }
                    }
                )*
                $( FxSlotType::$pvariant => sample, )*
            }
        }
    };
}

/// Generates the apply_modulated_params() dispatch match on FxChain.
macro_rules! fx_modulate_dispatch {
    ($(($variant:ident, $field:ident)),* $(,)?) => {
        pub(crate) fn apply_modulated_params(
            &mut self,
            params: &SynthParams,
            mod_cache: &ModMatrixCache,
        ) {
            for active_idx in 0..self.active_slot_count {
                let slot_idx = self.active_slots[active_idx];
                let config = &params.fx_slots[slot_idx];
                let slot = &mut self.slots[slot_idx];
                match config {
                    $(
                        FxSlotConfig::$variant(v) => {
                            slot.$field.apply_modulation(v, &mod_cache.values);
                        }
                    )*
                    FxSlotConfig::Empty
                    | FxSlotConfig::Vibrato(_)
                    | FxSlotConfig::PhaseMod(_) => {}
                }
            }
        }
    };
}

// ---------------------------------------------------------------------------
// FxSlotProcessors — one processor per effect type
// ---------------------------------------------------------------------------

fx_processors_struct_and_new! {
    with_sr: [
        chorus: ChorusFx,
        phaser: PhaserFx,
        delay: DelayFx,
        reverb: FdnReverb,
        compressor: CompressorFx,
        eq: EqFx,
        grain_delay: GrainDelayFx,
        shimmer_verb: ShimmerVerbFx,
        distortion: DistortionFx,
        juno_chorus: JunoChorusFx,
        ring_mod: RingModFx,
        tremolo: TremoloFx,
        lofi: LoFiFx,
    ]
    no_args: [
        bitcrusher: BitcrusherFx,
        wavefolder: WavefolderFx,
    ]
}

impl FxSlotProcessors {
    fn sync_from_config(&mut self, config: &FxSlotConfig) {
        match config {
            FxSlotConfig::Chorus(ch) => {
                self.chorus.enabled = ch.enabled;
                self.chorus.rate = ch.rate;
                self.chorus.depth = ch.depth;
                self.chorus.mix = ch.mix;
            }
            FxSlotConfig::Phaser(ph) => {
                self.phaser.enabled = ph.enabled;
                self.phaser.rate = ph.rate;
                self.phaser.depth = ph.depth;
                self.phaser.mix = ph.mix;
                self.phaser.feedback = ph.feedback;
            }
            FxSlotConfig::Delay(d) => {
                self.delay.enabled = d.enabled;
                self.delay.time = d.time;
                self.delay.feedback = d.feedback;
                self.delay.mix = d.mix;
                self.delay.tape_mode = d.tape_mode;
                self.delay.warmth = d.warmth;
            }
            FxSlotConfig::Reverb(rv) => {
                self.reverb.enabled = rv.enabled;
                self.reverb.mix = rv.mix;
                self.reverb.space = rv.space;
                self.reverb.predelay = rv.predelay;
                self.reverb.distance = rv.distance;
                self.reverb.character = rv.character;
            }
            FxSlotConfig::Compressor(c) => {
                self.compressor.enabled = c.enabled;
                self.compressor.threshold_db = c.threshold_db;
                self.compressor.ratio = c.ratio;
                self.compressor.attack_ms = c.attack_ms;
                self.compressor.release_ms = c.release_ms;
                self.compressor.makeup_db = c.makeup_db;
                self.compressor.mix = c.mix;
            }
            FxSlotConfig::Eq5Band(eq) => {
                self.eq.enabled = eq.enabled;
                self.eq.set_gain(0, eq.gain80);
                self.eq.set_gain(1, eq.gain240);
                self.eq.set_gain(2, eq.gain750);
                self.eq.set_gain(3, eq.gain2200);
                self.eq.set_gain(4, eq.gain8000);
            }
            FxSlotConfig::GrainDelay(gd) => {
                self.grain_delay.enabled = gd.enabled;
                self.grain_delay.time = gd.time;
                self.grain_delay.feedback = gd.feedback;
                self.grain_delay.scatter = gd.scatter;
                self.grain_delay.density = gd.density;
                self.grain_delay.mix = gd.mix;
            }
            FxSlotConfig::Bitcrusher(bc) => {
                self.bitcrusher.enabled = bc.enabled;
                self.bitcrusher.bits = bc.bits;
                self.bitcrusher.rate_reduction = bc.rate_reduction;
                self.bitcrusher.mix = bc.mix;
            }
            FxSlotConfig::ShimmerVerb(sv) => {
                self.shimmer_verb.enabled = sv.enabled;
                self.shimmer_verb.shimmer = sv.shimmer;
                self.shimmer_verb.space = sv.space;
                self.shimmer_verb.mix = sv.mix;
            }
            FxSlotConfig::Distortion(dist) => {
                self.distortion.enabled = dist.enabled;
                self.distortion.mode = dist.mode;
                self.distortion.drive = dist.drive;
                self.distortion.tone = dist.tone;
                self.distortion.mix = dist.mix;
            }
            FxSlotConfig::JunoChorus(jc) => {
                self.juno_chorus.enabled = jc.enabled;
                self.juno_chorus.mode = jc.mode;
                self.juno_chorus.mix = jc.mix;
            }
            FxSlotConfig::RingMod(rm) => {
                self.ring_mod.enabled = rm.enabled;
                self.ring_mod.carrier_hz = rm.carrier_hz;
                self.ring_mod.mix = rm.mix;
            }
            FxSlotConfig::Tremolo(tr) => {
                self.tremolo.enabled = tr.enabled;
                self.tremolo.rate = tr.rate;
                self.tremolo.depth = tr.depth;
                self.tremolo.waveform = tr.waveform;
                self.tremolo.mix = tr.mix;
            }
            FxSlotConfig::Wavefolder(wf) => {
                self.wavefolder.enabled = wf.enabled;
                self.wavefolder.drive = wf.drive;
                self.wavefolder.folds = wf.folds;
                self.wavefolder.mix = wf.mix;
            }
            FxSlotConfig::LoFi(lofi) => {
                self.lofi.enabled = lofi.enabled;
                self.lofi.degrade = lofi.degrade;
                self.lofi.wow_depth = lofi.wow_depth;
                self.lofi.wow_rate = lofi.wow_rate;
                self.lofi.flutter_depth = lofi.flutter_depth;
                self.lofi.flutter_rate = lofi.flutter_rate;
                self.lofi.tone = lofi.tone;
                self.lofi.mix = lofi.mix;
            }
            // Empty, Vibrato, PhaseMod are handled at voice level or pass through.
            FxSlotConfig::Empty | FxSlotConfig::Vibrato(_) | FxSlotConfig::PhaseMod(_) => {}
        }
    }

    fx_process_dispatch! {
        standard: [
            (Chorus, chorus),
            (Phaser, phaser),
            (Delay, delay),
            (Compressor, compressor),
            (Eq5Band, eq),
            (GrainDelay, grain_delay),
            (Bitcrusher, bitcrusher),
            (ShimmerVerb, shimmer_verb),
            (Distortion, distortion),
            (JunoChorus, juno_chorus),
            (RingMod, ring_mod),
            (Tremolo, tremolo),
            (Wavefolder, wavefolder),
            (LoFi, lofi),
        ]
        guarded: [
            (Reverb, reverb),
        ]
        passthrough: [Vibrato, PhaseMod, Empty]
    }
}

// ---------------------------------------------------------------------------
// FxChain — hosts all effects and dispatches per slot
// ---------------------------------------------------------------------------

pub struct FxChain {
    slots: [FxSlotProcessors; 6],

    /// Which effect type is in each of the 6 FX slots.
    pub slot_types: [FxSlotType; 6],
    active_slots: [usize; 6],
    pub(crate) active_slot_count: usize,
}

impl FxChain {
    pub fn new(sr: f32) -> Self {
        Self {
            slots: core::array::from_fn(|_| FxSlotProcessors::new(sr)),
            slot_types: [FxSlotType::Empty; 6],
            active_slots: [0, 1, 2, 3, 4, 5],
            active_slot_count: 0,
        }
    }

    pub fn sync_from_params(&mut self, params: &SynthParams) {
        self.active_slot_count = 0;
        for (i, config) in params.fx_slots.iter().enumerate() {
            self.slots[i].sync_from_config(config);
            let slot_type = config.slot_type();
            self.slot_types[i] = slot_type;
            // Voice-level or empty effects are handled elsewhere and can be skipped here.
            if !matches!(
                slot_type,
                FxSlotType::Empty | FxSlotType::Vibrato | FxSlotType::PhaseMod
            ) {
                self.active_slots[self.active_slot_count] = i;
                self.active_slot_count += 1;
            }
        }
    }

    fx_modulate_dispatch! {
        (Chorus, chorus),
        (Phaser, phaser),
        (Delay, delay),
        (Reverb, reverb),
        (Compressor, compressor),
        (Eq5Band, eq),
        (GrainDelay, grain_delay),
        (Bitcrusher, bitcrusher),
        (ShimmerVerb, shimmer_verb),
        (Distortion, distortion),
        (JunoChorus, juno_chorus),
        (RingMod, ring_mod),
        (Tremolo, tremolo),
        (Wavefolder, wavefolder),
        (LoFi, lofi),
    }

    /// Process one sample through all 6 FX slots in series.
    pub fn process(&mut self, sample: f32) -> f32 {
        let mut out = sample;
        for active_idx in 0..self.active_slot_count {
            let slot = self.active_slots[active_idx];
            out = self.process_slot(slot, out);
        }
        out
    }

    fn process_slot(&mut self, slot: usize, sample: f32) -> f32 {
        self.slots[slot].process(self.slot_types[slot], sample)
    }
}
