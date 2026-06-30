import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import RandomDisplay from "@/components/panels/drawer-modules/RandomDisplay";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import {
	useOptionalSynthController,
	useSynthParam,
} from "@/features/synth/SynthParamController";

const RANDOM_COLOR = "#c2571a";
const RANDOM_HISTORY_SIZE = 14;

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
	const { value: randomRate } = useSynthParam("randomRate");
	const previewStepRef = useRef(0);
	const [previewPhase, setPreviewPhase] = useState(0);
	const [displayValue, setDisplayValue] = useState(() => randomHoldValue(0));
	const [displayValues, setDisplayValues] = useState(buildInitialRandomValues);
	const [hasLiveTelemetry, setHasLiveTelemetry] = useState(false);

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

			setHasLiveTelemetry(true);
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

		let rafId = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
			last = now;
			const rateHz = Math.max(0, randomRate as number);

			setPreviewPhase((phase) => {
				let nextPhase = phase + dt * rateHz;
				if (nextPhase < 1) {
					return nextPhase;
				}

				let steps = 0;
				while (nextPhase >= 1) {
					nextPhase -= 1;
					steps += 1;
				}

				setDisplayValues((values) => {
					let nextStep = previewStepRef.current;
					let nextValue = randomHoldValue(nextStep);
					let nextValues = values;
					for (let i = 0; i < steps; i++) {
						nextStep += 1;
						nextValue = randomHoldValue(nextStep);
						nextValues = appendRandomValue(nextValues, nextValue);
					}
					previewStepRef.current = nextStep;
					setDisplayValue(nextValue);
					return nextValues;
				});

				return nextPhase;
			});

			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [hasLiveTelemetry, randomRate]);

	const displayPhase = useMemo(
		() => (hasLiveTelemetry ? 1 : previewPhase),
		[hasLiveTelemetry, previewPhase],
	);

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
				phase={displayPhase}
				live={hasLiveTelemetry}
			/>
			<SynthParamKnob
				paramKey="randomRate"
				color={RANDOM_COLOR}
				label={t("randomModule.rate")}
			/>
		</ModuleFrame>
	);
}
