import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending } from "three";
import type {
	RuntimeVoiceDebugState,
	RuntimeVoiceEnvState,
} from "@/features/synth/hooks/useAudioEngine";
import { useSynthStore } from "@/features/synth/synthStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";

type WavePoint = [number, number, number];

type WaveLine = {
	id: string;
	depth: number;
	isCurrent: boolean;
	color: string;
	points: WavePoint[];
};

type WaterfallPalette = {
	front: string;
	back: string;
	activeGlow: string;
	haloCurrent: string;
	haloBack: string;
	ambient: string;
	pointA: string;
	pointB: string;
	background: string;
	fog: string;
	glowOuter: string;
	glowMid: string;
	glowCore: string;
};

export type WavetableWaterfallProps = {
	line1WaveHistory: number[][];
	line2WaveHistory: number[][];
};

const LINE1_PALETTE: WaterfallPalette = {
	front: "#9fd7ff",
	back: "#1d4ed8",
	activeGlow: "#e8f4ff",
	haloCurrent: "#a9dcff",
	haloBack: "#3f7ae8",
	ambient: "#8bc6ff",
	pointA: "#7bbcff",
	pointB: "#2a5bd8",
	background: "#040814",
	fog: "#040814",
	glowOuter: "#2d7dff",
	glowMid: "#8fc5ff",
	glowCore: "#f2f8ff",
};

const LINE2_PALETTE: WaterfallPalette = {
	front: "#ffb0b0",
	back: "#b0172f",
	activeGlow: "#fff0f2",
	haloCurrent: "#ffbaba",
	haloBack: "#d13b4f",
	ambient: "#ff9ca8",
	pointA: "#ff8c98",
	pointB: "#b81f3a",
	background: "#160608",
	fog: "#160608",
	glowOuter: "#ff3f5d",
	glowMid: "#ff9cb0",
	glowCore: "#fff4f6",
};

const X_SPAN = 6.4;
const Y_AMPLITUDE = 0.62;
const Z_STEP = 0.14;
const CAMERA_POSITION: WavePoint = [6, 10, 10];
const SCENE_TRANSLATION: WavePoint = [2.95, 4.1, 1];
const SCENE_ROTATION: WavePoint = [-0.26, 0.14, 0];

type WaterfallSceneProps = {
	waveHistory: number[][];
	activeIndicators: ActiveIndicator[];
	palette: WaterfallPalette;
};

type VoiceProgressState = {
	note: number;
	progress: number;
};

type ActiveIndicator = {
	voiceId: number;
	progress: number;
	strength: number;
};

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
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

function toWaveLines(
	waveHistory: number[][],
	palette: WaterfallPalette,
): WaveLine[] {
	const validWaves = waveHistory.filter((wave) => wave.length > 1);
	if (!validWaves.length) {
		return [];
	}

	return validWaves.map((wave, index, allWaves) => {
		const depth = allWaves.length > 1 ? index / (allWaves.length - 1) : 0;
		const color = lerpHexColor(palette.front, palette.back, depth);
		const z = -index * Z_STEP;
		const points = wave.map((sample, sampleIndex): WavePoint => {
			const x = (sampleIndex / Math.max(1, wave.length - 1) - 0.5) * X_SPAN;
			const y = sample * Y_AMPLITUDE;
			return [x, y, z];
		});

		return {
			id: `wave-${index}`,
			depth,
			color,
			isCurrent: index === 0,
			points,
		};
	});
}

function lineInfluence(index: number, progress: number): number {
	const distance = Math.abs(index - progress);
	if (distance >= 1.4) {
		return 0;
	}
	const normalized = 1 - distance / 1.4;
	return normalized * normalized;
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

function interpolateWavePoints(
	waveLines: WaveLine[],
	progress: number,
): WavePoint[] | null {
	if (!waveLines.length) {
		return null;
	}

	const clampedProgress = clamp(progress, 0, waveLines.length - 1);
	const leftIndex = Math.floor(clampedProgress);
	const rightIndex = Math.min(waveLines.length - 1, leftIndex + 1);
	const mix = clampedProgress - leftIndex;
	const left = waveLines[leftIndex];
	const right = waveLines[rightIndex] ?? left;
	if (!left || !right || left.points.length !== right.points.length) {
		return left?.points ?? null;
	}

	return left.points.map((point, pointIndex): WavePoint => {
		const next = right.points[pointIndex] ?? point;
		return [
			point[0] + (next[0] - point[0]) * mix,
			point[1] + (next[1] - point[1]) * mix,
			point[2] + (next[2] - point[2]) * mix,
		];
	});
}

function parseHexChannel(hex: string, start: number): number {
	const pair = hex.slice(start, start + 2);
	return Number.parseInt(pair, 16);
}

function lerpHexColor(from: string, to: string, t: number): string {
	const clamped = Math.max(0, Math.min(1, t));
	const fromR = parseHexChannel(from, 1);
	const fromG = parseHexChannel(from, 3);
	const fromB = parseHexChannel(from, 5);
	const toR = parseHexChannel(to, 1);
	const toG = parseHexChannel(to, 3);
	const toB = parseHexChannel(to, 5);

	const r = Math.round(fromR + (toR - fromR) * clamped);
	const g = Math.round(fromG + (toG - fromG) * clamped);
	const b = Math.round(fromB + (toB - fromB) * clamped);

	return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
}

function toHexPair(value: number): string {
	return value.toString(16).padStart(2, "0");
}

function WaterfallScene({
	waveHistory,
	activeIndicators,
	palette,
}: WaterfallSceneProps) {
	const { camera } = useThree();
	const [glowTime, setGlowTime] = useState(0);
	const lastFrameTimeRef = useRef(0);
	const waveLines = useMemo(
		() => toWaveLines(waveHistory, palette),
		[waveHistory, palette],
	);
	const interpolatedGlowLines = useMemo(
		() =>
			activeIndicators
				.map((indicator) => ({
					id: `${indicator.voiceId}-${indicator.progress.toFixed(4)}`,
					strength: indicator.strength,
					points: interpolateWavePoints(waveLines, indicator.progress),
				}))
				.filter(
					(
						entry,
					): entry is { id: string; strength: number; points: WavePoint[] } =>
						Boolean(entry.points && entry.points.length > 1),
				),
		[activeIndicators, waveLines],
	);
	const depthOffset = ((waveLines.length - 1) * Z_STEP) / 2;
	const scenePosition = useMemo<WavePoint>(
		() => [
			SCENE_TRANSLATION[0],
			-0.22 + SCENE_TRANSLATION[1],
			depthOffset + SCENE_TRANSLATION[2],
		],
		[depthOffset],
	);
	const lookAtTarget = useMemo<WavePoint>(
		() => [0, -0.12, -depthOffset],
		[depthOffset],
	);

	useEffect(() => {
		camera.position.set(
			CAMERA_POSITION[0],
			CAMERA_POSITION[1],
			CAMERA_POSITION[2],
		);
		camera.lookAt(lookAtTarget[0], lookAtTarget[1], lookAtTarget[2]);
		camera.updateProjectionMatrix();
	}, [camera, lookAtTarget]);

	useFrame(({ clock }) => {
		const elapsed = clock.elapsedTime;
		if (elapsed - lastFrameTimeRef.current < 1 / 30) {
			return;
		}
		lastFrameTimeRef.current = elapsed;
		setGlowTime(elapsed);
	});

	return (
		<>
			<color attach="background" args={[palette.background]} />
			<fog attach="fog" args={[palette.fog, 5.1, 9.6]} />
			<ambientLight intensity={0.45} color={palette.ambient} />
			<pointLight
				position={[0, 2.6, 3.9]}
				intensity={7.2}
				color={palette.pointA}
			/>
			<pointLight
				position={[-3.8, 2.4, -3.6]}
				intensity={2.2}
				color={palette.pointB}
			/>

			<group position={scenePosition} rotation={SCENE_ROTATION}>
				{waveLines.map((line) => (
					<Line
						key={`phosphor-halo-${line.id}`}
						points={line.points}
						color={line.isCurrent ? palette.haloCurrent : palette.haloBack}
						lineWidth={line.isCurrent ? 12 : 6.4}
						transparent
						opacity={line.isCurrent ? 0.1 : 0.04 + (1 - line.depth) * 0.045}
						depthWrite={false}
						blending={AdditiveBlending}
						renderOrder={10}
						toneMapped={false}
					/>
				))}
				{waveLines.map((line, index) => {
					const influence = activeIndicators.reduce(
						(max, indicator) =>
							Math.max(
								max,
								lineInfluence(index, indicator.progress) * indicator.strength,
							),
						0,
					);
					const glowMix = clamp(influence, 0, 1);
					const idleOpacity = line.isCurrent
						? 1
						: 0.22 + (1 - line.depth) * 0.64;
					return (
						<Line
							key={line.id}
							points={line.points}
							color={lerpHexColor(line.color, palette.activeGlow, glowMix)}
							lineWidth={(line.isCurrent ? 2.7 : 1.2) + glowMix * 1.4}
							transparent
							opacity={Math.min(0.95, idleOpacity + glowMix * 0.22)}
							blending={AdditiveBlending}
							renderOrder={20}
							toneMapped={false}
						/>
					);
				})}
				{interpolatedGlowLines.map((glowLine, index) => {
					const pulse = 0.5 + 0.5 * Math.sin(glowTime * 1.8 + index * 0.9);
					const intensity = clamp(glowLine.strength, 0, 1);
					return (
						<Line
							key={`glow-outer-${glowLine.id}`}
							points={glowLine.points}
							color={palette.glowOuter}
							lineWidth={14 + intensity * 7 + pulse * 1.8}
							transparent
							opacity={(0.01 + pulse * 0.018) * intensity}
							depthTest={false}
							depthWrite={false}
							blending={AdditiveBlending}
							renderOrder={40}
							toneMapped={false}
						/>
					);
				})}
				{interpolatedGlowLines.map((glowLine, index) => {
					const pulse = 0.5 + 0.5 * Math.sin(glowTime * 2.3 + index * 1.1);
					const intensity = clamp(glowLine.strength, 0, 1);
					return (
						<Line
							key={`glow-cyan-${glowLine.id}`}
							points={glowLine.points}
							color={palette.glowMid}
							lineWidth={7 + intensity * 4 + pulse * 1.0}
							transparent
							opacity={(0.04 + pulse * 0.055) * intensity}
							depthTest={false}
							depthWrite={false}
							blending={AdditiveBlending}
							renderOrder={41}
							toneMapped={false}
						/>
					);
				})}
				{interpolatedGlowLines.map((glowLine, index) => {
					const pulse = 0.5 + 0.5 * Math.sin(glowTime * 2.9 + index * 1.3);
					const intensity = clamp(glowLine.strength, 0, 1);
					return (
						<Line
							key={`glow-core-${glowLine.id}`}
							points={glowLine.points}
							color={palette.glowCore}
							lineWidth={3 + intensity * 1.8 + pulse * 0.5}
							transparent
							opacity={(0.13 + pulse * 0.1) * intensity}
							depthTest={false}
							depthWrite={false}
							blending={AdditiveBlending}
							renderOrder={42}
							toneMapped={false}
						/>
					);
				})}
			</group>
		</>
	);
}

function WavetableWaterfallPane({
	label,
	waveHistory,
	activeIndicators,
	palette,
	labelClassName,
}: {
	label: string;
	waveHistory: number[][];
	activeIndicators: ActiveIndicator[];
	palette: WaterfallPalette;
	labelClassName: string;
}) {
	return (
		<div className="relative isolate min-h-0 flex-1 overflow-hidden rounded-md border border-[#3f3f55]/80 bg-[#030305] [box-shadow:inset_0_0_0_1px_rgba(214,214,255,0.06),inset_0_0_70px_rgba(94,94,255,0.08),0_0_24px_rgba(22,22,44,0.22)]">
			<div className="pointer-events-none absolute left-2 top-1 z-50 text-4xs font-mono uppercase tracking-[0.24em] text-base-content/75">
				<span className={labelClassName}>{label}</span>
			</div>
			<div className="pointer-events-none absolute inset-0 z-0 rounded-md bg-[radial-gradient(ellipse_at_50%_55%,rgba(180,180,255,0.12),rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.72)_100%)]" />
			<div className="pointer-events-none absolute inset-0 z-0 rounded-md opacity-70 bg-[radial-gradient(ellipse_at_50%_50%,transparent_0%,transparent_58%,rgba(0,0,0,0.52)_86%,rgba(0,0,0,0.88)_100%)]" />
			<div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1/2 rounded-t-md opacity-25 mix-blend-screen bg-[linear-gradient(105deg,transparent_0%,rgba(235,235,255,0.1)_18%,rgba(235,235,255,0.22)_31%,transparent_46%)]" />
			<div className="pointer-events-none absolute inset-0 z-20 rounded-md opacity-50 mix-blend-screen bg-[repeating-linear-gradient(180deg,rgba(206,206,255,0.16)_0px,rgba(206,206,255,0.08)_1px,rgba(0,0,0,0.16)_2px,rgba(0,0,0,0.32)_4px)]" />
			<div className="pointer-events-none absolute inset-0 z-20 rounded-md opacity-20 mix-blend-screen bg-[repeating-linear-gradient(90deg,rgba(159,159,255,0.28)_0px,rgba(159,159,255,0.28)_1px,transparent_1px,transparent_3px)]" />
			<div className="pointer-events-none absolute inset-0 z-20 rounded-md opacity-30 mix-blend-screen bg-[radial-gradient(circle_at_50%_50%,rgba(190,190,255,0.11)_0px,transparent_1.4px)] bg-size-[4px_4px]" />
			<div className="pointer-events-none absolute inset-0 z-30 rounded-md bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.36)_76%,rgba(0,0,0,0.68)_100%)]" />
			<div className="pointer-events-none absolute inset-0 z-30 rounded-md opacity-35 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,transparent_9%,transparent_88%,rgba(200,200,255,0.08)_100%)]" />
			<div className="pointer-events-none absolute inset-0 z-40 rounded-md [box-shadow:inset_0_12px_38px_rgba(214,214,255,0.08),inset_0_-34px_70px_rgba(0,0,0,0.5),inset_18px_0_44px_rgba(255,255,255,0.03),inset_-22px_0_58px_rgba(0,0,0,0.36)]" />
			<Canvas
				className="relative z-10 h-full w-full opacity-95 contrast-125 saturate-150"
				dpr={[1, 1.75]}
				camera={{ position: CAMERA_POSITION, fov: 30 }}
			>
				<WaterfallScene
					waveHistory={waveHistory}
					activeIndicators={activeIndicators}
					palette={palette}
				/>
			</Canvas>
		</div>
	);
}

export function WavetableWaterfall({
	line1WaveHistory,
	line2WaveHistory,
}: WavetableWaterfallProps) {
	const [line1ActiveIndicators, setLine1ActiveIndicators] = useState<
		ActiveIndicator[]
	>([]);
	const [line2ActiveIndicators, setLine2ActiveIndicators] = useState<
		ActiveIndicator[]
	>([]);
	const line1VoiceProgressRef = useRef<Map<number, VoiceProgressState>>(
		new Map(),
	);
	const line2VoiceProgressRef = useRef<Map<number, VoiceProgressState>>(
		new Map(),
	);
	const line1DcwEnv = useSynthStore((state) => state.line1DcwEnv);
	const line1Level = useSynthStore((state) => state.line1Level);
	const line2DcwEnv = useSynthStore((state) => state.line2DcwEnv);
	const line2Level = useSynthStore((state) => state.line2Level);

	useEffect(() => {
		const onVoiceStates = (event: Event) => {
			const detail = (event as CustomEvent<RuntimeVoiceDebugState[]>).detail;
			const voices = Array.isArray(detail) ? detail : [];
			const activeLine1Voices = voices.filter(
				(voice) =>
					voice.active &&
					voice.note !== null &&
					hasAudibleLine1(voice, line1Level),
			);
			const activeLine2Voices = voices.filter(
				(voice) =>
					voice.active &&
					voice.note !== null &&
					hasAudibleLine2(voice, line2Level),
			);

			const maxLine1WaveIndex = Math.max(0, line1WaveHistory.length - 1);
			const maxLine2WaveIndex = Math.max(0, line2WaveHistory.length - 1);

			const line1Indicators = activeLine1Voices.map((voice) => {
				const rawProgress = runtimeEnvelopeToProgress(
					line1DcwEnv,
					voice.line1.dcw,
				);
				const strength = clamp(voice.line1.dca.value * line1Level, 0, 1);
				const previous = line1VoiceProgressRef.current.get(voice.index);
				const progress =
					previous?.note === voice.note
						? Math.max(previous.progress, rawProgress)
						: rawProgress;

				line1VoiceProgressRef.current.set(voice.index, {
					note: voice.note as number,
					progress,
				});

				return {
					voiceId: voice.index,
					progress: progress * maxLine1WaveIndex,
					strength,
				};
			});

			const line2Indicators = activeLine2Voices.map((voice) => {
				const rawProgress = runtimeEnvelopeToProgress(
					line2DcwEnv,
					voice.line2.dcw,
				);
				const strength = clamp(voice.line2.dca.value * line2Level, 0, 1);
				const previous = line2VoiceProgressRef.current.get(voice.index);
				const progress =
					previous?.note === voice.note
						? Math.max(previous.progress, rawProgress)
						: rawProgress;

				line2VoiceProgressRef.current.set(voice.index, {
					note: voice.note as number,
					progress,
				});

				return {
					voiceId: voice.index,
					progress: progress * maxLine2WaveIndex,
					strength,
				};
			});

			const activeLine1Indices = new Set(
				activeLine1Voices.map((voice) => voice.index),
			);
			for (const voiceIndex of line1VoiceProgressRef.current.keys()) {
				if (!activeLine1Indices.has(voiceIndex)) {
					line1VoiceProgressRef.current.delete(voiceIndex);
				}
			}

			const activeLine2Indices = new Set(
				activeLine2Voices.map((voice) => voice.index),
			);
			for (const voiceIndex of line2VoiceProgressRef.current.keys()) {
				if (!activeLine2Indices.has(voiceIndex)) {
					line2VoiceProgressRef.current.delete(voiceIndex);
				}
			}

			setLine1ActiveIndicators(line1Indicators);
			setLine2ActiveIndicators(line2Indicators);
		};

		window.addEventListener("cz-runtime-voice-states", onVoiceStates);
		return () => {
			window.removeEventListener("cz-runtime-voice-states", onVoiceStates);
		};
	}, [
		line1DcwEnv,
		line1Level,
		line2DcwEnv,
		line2Level,
		line1WaveHistory.length,
		line2WaveHistory.length,
	]);

	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-2">
			<WavetableWaterfallPane
				label="LINE 1"
				labelClassName="text-[#7bbcff]"
				waveHistory={line1WaveHistory}
				activeIndicators={line1ActiveIndicators}
				palette={LINE1_PALETTE}
			/>
			<WavetableWaterfallPane
				label="LINE 2"
				labelClassName="text-[#ff8c98]"
				waveHistory={line2WaveHistory}
				activeIndicators={line2ActiveIndicators}
				palette={LINE2_PALETTE}
			/>
		</div>
	);
}
