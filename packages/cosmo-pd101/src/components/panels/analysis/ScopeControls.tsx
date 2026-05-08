import ControlKnob from "@/components/controls/ControlKnob";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

export function ScopeControls() {
	const scopeCycles = useSynthUiStore((s) => s.scopeCycles);
	const scopeVerticalZoom = useSynthUiStore((s) => s.scopeVerticalZoom);
	const scopeTriggerLevel = useSynthUiStore((s) => s.scopeTriggerLevel);
	const setScopeCycles = useSynthUiStore((s) => s.setScopeCycles);
	const setScopeVerticalZoom = useSynthUiStore((s) => s.setScopeVerticalZoom);
	const setScopeTriggerLevel = useSynthUiStore((s) => s.setScopeTriggerLevel);

	return (
		<div className="mt-2 flex shrink-0 justify-center gap-2">
			<ControlKnob
				value={scopeCycles}
				onChange={setScopeCycles}
				min={0.5}
				max={8}
				size={40}
				defaultValue={2}
				color="#3dff3d"
				label="Cycles"
				tooltip="Sets how many waveform cycles are shown in scope view."
				valueFormatter={(value) => value.toFixed(1)}
			/>
			<ControlKnob
				value={scopeVerticalZoom}
				onChange={setScopeVerticalZoom}
				min={0.25}
				max={4}
				size={40}
				defaultValue={1}
				color="#9cb937"
				label="Zoom"
				tooltip="Sets vertical waveform magnification."
				valueFormatter={(value) => `${value.toFixed(1)}x`}
			/>
			<ControlKnob
				value={scopeTriggerLevel}
				onChange={(value) => setScopeTriggerLevel(Math.round(value))}
				min={0}
				max={255}
				size={40}
				defaultValue={128}
				color="#7f9de4"
				label="Trig"
				tooltip="Sets trigger threshold used to stabilize waveform display."
				valueFormatter={(value) => `${Math.round(value)}`}
			/>
		</div>
	);
}
