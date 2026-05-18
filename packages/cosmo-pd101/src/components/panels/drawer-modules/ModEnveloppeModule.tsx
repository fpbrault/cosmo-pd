import { useEffect, useMemo, useRef, useState } from "react";
import { ControlKnob } from "@/components/controls/ControlKnob";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { MOD_ENV_PRESETS } from "@/lib/synth/modulePresets";
import { PARAM_META } from "@/lib/synth/paramMeta";

const MOD_ENV_TIME_MAX_S = 20;
const MOD_ENV_TIME_EXPONENT = 3.91073; // 50% travel ~= 1.33s
const MOD_ENV_PREVIEW_WIDTH = 220;
const MOD_ENV_PREVIEW_HEIGHT = 64;
const MOD_ENV_X0 = 6;
const MOD_ENV_X_MAX = MOD_ENV_PREVIEW_WIDTH - 6;
const MOD_ENV_TOP = 8;
const MOD_ENV_BOTTOM = 56;
const MOD_ENV_SUSTAIN_SPAN = (MOD_ENV_BOTTOM - MOD_ENV_TOP) * 0.78;

// Doubled from the previous tuning values.
const ATTACK_WIDTH_SCALE = 84;
const DECAY_WIDTH_SCALE = 66;
const RELEASE_WIDTH_SCALE = 92;

type EnvelopeHandle = "attack" | "decaySustain" | "release";

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, value));
}

function normToEnvSeconds(norm: number): number {
	return MOD_ENV_TIME_MAX_S * clamp01(norm) ** MOD_ENV_TIME_EXPONENT;
}

function envSecondsToNorm(seconds: number): number {
	if (seconds <= 0) {
		return 0;
	}
	return clamp01((seconds / MOD_ENV_TIME_MAX_S) ** (1 / MOD_ENV_TIME_EXPONENT));
}

function formatCompactValue(value: number): string {
	if (!Number.isFinite(value) || value <= 0) {
		return "0";
	}
	if (value >= 100) {
		return value.toFixed(0);
	}
	if (value >= 10) {
		return value.toFixed(1);
	}
	if (value >= 1) {
		return value.toFixed(2);
	}
	return value.toFixed(3);
}

function formatEnvTime(seconds: number): string {
	if (seconds < 1) {
		return `${Math.round(seconds * 1000)}ms`;
	}
	return `${formatCompactValue(seconds)}s`;
}

function adsrPreviewPath(
	attack: number,
	decay: number,
	sustain: number,
	release: number,
): string {
	const { x0, x1, x2, x3, x4, top, bottom, ySustain } = buildAdsrGeometry(
		attack,
		decay,
		sustain,
		release,
	);

	return [
		`M ${x0.toFixed(2)} ${bottom.toFixed(2)}`,
		`L ${x1.toFixed(2)} ${top.toFixed(2)}`,
		`L ${x2.toFixed(2)} ${ySustain.toFixed(2)}`,
		`L ${x3.toFixed(2)} ${ySustain.toFixed(2)}`,
		`L ${x4.toFixed(2)} ${bottom.toFixed(2)}`,
	].join(" ");
}

function buildAdsrGeometry(
	attack: number,
	decay: number,
	sustain: number,
	release: number,
) {
	const top = MOD_ENV_TOP;
	const bottom = MOD_ENV_BOTTOM;
	const x0 = MOD_ENV_X0;
	const xMax = MOD_ENV_X_MAX;

	// Moderate widening (compared to the original) without forcing full width.
	const aW = Math.max(0, Math.log10(attack + 1) * ATTACK_WIDTH_SCALE);
	const dW = Math.max(12, Math.log10(decay + 1) * DECAY_WIDTH_SCALE);
	const rW = Math.max(0, Math.log10(release + 1) * RELEASE_WIDTH_SCALE);

	const x1 = x0 + aW;
	const x2 = x1 + dW;
	const x3 = x2; // Sustain has no intrinsic length; represent it as a point.
	const x4 = Math.min(xMax, x3 + rW);

	const ySustain = bottom - clamp01(sustain) * MOD_ENV_SUSTAIN_SPAN;

	return { x0, x1, x2, x3, x4, top, bottom, ySustain };
}

function widthToSeconds(width: number, scale: number): number {
	if (width <= 0) {
		return 0;
	}
	return Math.min(MOD_ENV_TIME_MAX_S, Math.max(0, 10 ** (width / scale) - 1));
}

function clientToSvgPoint(event: PointerEvent, svg: SVGSVGElement) {
	const rect = svg.getBoundingClientRect();
	const x = ((event.clientX - rect.left) / rect.width) * MOD_ENV_PREVIEW_WIDTH;
	const y = ((event.clientY - rect.top) / rect.height) * MOD_ENV_PREVIEW_HEIGHT;
	return { x, y };
}

function estimateEnvelopeMarker(
	geo: ReturnType<typeof buildAdsrGeometry>,
	value: number,
	prevValue: number,
	sustain: number,
	prevMarkerX: number | null,
) {
	const envValue = clamp01(value);
	const prev = clamp01(prevValue);
	const delta = envValue - prev;
	const slopeEpsilon = 0.00001;

	const attackX = geo.x0 + (geo.x1 - geo.x0) * envValue;
	const decayX =
		geo.x1 +
		(geo.x2 - geo.x1) * clamp01((1 - envValue) / Math.max(0.001, 1 - sustain));
	const releaseX =
		geo.x3 +
		(geo.x4 - geo.x3) *
			clamp01((sustain - envValue) / Math.max(0.001, sustain));

	let x = geo.x0;
	if (envValue <= 0.001) {
		x = geo.x0;
	} else if (delta > slopeEpsilon) {
		x = attackX;
	} else if (delta < -slopeEpsilon) {
		x = envValue > sustain + 0.02 ? decayX : releaseX;
	} else if (Math.abs(envValue - sustain) <= 0.03) {
		x = geo.x3;
	} else {
		const candidates = [attackX, decayX, geo.x3, releaseX].filter((candidate) =>
			Number.isFinite(candidate),
		);
		if (prevMarkerX == null || candidates.length === 0) {
			x = geo.x3;
		} else {
			x = candidates.reduce((closest, candidate) => {
				return Math.abs(candidate - prevMarkerX) <
					Math.abs(closest - prevMarkerX)
					? candidate
					: closest;
			});
		}
	}

	const y = envelopeYAtX(geo, x);
	return { x, y };
}

function interpolateY(
	x: number,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
) {
	if (Math.abs(x1 - x0) < 1e-6) {
		return y1;
	}
	const t = (x - x0) / (x1 - x0);
	return y0 + (y1 - y0) * t;
}

function envelopeYAtX(geo: ReturnType<typeof buildAdsrGeometry>, x: number) {
	const clampedX = Math.max(geo.x0, Math.min(geo.x4, x));

	if (clampedX <= geo.x1) {
		return interpolateY(clampedX, geo.x0, geo.bottom, geo.x1, geo.top);
	}

	if (clampedX <= geo.x2) {
		return interpolateY(clampedX, geo.x1, geo.top, geo.x2, geo.ySustain);
	}

	if (clampedX <= geo.x3) {
		return geo.ySustain;
	}

	return interpolateY(clampedX, geo.x3, geo.ySustain, geo.x4, geo.bottom);
}

export default function ModEnveloppeModule() {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const [liveEnvValue, setLiveEnvValue] = useState(0);
	const [dragHandle, setDragHandle] = useState<EnvelopeHandle | null>(null);
	const previewSvgRef = useRef<SVGSVGElement | null>(null);
	const prevLiveEnvValueRef = useRef(0);
	const prevMarkerXRef = useRef<number | null>(null);
	const { value: modEnvAttack, setValue: setModEnvAttack } =
		useSynthParam("modEnvAttack");
	const { value: modEnvDecay, setValue: setModEnvDecay } =
		useSynthParam("modEnvDecay");
	const { value: modEnvSustain, setValue: setModEnvSustain } =
		useSynthParam("modEnvSustain");
	const { value: modEnvRelease, setValue: setModEnvRelease } =
		useSynthParam("modEnvRelease");
	const attackNorm = envSecondsToNorm(modEnvAttack as number);
	const decayNorm = envSecondsToNorm(modEnvDecay as number);
	const releaseNorm = envSecondsToNorm(modEnvRelease as number);

	useEffect(() => {
		const onRuntimeModSources = (event: Event) => {
			const detail = (event as CustomEvent<{ modEnv?: number } | undefined>)
				.detail;
			if (!detail || !Number.isFinite(detail.modEnv)) {
				return;
			}
			setLiveEnvValue((previous) => {
				prevLiveEnvValueRef.current = previous;
				return clamp01(detail.modEnv ?? 0);
			});
		};

		window.addEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		return () => {
			window.removeEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		};
	}, []);

	const envGeometry = useMemo(
		() =>
			buildAdsrGeometry(
				modEnvAttack as number,
				modEnvDecay as number,
				modEnvSustain as number,
				modEnvRelease as number,
			),
		[modEnvAttack, modEnvDecay, modEnvRelease, modEnvSustain],
	);
	const envMarker = useMemo(
		() =>
			estimateEnvelopeMarker(
				envGeometry,
				liveEnvValue,
				prevLiveEnvValueRef.current,
				modEnvSustain as number,
				prevMarkerXRef.current,
			),
		[envGeometry, liveEnvValue, modEnvSustain],
	);

	useEffect(() => {
		prevMarkerXRef.current = envMarker.x;
	}, [envMarker.x]);

	useEffect(() => {
		if (!dragHandle) {
			return;
		}

		const onPointerMove = (event: PointerEvent) => {
			const svg = previewSvgRef.current;
			if (!svg) {
				return;
			}

			const point = clientToSvgPoint(event, svg);
			const geo = envGeometry;

			if (dragHandle === "attack") {
				const x = Math.max(geo.x0, Math.min(geo.x2 - 2, point.x));
				setModEnvAttack(widthToSeconds(x - geo.x0, ATTACK_WIDTH_SCALE));
				return;
			}

			if (dragHandle === "decaySustain") {
				const x = Math.max(geo.x1 + 2, Math.min(geo.x4 - 2, point.x));
				const y = Math.max(geo.top, Math.min(geo.bottom, point.y));
				setModEnvDecay(widthToSeconds(x - geo.x1, DECAY_WIDTH_SCALE));
				setModEnvSustain(clamp01((geo.bottom - y) / MOD_ENV_SUSTAIN_SPAN));
				return;
			}

			const x = Math.max(geo.x3 + 2, Math.min(MOD_ENV_X_MAX, point.x));
			setModEnvRelease(widthToSeconds(x - geo.x3, RELEASE_WIDTH_SCALE));
		};

		const onPointerUp = () => {
			setDragHandle(null);
		};

		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
		};
	}, [
		dragHandle,
		envGeometry,
		setModEnvAttack,
		setModEnvDecay,
		setModEnvRelease,
		setModEnvSustain,
	]);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = MOD_ENV_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setModEnvAttack(preset.patch.modEnv.attack);
		setModEnvDecay(preset.patch.modEnv.decay);
		setModEnvSustain(preset.patch.modEnv.sustain);
		setModEnvRelease(preset.patch.modEnv.release);
		requestApplyModulePreset({
			module: "modEnv",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Mod Env"
			color="#c24587"
			enabled
			headerControl={
				<ModulePresetPopover
					title="Mod Env Presets"
					accentColor="#c24587"
					value={selectedPreset}
					options={MOD_ENV_PRESETS}
					onChange={handlePresetChange}
				/>
			}
		>
			<div className="col-span-4 rounded-md border border-cz-border/55 bg-cz-bg/35 px-2 py-1.5">
				<svg ref={previewSvgRef} viewBox="0 0 220 64" className="h-16 w-full">
					<title>Modulation envelope preview</title>
					<defs>
						<linearGradient id="mod-env-preview" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="#c24587" stopOpacity="0.55" />
							<stop offset="100%" stopColor="#c24587" stopOpacity="0.9" />
						</linearGradient>
					</defs>
					<line
						x1="0"
						y1="56"
						x2="220"
						y2="56"
						stroke="rgba(255,255,255,0.1)"
						strokeWidth="1"
					/>
					<path
						d={adsrPreviewPath(
							modEnvAttack as number,
							modEnvDecay as number,
							modEnvSustain as number,
							modEnvRelease as number,
						)}
						fill="none"
						stroke="url(#mod-env-preview)"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<g>
						<circle
							cx={envGeometry.x1}
							cy={envGeometry.top}
							r={8}
							fill="transparent"
							onPointerDown={() => setDragHandle("attack")}
							style={{ cursor: "ew-resize" }}
						/>
						<circle
							cx={envGeometry.x1}
							cy={envGeometry.top}
							r={3.5}
							fill="#2a2a2a"
							stroke="#c24587"
							strokeWidth="1.4"
							pointerEvents="none"
						/>
						<circle
							cx={envGeometry.x2}
							cy={envGeometry.ySustain}
							r={8}
							fill="transparent"
							onPointerDown={() => setDragHandle("decaySustain")}
							style={{ cursor: "move" }}
						/>
						<circle
							cx={envGeometry.x2}
							cy={envGeometry.ySustain}
							r={3.5}
							fill="#2a2a2a"
							stroke="#c24587"
							strokeWidth="1.4"
							pointerEvents="none"
						/>
						<circle
							cx={envGeometry.x4}
							cy={envGeometry.bottom}
							r={8}
							fill="transparent"
							onPointerDown={() => setDragHandle("release")}
							style={{ cursor: "ew-resize" }}
						/>
						<circle
							cx={envGeometry.x4}
							cy={envGeometry.bottom}
							r={3.5}
							fill="#2a2a2a"
							stroke="#c24587"
							strokeWidth="1.4"
							pointerEvents="none"
						/>
					</g>
					<circle
						cx={envMarker.x}
						cy={envMarker.y}
						r={3}
						fill="#c24587"
						stroke="rgba(10,10,10,0.85)"
						strokeWidth="1"
					/>
				</svg>
			</div>
			<ControlKnob
				value={attackNorm}
				onChange={(nextNorm) => setModEnvAttack(normToEnvSeconds(nextNorm))}
				min={0}
				max={1}
				defaultValue={envSecondsToNorm(0.01)}
				color="#c24587"
				label="Atk"
				tooltip={PARAM_META.modEnvAttack?.tooltip}
				valueFormatter={(nextNorm) => formatEnvTime(normToEnvSeconds(nextNorm))}
			/>
			<ControlKnob
				value={decayNorm}
				onChange={(nextNorm) => setModEnvDecay(normToEnvSeconds(nextNorm))}
				min={0}
				max={1}
				defaultValue={envSecondsToNorm(0.2)}
				color="#c24587"
				label="Dec"
				tooltip={PARAM_META.modEnvDecay?.tooltip}
				valueFormatter={(nextNorm) => formatEnvTime(normToEnvSeconds(nextNorm))}
			/>
			<SynthParamKnob
				paramKey="modEnvSustain"
				value={modEnvSustain as number}
				onChange={setModEnvSustain}
				color="#c24587"
				label="Sus"
				valueFormatter={(value) => `${Math.round((value as number) * 100)}%`}
			/>
			<ControlKnob
				value={releaseNorm}
				onChange={(nextNorm) => setModEnvRelease(normToEnvSeconds(nextNorm))}
				min={0}
				max={1}
				defaultValue={envSecondsToNorm(0.4)}
				color="#c24587"
				label="Rel"
				tooltip={PARAM_META.modEnvRelease?.tooltip}
				valueFormatter={(nextNorm) => formatEnvTime(normToEnvSeconds(nextNorm))}
			/>
		</ModuleFrame>
	);
}
