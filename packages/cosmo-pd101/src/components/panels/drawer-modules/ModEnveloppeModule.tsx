import { useEffect, useMemo, useRef, useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { MOD_ENV_PRESETS } from "@/lib/synth/modulePresets";
import { PARAM_META } from "@/lib/synth/paramMeta";
import {
	adsrPreviewPath,
	buildAdsrGeometry,
	envSecondsToNorm,
	estimateEnvelopeMarker,
	formatEnvTime,
	normToEnvSeconds,
} from "./modEnvelopePreview";
import { useModEnvelopePreviewDrag } from "./useModEnvelopePreviewDrag";

export default function ModEnveloppeModule() {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const [liveEnvValue, setLiveEnvValue] = useState(0);
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
	const attackMidiLearn = useMidiLearnTarget({
		targetKey: "modEnvAttackKnob",
		label: "Mod Env Attack",
		apply: (rawValue) => setModEnvAttack(normToEnvSeconds(rawValue / 127)),
	});
	const decayMidiLearn = useMidiLearnTarget({
		targetKey: "modEnvDecayKnob",
		label: "Mod Env Decay",
		apply: (rawValue) => setModEnvDecay(normToEnvSeconds(rawValue / 127)),
	});
	const releaseMidiLearn = useMidiLearnTarget({
		targetKey: "modEnvReleaseKnob",
		label: "Mod Env Release",
		apply: (rawValue) => setModEnvRelease(normToEnvSeconds(rawValue / 127)),
	});

	useEffect(() => {
		const onRuntimeModSources = (event: Event) => {
			const detail = (event as CustomEvent<{ modEnv?: number } | undefined>)
				.detail;
			if (!detail || !Number.isFinite(detail.modEnv)) {
				return;
			}
			setLiveEnvValue((previous) => {
				prevLiveEnvValueRef.current = previous;
				return Math.max(0, Math.min(1, detail.modEnv ?? 0));
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

	const { setDragHandle } = useModEnvelopePreviewDrag({
		envGeometry,
		previewSvgRef,
		setModEnvAttack,
		setModEnvDecay,
		setModEnvSustain,
		setModEnvRelease,
	});

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
				onClick={attackMidiLearn.onClick}
				onContextMenu={attackMidiLearn.onContextMenu}
				interactionLocked={attackMidiLearn.interactionLocked}
				midiLearnState={attackMidiLearn.midiLearnState}
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
				onClick={decayMidiLearn.onClick}
				onContextMenu={decayMidiLearn.onContextMenu}
				interactionLocked={decayMidiLearn.interactionLocked}
				midiLearnState={decayMidiLearn.midiLearnState}
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
				onClick={releaseMidiLearn.onClick}
				onContextMenu={releaseMidiLearn.onContextMenu}
				interactionLocked={releaseMidiLearn.interactionLocked}
				midiLearnState={releaseMidiLearn.midiLearnState}
			/>
		</ModuleFrame>
	);
}
