use crate::params::FxSlotType;
use crate::params::SynthParams;

use super::bitcrusher::BitcrusherFx;
use super::chorus::ChorusFx;
use super::compressor::CompressorFx;
use super::delay::DelayFx;
use super::distortion::DistortionFx;
use super::eq::EqFx;
use super::grain_delay::GrainDelayFx;
use super::juno_chorus::JunoChorusFx;
use super::phaser::PhaserFx;
use super::reverb::FdnReverb;
use super::ring_mod::RingModFx;
use super::shimmer_verb::ShimmerVerbFx;
use super::tremolo::TremoloFx;
use super::wavefolder::WavefolderFx;

// ---------------------------------------------------------------------------
// FxChain — hosts all effects and dispatches per slot
// ---------------------------------------------------------------------------

struct FxSlotProcessors {
    chorus: ChorusFx,
    phaser: PhaserFx,
    delay: DelayFx,
    reverb: FdnReverb,
    compressor: CompressorFx,
    eq: EqFx,
    grain_delay: GrainDelayFx,
    bitcrusher: BitcrusherFx,
    shimmer_verb: ShimmerVerbFx,
    distortion: DistortionFx,
    juno_chorus: JunoChorusFx,
    ring_mod: RingModFx,
    tremolo: TremoloFx,
    wavefolder: WavefolderFx,
}

impl FxSlotProcessors {
    fn new(sr: f32) -> Self {
        Self {
            chorus: ChorusFx::new(sr),
            phaser: PhaserFx::new(sr),
            delay: DelayFx::new(sr),
            reverb: FdnReverb::new(sr),
            compressor: CompressorFx::new(sr),
            eq: EqFx::new(sr),
            grain_delay: GrainDelayFx::new(sr),
            bitcrusher: BitcrusherFx::new(),
            shimmer_verb: ShimmerVerbFx::new(sr),
            distortion: DistortionFx::new(sr),
            juno_chorus: JunoChorusFx::new(sr),
            ring_mod: RingModFx::new(sr),
            tremolo: TremoloFx::new(sr),
            wavefolder: WavefolderFx::new(),
        }
    }

    fn sync_from_params(&mut self, p: &SynthParams, slot_idx: usize) {
        let ch = &p.fx_slot_choruses[slot_idx];
        self.chorus.enabled = ch.enabled;
        self.chorus.rate = ch.rate;
        self.chorus.depth = ch.depth;
        self.chorus.mix = ch.mix;

        let ph = &p.fx_slot_phasers[slot_idx];
        self.phaser.enabled = ph.enabled;
        self.phaser.rate = ph.rate;
        self.phaser.depth = ph.depth;
        self.phaser.mix = ph.mix;
        self.phaser.feedback = ph.feedback;

        let d = &p.fx_slot_delays[slot_idx];
        self.delay.enabled = d.enabled;
        self.delay.time = d.time;
        self.delay.feedback = d.feedback;
        self.delay.mix = d.mix;
        self.delay.tape_mode = d.tape_mode;
        self.delay.warmth = d.warmth;

        let rv = &p.fx_slot_reverbs[slot_idx];
        self.reverb.enabled = rv.enabled;
        self.reverb.mix = rv.mix;
        self.reverb.space = rv.space;
        self.reverb.predelay = rv.predelay;
        self.reverb.distance = rv.distance;
        self.reverb.character = rv.character;

        let c = &p.fx_slot_compressors[slot_idx];
        self.compressor.enabled = c.enabled;
        self.compressor.threshold_db = c.threshold_db;
        self.compressor.ratio = c.ratio;
        self.compressor.attack_ms = c.attack_ms;
        self.compressor.release_ms = c.release_ms;
        self.compressor.makeup_db = c.makeup_db;
        self.compressor.mix = c.mix;

        let eq = &p.fx_slot_eqs[slot_idx];
        self.eq.enabled = eq.enabled;
        self.eq.gains[0] = eq.gain80;
        self.eq.gains[1] = eq.gain240;
        self.eq.gains[2] = eq.gain750;
        self.eq.gains[3] = eq.gain2200;
        self.eq.gains[4] = eq.gain8000;

        let gd = &p.fx_slot_grain_delays[slot_idx];
        self.grain_delay.enabled = gd.enabled;
        self.grain_delay.time = gd.time;
        self.grain_delay.scatter = gd.scatter;
        self.grain_delay.density = gd.density;
        self.grain_delay.mix = gd.mix;

        let bc = &p.fx_slot_bitcrushers[slot_idx];
        self.bitcrusher.enabled = bc.enabled;
        self.bitcrusher.bits = bc.bits;
        self.bitcrusher.rate_reduction = bc.rate_reduction;
        self.bitcrusher.mix = bc.mix;

        let sv = &p.fx_slot_shimmer_verbs[slot_idx];
        self.shimmer_verb.enabled = sv.enabled;
        self.shimmer_verb.shimmer = sv.shimmer;
        self.shimmer_verb.space = sv.space;
        self.shimmer_verb.mix = sv.mix;

        let dist = &p.fx_slot_distortions[slot_idx];
        self.distortion.enabled = dist.enabled;
        self.distortion.drive = dist.drive;
        self.distortion.tone = dist.tone;
        self.distortion.mix = dist.mix;

        let jc = &p.fx_slot_juno_choruses[slot_idx];
        self.juno_chorus.enabled = jc.enabled;
        self.juno_chorus.mode = jc.mode;
        self.juno_chorus.mix = jc.mix;

        let rm = &p.fx_slot_ring_mods[slot_idx];
        self.ring_mod.enabled = rm.enabled;
        self.ring_mod.carrier_hz = rm.carrier_hz;
        self.ring_mod.mix = rm.mix;

        let tr = &p.fx_slot_tremolos[slot_idx];
        self.tremolo.enabled = tr.enabled;
        self.tremolo.rate = tr.rate;
        self.tremolo.depth = tr.depth;
        self.tremolo.waveform = tr.waveform;
        self.tremolo.mix = tr.mix;

        let wf = &p.fx_slot_wavefolders[slot_idx];
        self.wavefolder.enabled = wf.enabled;
        self.wavefolder.drive = wf.drive;
        self.wavefolder.folds = wf.folds;
        self.wavefolder.mix = wf.mix;
    }

    fn process(&mut self, effect_type: FxSlotType, sample: f32) -> f32 {
        match effect_type {
            FxSlotType::Chorus => self.chorus.process(sample),
            FxSlotType::Phaser => self.phaser.process(sample),
            FxSlotType::Delay => self.delay.process(sample),
            FxSlotType::Reverb => {
                if !self.reverb.enabled {
                    sample
                } else {
                    self.reverb.process(sample)
                }
            }
            FxSlotType::Compressor => self.compressor.process(sample),
            FxSlotType::Eq5Band => self.eq.process(sample),
            FxSlotType::GrainDelay => self.grain_delay.process(sample),
            FxSlotType::Bitcrusher => self.bitcrusher.process(sample),
            FxSlotType::ShimmerVerb => self.shimmer_verb.process(sample),
            FxSlotType::Distortion => self.distortion.process(sample),
            FxSlotType::JunoChorus => self.juno_chorus.process(sample),
            FxSlotType::RingMod => self.ring_mod.process(sample),
            FxSlotType::Tremolo => self.tremolo.process(sample),
            FxSlotType::Wavefolder => self.wavefolder.process(sample),
            // Voice-level effects and empty slots pass through.
            FxSlotType::Vibrato | FxSlotType::PhaseMod | FxSlotType::Empty => sample,
        }
    }
}

pub struct FxChain {
    slots: [FxSlotProcessors; 6],

    /// Which effect type is in each of the 6 FX slots.
    pub slot_types: [FxSlotType; 6],
}

impl FxChain {
    pub fn new(sr: f32) -> Self {
        Self {
            slots: core::array::from_fn(|_| FxSlotProcessors::new(sr)),
            slot_types: [
                FxSlotType::Chorus,
                FxSlotType::Delay,
                FxSlotType::Reverb,
                FxSlotType::Vibrato,
                FxSlotType::PhaseMod,
                FxSlotType::Phaser,
            ],
        }
    }

    pub fn sync_from_params(&mut self, params: &SynthParams) {
        for (i, slot) in self.slots.iter_mut().enumerate() {
            slot.sync_from_params(params, i);
        }
        self.slot_types = params.fx_slots;
    }

    /// Process one sample through all 6 FX slots in series.
    pub fn process(&mut self, sample: f32) -> f32 {
        let mut out = sample;
        for slot in 0..6 {
            out = self.process_slot(slot, out);
        }
        out
    }

    fn process_slot(&mut self, slot: usize, sample: f32) -> f32 {
        self.slots[slot].process(self.slot_types[slot], sample)
    }
}
