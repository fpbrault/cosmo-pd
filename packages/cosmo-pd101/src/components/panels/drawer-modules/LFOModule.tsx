import { useState } from "react";
import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { getLfoModulePatch, LFO_PRESETS } from "@/lib/synth/modulePresets";
import { PARAM_META } from "@/lib/synth/paramMeta";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";

interface LfoModuleProps {
	id: 1 | 2;
	color: string;
}

export default function LfoModule({ id, color }: LfoModuleProps) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	// Dynamically resolve the parameter names based on the LFO id
	const prefix = id === 1 ? "lfo" : "lfo2";
	const lfoParamTooltip = (suffix: string) =>
		PARAM_META[`${prefix}${suffix}` as SynthParamKey]?.tooltip;

	const { value: lfoWaveform, setValue: setLfoWaveform } = useSynthParam(
		`${prefix}Waveform`,
	);
	const { value: lfoRate, setValue: setLfoRate } = useSynthParam(
		`${prefix}Rate`,
	);
	const { value: lfoDepth, setValue: setLfoDepth } = useSynthParam(
		`${prefix}Depth`,
	);
	const { value: lfoSymmetry, setValue: setLfoSymmetry } = useSynthParam(
		`${prefix}Symmetry`,
	);
	const { value: lfoRetrigger, setValue: setLfoRetrigger } = useSynthParam(
		`${prefix}Retrigger`,
	);
	const { value: lfoOffset, setValue: setLfoOffset } = useSynthParam(
		`${prefix}Offset`,
	);

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
					secondaryColor={color}
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
			<ControlKnob
				value={lfoRate}
				onChange={setLfoRate}
				min={0}
				max={20}
				defaultValue={5}
				size={40}
				color="#27588f"
				label="Rate"
				tooltip={lfoParamTooltip("Rate")}
				modDestination={resolveTargetFromMetadata("lfo.rate", { lfoIndex: id })}
				valueFormatter={(v) => `${v.toFixed(1)}Hz`}
			/>
			<ControlKnob
				value={lfoDepth}
				onChange={setLfoDepth}
				min={0}
				max={1}
				defaultValue={1.0}
				size={40}
				color="#27588f"
				label="Depth"
				tooltip={lfoParamTooltip("Depth")}
				modDestination={resolveTargetFromMetadata("lfo.depth", {
					lfoIndex: id,
				})}
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={lfoOffset}
				onChange={setLfoOffset}
				min={-1}
				max={1}
				defaultValue={0}
				size={40}
				color="#27588f"
				label="Offset"
				tooltip={lfoParamTooltip("Offset")}
				modDestination={resolveTargetFromMetadata("lfo.offset", {
					lfoIndex: id,
				})}
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={lfoSymmetry}
				onChange={setLfoSymmetry}
				min={0}
				max={1}
				defaultValue={0.5}
				size={40}
				color="#27588f"
				label="Sym."
				tooltip={lfoParamTooltip("Symmetry")}
				modDestination={resolveTargetFromMetadata("lfo.symmetry", {
					lfoIndex: id,
				})}
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<Button
				className={`btn btn-xs px-2 col-span-4 w-fit justify-self-center ${
					lfoRetrigger ? "btn-secondary" : "btn-outline"
				}`}
				onClick={() => setLfoRetrigger(!lfoRetrigger)}
				title={lfoParamTooltip("Retrigger")}
			>
				Retrig
			</Button>
		</ModuleFrame>
	);
}
