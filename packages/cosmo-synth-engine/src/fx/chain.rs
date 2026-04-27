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

    fn sync_from_params(&mut self, p: &SynthParams) {
        self.chorus.enabled = p.chorus.enabled;
        self.chorus.rate = p.chorus.rate;
        self.chorus.depth = p.chorus.depth;
        self.chorus.mix = p.chorus.mix;

        self.phaser.enabled = p.phaser.enabled;
        self.phaser.rate = p.phaser.rate;
        self.phaser.depth = p.phaser.depth;
        self.phaser.mix = p.phaser.mix;
        self.phaser.feedback = p.phaser.feedback;

        self.delay.enabled = p.delay.enabled;
        self.delay.time = p.delay.time;
        self.delay.feedback = p.delay.feedback;
        self.delay.mix = p.delay.mix;
        self.delay.tape_mode = p.delay.tape_mode;
        self.delay.warmth = p.delay.warmth;

        self.reverb.enabled = p.reverb.enabled;
        self.reverb.mix = p.reverb.mix;
        self.reverb.space = p.reverb.space;
        self.reverb.predelay = p.reverb.predelay;
        self.reverb.distance = p.reverb.distance;
        self.reverb.character = p.reverb.character;

        self.compressor.enabled = p.compressor.enabled;
        self.compressor.threshold_db = p.compressor.threshold_db;
        self.compressor.ratio = p.compressor.ratio;
        self.compressor.attack_ms = p.compressor.attack_ms;
        self.compressor.release_ms = p.compressor.release_ms;
        self.compressor.makeup_db = p.compressor.makeup_db;
        self.compressor.mix = p.compressor.mix;

        self.eq.enabled = p.eq.enabled;
        self.eq.gains[0] = p.eq.gain80;
        self.eq.gains[1] = p.eq.gain240;
        self.eq.gains[2] = p.eq.gain750;
        self.eq.gains[3] = p.eq.gain2200;
        self.eq.gains[4] = p.eq.gain8000;

        self.grain_delay.enabled = p.grain_delay.enabled;
        self.grain_delay.time = p.grain_delay.time;
        self.grain_delay.scatter = p.grain_delay.scatter;
        self.grain_delay.density = p.grain_delay.density;
        self.grain_delay.mix = p.grain_delay.mix;

        self.bitcrusher.enabled = p.bitcrusher.enabled;
        self.bitcrusher.bits = p.bitcrusher.bits;
        self.bitcrusher.rate_reduction = p.bitcrusher.rate_reduction;
        self.bitcrusher.mix = p.bitcrusher.mix;

        self.shimmer_verb.enabled = p.shimmer_verb.enabled;
        self.shimmer_verb.shimmer = p.shimmer_verb.shimmer;
        self.shimmer_verb.space = p.shimmer_verb.space;
        self.shimmer_verb.mix = p.shimmer_verb.mix;

        self.distortion.enabled = p.distortion.enabled;
        self.distortion.drive = p.distortion.drive;
        self.distortion.tone = p.distortion.tone;
        self.distortion.mix = p.distortion.mix;

        self.juno_chorus.enabled = p.juno_chorus.enabled;
        self.juno_chorus.mode = p.juno_chorus.mode;
        self.juno_chorus.mix = p.juno_chorus.mix;

        self.ring_mod.enabled = p.ring_mod.enabled;
        self.ring_mod.carrier_hz = p.ring_mod.carrier_hz;
        self.ring_mod.mix = p.ring_mod.mix;

        self.tremolo.enabled = p.tremolo.enabled;
        self.tremolo.rate = p.tremolo.rate;
        self.tremolo.depth = p.tremolo.depth;
        self.tremolo.waveform = p.tremolo.waveform;
        self.tremolo.mix = p.tremolo.mix;

        self.wavefolder.enabled = p.wavefolder.enabled;
        self.wavefolder.drive = p.wavefolder.drive;
        self.wavefolder.folds = p.wavefolder.folds;
        self.wavefolder.mix = p.wavefolder.mix;
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
        for slot in &mut self.slots {
            slot.sync_from_params(params);
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
