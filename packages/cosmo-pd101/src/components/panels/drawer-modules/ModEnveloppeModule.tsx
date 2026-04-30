import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { MOD_ENV_PRESETS } from "@/lib/synth/modulePresets";
import { PARAM_META } from "@/lib/synth/paramMeta";

export default function ModEnveloppeModule() {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const { value: modEnvAttack, setValue: setModEnvAttack } =
		useSynthParam("modEnvAttack");
	const { value: modEnvDecay, setValue: setModEnvDecay } =
		useSynthParam("modEnvDecay");
	const { value: modEnvSustain, setValue: setModEnvSustain } =
		useSynthParam("modEnvSustain");
	const { value: modEnvRelease, setValue: setModEnvRelease } =
		useSynthParam("modEnvRelease");

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
			<ControlKnob
				value={modEnvAttack}
				onChange={setModEnvAttack}
				min={0}
				max={10}
				defaultValue={0.01}
				size={52}
				color="#c24587"
				label="Atk"
				tooltip={PARAM_META.modEnvAttack?.tooltip}
				valueFormatter={(v) => `${v?.toFixed(2)}s`}
			/>
			<ControlKnob
				value={modEnvDecay}
				onChange={setModEnvDecay}
				min={0}
				max={10}
				defaultValue={0.1}
				size={52}
				color="#c24587"
				label="Dec"
				tooltip={PARAM_META.modEnvDecay?.tooltip}
				valueFormatter={(v) => `${v?.toFixed(2)}s`}
			/>
			<ControlKnob
				value={modEnvSustain}
				onChange={setModEnvSustain}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color="#c24587"
				label="Sus"
				tooltip={PARAM_META.modEnvSustain?.tooltip}
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={modEnvRelease}
				onChange={setModEnvRelease}
				min={0}
				max={10}
				defaultValue={0.2}
				size={52}
				color="#c24587"
				label="Rel"
				tooltip={PARAM_META.modEnvRelease?.tooltip}
				valueFormatter={(v) => `${v?.toFixed(2)}s`}
			/>
		</ModuleFrame>
	);
}
