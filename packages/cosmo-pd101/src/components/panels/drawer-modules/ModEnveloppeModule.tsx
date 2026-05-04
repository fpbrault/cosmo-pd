import { useState } from "react";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { MOD_ENV_PRESETS } from "@/lib/synth/modulePresets";

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
			<SynthParamKnob
				paramKey="modEnvAttack"
				value={modEnvAttack}
				onChange={setModEnvAttack}
				color="#c24587"
				label="Atk"
			/>
			<SynthParamKnob
				paramKey="modEnvDecay"
				value={modEnvDecay}
				onChange={setModEnvDecay}
				color="#c24587"
				label="Dec"
			/>
			<SynthParamKnob
				paramKey="modEnvSustain"
				value={modEnvSustain}
				onChange={setModEnvSustain}
				color="#c24587"
				label="Sus"
			/>
			<SynthParamKnob
				paramKey="modEnvRelease"
				value={modEnvRelease}
				onChange={setModEnvRelease}
				color="#c24587"
				label="Rel"
			/>
		</ModuleFrame>
	);
}
