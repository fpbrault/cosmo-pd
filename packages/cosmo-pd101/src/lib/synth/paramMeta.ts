import type { SynthParamKey } from "@/features/synth/SynthParamController";

export type ParamMeta = {
	tooltip: string;
};

/**
 * Canonical tooltip text for every engine parameter.
 * Components must not hardcode these strings — always read from here.
 */
export const PARAM_META: Partial<Record<SynthParamKey, ParamMeta>> = {
	// Volume
	volume: { tooltip: "Sets the global synth output level." },

	// Per-line tuning & levels (A = line 1, B = line 2)
	warpAAmount: { tooltip: "Sets base harmonic warp amount for this line." },
	warpBAmount: { tooltip: "Sets base harmonic warp amount for this line." },
	line1Level: { tooltip: "Sets base output level for this line." },
	line2Level: { tooltip: "Sets base output level for this line." },
	line1Octave: { tooltip: "Transposes this line by octave steps." },
	line2Octave: { tooltip: "Transposes this line by octave steps." },
	line1Detune: { tooltip: "Fine tunes this line in cents." },
	line2Detune: { tooltip: "Fine tunes this line in cents." },
	algoBlendA: { tooltip: "Crossfades between Algo A and Algo B outputs." },
	algoBlendB: { tooltip: "Crossfades between Algo A and Algo B outputs." },

	// Phase modulation
	intPmAmount: { tooltip: "Sets internal phase modulation depth." },
	intPmRatio: { tooltip: "Sets modulator-to-carrier frequency ratio." },
	pmPre: { tooltip: "Apply phase modulation before warp shaping." },

	// Vibrato
	vibratoRate: { tooltip: "Sets vibrato speed." },
	vibratoDepth: { tooltip: "Sets vibrato pitch modulation depth." },
	vibratoDelay: { tooltip: "Delays vibrato onset after note start." },

	// LFO 1
	lfoRate: { tooltip: "Sets LFO 1 speed." },
	lfoDepth: { tooltip: "Sets LFO 1 modulation depth." },
	lfoOffset: { tooltip: "Offsets LFO 1 output around zero." },
	lfoSymmetry: { tooltip: "Adjusts LFO 1 waveform symmetry." },
	lfoRetrigger: { tooltip: "Restart LFO 1 phase on each new note." },

	// LFO 2
	lfo2Rate: { tooltip: "Sets LFO 2 speed." },
	lfo2Depth: { tooltip: "Sets LFO 2 modulation depth." },
	lfo2Offset: { tooltip: "Offsets LFO 2 output around zero." },
	lfo2Symmetry: { tooltip: "Adjusts LFO 2 waveform symmetry." },
	lfo2Retrigger: { tooltip: "Restart LFO 2 phase on each new note." },

	// Mod envelope
	modEnvAttack: { tooltip: "Sets modulation envelope attack time." },
	modEnvDecay: { tooltip: "Sets modulation envelope decay time." },
	modEnvSustain: {
		tooltip: "Sets sustained modulation level while note is held.",
	},
	modEnvRelease: {
		tooltip: "Sets modulation envelope release time after note off.",
	},

	// Random (S&H)
	randomRate: {
		tooltip: "Sets sample-and-hold random modulation refresh rate.",
	},

	// Filter
	filterCutoff: { tooltip: "Sets the filter cutoff frequency." },
	filterResonance: { tooltip: "Boosts frequencies around the cutoff point." },
	filterEnvAmount: {
		tooltip: "Applies envelope modulation amount to the cutoff.",
	},

	// Chorus
	chorusRate: { tooltip: "Sets chorus modulation speed." },
	chorusDepth: { tooltip: "Sets intensity of chorus pitch modulation." },
	chorusMix: { tooltip: "Blends dry signal with chorus effect." },

	// Delay
	delayTime: { tooltip: "Sets the delay repeat interval." },
	delayFeedback: { tooltip: "Feeds delayed signal back for additional repeats." },
	delayWarmth: {
		tooltip: "Adds tape-style saturation and high-frequency rolloff.",
	},
	delayMix: { tooltip: "Blends dry signal with delayed signal." },
	delayTapeMode: { tooltip: "Toggle tape echo coloration for delay repeats." },

	// Reverb
	reverbSpace: { tooltip: "Sets the virtual room size for reverb reflections." },
	reverbPredelay: { tooltip: "Adds delay before the reverb tail starts." },
	reverbDistance: {
		tooltip: "Moves source position deeper into the reverb space.",
	},
	reverbCharacter: { tooltip: "Shapes reverb tone from dark to bright." },
	reverbMix: { tooltip: "Blends dry signal with reverb output." },

	// Phaser
	phaserRate: { tooltip: "Sets phaser sweep speed." },
	phaserDepth: { tooltip: "Sets depth of the phaser notch sweep." },
	phaserFeedback: {
		tooltip: "Feeds phased signal back for stronger notches.",
	},
	phaserMix: { tooltip: "Blends dry signal with phaser output." },

	// Portamento
	portamentoRate: { tooltip: "Sets glide speed when portamento mode is Rate." },
	portamentoTime: {
		tooltip: "Sets glide duration when portamento mode is Time.",
	},

	// Global voice
	pitchBendRange: { tooltip: "Sets maximum pitch bend range in semitones." },
	velocityCurve: {
		tooltip: "Shapes how keyboard velocity maps to output level.",
	},
	modWheelVibratoDepth: {
		tooltip: "Sets how much mod wheel movement affects vibrato depth.",
	},
};

/** Canonical tooltips for `lineSelect` enum values. */
export const LINE_SELECT_TOOLTIPS: Partial<Record<string, string>> = {
	L1: "Play oscillator line 1 only.",
	"L1+L2": "Layer oscillator lines 1 and 2.",
	L2: "Play oscillator line 2 only.",
	"L1+L1'": "Stack line 1 with a detuned variant.",
	"L1+L2'": "Layer line 1 with a detuned line 2 variant.",
};

/** Canonical tooltips for `modMode` enum values. */
export const MOD_MODE_TOOLTIPS: Partial<Record<string, string>> = {
	normal: "Standard phase modulation behavior.",
	ring: "Enable ring modulation between lines.",
	noise: "Mix noise source into modulation path.",
};

/** Canonical tooltips for `filterType` enum values. */
export const FILTER_TYPE_TOOLTIPS: Partial<Record<string, string>> = {
	lp: "Low-pass mode: attenuates frequencies above cutoff.",
	hp: "High-pass mode: attenuates frequencies below cutoff.",
	bp: "Band-pass mode: emphasizes a narrow band around cutoff.",
};

/** Canonical tooltips for `portamentoMode` enum values. */
export const PORTAMENTO_MODE_TOOLTIPS: Partial<Record<string, string>> = {
	rate: "Portamento time scales with note interval distance.",
	time: "Portamento uses a fixed glide time between notes.",
};
