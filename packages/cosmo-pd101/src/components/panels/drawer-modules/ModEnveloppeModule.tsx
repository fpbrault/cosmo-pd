import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModEnvDisplay from "@/components/panels/drawer-modules/ModEnvDisplay";
import BadgeToggle from "@/components/primitives/BadgeToggle";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import {
	EMPTY_RUNTIME_VOICE_STATES,
	type RuntimeVoiceDebugState,
} from "@/features/synth/hooks/useAudioEngine";
import {
	useOptionalSynthController,
	useSynthParam,
} from "@/features/synth/SynthParamController";
import type { ModEnvMode, ModEnvRetrigMode } from "@/lib/synth/bindings/synth";
import { MOD_ENV_PRESET_DATA } from "@/lib/synth/bindings/synth";
import {
	MOD_ENV_MODE_TOOLTIPS,
	MOD_ENV_RETRIG_MODE_TOOLTIPS,
} from "@/lib/synth/paramMeta";
import {
	buildAdsrGeometry,
	envSecondsToNorm,
	estimateEnvelopeMarkerForPhase,
	formatEnvTime,
	normToEnvSeconds,
} from "./modEnvelopePreview";
import { useModEnvelopePreviewDrag } from "./useModEnvelopePreviewDrag";

export default function ModEnveloppeModule() {
	const { t } = useTranslation("synth");
	const synthController = useOptionalSynthController();
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const [liveVoiceStates, setLiveVoiceStates] = useState<
		ReadonlyArray<RuntimeVoiceDebugState>
	>(() => synthController?.getLiveVoiceStates() ?? EMPTY_RUNTIME_VOICE_STATES);
	const previewSvgRef = useRef<SVGSVGElement | null>(null);
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
	const { value: modEnvRetrigMode, setValue: setModEnvRetrigMode } =
		useSynthParam("modEnvRetrigMode");
	const isAdr = modEnvMode === "adr";

	useEffect(() => {
		const unregisterLiveVoiceStates =
			synthController?.registerLiveVoiceStatesConsumer();
		setLiveVoiceStates(
			synthController?.getLiveVoiceStates() ?? EMPTY_RUNTIME_VOICE_STATES,
		);

		const onRuntimeVoiceStates = (event: Event) => {
			const detail = (
				event as CustomEvent<RuntimeVoiceDebugState[] | undefined>
			).detail;
			if (!detail) {
				return;
			}
			setLiveVoiceStates(detail);
		};

		window.addEventListener("cz-runtime-voice-states", onRuntimeVoiceStates);
		return () => {
			unregisterLiveVoiceStates?.();
			window.removeEventListener(
				"cz-runtime-voice-states",
				onRuntimeVoiceStates,
			);
		};
	}, [synthController]);

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
	const effectiveSustain = modEnvSustain as number;
	const envMarkers = useMemo(() => {
		const activeVoices = liveVoiceStates.filter(
			(voice) =>
				voice.active ||
				voice.isReleasing ||
				voice.modEnv.value > 0.001 ||
				voice.modEnv.phase !== "idle",
		);
		const markerVoices =
			modEnvRetrigMode === "poly" ? activeVoices : activeVoices.slice(0, 1);
		return markerVoices.map((voice) => ({
			id: modEnvRetrigMode === "poly" ? voice.index : "shared",
			releasing: voice.modEnv.releasing || voice.modEnv.phase === "release",
			...estimateEnvelopeMarkerForPhase(
				envGeometry,
				voice.modEnv.value,
				effectiveSustain,
				voice.modEnv.phase,
			),
		}));
	}, [effectiveSustain, envGeometry, liveVoiceStates, modEnvRetrigMode]);

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
		setModEnvRetrigMode(
			(preset.params.retrigMode ?? "poly") as ModEnvRetrigMode,
		);
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
			<div className="col-span-full flex gap-2">
				<BadgeToggle
					active={isAdr}
					label="ADR"
					className="text-nowrap px-0"
					onClick={() => setModEnvMode(isAdr ? "adsr" : "adr")}
					tooltip={MOD_ENV_MODE_TOOLTIPS[isAdr ? "adr" : "adsr"]}
				/>
				<div className="join">
					{(["poly", "mono", "legato"] as const).map((mode) => (
						<button
							key={mode}
							type="button"
							className={`join-item btn btn-xs ${
								modEnvRetrigMode === mode ? "btn-primary" : ""
							}`}
							onClick={() => setModEnvRetrigMode(mode)}
							title={MOD_ENV_RETRIG_MODE_TOOLTIPS[mode]}
						>
							{mode === "poly" ? "Poly" : mode === "mono" ? "Mono" : "Legato"}
						</button>
					))}
				</div>
			</div>
			<ModEnvDisplay
				previewSvgRef={previewSvgRef}
				envGeometry={envGeometry}
				envMarkers={envMarkers}
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
