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
use crate::params::FxSlotConfig;
use crate::params::FxSlotType;
use crate::params::ModMatrixCache;
use crate::params::SynthParams;

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
                self.delay.time_mode = d.time_mode;
                self.delay.sync_division = d.sync_division;
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
                self.grain_delay.time_mode = gd.time_mode;
                self.grain_delay.sync_division = gd.sync_division;
                self.grain_delay.pitch_semitones = gd.pitch_semitones;
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
                self.tremolo.rate_mode = tr.rate_mode;
                self.tremolo.sync_division = tr.sync_division;
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

    pub fn set_tempo_bpm(&mut self, tempo_bpm: f32) {
        let tempo = tempo_bpm.max(1.0);
        for slot in &mut self.slots {
            slot.delay.tempo_bpm = tempo;
            slot.grain_delay.tempo_bpm = tempo;
            slot.tremolo.tempo_bpm = tempo;
        }
    }

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
                FxSlotConfig::Chorus(ch) => slot.chorus.apply_modulation(ch, &mod_cache.values),
                FxSlotConfig::Phaser(ph) => slot.phaser.apply_modulation(ph, &mod_cache.values),
                FxSlotConfig::Delay(d) => slot.delay.apply_modulation(d, &mod_cache.values),
                FxSlotConfig::Reverb(rv) => slot.reverb.apply_modulation(rv, &mod_cache.values),
                FxSlotConfig::Compressor(c) => {
                    slot.compressor.apply_modulation(c, &mod_cache.values);
                }
                FxSlotConfig::Eq5Band(eq) => slot.eq.apply_modulation(eq, &mod_cache.values),
                FxSlotConfig::GrainDelay(gd) => {
                    slot.grain_delay.apply_modulation(gd, &mod_cache.values);
                }
                FxSlotConfig::Bitcrusher(bc) => {
                    slot.bitcrusher.apply_modulation(bc, &mod_cache.values);
                }
                FxSlotConfig::ShimmerVerb(sv) => {
                    slot.shimmer_verb.apply_modulation(sv, &mod_cache.values);
                }
                FxSlotConfig::Distortion(dist) => {
                    slot.distortion.apply_modulation(dist, &mod_cache.values);
                }
                FxSlotConfig::JunoChorus(jc) => {
                    slot.juno_chorus.apply_modulation(jc, &mod_cache.values);
                }
                FxSlotConfig::RingMod(rm) => {
                    slot.ring_mod.apply_modulation(rm, &mod_cache.values);
                }
                FxSlotConfig::Tremolo(tr) => slot.tremolo.apply_modulation(tr, &mod_cache.values),
                FxSlotConfig::Wavefolder(wf) => {
                    slot.wavefolder.apply_modulation(wf, &mod_cache.values);
                }
                FxSlotConfig::LoFi(lofi) => slot.lofi.apply_modulation(lofi, &mod_cache.values),
                FxSlotConfig::MultimodeFilter(mm) => {
                    slot.multimode_filter
                        .apply_modulation(mm, &mod_cache.values);
                }
                FxSlotConfig::Flanger(fl) => slot.flanger.apply_modulation(fl, &mod_cache.values),
                FxSlotConfig::RotarySpeaker(rs) => {
                    slot.rotary_speaker.apply_modulation(rs, &mod_cache.values);
                }
                FxSlotConfig::AutoWah(aw) => {
                    slot.auto_wah.apply_modulation(aw, &mod_cache.values);
                }
                FxSlotConfig::StereoWidener(sw) => {
                    slot.stereo_widener.apply_modulation(sw, &mod_cache.values);
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
