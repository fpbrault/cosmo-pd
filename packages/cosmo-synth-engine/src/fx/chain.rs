use crate::params::FxSlotConfig;
use crate::params::FxSlotType;
use crate::params::ModDestination;
use crate::params::ModMatrix;
use crate::params::SynthParams;
use crate::voice::{mod_value_for, ModSources};

use super::auto_wah::AutoWahFx;
use super::bitcrusher::BitcrusherFx;
use super::chorus::ChorusFx;
use super::compressor::CompressorFx;
use super::delay::DelayFx;
use super::distortion::DistortionFx;
use super::eq::EqFx;
use super::flanger::FlangerFx;
use super::grain_delay::GrainDelayFx;
use super::juno_chorus::JunoChorusFx;
use super::lofi::LoFiFx;
use super::multimode_filter::MultimodeFilterFx;
use super::phaser::PhaserFx;
use super::reverb::FdnReverb;
use super::ring_mod::RingModFx;
use super::rotary_speaker::RotarySpeakerFx;
use super::shimmer_verb::ShimmerVerbFx;
use super::stereo_widener::StereoWidenerFx;
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
    multimode_filter: MultimodeFilterFx,
    flanger: FlangerFx,
    rotary_speaker: RotarySpeakerFx,
    auto_wah: AutoWahFx,
    stereo_widener: StereoWidenerFx,
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
            multimode_filter: MultimodeFilterFx::new(sr),
            flanger: FlangerFx::new(sr),
            rotary_speaker: RotarySpeakerFx::new(sr),
            auto_wah: AutoWahFx::new(sr),
            stereo_widener: StereoWidenerFx::new(sr),
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
            FxSlotConfig::MultimodeFilter(filter) => {
                self.multimode_filter.enabled = filter.enabled;
                self.multimode_filter.mode = filter.mode;
                self.multimode_filter.four_pole = filter.four_pole;
                self.multimode_filter.cutoff_hz = filter.cutoff_hz;
                self.multimode_filter.resonance = filter.resonance;
                self.multimode_filter.drive = filter.drive;
                self.multimode_filter.mix = filter.mix;
            }
            FxSlotConfig::Flanger(flanger) => {
                self.flanger.enabled = flanger.enabled;
                self.flanger.rate = flanger.rate;
                self.flanger.depth = flanger.depth;
                self.flanger.delay_ms = flanger.delay_ms;
                self.flanger.feedback = flanger.feedback;
                self.flanger.through_zero = flanger.through_zero;
                self.flanger.mix = flanger.mix;
            }
            FxSlotConfig::RotarySpeaker(rotary) => {
                self.rotary_speaker.enabled = rotary.enabled;
                self.rotary_speaker.speed = rotary.speed;
                self.rotary_speaker.depth = rotary.depth;
                self.rotary_speaker.drive = rotary.drive;
                self.rotary_speaker.mix = rotary.mix;
            }
            FxSlotConfig::AutoWah(wah) => {
                self.auto_wah.enabled = wah.enabled;
                self.auto_wah.mode = wah.mode;
                self.auto_wah.sensitivity = wah.sensitivity;
                self.auto_wah.cutoff_hz = wah.cutoff_hz;
                self.auto_wah.resonance = wah.resonance;
                self.auto_wah.attack_ms = wah.attack_ms;
                self.auto_wah.release_ms = wah.release_ms;
                self.auto_wah.mix = wah.mix;
            }
            FxSlotConfig::StereoWidener(widener) => {
                self.stereo_widener.enabled = widener.enabled;
                self.stereo_widener.width = widener.width;
                self.stereo_widener.delay_ms = widener.delay_ms;
                self.stereo_widener.tone = widener.tone;
                self.stereo_widener.mix = widener.mix;
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
            FxSlotType::MultimodeFilter => self.multimode_filter.process(sample),
            FxSlotType::Flanger => self.flanger.process(sample),
            FxSlotType::RotarySpeaker => self.rotary_speaker.process(sample),
            FxSlotType::AutoWah => self.auto_wah.process(sample),
            FxSlotType::StereoWidener => self.stereo_widener.process(sample),
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
    active_slot_count: usize,
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

    pub(crate) fn apply_modulation(&mut self, params: &SynthParams, sources: &ModSources) {
        let matrix = &params.mod_matrix;
        if matrix.routes.is_empty() {
            return;
        }

        for (i, config) in params.fx_slots.iter().enumerate() {
            self.apply_slot_modulation(i, config, matrix, sources);
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

    fn apply_slot_modulation(
        &mut self,
        slot_index: usize,
        config: &FxSlotConfig,
        matrix: &ModMatrix,
        sources: &ModSources,
    ) {
        let slot = &mut self.slots[slot_index];
        match config {
            FxSlotConfig::MultimodeFilter(filter) => {
                slot.multimode_filter.cutoff_hz = (filter.cutoff_hz
                    + mod_value_for(ModDestination::MultimodeFilterCutoffHz, matrix, sources)
                        * 6000.0)
                    .clamp(20.0, 18_000.0);
                slot.multimode_filter.resonance = (filter.resonance
                    + mod_value_for(ModDestination::MultimodeFilterResonance, matrix, sources)
                        * 0.8)
                    .clamp(0.0, 1.0);
                slot.multimode_filter.drive = (filter.drive
                    + mod_value_for(ModDestination::MultimodeFilterDrive, matrix, sources))
                .clamp(0.0, 1.0);
                slot.multimode_filter.mix = (filter.mix
                    + mod_value_for(ModDestination::MultimodeFilterMix, matrix, sources))
                .clamp(0.0, 1.0);
            }
            FxSlotConfig::Flanger(flanger) => {
                slot.flanger.rate = (flanger.rate
                    + mod_value_for(ModDestination::FlangerRate, matrix, sources) * 5.0)
                    .clamp(0.01, 10.0);
                slot.flanger.depth = (flanger.depth
                    + mod_value_for(ModDestination::FlangerDepth, matrix, sources))
                .clamp(0.0, 1.0);
                slot.flanger.delay_ms = (flanger.delay_ms
                    + mod_value_for(ModDestination::FlangerDelayMs, matrix, sources) * 5.0)
                    .clamp(0.1, 10.0);
                slot.flanger.feedback = (flanger.feedback
                    + mod_value_for(ModDestination::FlangerFeedback, matrix, sources) * 0.95)
                    .clamp(-0.95, 0.95);
                slot.flanger.mix = (flanger.mix
                    + mod_value_for(ModDestination::FlangerMix, matrix, sources))
                .clamp(0.0, 1.0);
            }
            FxSlotConfig::RotarySpeaker(rotary) => {
                slot.rotary_speaker.speed = (rotary.speed
                    + mod_value_for(ModDestination::RotarySpeakerSpeed, matrix, sources) * 6.0)
                    .clamp(0.1, 12.0);
                slot.rotary_speaker.depth = (rotary.depth
                    + mod_value_for(ModDestination::RotarySpeakerDepth, matrix, sources))
                .clamp(0.0, 1.0);
                slot.rotary_speaker.drive = (rotary.drive
                    + mod_value_for(ModDestination::RotarySpeakerDrive, matrix, sources))
                .clamp(0.0, 1.0);
                slot.rotary_speaker.mix = (rotary.mix
                    + mod_value_for(ModDestination::RotarySpeakerMix, matrix, sources))
                .clamp(0.0, 1.0);
            }
            FxSlotConfig::AutoWah(wah) => {
                slot.auto_wah.sensitivity = (wah.sensitivity
                    + mod_value_for(ModDestination::AutoWahSensitivity, matrix, sources))
                .clamp(0.0, 1.0);
                slot.auto_wah.cutoff_hz = (wah.cutoff_hz
                    + mod_value_for(ModDestination::AutoWahCutoffHz, matrix, sources) * 2000.0)
                    .clamp(40.0, 2500.0);
                slot.auto_wah.resonance = (wah.resonance
                    + mod_value_for(ModDestination::AutoWahResonance, matrix, sources))
                .clamp(0.0, 1.0);
                slot.auto_wah.attack_ms = (wah.attack_ms
                    + mod_value_for(ModDestination::AutoWahAttackMs, matrix, sources) * 100.0)
                    .clamp(0.5, 200.0);
                slot.auto_wah.release_ms = (wah.release_ms
                    + mod_value_for(ModDestination::AutoWahReleaseMs, matrix, sources) * 500.0)
                    .clamp(1.0, 1200.0);
                slot.auto_wah.mix = (wah.mix
                    + mod_value_for(ModDestination::AutoWahMix, matrix, sources))
                .clamp(0.0, 1.0);
            }
            FxSlotConfig::StereoWidener(widener) => {
                slot.stereo_widener.width = (widener.width
                    + mod_value_for(ModDestination::StereoWidenerWidth, matrix, sources))
                .clamp(0.0, 1.0);
                slot.stereo_widener.delay_ms = (widener.delay_ms
                    + mod_value_for(ModDestination::StereoWidenerDelayMs, matrix, sources) * 15.0)
                    .clamp(1.0, 30.0);
                slot.stereo_widener.tone = (widener.tone
                    + mod_value_for(ModDestination::StereoWidenerTone, matrix, sources))
                .clamp(0.0, 1.0);
                slot.stereo_widener.mix = (widener.mix
                    + mod_value_for(ModDestination::StereoWidenerMix, matrix, sources))
                .clamp(0.0, 1.0);
            }
            _ => {}
        }
    }
}
