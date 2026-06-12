import { memo } from "react";
import Card from "@/components/primitives/Card";
import type { Algo } from "@/lib/synth/bindings/synth";
import { useAlgoUiText } from "@/lib/synth/i18nAlgo";
import AlgoControlItem from "./AlgoControlItem";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
	LineIndex,
} from "./algoControlTypes";

const CZ_STRUCTURED_CONTROL_IDS = new Set([
	"preset",
	"waveform1",
	"waveform2",
	"windowFunction",
]);

type AlgoControlsGroupSlot = {
	algo: Algo;
	controls: AlgoControlRuntime[];
	controlBindings: Record<string, AlgoControlBinding>;
	lineIndex: LineIndex;
	algoParamSlotIndex: Record<string, number>;
	getAlgoControlValue: (id: string, fallback: number) => number;
	setAlgoControlValue: (id: string, value: number) => void;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
};

interface AlgoControlsGroupProps {
	sectionId?: "a" | "b";
	disabled?: boolean;
	slot: AlgoControlsGroupSlot;
	color?: string;
}

type CzStructuredControls = {
	preset: AlgoControlRuntime | null;
	waveform1: AlgoControlRuntime | null;
	waveform2: AlgoControlRuntime | null;
	windowFunction: AlgoControlRuntime | null;
	remainingControls: AlgoControlRuntime[];
};

function buildCzStructuredControls(
	controls: AlgoControlRuntime[],
): CzStructuredControls {
	const controlsById = new Map(
		controls.map((control) => [control.id, control]),
	);

	return {
		preset: controlsById.get("preset") ?? null,
		waveform1: controlsById.get("waveform1") ?? null,
		waveform2: controlsById.get("waveform2") ?? null,
		windowFunction: controlsById.get("windowFunction") ?? null,
		remainingControls: controls.filter(
			(control) => !CZ_STRUCTURED_CONTROL_IDS.has(control.id),
		),
	};
}

function AlgoControlsGroupInner({
	slot,
	disabled = false,
	sectionId = "a",
	color,
}: AlgoControlsGroupProps) {
	const {
		algo,
		controls,
		controlBindings,
		lineIndex,
		algoParamSlotIndex,
		getAlgoControlValue,
		setAlgoControlValue,
		getActiveSelectOption,
		applyOptionAssignments,
	} = slot;

	const noControlsLabel = useAlgoUiText("noControlsForThisAlgo");
	const isCzAlgo = algo === "cz101";
	const czStructuredControls = isCzAlgo
		? buildCzStructuredControls(controls)
		: null;

	const renderControl = (control: AlgoControlRuntime) => (
		<AlgoControlItem
			key={control.id}
			control={control}
			disabled={disabled}
			sectionId={sectionId}
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

	return (
		<Card
			variant="panel"
			className={`mt-2 flex h-full min-h-0 flex-col bg-cz-surface p-3 pt-4 [@container_phase_(max-height:620px)]:mt-1 [@container_phase_(max-height:620px)]:p-1.5 ${controls.length > 0 ? "justify-center overflow-visible" : ""} ${disabled ? "opacity-45" : ""} ${controls.length > 0 && disabled ? "pointer-events-none" : ""}`}
		>
			{controls.length > 0 ? (
				isCzAlgo ? (
					<div
						className="space-y-3 [@container_phase_(max-height:620px)]:space-y-1"
						data-testid="algo-controls-cz-layout"
					>
						{czStructuredControls?.preset ? (
							<div>{renderControl(czStructuredControls.preset)}</div>
						) : null}
						{czStructuredControls &&
						(czStructuredControls.waveform1 ||
							czStructuredControls.waveform2) ? (
							<div
								className="grid grid-cols-1 items-start gap-6 [@container_phase_(max-height:600px)]:grid-cols-2 [@container_phase_(max-height:620px)]:gap-2"
								data-testid="algo-controls-cz-waveforms"
							>
								{czStructuredControls.waveform1 ? (
									<div>{renderControl(czStructuredControls.waveform1)}</div>
								) : (
									<div />
								)}
								{czStructuredControls.waveform2 ? (
									<div>{renderControl(czStructuredControls.waveform2)}</div>
								) : (
									<div />
								)}
							</div>
						) : null}
						{czStructuredControls?.windowFunction ? (
							<div>{renderControl(czStructuredControls.windowFunction)}</div>
						) : null}
						{czStructuredControls &&
						czStructuredControls.remainingControls.length > 0 ? (
							<div
								className="grid grid-cols-2 justify-center gap-2"
								data-testid="algo-controls-cz-remaining"
							>
								{czStructuredControls.remainingControls.map((control) =>
									renderControl(control),
								)}
							</div>
						) : null}
					</div>
				) : (
					<div
						className="grid grid-cols-2 justify-center gap-2"
						data-testid="algo-controls-default-grid"
					>
						{controls.map((control) => renderControl(control))}
					</div>
				)
			) : (
				<div className="text-3xs text-cz-cream/70 uppercase tracking-[0.2em]">
					{noControlsLabel}
				</div>
			)}
		</Card>
	);
}

const AlgoControlsGroup = memo(AlgoControlsGroupInner);

export default AlgoControlsGroup;
