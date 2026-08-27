import { memo, useRef, useState } from "react";
import AlgoControlItem from "@/components/controls/algo/AlgoControlItem";
import AlgoControlNumber from "@/components/controls/algo/AlgoControlNumber";
import type {
	AlgoControlRuntime,
	LineIndex,
} from "@/components/controls/algo/algoControlTypes";
import { WaveformOptionIcon } from "@/components/controls/algo/CzControlSelect";
import type { AlgoSlotViewModel } from "@/components/editor/phaseLineTypes";
import Popover from "@/components/primitives/Popover";
import { PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import {
	getAlgoControlOptionLabel,
	useAlgoControl,
} from "@/lib/synth/i18nAlgo";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";

const CONTROL_POSITION_IDS = ["first", "second", "third", "fourth"] as const;

export function AlgorithmMark({ value }: { value: PdAlgo }) {
	const definition =
		PD_ALGOS.find((algo) => algo.value === value) ?? PD_ALGOS[0];
	if (value === "cz101") {
		return <span className="text-4xl">CZ</span>;
	}
	return (
		<svg viewBox="0 0 24 24" className="size-14" aria-hidden="true">
			<path
				d={definition.icon}
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1"
			/>
		</svg>
	);
}

export const CompactAlgorithmPicker = memo(function CompactAlgorithmPicker({
	value,
	disabled,
	allowNone = false,
	noneSelected = false,
	colorClass,
	onChange,
	onSelectNone,
	triggerClassName,
	ariaLabel,
	popoverAriaLabel,
	onOpen,
}: {
	value: PdAlgo;
	disabled: boolean;
	allowNone?: boolean;
	noneSelected?: boolean;
	colorClass: string;
	onChange: (value: PdAlgo) => void;
	onSelectNone?: () => void;
	triggerClassName?: string;
	ariaLabel?: string;
	popoverAriaLabel?: string;
	onOpen?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const current = PD_ALGOS.find((algo) => algo.value === value) ?? PD_ALGOS[0];
	const currentLabel = noneSelected ? "None" : current.label;
	const togglePicker = () => {
		onOpen?.();
		setOpen((currentOpen) => !currentOpen);
	};
	const selectAdjacent = (direction: -1 | 1) => {
		const options = [
			...PD_ALGOS.map((algorithm) => algorithm.value),
			...(allowNone ? [null] : []),
		];
		const currentIndex = noneSelected ? 0 : options.indexOf(value);
		const nextIndex =
			(currentIndex + direction + options.length) % options.length;
		const nextValue = options[nextIndex];
		if (nextValue === null) onSelectNone?.();
		else onChange(nextValue);
	};

	return (
		<>
			<div
				className={`grid shrink-0 grid-cols-[1fr_1.25rem] grid-rows-[1.1rem_1fr_1fr_1.35rem] overflow-hidden border border-cz-border bg-cz-surface [grid-template-areas:'spacer_spacer''icon_up''icon_down''label_label'] focus-within:ring-1 focus-within:ring-cz-light-blue ${disabled ? "opacity-35" : ""} ${triggerClassName ?? "w-[4.25rem]"}`}
			>
				<span
					aria-hidden="true"
					className="border-cz-border border-b bg-cz-inset [grid-area:spacer]"
				/>
				<button
					ref={triggerRef}
					type="button"
					disabled={disabled}
					aria-label={ariaLabel ?? `Algorithm: ${currentLabel}`}
					aria-haspopup="dialog"
					aria-expanded={open}
					onClick={togglePicker}
					className="flex items-center justify-center text-cz-gold transition-colors [grid-area:icon] hover:bg-cz-inset focus:outline-none"
				>
					{noneSelected ? (
						<span className="font-mono text-2xl">—</span>
					) : (
						<AlgorithmMark value={value} />
					)}
				</button>
				<button
					type="button"
					disabled={disabled}
					aria-label="Previous algorithm"
					onClick={() => selectAdjacent(-1)}
					className={`flex items-center justify-center border-cz-border border-b text-[0.55rem] transition-colors [grid-area:up] hover:bg-cz-inset focus:outline-none disabled:cursor-not-allowed ${colorClass}`}
				>
					▲
				</button>
				<button
					type="button"
					disabled={disabled}
					aria-label="Next algorithm"
					onClick={() => selectAdjacent(1)}
					className={`flex items-center justify-center text-[0.55rem] transition-colors [grid-area:down] hover:bg-cz-inset focus:outline-none disabled:cursor-not-allowed ${colorClass}`}
				>
					▼
				</button>
				<button
					type="button"
					disabled={disabled}
					aria-label={`${ariaLabel ?? "Algorithm"} name: ${currentLabel}`}
					aria-haspopup="dialog"
					aria-expanded={open}
					onClick={togglePicker}
					className={`flex min-w-0 items-center justify-center border-cz-border border-t bg-cz-inset px-1 font-mono text-[0.52rem] uppercase tracking-[0.1em] transition-colors [grid-area:label] hover:bg-cz-inset focus:outline-none ${colorClass}`}
				>
					<span className="max-w-full truncate">{currentLabel}</span>
				</button>
			</div>
			<Popover
				open={open}
				onClose={() => setOpen(false)}
				triggerRef={triggerRef}
				ariaLabel={popoverAriaLabel ?? ariaLabel ?? "Select algorithm"}
				placement="top"
			>
				<div className="grid grid-cols-5 p-1">
					{PD_ALGOS.map((algorithm) => (
						<button
							key={algorithm.value}
							type="button"
							aria-label={algorithm.label}
							aria-pressed={!noneSelected && algorithm.value === value}
							onClick={() => {
								onChange(algorithm.value);
								setOpen(false);
							}}
							className="flex size-16 flex-col items-center justify-center border border-cz-border bg-cz-surface font-mono text-[0.45rem] text-cz-gold uppercase hover:border-cz-light-blue hover:text-white aria-pressed:border-cz-light-blue aria-pressed:bg-cz-inset aria-pressed:text-white"
						>
							<AlgorithmMark value={algorithm.value} />
							<span className="max-w-14 truncate">{algorithm.label}</span>
						</button>
					))}
						{allowNone ? (
						<button
							type="button"
							aria-label="None"
							aria-pressed={noneSelected}
							onClick={() => {
								onSelectNone?.();
								setOpen(false);
							}}
							className="flex size-16 flex-col items-center justify-center border border-cz-border bg-cz-surface font-mono text-[0.45rem] text-cz-gold uppercase hover:border-cz-light-blue hover:text-white aria-pressed:border-cz-light-blue aria-pressed:bg-cz-inset aria-pressed:text-white"
						>
							<span className="text-2xl">—</span>
							<span>None</span>
						</button>
					) : null}
				</div>
			</Popover>
		</>
	);
});

function CompactCzControl({
	control,
	slot,
	disabled,
}: {
	control: AlgoControlRuntime;
	slot: AlgoSlotViewModel;
	disabled: boolean;
}) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const translated = useAlgoControl(control.algo, control.id);
	const label = translated.label || control.label || control.id;
	const options = control.options ?? [];
	const activeOption = slot.getActiveSelectOption(control);

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				disabled={disabled}
				aria-label={`${label}: ${activeOption?.label ?? "Custom"}`}
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen((current) => !current)}
				className="flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded border border-cz-border bg-cz-inset/65 px-0.5 text-cz-gold hover:border-cz-light-blue focus:outline-none focus:ring-1 focus:ring-cz-light-blue disabled:opacity-35"
				data-testid={`simple-cz-${control.id}`}
			>
				<span className="max-w-full truncate font-mono text-[0.42rem] text-cz-cream/70 uppercase tracking-[0.06em]">
					{label}
				</span>
				<svg
					viewBox="0 0 34 22"
					className="h-8 w-full max-w-14"
					aria-hidden="true"
				>
					<WaveformOptionIcon
						value={activeOption?.value ?? "off"}
						isWindowFunction={control.id === "windowFunction"}
					/>
				</svg>
				<span className="max-w-full truncate font-mono text-[0.47rem] text-cz-cream uppercase">
					{activeOption?.label ?? "Custom"} ▾
				</span>
			</button>
			<Popover
				open={open}
				onClose={() => setOpen(false)}
				triggerRef={triggerRef}
				ariaLabel={label}
				placement="top"
			>
				<div className="p-2">
					<div className="mb-2 text-center font-mono text-[0.62rem] text-cz-cream uppercase tracking-[0.16em]">
						{label}
					</div>
					<div className="grid grid-cols-4">
						{options.map((option, index) => {
							const optionLabel = getAlgoControlOptionLabel(
								control.algo,
								control.id,
								option.value,
							);
							return (
								<button
									key={option.value}
									type="button"
									aria-label={optionLabel}
									aria-pressed={option.value === activeOption?.value}
									onClick={() => {
										if (option.set.length > 0) {
											slot.applyOptionAssignments(option);
										} else {
											slot.controlBindings[control.id]?.setNumber?.(index);
										}
										setOpen(false);
									}}
									className="flex h-16 w-20 flex-col items-center justify-center border border-cz-border bg-cz-surface font-mono text-[0.45rem] text-cz-gold uppercase hover:border-cz-light-blue aria-pressed:border-cz-light-blue aria-pressed:bg-cz-inset aria-pressed:text-white"
								>
									<svg
										viewBox="0 0 34 22"
										className="h-7 w-14"
										aria-hidden="true"
									>
										<WaveformOptionIcon
											value={option.value}
											isWindowFunction={control.id === "windowFunction"}
										/>
									</svg>
									<span className="max-w-16 truncate">{optionLabel}</span>
								</button>
							);
						})}
					</div>
				</div>
			</Popover>
		</>
	);
}

export default memo(function CompactAlgorithmControls({
	slot,
	lineIndex,
	color,
}: {
	slot: AlgoSlotViewModel;
	lineIndex: LineIndex;
	color: string;
}) {
	if (slot.value === "cz101") {
		return (
			<div
				className="grid min-w-0 flex-1 grid-cols-4 gap-0.5"
				data-testid="simple-cz-controls"
			>
				{slot.controls.slice(0, 4).map((control) => (
					<CompactCzControl
						key={control.id}
						control={control}
						slot={slot}
						disabled={slot.disabled}
					/>
				))}
			</div>
		);
	}

	return (
		<div
			className="grid min-w-0 flex-1 grid-cols-4 items-center gap-0.5"
			data-testid="simple-algo-controls"
		>
			{CONTROL_POSITION_IDS.map((positionId, index) => {
				const control = slot.controls[index];
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

				if ((control.kind ?? "number") === "number") {
					return (
						<AlgoControlNumber
							key={control.id}
							control={control}
							disabled={slot.disabled}
							binding={slot.controlBindings[control.id]}
							lineIndex={lineIndex}
							algoControlSlotIndex={slot.algoControlSlotIndex}
							getAlgoControlValue={slot.getControlValue}
							setAlgoControlValue={slot.setControlValue}
							color={color}
							size={64}
						/>
					);
				}

				return (
					<AlgoControlItem
						key={control.id}
						control={control}
						disabled={slot.disabled}
						binding={slot.controlBindings[control.id]}
						lineIndex={lineIndex}
						algoControlSlotIndex={slot.algoControlSlotIndex}
						getAlgoControlValue={slot.getControlValue}
						setAlgoControlValue={slot.setControlValue}
						getActiveSelectOption={slot.getActiveSelectOption}
						applyOptionAssignments={slot.applyOptionAssignments}
						color={color}
					/>
				);
			})}
		</div>
	);
});
