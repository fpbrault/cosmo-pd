import { useDeferredValue, useMemo } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { computeWaveform } from "@/lib/synth/pdAlgorithms";

const WAVE_COUNT = 42;
const POINTS_PER_WAVE = 128;

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

export function useWavetablePreview(): {
	line1History: number[][];
	line2History: number[][];
} {
	const warpAAmount = useSynthStore((s) => s.warpAAmount);
	const warpBAmount = useSynthStore((s) => s.warpBAmount);
	const warpAAlgo = useSynthStore((s) => s.warpAAlgo);
	const warpBAlgo = useSynthStore((s) => s.warpBAlgo);
	const algo2A = useSynthStore((s) => s.algo2A);
	const algo2B = useSynthStore((s) => s.algo2B);
	const algoBlendA = useSynthStore((s) => s.algoBlendA);
	const algoBlendB = useSynthStore((s) => s.algoBlendB);
	const windowType = useSynthStore((s) => s.windowType);
	const line1Level = useSynthStore((s) => s.line1Level);
	const line2Level = useSynthStore((s) => s.line2Level);
	const line1DcwEnv = useSynthStore((s) => s.line1DcwEnv);
	const line2DcwEnv = useSynthStore((s) => s.line2DcwEnv);
	const line1DcaEnv = useSynthStore((s) => s.line1DcaEnv);
	const line2DcaEnv = useSynthStore((s) => s.line2DcaEnv);
	const line1BaseWaveformA = useSynthStore((s) => s.line1BaseWaveformA);
	const line1BaseWaveformB = useSynthStore((s) => s.line1BaseWaveformB);
	const line2BaseWaveformA = useSynthStore((s) => s.line2BaseWaveformA);
	const line2BaseWaveformB = useSynthStore((s) => s.line2BaseWaveformB);
	const line1AlgoControlsA = useSynthStore((s) => s.line1AlgoControlsA);
	const line1AlgoControlsB = useSynthStore((s) => s.line1AlgoControlsB);
	const line2AlgoControlsA = useSynthStore((s) => s.line2AlgoControlsA);
	const line2AlgoControlsB = useSynthStore((s) => s.line2AlgoControlsB);
	const phaseModSlot = useSynthStore((s) => s.fxSlots[4]);

	const snapshot = useMemo(() => {
		const phaseModParams =
			phaseModSlot?.type === "phaseMod" ? phaseModSlot.params : null;
		const phaseModEnabled = phaseModParams?.enabled ?? false;
		const intPmAmount = phaseModEnabled ? (phaseModParams?.amount ?? 0) : 0;
		const intPmRatio = phaseModParams?.ratio ?? 1;
		const pmPre = phaseModParams?.pmPre ?? true;

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
	}, [
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
		phaseModSlot,
	]);

	return useDeferredValue(snapshot);
}
