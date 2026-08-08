import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/parameters/SynthParamKnob";
import { LFO_RATE_TRANSFORM } from "@/components/panels/modulation/lfo/lfoRateTransform";
import { getSyncCyclesPerBeat } from "@/components/panels/modulation/lfo/syncDivisions";
import RandomDisplay from "@/components/panels/modulation/random/RandomDisplay";
import ModuleFrame from "@/components/primitives/containers/ModuleFrame";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import {
	useOptionalSynthController,
	useSynthParam,
} from "@/features/synth/SynthParamController";

const RANDOM_COLOR = "#c2571a";
const RANDOM_HISTORY_SIZE = 14;
const RANDOM_DISPLAY_MAX_FPS = 30;
const RANDOM_DISPLAY_MIN_INTERVAL_MS = 1000 / RANDOM_DISPLAY_MAX_FPS;

function randomHoldValue(stepIndex: number): number {
	const seed = stepIndex * 12.9898 + 78.233;
	const hash = Math.sin(seed) * 43_758.547;
	const fract = hash - Math.floor(hash);
	return fract * 2 - 1;
}

function buildInitialRandomValues(): number[] {
	return Array.from({ length: RANDOM_HISTORY_SIZE }, (_, index) =>
		randomHoldValue(index - RANDOM_HISTORY_SIZE + 1),
	);
}

function appendRandomValue(values: number[], nextValue: number): number[] {
	return [...values.slice(1), nextValue];
}

export default function RandomModule() {
	const { t } = useTranslation("synth");
	const synthController = useOptionalSynthController();
	const transport = useHostTransport();
	const { value: randomRate } = useSynthParam("randomRate");
	const { value: randomRateMode } = useSynthParam("randomRateMode");
	const { value: randomSyncDivision } = useSynthParam("randomSyncDivision");
	const { value: tempoBpm } = useSynthParam("tempoBpm");
	const previewStepRef = useRef(0);
	const hasLiveTelemetryRef = useRef(false);
	const lastLiveValueRef = useRef<number | null>(null);
	const lastLiveUpdateAtRef = useRef(0);
	const [displayValue, setDisplayValue] = useState(() => randomHoldValue(0));
	const [displayValues, setDisplayValues] = useState(buildInitialRandomValues);
	const [hasLiveTelemetry, setHasLiveTelemetry] = useState(false);

	useEffect(() => {
		hasLiveTelemetryRef.current = hasLiveTelemetry;
	}, [hasLiveTelemetry]);

	useEffect(() => {
		const unregisterLiveSources =
			synthController?.registerLiveModSourcesConsumer();

		const onRuntimeModSources = (event: Event) => {
			const detail = (event as CustomEvent<{ random?: unknown } | undefined>)
				.detail;
			const nextRandom =
				typeof detail?.random === "number" && Number.isFinite(detail.random)
					? detail.random
					: synthController?.getLiveSources().random;
			if (typeof nextRandom !== "number" || !Number.isFinite(nextRandom)) {
				return;
			}
			const now = performance.now();
			const previous = lastLiveValueRef.current;
			if (
				previous !== null &&
				Math.abs(previous - nextRandom) < 0.0001 &&
				now - lastLiveUpdateAtRef.current < RANDOM_DISPLAY_MIN_INTERVAL_MS
			) {
				return;
			}
			if (
				now - lastLiveUpdateAtRef.current < RANDOM_DISPLAY_MIN_INTERVAL_MS &&
				previous !== null
			) {
				return;
			}

			lastLiveValueRef.current = nextRandom;
			lastLiveUpdateAtRef.current = now;
			if (!hasLiveTelemetryRef.current) {
				hasLiveTelemetryRef.current = true;
				setHasLiveTelemetry(true);
			}
			setDisplayValue(nextRandom);
			setDisplayValues((values) => appendRandomValue(values, nextRandom));
		};

		window.addEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		return () => {
			unregisterLiveSources?.();
			window.removeEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		};
	}, [synthController]);

	useEffect(() => {
		if (hasLiveTelemetry) {
			return;
		}
		const syncCyclesPerBeat = getSyncCyclesPerBeat(randomSyncDivision);
		const effectiveTempoBpm =
			transport.available &&
			Number.isFinite(transport.tempo) &&
			transport.tempo > 0
				? transport.tempo
				: tempoBpm;
		const previewRateHz =
			randomRateMode === "sync"
				? Math.max(
						0.01,
						(Math.max(1, effectiveTempoBpm) / 60) * syncCyclesPerBeat,
					)
				: Math.max(0, randomRate as number);
		if (previewRateHz <= 0) {
			return;
		}

		let timeoutId = 0;
		const intervalMs = Math.max(
			RANDOM_DISPLAY_MIN_INTERVAL_MS,
			1000 / previewRateHz,
		);
		const stepsPerTick = Math.max(
			1,
			Math.round((previewRateHz * intervalMs) / 1000),
		);
		const tick = () => {
			setDisplayValues((values) => {
				let nextStep = previewStepRef.current;
				let nextValue = randomHoldValue(nextStep);
				let nextValues = values;
				for (let i = 0; i < stepsPerTick; i++) {
					nextStep += 1;
					nextValue = randomHoldValue(nextStep);
					nextValues = appendRandomValue(nextValues, nextValue);
				}
				previewStepRef.current = nextStep;
				setDisplayValue(nextValue);
				return nextValues;
			});
			timeoutId = window.setTimeout(tick, intervalMs);
		};

		timeoutId = window.setTimeout(tick, intervalMs);
		return () => window.clearTimeout(timeoutId);
	}, [
		hasLiveTelemetry,
		randomRate,
		randomRateMode,
		randomSyncDivision,
		tempoBpm,
		transport.available,
		transport.tempo,
	]);

	return (
		<ModuleFrame
			title={t("randomModule.title")}
			color={RANDOM_COLOR}
			enabled
			hideToggle
			columns={1}
			presetValue=""
			presetOptions={[]}
			onPresetChange={() => {}}
			presetDisabled
		>
			<RandomDisplay
				color={RANDOM_COLOR}
				values={displayValues}
				currentValue={displayValue}
				phase={1}
				live={hasLiveTelemetry}
			/>
			<SynthParamKnob
				paramKey="randomRate"
				color={RANDOM_COLOR}
				label={t("randomModule.rate")}
				uiTransform={LFO_RATE_TRANSFORM}
				sync
			/>
		</ModuleFrame>
	);
}
