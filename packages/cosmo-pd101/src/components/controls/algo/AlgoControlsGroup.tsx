import { memo } from "react";
import Card from "@/components/primitives/Card";
import AlgoControlItem from "./AlgoControlItem";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
	LineIndex,
} from "./algoControlTypes";

interface AlgoControlsGroupProps {
	controls: AlgoControlRuntime[];
	title?: string;
	disabled?: boolean;
	embedded?: boolean;
	controlBindings: Record<string, AlgoControlBinding>;
	lineIndex: LineIndex;
	algoParamSlotIndex: Record<string, number>;
	getAlgoControlValue: (id: string, fallback: number) => number;
	setAlgoControlValue: (id: string, value: number) => void;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
	color?: string;
}

function AlgoControlsGroupInner({
	controls,
	title = "Algo Controls",
	disabled = false,
	embedded = false,
	controlBindings,
	lineIndex,
	algoParamSlotIndex,
	getAlgoControlValue,
	setAlgoControlValue,
	getActiveSelectOption,
	applyOptionAssignments,
	color,
}: AlgoControlsGroupProps) {
	const presetControl = controls.find((control) => control.id === "preset");
	const waveform1Control = controls.find(
		(control) => control.id === "waveform1",
	);
	const waveform2Control = controls.find(
		(control) => control.id === "waveform2",
	);
	const windowFunctionControl = controls.find(
		(control) => control.id === "windowFunction",
	);
	const czStructuredControlIds = new Set([
		"preset",
		"waveform1",
		"waveform2",
		"windowFunction",
	]);
	const hasCzStructuredLayout =
		controls.some((control) => czStructuredControlIds.has(control.id)) &&
		(presetControl != null ||
			(waveform1Control != null && waveform2Control != null) ||
			windowFunctionControl != null);
	const remainingControls = hasCzStructuredLayout
		? controls.filter((control) => !czStructuredControlIds.has(control.id))
		: controls;

	const renderControl = (control: AlgoControlRuntime) => (
		<AlgoControlItem
			key={control.id}
			control={control}
			disabled={disabled}
			binding={controlBindings[control.id]}
			lineIndex={lineIndex}
			algoParamSlotIndex={algoParamSlotIndex}
			getAlgoControlValue={getAlgoControlValue}
			setAlgoControlValue={setAlgoControlValue}
			getActiveSelectOption={getActiveSelectOption}
			applyOptionAssignments={applyOptionAssignments}
			color={color}
		/>
	);

	const content = (
		<>
			<div className="mb-3 text-3xs uppercase tracking-[0.24em] text-cz-cream">
				{title}
			</div>
			{controls.length > 0 ? (
				<div
					className={`flex-1 min-h-0 overflow-visible ${disabled ? "pointer-events-none" : ""}`}
				>
					{hasCzStructuredLayout ? (
						<div className="space-y-3">
							{presetControl ? <div>{renderControl(presetControl)}</div> : null}
							{waveform1Control || waveform2Control ? (
								<div className="grid grid-cols-2 gap-2 items-start">
									{waveform1Control ? (
										<div>{renderControl(waveform1Control)}</div>
									) : (
										<div />
									)}
									{waveform2Control ? (
										<div>{renderControl(waveform2Control)}</div>
									) : (
										<div />
									)}
								</div>
							) : null}
							{windowFunctionControl ? (
								<div>{renderControl(windowFunctionControl)}</div>
							) : null}
							{remainingControls.length > 0 ? (
								<div className="grid grid-cols-2 gap-2 justify-center space-y-3">
									{remainingControls.map((control) => renderControl(control))}
								</div>
							) : null}
						</div>
					) : (
						<div className="grid grid-cols-2 gap-2 justify-center space-y-3">
							{controls.map((control) => renderControl(control))}
						</div>
					)}
				</div>
			) : (
				<div className="text-3xs text-cz-cream/70 uppercase tracking-[0.2em]">
					No controls for this algo
				</div>
			)}
		</>
	);

	if (embedded) {
		return (
			<div className={`min-h-0 flex flex-col ${disabled ? "opacity-45" : ""}`}>
				{content}
			</div>
		);
	}

	return (
		<Card
			variant="subtle"
			className={`p-3 min-h-0 flex flex-col ${disabled ? "opacity-45" : ""}`}
		>
			{content}
		</Card>
	);
}

const AlgoControlsGroup = memo(AlgoControlsGroupInner);

export default AlgoControlsGroup;
