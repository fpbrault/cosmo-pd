import { memo } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import type { KnobVariant } from "@/components/controls/knob/KnobView";
import type { KnobCurve } from "@/components/controls/knob/knobGeometry";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import type { SyncConfig, UiTransform } from "./synthParamControlShared";
import { useSynthParamControl } from "./synthParamControlShared";

const TOGGLE_BUTTON_CLASS =
	"btn btn-ghost btn-xs h-4 min-h-0 rounded-sm border border-cz-border/65 px-1 font-mono text-[0.52rem] text-cz-gold/85 normal-case tracking-normal";

interface SynthParamKnobProps {
	paramKey: SynthParamKey;
	value?: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
	label?: string;
	labelClassName?: string;
	color?: string;
	size?: number;
	min?: number;
	max?: number;
	bipolar?: boolean;
	variant?: KnobVariant;
	step?: number;
	curve?: KnobCurve;
	modDestination?: ModDestination;
	tooltip?: string;
	valueFormatter?: (value: number) => string;
	midiTargetKey?: string;
	midiLabel?: string;
	uiTransform?: UiTransform;
	sync?: SyncConfig;
}

function SynthParamKnobInner({
	paramKey,
	value,
	onChange,
	disabled,
	label,
	labelClassName,
	color,
	size,
	min,
	max,
	bipolar,
	variant,
	step,
	curve,
	modDestination,
	tooltip,
	valueFormatter,
	midiTargetKey,
	midiLabel,
	uiTransform,
	sync,
}: SynthParamKnobProps) {
	const state = useSynthParamControl({
		paramKey,
		value,
		onChange,
		min,
		max,
		step,
		bipolar,
		curve,
		modDestination,
		tooltip,
		label,
		valueFormatter,
		midiTargetKey,
		midiLabel,
		uiTransform,
		sync,
	});

	return (
		<ControlKnob
			value={state.displayedValue}
			onChange={state.handleControlChange}
			disabled={disabled}
			label={label}
			labelClassName={labelClassName}
			labelAccessory={
				state.syncConfig ? (
					<button
						type="button"
						className={TOGGLE_BUTTON_CLASS}
						onClick={() => state.setSyncMode(state.syncMode ? "hz" : "sync")}
					>
						{state.syncMode ? "sync" : "hz"}
					</button>
				) : undefined
			}
			tooltip={state.syncMode ? state.syncTooltip : state.boundTooltip}
			min={state.controlMin}
			max={state.controlMax}
			step={state.controlStep}
			defaultValue={state.controlDefaultValue}
			bipolar={state.controlBipolar}
			color={color}
			size={size}
			variant={variant}
			curve={state.controlCurve}
			valueFormatter={state.valueFormatter}
			modDestination={state.modDestinationResolved}
			onContextMenu={state.midiLearn.onContextMenu}
			onClick={state.midiLearn.onClick}
			interactionLocked={state.midiLearn.interactionLocked}
			midiLearnState={state.midiLearn.midiLearnState}
		/>
	);
}

const SynthParamKnob = memo(SynthParamKnobInner);
export default SynthParamKnob;
