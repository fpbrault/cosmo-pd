import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModEnvDisplay from "@/components/panels/drawer-modules/ModEnvDisplay";
import BadgeToggle from "@/components/primitives/BadgeToggle";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { ModEnvMode } from "@/lib/synth/bindings/synth";
import { MOD_ENV_PRESET_DATA } from "@/lib/synth/bindings/synth";
import { MOD_ENV_MODE_TOOLTIPS } from "@/lib/synth/paramMeta";
import {
	buildAdsrGeometry,
	envSecondsToNorm,
	estimateEnvelopeMarker,
	formatEnvTime,
	normToEnvSeconds,
} from "./modEnvelopePreview";
import { useModEnvelopePreviewDrag } from "./useModEnvelopePreviewDrag";

export default function ModEnveloppeModule() {
	const { t } = useTranslation("synth");
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
	const { value: modEnvMode, setValue: setModEnvMode } =
		useSynthParam("modEnvMode");
	const isAdr = modEnvMode === "adr";

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
				modEnvMode,
			),
		[modEnvAttack, modEnvDecay, modEnvMode, modEnvRelease, modEnvSustain],
	);
	const effectiveSustain = isAdr ? 0 : (modEnvSustain as number);
	const envMarker = useMemo(
		() =>
			estimateEnvelopeMarker(
				envGeometry,
				liveEnvValue,
				prevLiveEnvValueRef.current,
				effectiveSustain,
				prevMarkerXRef.current,
			),
		[effectiveSustain, envGeometry, liveEnvValue],
	);

	useEffect(() => {
		prevMarkerXRef.current = envMarker.x;
	}, [envMarker.x]);

	const { setDragHandle } = useModEnvelopePreviewDrag({
		envGeometry,
		previewSvgRef,
		mode: modEnvMode,
		setModEnvAttack,
		setModEnvDecay,
		setModEnvSustain,
		setModEnvRelease,
	});

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = MOD_ENV_PRESET_DATA.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setModEnvAttack(preset.params.attack as number);
		setModEnvDecay(preset.params.decay as number);
		setModEnvSustain(preset.params.sustain as number);
		setModEnvRelease(preset.params.release as number);
		setModEnvMode((preset.params.mode ?? "adsr") as ModEnvMode);
		requestApplyModulePreset({
			module: "modEnv",
			preset: preset.id,
			patch: preset.params as Record<string, unknown>,
		});
	};

	return (
		<ModuleFrame
			title={t("modEnv.title")}
			color="#c24587"
			enabled
			hideToggle
			presetValue={selectedPreset}
			presetOptions={MOD_ENV_PRESET_DATA}
			onPresetChange={handlePresetChange}
		>
				<BadgeToggle
				active={isAdr}
				label="ADR"
				className="col-span-full text-nowrap px-0"
				onClick={() => setModEnvMode(isAdr ? "adsr" : "adr")}
				tooltip={MOD_ENV_MODE_TOOLTIPS[isAdr ? "adr" : "adsr"]}
			/>
			<ModEnvDisplay
				previewSvgRef={previewSvgRef}
				envGeometry={envGeometry}
				envMarker={envMarker}
				attack={modEnvAttack as number}
				decay={modEnvDecay as number}
				sustain={modEnvSustain as number}
				release={modEnvRelease as number}
				mode={modEnvMode}
				onDragHandle={setDragHandle}
			/>

			<SynthParamKnob
				paramKey="modEnvAttack"
				color="#c24587"
				label={t("modEnv.attack")}
				midiTargetKey="modEnvAttackKnob"
				midiLabel={t("modEnv.attackMidi")}
				size={64}
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
				label={t("modEnv.decay")}
				midiTargetKey="modEnvDecayKnob"
				midiLabel={t("modEnv.decayMidi")}
				size={64}
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
				size={64}
				disabled={isAdr}
				label={t("modEnv.sustain")}
				valueFormatter={(value) => `${Math.round((value as number) * 100)}%`}
			/>

			<SynthParamKnob
				paramKey="modEnvRelease"
				color="#c24587"
				label={t("modEnv.release")}
				midiTargetKey="modEnvReleaseKnob"
				midiLabel={t("modEnv.releaseMidi")}
				size={64}
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
