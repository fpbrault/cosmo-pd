import type {
	RuntimeVoiceDebugState,
	RuntimeVoiceEnvState,
} from "@/features/synth/hooks/useAudioEngine";
import type {
	Algo,
	AlgoControlValueV1,
	BaseWaveform,
	StepEnvData,
	WindowType,
} from "@/lib/synth/bindings/synth";
import { computeWaveform } from "@/lib/synth/waveformPreview";
import type {
	WaterfallPreviewData,
	WaterfallPreviewIndicator,
	WaterfallVoiceProgressState,
} from "./types";

const WAVE_COUNT = 42;
const POINTS_PER_WAVE = 128;

type BuildWaterfallPreviewHistoriesParams = {
	warpAAmount: number;
	warpBAmount: number;
	warpAAlgo: Algo;
	warpBAlgo: Algo;
	algo2A: Algo | null;
	algo2B: Algo | null;
	algoBlendA: number;
	algoBlendB: number;
	windowType: WindowType;
	line1Level: number;
	line2Level: number;
	line1DcwEnv: StepEnvData;
	line2DcwEnv: StepEnvData;
	line1DcaEnv: StepEnvData;
	line2DcaEnv: StepEnvData;
	line1BaseWaveformA: BaseWaveform;
	line1BaseWaveformB: BaseWaveform;
	line2BaseWaveformA: BaseWaveform;
	line2BaseWaveformB: BaseWaveform;
	line1AlgoControlsA: AlgoControlValueV1[];
	line1AlgoControlsB: AlgoControlValueV1[];
	line2AlgoControlsA: AlgoControlValueV1[];
	line2AlgoControlsB: AlgoControlValueV1[];
	intPmAmount: number;
	intPmRatio: number;
	pmPre: boolean;
};

type CollectWaterfallActiveIndicatorsParams = {
	voices: RuntimeVoiceDebugState[];
	maxWaveIndex: number;
	env: StepEnvData;
	lineLevel: number;
	previousProgressByVoice: ReadonlyMap<number, WaterfallVoiceProgressState>;
	isAudible: (voice: RuntimeVoiceDebugState, level: number) => boolean;
	getRuntimeEnv: (voice: RuntimeVoiceDebugState) => RuntimeVoiceEnvState;
	getRuntimeDca: (voice: RuntimeVoiceDebugState) => number;
};

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function rateToDuration(rate: number): number {
	const normalized = 1 - clamp(rate, 0, 99) / 99;
	return 0.08 + normalized * normalized * 1.15;
}

function evaluateEnvelope(env: StepEnvData, position: number): number {
	const stepCount = clamp(env.stepCount, 1, env.steps.length);
	const steps = env.steps.slice(0, stepCount);
	if (!steps.length) {
		return 1;
	}

	const durations = steps.map((step) => rateToDuration(step.rate ?? 0));
	const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
	let cursor = 0;
	let previousLevel = steps[0]?.level ?? 99;
	const time = position * totalDuration;

	for (let index = 0; index < steps.length; index++) {
		const step = steps[index];
		if (!step) {
			continue;
		}

		const duration = durations[index] ?? 1;
		const nextCursor = cursor + duration;
		if (time <= nextCursor || index === steps.length - 1) {
			const segmentT = duration > 0 ? (time - cursor) / duration : 1;
			return clamp(lerp(previousLevel, step.level ?? 99, segmentT), 0, 99) / 99;
		}

		cursor = nextCursor;
		previousLevel = step.level ?? 99;
	}

	return clamp(steps[steps.length - 1]?.level ?? 99, 0, 99) / 99;
}

function resampleWave(wave: Float32Array, points: number): number[] {
	const out = new Array<number>(points);
	for (let i = 0; i < points; i++) {
		const sourcePosition = (i / (points - 1)) * (wave.length - 1);
		const leftIndex = Math.floor(sourcePosition);
		const rightIndex = Math.min(wave.length - 1, leftIndex + 1);
		const t = sourcePosition - leftIndex;
		out[i] = lerp(wave[leftIndex] ?? 0, wave[rightIndex] ?? 0, t);
	}
	return out;
}

function dcwRateToSeconds(rate: number): number {
	const clampedRate = clamp(rate, 0, 99);
	const normalizedRate = clampedRate / 99;
	return 104.04 * (0.004 / 104.04) ** normalizedRate;
}

function getEnvelopeStepTargetLevel(env: StepEnvData, step: number): number {
	const stepCount = clamp(env.stepCount, 1, env.steps.length);
	const endStep = stepCount - 1;
	if (step >= endStep) {
		return 0;
	}
	const next = env.steps[step];
	return clamp((next?.level ?? 0) / 99, 0, 1);
}

function getEnvelopeStepDurations(env: StepEnvData): number[] {
	const stepCount = clamp(env.stepCount, 1, env.steps.length);
	const durations: number[] = [];
	let previousTarget = 0;

	for (let index = 0; index < stepCount; index++) {
		const target = getEnvelopeStepTargetLevel(env, index);
		const rate = env.steps[index]?.rate ?? 0;
		const distance = Math.abs(target - previousTarget);
		durations.push(dcwRateToSeconds(rate) * distance);
		previousTarget = target;
	}

	return durations;
}

function runtimeEnvelopeToProgress(
	env: StepEnvData,
	runtimeEnv: RuntimeVoiceEnvState,
): number {
	const stepCount = clamp(env.stepCount, 1, env.steps.length);
	const endStep = stepCount - 1;
	const step = clamp(runtimeEnv.step, 0, endStep);
	const durations = getEnvelopeStepDurations(env);
	const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
	const elapsedBefore = durations
		.slice(0, step)
		.reduce((sum, duration) => sum + duration, 0);

	const currentRate = env.steps[step]?.rate ?? 0;
	const previousLevel = clamp(runtimeEnv.prevLevel, 0, 1);
	const targetLevel = getEnvelopeStepTargetLevel(env, step);
	const distance = Math.abs(targetLevel - previousLevel);
	const currentDuration = dcwRateToSeconds(currentRate) * distance;

	let progressInCurrentStep = 1;
	if (distance > 1e-6) {
		const value = clamp(runtimeEnv.value, 0, 1);
		progressInCurrentStep = clamp(
			(value - previousLevel) / (targetLevel - previousLevel),
			0,
			1,
		);
	}

	if (totalDuration <= 1e-6) {
		return stepCount > 1 ? step / endStep : 0;
	}

	return clamp(
		(elapsedBefore + currentDuration * progressInCurrentStep) / totalDuration,
		0,
		1,
	);
}

function hasAudibleLine1(
	voice: RuntimeVoiceDebugState,
	line1Level: number,
): boolean {
	return voice.line1.dca.value * line1Level > 0.0001;
}

function hasAudibleLine2(
	voice: RuntimeVoiceDebugState,
	line2Level: number,
): boolean {
	return voice.line2.dca.value * line2Level > 0.0001;
}

export function lineInfluence(index: number, progress: number): number {
	const distance = Math.abs(index - progress);
	if (distance >= 1.4) {
		return 0;
	}
	const normalized = 1 - distance / 1.4;
	return normalized * normalized;
}

export function buildWaterfallPreviewHistories(
	params: BuildWaterfallPreviewHistoriesParams,
): Pick<WaterfallPreviewData, "line1History" | "line2History"> {
	const {
		warpAAmount,
		warpBAmount,
		warpAAlgo,
		warpBAlgo,
		algo2A,
		algo2B,
		algoBlendA,
		algoBlendB,
		windowType,
		line1Level,
		line2Level,
		line1DcwEnv,
		line2DcwEnv,
		line1DcaEnv,
		line2DcaEnv,
		line1BaseWaveformA,
		line1BaseWaveformB,
		line2BaseWaveformA,
		line2BaseWaveformB,
		line1AlgoControlsA,
		line1AlgoControlsB,
		line2AlgoControlsA,
		line2AlgoControlsB,
		intPmAmount,
		intPmRatio,
		pmPre,
	} = params;

	const line1History: number[][] = [];
	const line2History: number[][] = [];

	for (let index = 0; index < WAVE_COUNT; index++) {
		const time = index / (WAVE_COUNT - 1);
		const dcw1 = evaluateEnvelope(line1DcwEnv, time);
		const dcw2 = evaluateEnvelope(line2DcwEnv, time);
		const dca1 = evaluateEnvelope(line1DcaEnv, time);
		const dca2 = evaluateEnvelope(line2DcaEnv, time);
		const waveform = computeWaveform({
			warpAAmount: warpAAmount * dcw1,
			warpBAmount: warpBAmount * dcw2,
			warpAAlgo,
			warpBAlgo,
			algo2A,
			algo2B,
			algoBlendA,
			algoBlendB,
			intPmAmount,
			intPmRatio,
			extPmAmount: 0,
			pmPre,
			windowType,
			line1Level: line1Level * dca1,
			line2Level: line2Level * dca2,
			line1BaseWaveformA,
			line1BaseWaveformB,
			line2BaseWaveformA,
			line2BaseWaveformB,
			line1AlgoControlsA,
			line1AlgoControlsB,
			line2AlgoControlsA,
			line2AlgoControlsB,
		});

		line1History.push(
			resampleWave(
				Float32Array.from(waveform.out1, (sample) =>
					clamp(sample, -1.15, 1.15),
				),
				POINTS_PER_WAVE,
			),
		);
		line2History.push(
			resampleWave(
				Float32Array.from(waveform.out2, (sample) =>
					clamp(sample, -1.15, 1.15),
				),
				POINTS_PER_WAVE,
			),
		);
	}

	return {
		line1History,
		line2History,
	};
}

function collectWaterfallActiveIndicators({
	voices,
	maxWaveIndex,
	env,
	lineLevel,
	previousProgressByVoice,
	isAudible,
	getRuntimeEnv,
	getRuntimeDca,
}: CollectWaterfallActiveIndicatorsParams): {
	indicators: WaterfallPreviewIndicator[];
	nextProgressByVoice: Map<number, WaterfallVoiceProgressState>;
} {
	const nextProgressByVoice = new Map(previousProgressByVoice);
	const activeVoices = voices.filter(
		(voice) =>
			voice.active && voice.note !== null && isAudible(voice, lineLevel),
	);

	const indicators = activeVoices.map((voice) => {
		const rawProgress = runtimeEnvelopeToProgress(env, getRuntimeEnv(voice));
		const strength = clamp(getRuntimeDca(voice) * lineLevel, 0, 1);
		const previous = nextProgressByVoice.get(voice.index);
		const progress =
			previous?.note === voice.note
				? Math.max(previous.progress, rawProgress)
				: rawProgress;

		nextProgressByVoice.set(voice.index, {
			note: voice.note as number,
			progress,
		});

		return {
			voiceId: voice.index,
			progress: progress * maxWaveIndex,
			strength,
		};
	});

	const activeIndices = new Set(activeVoices.map((voice) => voice.index));
	for (const voiceIndex of nextProgressByVoice.keys()) {
		if (!activeIndices.has(voiceIndex)) {
			nextProgressByVoice.delete(voiceIndex);
		}
	}

	return {
		indicators,
		nextProgressByVoice,
	};
}

export function buildWaterfallPreviewData(args: {
	histories: Pick<WaterfallPreviewData, "line1History" | "line2History">;
	voices: RuntimeVoiceDebugState[];
	line1DcwEnv: StepEnvData;
	line1Level: number;
	line2DcwEnv: StepEnvData;
	line2Level: number;
	line1ProgressByVoice: ReadonlyMap<number, WaterfallVoiceProgressState>;
	line2ProgressByVoice: ReadonlyMap<number, WaterfallVoiceProgressState>;
}): {
	preview: WaterfallPreviewData;
	nextLine1ProgressByVoice: Map<number, WaterfallVoiceProgressState>;
	nextLine2ProgressByVoice: Map<number, WaterfallVoiceProgressState>;
} {
	const {
		histories,
		voices,
		line1DcwEnv,
		line1Level,
		line2DcwEnv,
		line2Level,
		line1ProgressByVoice,
		line2ProgressByVoice,
	} = args;

	const line1Result = collectWaterfallActiveIndicators({
		voices,
		maxWaveIndex: Math.max(0, histories.line1History.length - 1),
		env: line1DcwEnv,
		lineLevel: line1Level,
		previousProgressByVoice: line1ProgressByVoice,
		isAudible: hasAudibleLine1,
		getRuntimeEnv: (voice) => voice.line1.dcw,
		getRuntimeDca: (voice) => voice.line1.dca.value,
	});

	const line2Result = collectWaterfallActiveIndicators({
		voices,
		maxWaveIndex: Math.max(0, histories.line2History.length - 1),
		env: line2DcwEnv,
		lineLevel: line2Level,
		previousProgressByVoice: line2ProgressByVoice,
		isAudible: hasAudibleLine2,
		getRuntimeEnv: (voice) => voice.line2.dcw,
		getRuntimeDca: (voice) => voice.line2.dca.value,
	});

	return {
		preview: {
			...histories,
			line1Indicators: line1Result.indicators,
			line2Indicators: line2Result.indicators,
		},
		nextLine1ProgressByVoice: line1Result.nextProgressByVoice,
		nextLine2ProgressByVoice: line2Result.nextProgressByVoice,
	};
}
