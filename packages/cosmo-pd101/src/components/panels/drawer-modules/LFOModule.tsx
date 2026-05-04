import { useState } from "react";
import Button from "@/components/controls/Button";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";
import { getLfoModulePatch, LFO_PRESETS } from "@/lib/synth/modulePresets";
import { PARAM_META } from "@/lib/synth/paramMeta";

interface LfoModuleProps {
	id: 1 | 2;
	color: string;
}

export default function LfoModule({ id, color }: LfoModuleProps) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const lfoWaveformKey = id === 1 ? "lfoWaveform" : "lfo2Waveform";
	const lfoRateKey = id === 1 ? "lfoRate" : "lfo2Rate";
	const lfoDepthKey = id === 1 ? "lfoDepth" : "lfo2Depth";
	const lfoSymmetryKey = id === 1 ? "lfoSymmetry" : "lfo2Symmetry";
	const lfoRetriggerKey = id === 1 ? "lfoRetrigger" : "lfo2Retrigger";
	const lfoOffsetKey = id === 1 ? "lfoOffset" : "lfo2Offset";

	const { value: lfoWaveform, setValue: setLfoWaveform } =
		useSynthParam(lfoWaveformKey);
	const { value: lfoRate, setValue: setLfoRate } = useSynthParam(lfoRateKey);
	const { value: lfoDepth, setValue: setLfoDepth } = useSynthParam(lfoDepthKey);
	const { value: lfoSymmetry, setValue: setLfoSymmetry } =
		useSynthParam(lfoSymmetryKey);
	const { value: lfoRetrigger, setValue: setLfoRetrigger } =
		useSynthParam(lfoRetriggerKey);
	const { value: lfoOffset, setValue: setLfoOffset } =
		useSynthParam(lfoOffsetKey);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = LFO_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setLfoWaveform(preset.patch.waveform);
		setLfoRate(preset.patch.rate);
		setLfoDepth(preset.patch.depth);
		setLfoSymmetry(preset.patch.symmetry);
		setLfoRetrigger(preset.patch.retrigger);
		setLfoOffset(preset.patch.offset);
		requestApplyModulePreset({
			module: id === 1 ? "lfo1" : "lfo2",
			preset: preset.id,
			patch: getLfoModulePatch(id, preset.patch),
		});
	};

	return (
		<ModuleFrame
			title={`LFO ${id}`}
			color={color}
			enabled
			headerControl={
				<ModulePresetPopover
					title={`LFO ${id} Presets`}
					value={selectedPreset}
					options={LFO_PRESETS}
					onChange={handlePresetChange}
				/>
			}
		>
			<div className="grid grid-cols-3 justify-center col-span-4 gap-1">
				{(
					[
						["sine", "sine"],
						["tri", "triangle"],
						["sq", "square"],
						["saw", "saw"],
						["inv", "invertedSaw"],
						["rnd", "random"],
					] as const
				).map(([label, w]) => (
					<Button
						key={w}
						className={`btn btn-xs grow ${
							lfoWaveform === w ? "btn-secondary" : "btn-outline"
						}`}
						onClick={() => setLfoWaveform(w)}
						title={`Select ${label} waveform for LFO ${id}.`}
					>
						{label}
					</Button>
				))}
			</div>
			<SynthParamKnob
				paramKey={lfoRateKey}
				value={lfoRate}
				onChange={setLfoRate}
				color="#27588f"
				label="Rate"
				modDestination={resolveTargetFromMetadata("lfo.rate", { lfoIndex: id })}
			/>
			<SynthParamKnob
				paramKey={lfoDepthKey}
				value={lfoDepth}
				onChange={setLfoDepth}
				color="#27588f"
				label="Depth"
				modDestination={resolveTargetFromMetadata("lfo.depth", {
					lfoIndex: id,
				})}
			/>
			<SynthParamKnob
				paramKey={lfoOffsetKey}
				value={lfoOffset}
				onChange={setLfoOffset}
				color="#27588f"
				label="Offset"
				modDestination={resolveTargetFromMetadata("lfo.offset", {
					lfoIndex: id,
				})}
			/>
			<SynthParamKnob
				paramKey={lfoSymmetryKey}
				value={lfoSymmetry}
				onChange={setLfoSymmetry}
				color="#27588f"
				label="Sym."
				modDestination={resolveTargetFromMetadata("lfo.symmetry", {
					lfoIndex: id,
				})}
			/>
			<Button
				className={`btn btn-xs px-2 col-span-4 w-fit justify-self-center ${
					lfoRetrigger ? "btn-secondary" : "btn-outline"
				}`}
				onClick={() => setLfoRetrigger(!lfoRetrigger)}
				title={PARAM_META[lfoRetriggerKey as SynthParamKey]?.tooltip}
			>
				Retrig
			</Button>
		</ModuleFrame>
	);
}
