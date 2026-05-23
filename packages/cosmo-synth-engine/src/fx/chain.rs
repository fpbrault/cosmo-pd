use crate::params::FxSlotConfig;
use crate::params::FxSlotType;
use crate::params::ModDestination;
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
    lofi: LoFiFx,
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
            lofi: LoFiFx::new(sr),
        }
    }

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
            FxSlotType::LoFi => self.lofi.process(sample),
            // Voice-level effects and empty slots pass through.
            FxSlotType::Vibrato | FxSlotType::PhaseMod | FxSlotType::Empty => sample,
        }
    }
}

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

    pub(crate) fn apply_modulated_params(
        &mut self,
        params: &SynthParams,
        mod_cache: &ModMatrixCache,
    ) {
        let v = &mod_cache.values;
        for active_idx in 0..self.active_slot_count {
            let slot_idx = self.active_slots[active_idx];
            let config = &params.fx_slots[slot_idx];
            let slot = &mut self.slots[slot_idx];
            match config {
                FxSlotConfig::Chorus(ch) => {
                    slot.chorus.rate =
                        (ch.rate + v[ModDestination::ChorusRate as usize] * 20.0).clamp(0.01, 20.0);
                    slot.chorus.depth =
                        (ch.depth + v[ModDestination::ChorusDepth as usize]).clamp(0.0, 1.0);
                    slot.chorus.mix =
                        (ch.mix + v[ModDestination::ChorusMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Phaser(ph) => {
                    slot.phaser.rate =
                        (ph.rate + v[ModDestination::PhaserRate as usize] * 20.0).clamp(0.01, 20.0);
                    slot.phaser.depth =
                        (ph.depth + v[ModDestination::PhaserDepth as usize]).clamp(0.0, 1.0);
                    slot.phaser.feedback =
                        (ph.feedback + v[ModDestination::PhaserFeedback as usize]).clamp(0.0, 0.99);
                    slot.phaser.mix =
                        (ph.mix + v[ModDestination::PhaserMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Delay(d) => {
                    slot.delay.time =
                        (d.time + v[ModDestination::DelayTime as usize]).clamp(0.01, 2.0);
                    slot.delay.feedback =
                        (d.feedback + v[ModDestination::DelayFeedback as usize]).clamp(0.0, 0.99);
                    slot.delay.warmth =
                        (d.warmth + v[ModDestination::DelayWarmth as usize]).clamp(0.0, 1.0);
                    slot.delay.mix = (d.mix + v[ModDestination::DelayMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Reverb(rv) => {
                    slot.reverb.mix =
                        (rv.mix + v[ModDestination::ReverbMix as usize]).clamp(0.0, 1.0);
                    slot.reverb.space =
                        (rv.space + v[ModDestination::ReverbSpace as usize]).clamp(0.0, 1.0);
                    slot.reverb.predelay =
                        (rv.predelay + v[ModDestination::ReverbPredelay as usize]).clamp(0.0, 0.2);
                    slot.reverb.distance =
                        (rv.distance + v[ModDestination::ReverbDistance as usize]).clamp(0.0, 1.0);
                    slot.reverb.character = (rv.character
                        + v[ModDestination::ReverbCharacter as usize])
                        .clamp(0.0, 1.0);
                }
                FxSlotConfig::Compressor(c) => {
                    slot.compressor.threshold_db = (c.threshold_db
                        + v[ModDestination::CompressorThreshold as usize] * 36.0)
                        .clamp(-60.0, 0.0);
                    slot.compressor.ratio = (c.ratio
                        + v[ModDestination::CompressorRatio as usize] * 20.0)
                        .clamp(1.0, 20.0);
                    slot.compressor.makeup_db = (c.makeup_db
                        + v[ModDestination::CompressorMakeup as usize] * 24.0)
                        .clamp(0.0, 24.0);
                    slot.compressor.mix =
                        (c.mix + v[ModDestination::CompressorMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Eq5Band(eq) => {
                    slot.eq.set_gain(
                        0,
                        (eq.gain80 + v[ModDestination::EqGain80 as usize] * 24.0)
                            .clamp(-24.0, 24.0),
                    );
                    slot.eq.set_gain(
                        1,
                        (eq.gain240 + v[ModDestination::EqGain240 as usize] * 24.0)
                            .clamp(-24.0, 24.0),
                    );
                    slot.eq.set_gain(
                        2,
                        (eq.gain750 + v[ModDestination::EqGain750 as usize] * 24.0)
                            .clamp(-24.0, 24.0),
                    );
                    slot.eq.set_gain(
                        3,
                        (eq.gain2200 + v[ModDestination::EqGain2200 as usize] * 24.0)
                            .clamp(-24.0, 24.0),
                    );
                    slot.eq.set_gain(
                        4,
                        (eq.gain8000 + v[ModDestination::EqGain8000 as usize] * 24.0)
                            .clamp(-24.0, 24.0),
                    );
                }
                FxSlotConfig::GrainDelay(gd) => {
                    slot.grain_delay.time =
                        (gd.time + v[ModDestination::GrainDelayTime as usize]).clamp(0.01, 2.0);
                    slot.grain_delay.feedback = (gd.feedback
                        + v[ModDestination::GrainDelayFeedback as usize])
                        .clamp(0.0, 0.99);
                    slot.grain_delay.scatter = (gd.scatter
                        + v[ModDestination::GrainDelayScatter as usize])
                        .clamp(0.0, 1.0);
                    slot.grain_delay.density = (gd.density
                        + v[ModDestination::GrainDelayDensity as usize])
                        .clamp(0.0, 1.0);
                    slot.grain_delay.mix =
                        (gd.mix + v[ModDestination::GrainDelayMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Bitcrusher(bc) => {
                    slot.bitcrusher.bits = (bc.bits
                        + v[ModDestination::BitcrusherBits as usize] * 12.0)
                        .clamp(1.0, 16.0);
                    slot.bitcrusher.rate_reduction = (bc.rate_reduction
                        + v[ModDestination::BitcrusherRateReduction as usize])
                        .clamp(0.0, 0.99);
                    slot.bitcrusher.mix =
                        (bc.mix + v[ModDestination::BitcrusherMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::ShimmerVerb(sv) => {
                    slot.shimmer_verb.shimmer = (sv.shimmer
                        + v[ModDestination::ShimmerVerbShimmer as usize])
                        .clamp(0.0, 1.0);
                    slot.shimmer_verb.space =
                        (sv.space + v[ModDestination::ShimmerVerbSpace as usize]).clamp(0.0, 1.0);
                    slot.shimmer_verb.mix =
                        (sv.mix + v[ModDestination::ShimmerVerbMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Distortion(dist) => {
                    slot.distortion.drive =
                        (dist.drive + v[ModDestination::DistortionDrive as usize]).clamp(0.0, 1.0);
                    slot.distortion.tone =
                        (dist.tone + v[ModDestination::DistortionTone as usize]).clamp(0.0, 1.0);
                    slot.distortion.mix =
                        (dist.mix + v[ModDestination::DistortionMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::JunoChorus(jc) => {
                    slot.juno_chorus.mix =
                        (jc.mix + v[ModDestination::JunoChorusMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::RingMod(rm) => {
                    slot.ring_mod.carrier_hz = (rm.carrier_hz
                        + v[ModDestination::RingModCarrierHz as usize] * 5000.0)
                        .clamp(20.0, 8_000.0);
                    slot.ring_mod.mix =
                        (rm.mix + v[ModDestination::RingModMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Tremolo(tr) => {
                    slot.tremolo.rate =
                        (tr.rate + v[ModDestination::TremoloRate as usize] * 20.0).clamp(0.1, 40.0);
                    slot.tremolo.depth =
                        (tr.depth + v[ModDestination::TremoloDepth as usize]).clamp(0.0, 1.0);
                    slot.tremolo.mix =
                        (tr.mix + v[ModDestination::TremoloMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Wavefolder(wf) => {
                    slot.wavefolder.drive =
                        (wf.drive + v[ModDestination::WavefolderDrive as usize]).clamp(0.0, 2.0);
                    slot.wavefolder.folds = (wf.folds
                        + v[ModDestination::WavefolderFolds as usize] * 8.0)
                        .clamp(1.0, 10.0);
                    slot.wavefolder.mix =
                        (wf.mix + v[ModDestination::WavefolderMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::LoFi(lofi) => {
                    slot.lofi.degrade =
                        (lofi.degrade + v[ModDestination::LoFiDegrade as usize]).clamp(0.0, 1.0);
                    slot.lofi.wow_depth =
                        (lofi.wow_depth + v[ModDestination::LoFiWowDepth as usize]).clamp(0.0, 1.0);
                    slot.lofi.wow_rate = (lofi.wow_rate
                        + v[ModDestination::LoFiWowRate as usize] * 20.0)
                        .clamp(0.0, 20.0);
                    slot.lofi.flutter_depth = (lofi.flutter_depth
                        + v[ModDestination::LoFiFlutterDepth as usize])
                        .clamp(0.0, 1.0);
                    slot.lofi.flutter_rate = (lofi.flutter_rate
                        + v[ModDestination::LoFiFlutterRate as usize] * 40.0)
                        .clamp(0.0, 40.0);
                    slot.lofi.tone =
                        (lofi.tone + v[ModDestination::LoFiTone as usize]).clamp(0.0, 1.0);
                    slot.lofi.mix =
                        (lofi.mix + v[ModDestination::LoFiMix as usize]).clamp(0.0, 1.0);
                }
                FxSlotConfig::Empty | FxSlotConfig::Vibrato(_) | FxSlotConfig::PhaseMod(_) => {}
            }
        }
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
