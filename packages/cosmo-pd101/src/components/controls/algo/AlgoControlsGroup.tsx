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
const COMPACT_CONTROL_POSITIONS = ["first", "second", "third", "fourth"];

export type AlgoControlsGroupSlot = {
	algo: Algo | null;
	controls: AlgoControlRuntime[];
	controlBindings: Record<string, AlgoControlBinding>;
	lineIndex: LineIndex;
	algoControlSlotIndex: Record<string, number>;
	getAlgoControlValue: (id: string, fallback: number) => number;
	setAlgoControlValue: (id: string, value: number) => void;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
};

interface AlgoControlsGroupProps {
	disabled?: boolean;
	slot: AlgoControlsGroupSlot;
	color?: string;
	variant?: "standard" | "compact";
	controlSize?: number;
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
	color,
	variant = "standard",
	controlSize,
}: AlgoControlsGroupProps) {
	const {
		algo,
		controls,
		controlBindings,
		lineIndex,
		algoControlSlotIndex,
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
			binding={controlBindings[control.id]}
			lineIndex={lineIndex}
			algoControlSlotIndex={algoControlSlotIndex}
			getAlgoControlValue={getAlgoControlValue}
			setAlgoControlValue={setAlgoControlValue}
			getActiveSelectOption={getActiveSelectOption}
			applyOptionAssignments={applyOptionAssignments}
			color={color}
			variant={variant}
			controlSize={controlSize}
		/>
	);

	if (variant === "compact") {
		return (
			<div
				className="grid min-w-0 flex-1 grid-cols-4 items-center gap-0.5"
				data-testid={isCzAlgo ? "simple-cz-controls" : "simple-algo-controls"}
			>
				{COMPACT_CONTROL_POSITIONS.map((positionId, index) => {
					const control = controls[index];
					if (!control) {
						return (
							<div
								key={positionId}
								title={`Unused algorithm control ${index + 1}`}
								className="flex h-20 min-w-0 items-center justify-center rounded border border-cz-border/45 bg-cz-inset/25 text-cz-cream/20"
							>
								—
							</div>
						);
					}
					return renderControl(control);
				})}
			</div>
		);
	}

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
