import { useEffect, useMemo, useRef, useState } from "react";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModEnvDisplay from "@/components/panels/drawer-modules/ModEnvDisplay";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { MOD_ENV_PRESETS } from "@/lib/synth/modulePresets";
import {
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
			presetTitle="Mod Env Presets"
			presetValue={selectedPreset}
			presetOptions={MOD_ENV_PRESETS}
			onPresetChange={handlePresetChange}
		>
			<ModEnvDisplay
				previewSvgRef={previewSvgRef}
				envGeometry={envGeometry}
				envMarker={envMarker}
				attack={modEnvAttack as number}
				decay={modEnvDecay as number}
				sustain={modEnvSustain as number}
				release={modEnvRelease as number}
				onDragHandle={setDragHandle}
			/>
			<SynthParamKnob
				paramKey="modEnvAttack"
				color="#c24587"
				label="Atk"
				midiTargetKey="modEnvAttackKnob"
				midiLabel="Mod Env Attack"
				uiTransform={{
					toControlValue: envSecondsToNorm,
					fromControlValue: normToEnvSeconds,
					min: 0,
					max: 1,
					defaultValue: envSecondsToNorm(0.01),
					valueFormatter: (_controlValue, engineValue) =>
						formatEnvTime(engineValue),
				}}
			/>
			<SynthParamKnob
				paramKey="modEnvDecay"
				color="#c24587"
				label="Dec"
				midiTargetKey="modEnvDecayKnob"
				midiLabel="Mod Env Decay"
				uiTransform={{
					toControlValue: envSecondsToNorm,
					fromControlValue: normToEnvSeconds,
					min: 0,
					max: 1,
					defaultValue: envSecondsToNorm(0.2),
					valueFormatter: (_controlValue, engineValue) =>
						formatEnvTime(engineValue),
				}}
			/>
			<SynthParamKnob
				paramKey="modEnvSustain"
				color="#c24587"
				label="Sus"
				valueFormatter={(value) => `${Math.round((value as number) * 100)}%`}
			/>
			<SynthParamKnob
				paramKey="modEnvRelease"
				color="#c24587"
				label="Rel"
				midiTargetKey="modEnvReleaseKnob"
				midiLabel="Mod Env Release"
				uiTransform={{
					toControlValue: envSecondsToNorm,
					fromControlValue: normToEnvSeconds,
					min: 0,
					max: 1,
					defaultValue: envSecondsToNorm(0.4),
					valueFormatter: (_controlValue, engineValue) =>
						formatEnvTime(engineValue),
				}}
			/>
		</ModuleFrame>
	);
}
