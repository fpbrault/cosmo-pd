import type { DecodedPatch, EnvelopeStep } from "@/lib/midi/czSysexDecoder";
import type {
	AlgoControlValueV1,
	CzWaveform,
	EnvelopeProgramV1,
	EnvStep,
	StepEnvData,
	SynthPresetV1,
} from "@/lib/synth/bindings/synth";
import {
	DEFAULT_DCA_ENV,
	DEFAULT_DCO_ENV,
	DEFAULT_DCW_ENV,
} from "@/lib/synth/defaultEnvelopes";
import { DEFAULT_PRESET } from "@/lib/synth/presetStorage";

function convertEnvelope(env: {
	steps: EnvelopeStep[];
	endStep: number;
}): StepEnvData {
	const czSteps = env.steps.slice(0, env.endStep);
	const steps: EnvStep[] = czSteps.map((step) => ({
		level: step.level,
		rate: step.rate,
	}));

	while (steps.length < 8) {
		steps.push({ level: 0, rate: 50 });
	}

	const sustainIndex = czSteps.findIndex((s) => s.sustain);
	const sustainStep = sustainIndex >= 0 ? sustainIndex : env.endStep - 1;

	return {
		steps,
		sustainStep: Math.min(sustainStep, 7),
		stepCount: env.endStep,
		loop: false,
	};
}

function stepProgram(params: StepEnvData): EnvelopeProgramV1 {
	return { type: "step", params };
}

function waveformToCzWaveform(
	waveform: DecodedPatch["dco1"]["firstWaveform"],
): CzWaveform {
	if (waveform === 1) return "saw";
	if (waveform === 2) return "square";
	if (waveform === 3) return "pulse";
	if (waveform === 4) return "null";
	if (waveform === 5) return "sinePulse";
	if (waveform === 6) return "sawPulse";
	if (waveform === 7) return "multiSine";
	return "pulse2";
}

function setAlgoControl(
	entries: AlgoControlValueV1[],
	id: string,
	value: number,
): AlgoControlValueV1[] {
	const index = entries.findIndex((entry) => entry.id === id);
	if (index >= 0) {
		const next = [...entries];
		next[index] = { ...next[index], value };
		return next;
	}
	return [...entries, { id, value }];
}

function makeCzControls(
	waveform1: CzWaveform,
	waveform2: CzWaveform,
	windowFunction: number,
): AlgoControlValueV1[] {
	const waveformIndex = (waveform: CzWaveform) =>
		[
			"saw",
			"square",
			"pulse",
			"null",
			"sinePulse",
			"sawPulse",
			"multiSine",
			"pulse2",
		].indexOf(waveform);
	const presetIndex =
		waveform1 === "saw" && waveform2 === "saw" && windowFunction === 0
			? 0
			: waveform1 === "square" && waveform2 === "square" && windowFunction === 0
				? 1
				: waveform1 === "pulse" && waveform2 === "pulse" && windowFunction === 0
					? 2
					: waveform1 === "sinePulse" &&
							waveform2 === "sinePulse" &&
							windowFunction === 0
						? 3
						: waveform1 === "sawPulse" &&
								waveform2 === "sawPulse" &&
								windowFunction === 0
							? 4
							: waveform1 === "multiSine" &&
									waveform2 === "multiSine" &&
									windowFunction === 1
								? 5
								: waveform1 === "multiSine" &&
										waveform2 === "multiSine" &&
										windowFunction === 2
									? 6
									: waveform1 === "multiSine" &&
											waveform2 === "multiSine" &&
											windowFunction === 3
										? 7
										: 0;
	let entries: AlgoControlValueV1[] = [];
	entries = setAlgoControl(entries, "preset", presetIndex);
	entries = setAlgoControl(entries, "waveform1", waveformIndex(waveform1));
	entries = setAlgoControl(entries, "waveform2", waveformIndex(waveform2));
	entries = setAlgoControl(entries, "windowFunction", windowFunction);
	return entries;
}

export function convertDecodedPatchToSynthPreset(
	decoded: DecodedPatch,
): SynthPresetV1 {
	const preset: SynthPresetV1 = JSON.parse(JSON.stringify(DEFAULT_PRESET));
	const p = preset.params;

	const detuneSign = decoded.detuneDirection === "+" ? 1 : -1;

	p.line1.engine.params.algo = "cz101";
	p.line1.engine.params.algo2 = decoded.dco1.secondWaveform ? "cz101" : null;
	const line1Waveform1 = waveformToCzWaveform(decoded.dco1.firstWaveform);
	const line1Waveform2 = decoded.dco1.secondWaveform
		? waveformToCzWaveform(decoded.dco1.secondWaveform)
		: line1Waveform1;
	const line1WindowFunction = decoded.dco1.windowFunction ?? 0;
	p.line1.engine.params.algoControlsA = makeCzControls(
		line1Waveform1,
		line1Waveform2,
		line1WindowFunction,
	);
	p.line1.engine.params.algoControlsB = decoded.dco1.secondWaveform
		? makeCzControls(line1Waveform2, line1Waveform2, line1WindowFunction)
		: [];
	p.line1.octave = decoded.octave;
	p.line1.detuneNote = 0;
	p.line1.detuneFine = 0;
	p.line1.envelopes.pitch = stepProgram(convertEnvelope(decoded.dco1Env));
	p.line1.envelopes.timbre = stepProgram(convertEnvelope(decoded.dcw1));
	p.line1.envelopes.amplitude = stepProgram(convertEnvelope(decoded.dca1));
	p.line1.engine.params.dcwKeyFollow = decoded.dcw1KeyFollow;
	p.line1.engine.params.dcaKeyFollow = decoded.dca1KeyFollow;

	p.line2.engine.params.algo = "cz101";
	p.line2.engine.params.algo2 = decoded.dco2.secondWaveform ? "cz101" : null;
	const line2Waveform1 = waveformToCzWaveform(decoded.dco2.firstWaveform);
	const line2Waveform2 = decoded.dco2.secondWaveform
		? waveformToCzWaveform(decoded.dco2.secondWaveform)
		: line2Waveform1;
	const line2WindowFunction = decoded.dco2.windowFunction ?? 0;
	p.line2.engine.params.algoControlsA = makeCzControls(
		line2Waveform1,
		line2Waveform2,
		line2WindowFunction,
	);
	p.line2.engine.params.algoControlsB = decoded.dco2.secondWaveform
		? makeCzControls(line2Waveform2, line2Waveform2, line2WindowFunction)
		: [];
	p.line2.octave = decoded.octave + detuneSign * decoded.detuneOctave;
	p.line2.detuneNote = detuneSign * decoded.detuneNote;
	p.line2.detuneFine = detuneSign * decoded.detuneFine;
	p.line2.envelopes.pitch = stepProgram(convertEnvelope(decoded.dco2Env));
	p.line2.envelopes.timbre = stepProgram(convertEnvelope(decoded.dcw2));
	p.line2.envelopes.amplitude = stepProgram(convertEnvelope(decoded.dca2));
	p.line2.engine.params.dcwKeyFollow = decoded.dcw2KeyFollow;
	p.line2.engine.params.dcaKeyFollow = decoded.dca2KeyFollow;

	if (decoded.dco1.modulation === "ring") p.modMode = "ring";
	else if (decoded.dco1.modulation === "noise") p.modMode = "noise";
	else p.modMode = "normal";

	if (decoded.lineSelect === "L1") {
		p.lineSelect = "L1";
		p.line2.octave = 0;
		p.line2.detuneNote = 0;
		p.line2.detuneFine = 0;
		p.line2.envelopes.pitch = stepProgram(DEFAULT_DCO_ENV);
		p.line2.envelopes.timbre = stepProgram(DEFAULT_DCW_ENV);
		p.line2.envelopes.amplitude = stepProgram(DEFAULT_DCA_ENV);
		p.line2.engine.params.dcwKeyFollow = 0;
		p.line2.engine.params.dcaKeyFollow = 0;
		p.line2.engine.params.algo = DEFAULT_PRESET.params.line2.engine.params.algo;
		p.line2.engine.params.algo2 =
			DEFAULT_PRESET.params.line2.engine.params.algo2;
	}

	if (decoded.lineSelect === "L2") {
		p.lineSelect = "L2";
		p.line1.octave = 0;
		p.line1.detuneNote = 0;
		p.line1.detuneFine = 0;
		p.line1.envelopes.pitch = stepProgram(DEFAULT_DCO_ENV);
		p.line1.envelopes.timbre = stepProgram(DEFAULT_DCW_ENV);
		p.line1.envelopes.amplitude = stepProgram(DEFAULT_DCA_ENV);
		p.line1.engine.params.dcwKeyFollow = 0;
		p.line1.engine.params.dcaKeyFollow = 0;
		p.line1.engine.params.algo = DEFAULT_PRESET.params.line1.engine.params.algo;
		p.line1.engine.params.algo2 =
			DEFAULT_PRESET.params.line1.engine.params.algo2;
	}

	if (decoded.lineSelect === "L1+1'") {
		p.lineSelect = "L1+L1'";
	}

	if (decoded.lineSelect === "L1+2'") {
		p.lineSelect = "L1+L2'";
	}

	p.polyMode = "poly8";
	p.legato = false;

	p.line1.engine.params.dcwBase = 1.0;
	p.line2.engine.params.dcwBase = 1.0;
	p.line1.engine.params.algoBlend = 0;
	p.line2.engine.params.algoBlend = 0;
	p.line1.engine.params.window = "off";
	p.line2.engine.params.window = "off";
	p.volume = 0.8;
	p.line1.engine.params.dcaBase = 1;
	p.line2.engine.params.dcaBase = 1;
	p.portamento.enabled = false;
	p.portamento.mode = "time";
	p.portamento.rate = 0;
	p.portamento.time = 0.5;
	p.lfo.waveform = "sine";
	p.lfo.rate = 5;
	p.lfo.depth = 1;
	p.lfo.symmetry = 0.5;
	p.lfo.retrigger = false;
	p.fxSlots = [
		{ type: "empty" },
		{ type: "empty" },
		{ type: "empty" },
		{
			type: "vibrato",
			params: {
				enabled: decoded.vibratoDepth > 0,
				waveform: decoded.vibratoWave,
				rate: decoded.vibratoRate,
				depth: decoded.vibratoDepth,
				delay: decoded.vibratoDelay,
			},
		},
		{ type: "empty" },
		{ type: "empty" },
	];

	return preset;
}
