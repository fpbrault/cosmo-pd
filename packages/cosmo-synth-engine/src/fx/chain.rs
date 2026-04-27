use crate::params::FxSlotType;

use super::bitcrusher::BitcrusherFx;
use super::chorus::ChorusFx;
use super::compressor::CompressorFx;
use super::delay::DelayFx;
use super::delay_line::DelayLine;
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

pub struct FxChain {
    // Classic effects
    pub chorus: ChorusFx,
    pub phaser: PhaserFx,
    pub delay: DelayFx,
    pub reverb: FdnReverb,

    // New effects
    pub compressor: CompressorFx,
    pub eq: EqFx,
    pub grain_delay: GrainDelayFx,
    pub bitcrusher: BitcrusherFx,
    pub shimmer_verb: ShimmerVerbFx,
    pub distortion: DistortionFx,
    pub juno_chorus: JunoChorusFx,
    pub ring_mod: RingModFx,
    pub tremolo: TremoloFx,
    pub wavefolder: WavefolderFx,

    /// Which effect type is in each of the 6 FX slots.
    pub slot_types: [FxSlotType; 6],

    sample_rate: f32,
}

impl FxChain {
    pub fn new(sr: f32) -> Self {
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
            slot_types: [
                FxSlotType::Chorus,
                FxSlotType::Delay,
                FxSlotType::Reverb,
                FxSlotType::Vibrato,
                FxSlotType::PhaseMod,
                FxSlotType::Phaser,
            ],
            sample_rate: sr,
        }
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
        match self.slot_types[slot] {
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
            // Voice-level effects and empty slots pass through
            FxSlotType::Vibrato | FxSlotType::PhaseMod | FxSlotType::Empty => sample,
        }
    }
}
