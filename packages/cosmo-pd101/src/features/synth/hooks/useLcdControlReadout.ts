import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
	EngineParamReadoutFormatV1,
	StepEnvData,
} from "@/lib/synth/bindings/synth";
import { getEngineParamUiMeta } from "@/lib/synth/paramMeta";

type LcdControlReadout = {
	label: string;
	value: string;
};

type UseLcdControlReadoutResult = {
	lcdControlReadout: LcdControlReadout | null;
	pushLcdControlReadout: (key: string, value: unknown) => void;
	formatEnvReadout: (prev: StepEnvData, next: StepEnvData) => string;
};

export function useLcdControlReadout(): UseLcdControlReadoutResult {
	const { t } = useTranslation("synth");
	const [lcdControlReadout, setLcdControlReadout] =
		useState<LcdControlReadout | null>(null);
	const lcdReadoutTimeoutRef = useRef<number | null>(null);

	const formatEngineValue = useCallback(
		(
			format: EngineParamReadoutFormatV1,
			value: string | number | boolean,
		): string | null => {
			switch (format.kind) {
				case "onOff":
					return typeof value === "boolean" ? (value ? "ON" : "OFF") : null;
				case "raw":
					return typeof value === "string" ? value : null;
				case "uppercase":
					return typeof value === "string" ? value.toUpperCase() : null;
				case "integer":
					return typeof value === "number" ? `${Math.round(value)}` : null;
				case "decimal":
					if (typeof value !== "number") return null;
					return Number.isInteger(value) ? `${value}` : value.toFixed(2);
				case "percent":
					return typeof value === "number"
						? `${Math.round(value * 100)}%`
						: null;
				case "semitones":
					return typeof value === "number" ? `${Math.round(value)} ST` : null;
				case "milliseconds":
					return typeof value === "number" ? `${Math.round(value)} MS` : null;
				case "seconds2":
					return typeof value === "number" ? `${value.toFixed(2)} S` : null;
				case "hertz":
					return typeof value === "number" ? `${Math.round(value)} HZ` : null;
				case "enumMap": {
					if (typeof value !== "string") {
						return null;
					}
					const match = format.values.find((entry) => entry.value === value);
					return match?.label ?? value.toUpperCase();
				}
			}
		},
		[],
	);

	const formatValue = useCallback(
		(key: string, value: string | number | boolean): string => {
			const engineMeta = getEngineParamUiMeta(key);
			if (engineMeta) {
				const engineFormatted = formatEngineValue(
					engineMeta.readoutFormat,
					value,
				);
				if (engineFormatted) {
					return engineFormatted;
				}
			}

			if (typeof value === "boolean") {
				return value ? t("states.on") : t("states.off");
			}

			if (typeof value === "string") {
				if (key === "polyMode") {
					return value === "poly8" ? t("states.poly8") : t("states.mono");
				}
				if (key === "windowType") return value.toUpperCase();
				if (key === "lineSelect") return value;
				if (key === "modMode") return value.toUpperCase();
				if (key === "filterType") return value.toUpperCase();
				if (key === "lfoWaveform") return value.toUpperCase();
				if (key === "portamentoMode") return value.toUpperCase();
				return value.toUpperCase();
			}

			if (key === "volume")
				return t("units.percent", { value: Math.round(value * 100) });
			if (key === "line1Level" || key === "line2Level")
				return t("units.percent", { value: Math.round(value * 100) });
			if (key === "pitchBendRange")
				return t("units.semitones", { value: Math.round(value) });
			if (key === "vibratoDelay")
				return t("units.milliseconds", { value: Math.round(value) });
			if (key === "filterCutoff")
				return t("units.hertz", { value: Math.round(value) });
			if (key === "delayTime" || key === "portamentoTime")
				return t("units.seconds", { value: value.toFixed(2) });
			if (
				key === "chorusMix" ||
				key === "delayMix" ||
				key === "reverbMix" ||
				key === "reverbCharacter" ||
				key === "filterResonance" ||
				key === "filterEnvAmount"
			) {
				return t("units.decimal", { value });
			}
			if (
				key === "intPmAmount" ||
				key === "intPmRatio" ||
				key === "chorusRate" ||
				key === "chorusDepth" ||
				key === "reverbSize" ||
				key === "scopeVerticalZoom"
			) {
				return t("units.decimal", { value });
			}

			return Number.isInteger(value) ? `${value}` : value.toFixed(2);
		},
		[formatEngineValue, t],
	);

	const pushLcdControlReadout = useCallback(
		(key: string, value: unknown) => {
			const engineMeta = getEngineParamUiMeta(key);
			const label =
				engineMeta?.readoutLabel ??
				t(`lcdControls.${key}`, { defaultValue: key });
			if (
				typeof value !== "string" &&
				typeof value !== "number" &&
				typeof value !== "boolean"
			) {
				return;
			}

			setLcdControlReadout({
				label,
				value: formatValue(key, value),
			});
			if (lcdReadoutTimeoutRef.current != null) {
				window.clearTimeout(lcdReadoutTimeoutRef.current);
			}
			lcdReadoutTimeoutRef.current = window.setTimeout(() => {
				setLcdControlReadout(null);
			}, 1200);
		},
		[t, formatValue],
	);

	const formatEnvReadout = useCallback(
		(prev: StepEnvData, next: StepEnvData): string => {
			if (prev.stepCount !== next.stepCount) {
				return `STEPS ${next.stepCount}`;
			}
			if (prev.loop !== next.loop) {
				return `LOOP ${next.loop ? "ON" : "OFF"}`;
			}
			if (prev.sustainStep !== next.sustainStep) {
				return `SUS S${next.sustainStep + 1}`;
			}

			const maxSteps = Math.max(prev.steps.length, next.steps.length);
			for (let index = 0; index < maxSteps; index++) {
				const prevStep = prev.steps[index];
				const nextStep = next.steps[index];
				if (!nextStep) continue;
				if (
					!prevStep ||
					prevStep.level !== nextStep.level ||
					prevStep.rate !== nextStep.rate
				) {
					const level = Math.round(nextStep.level * 99);
					const rate = Math.round(nextStep.rate);
					return `S${index + 1} L${level} R${rate}`;
				}
			}

			const sustainIndex = Math.max(
				0,
				Math.min(next.sustainStep, next.steps.length - 1),
			);
			const sustain = next.steps[sustainIndex];
			const sustainLevel = Math.round((sustain?.level ?? 0) * 99);
			const sustainRate = Math.round(sustain?.rate ?? 0);
			return `S${sustainIndex + 1} L${sustainLevel} R${sustainRate}`;
		},
		[],
	);

	useEffect(() => {
		return () => {
			if (lcdReadoutTimeoutRef.current != null) {
				window.clearTimeout(lcdReadoutTimeoutRef.current);
			}
		};
	}, []);

	return {
		lcdControlReadout,
		pushLcdControlReadout,
		formatEnvReadout,
	};
}
