import { memo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import { useSequencerRuntime } from "@/features/synth/hooks/useSequencerRuntime";
import {
	ARPEGGIATOR_DIRECTIONS,
	DEFAULT_SEQUENCER_PARAMS,
	normalizeSequencerParams,
	SEQUENCER_HOLD_MODES,
	SEQUENCER_RATES,
	STEP_DIRECTIONS,
} from "@/features/synth/sequencer";
import { useSynthStore } from "@/features/synth/synthStore";
import type {
	LfoSyncDivision,
	SequencerDirection,
	SequencerMode,
	SequencerParams,
	SequencerStep,
} from "@/lib/synth/bindings/synth";

const directionLabels: Record<SequencerDirection, string> = {
	up: "UP",
	down: "DOWN",
	upDown: "UP/DOWN",
	random: "RANDOM",
	asPlayed: "AS PLAYED",
	forward: "FORWARD",
	reverse: "REVERSE",
	pingPong: "PING-PONG",
};

const rateLabels: Record<LfoSyncDivision, string> = {
	whole: "1/1",
	half: "1/2",
	quarter: "1/4",
	eighth: "1/8",
	sixteenth: "1/16",
	thirtySecond: "1/32",
	dottedQuarter: "1/4D",
	dottedEighth: "1/8D",
	quarterTriplet: "1/4T",
	eighthTriplet: "1/8T",
};

const sequencerStepKeys = Array.from(
	{ length: 16 },
	(_, index) => `sequencer-step-${index + 1}`,
);

function ControlLabel({ children }: { children: ReactNode }) {
	return (
		<div className="mb-1 font-semibold text-[0.55rem] text-cz-cream/60 uppercase tracking-[0.18em]">
			{children}
		</div>
	);
}

function SelectControl<T extends string>({
	label,
	value,
	options,
	labels,
	onChange,
}: {
	label: string;
	value: T;
	options: readonly T[];
	labels: Record<T, string>;
	onChange: (value: T) => void;
}) {
	return (
		<label className="min-w-0 flex-1">
			<ControlLabel>{label}</ControlLabel>
			<select
				className="select select-xs h-7 min-h-0 w-full border-cz-border bg-cz-inset px-2 text-[0.65rem] text-cz-cream"
				value={value}
				onChange={(event) => onChange(event.target.value as T)}
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{labels[option]}
					</option>
				))}
			</select>
		</label>
	);
}

function RangeControl({
	label,
	value,
	min,
	max,
	step,
	format,
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	format: (value: number) => string;
	onChange: (value: number) => void;
}) {
	return (
		<label className="min-w-0 flex-1">
			<div className="mb-1 flex items-center justify-between gap-2">
				<ControlLabel>{label}</ControlLabel>
				<span className="text-[0.6rem] text-cz-light-blue tabular-nums">
					{format(value)}
				</span>
			</div>
			<input
				className="range range-xs range-info h-4 w-full"
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
			/>
		</label>
	);
}

function ModeButton({
	active,
	children,
	onClick,
}: {
	active: boolean;
	children: ReactNode;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			className={`btn btn-xs min-h-0 flex-1 rounded-sm border px-2 font-semibold text-[0.62rem] tracking-[0.14em] ${
				active
					? "border-cz-light-blue/70 bg-cz-light-blue/20 text-cz-light-blue"
					: "border-cz-border bg-cz-inset text-cz-cream/60"
			}`}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}

function SequencerStepCell({
	index,
	step,
	active,
	onChange,
}: {
	index: number;
	step: SequencerStep;
	active: boolean;
	onChange: (patch: SequencerStep) => void;
}) {
	const enabled = step.enabled !== false;
	return (
		<div
			className={`min-w-13 flex-1 rounded border p-1.5 transition-colors ${
				active
					? "border-cz-light-blue bg-cz-light-blue/10"
					: "border-cz-border/80 bg-cz-inset/80"
			}`}
			data-testid={`sequencer-step-${index + 1}`}
		>
			<button
				className={`mb-1 flex h-5 w-full items-center justify-center rounded font-bold text-[0.6rem] ${
					enabled
						? "bg-cz-light-blue/20 text-cz-light-blue"
						: "bg-cz-border/40 text-cz-cream/40"
				}`}
				type="button"
				aria-label={`Step ${index + 1} ${enabled ? "enabled" : "disabled"}`}
				onClick={() => onChange({ ...step, enabled: !enabled })}
			>
				{String(index + 1).padStart(2, "0")}
			</button>
			<label className="block text-[0.5rem] text-cz-cream/45 uppercase tracking-wider">
				Pitch
				<input
					className="input input-xs mt-0.5 h-6 min-h-0 w-full border-cz-border bg-cz-body px-1 text-center text-[0.6rem] text-cz-cream"
					type="number"
					min={-24}
					max={24}
					step={1}
					value={step.pitch ?? 0}
					onChange={(event) =>
						onChange({ ...step, pitch: Number(event.target.value) })
					}
				/>
			</label>
			<label className="mt-1 block text-[0.5rem] text-cz-cream/45 uppercase tracking-wider">
				Vel
				<input
					className="range range-xs range-info mt-1 h-3 w-full"
					type="range"
					min={0}
					max={1}
					step={0.01}
					value={step.velocity ?? 1}
					onChange={(event) =>
						onChange({ ...step, velocity: Number(event.target.value) })
					}
				/>
			</label>
			<label className="mt-1 block text-[0.5rem] text-cz-cream/45 uppercase tracking-wider">
				Gate
				<input
					className="range range-xs range-info mt-1 h-3 w-full"
					type="range"
					min={0}
					max={1}
					step={0.01}
					value={step.gate ?? 1}
					onChange={(event) =>
						onChange({ ...step, gate: Number(event.target.value) })
					}
				/>
			</label>
			<label className="mt-1 block text-[0.5rem] text-cz-cream/45 uppercase tracking-wider">
				Prob
				<input
					className="range range-xs range-info mt-1 h-3 w-full"
					type="range"
					min={0}
					max={1}
					step={0.01}
					value={step.probability ?? 1}
					onChange={(event) =>
						onChange({ ...step, probability: Number(event.target.value) })
					}
				/>
			</label>
		</div>
	);
}

export default memo(function SequencerDrawer() {
	const { t } = useTranslation("synth");
	const rawParams = useSynthStore((state) => state.sequencer);
	const updateSequencer = useSynthStore((state) => state.updateSequencer);
	const runtime = useSequencerRuntime();
	const params = normalizeSequencerParams(
		rawParams ?? DEFAULT_SEQUENCER_PARAMS,
	);
	const steps = params.steps ?? DEFAULT_SEQUENCER_PARAMS.steps ?? [];
	const isStepMode = params.mode === "step";
	const directions = isStepMode ? STEP_DIRECTIONS : ARPEGGIATOR_DIRECTIONS;

	const updateSteps = (index: number, patch: SequencerStep) => {
		const nextSteps = [...steps];
		nextSteps[index] = patch;
		updateSequencer({
			steps: nextSteps as NonNullable<SequencerParams["steps"]>,
		});
	};

	return (
		<section className="flex h-full min-h-0 flex-col gap-2 overflow-auto bg-cz-body p-3 text-cz-cream">
			<div className="flex shrink-0 items-center gap-3 border-cz-border border-b pb-2">
				<div>
					<div className="font-semibold text-[0.65rem] text-cz-light-blue uppercase tracking-[0.24em]">
						{t("sequencer.title")}
					</div>
					<div className="mt-1 text-[0.55rem] text-cz-cream/45 uppercase tracking-wider">
						{runtime.playing
							? `${runtime.sourceNoteCount} source note${runtime.sourceNoteCount === 1 ? "" : "s"}`
							: "Waiting for notes"}
					</div>
				</div>
				<div className="ml-auto flex items-center gap-2">
					<span
						role="status"
						className={`h-2 w-2 rounded-full ${runtime.playing ? "bg-cz-light-blue shadow-[0_0_8px] shadow-cz-light-blue" : "bg-cz-border"}`}
						aria-label={
							runtime.playing ? "Sequencer playing" : "Sequencer stopped"
						}
					/>
					<Button
						type="button"
						className={`btn btn-xs min-h-0 border text-[0.58rem] uppercase tracking-wider ${
							params.enabled
								? "border-cz-light-blue/60 bg-cz-light-blue/15 text-cz-light-blue"
								: "border-cz-border bg-transparent text-cz-cream/55"
						}`}
						onClick={() => updateSequencer({ enabled: !params.enabled })}
					>
						{params.enabled ? "On" : "Off"}
					</Button>
					<Button
						type="button"
						className="btn btn-xs min-h-0 border border-cz-border bg-transparent text-[0.58rem] text-cz-cream/55 uppercase tracking-wider"
						onClick={() =>
							window.dispatchEvent(new CustomEvent("cz-sequencer-panic"))
						}
					>
						Clear
					</Button>
				</div>
			</div>

			<div className="flex shrink-0 gap-1">
				<ModeButton
					active={!isStepMode}
					onClick={() =>
						updateSequencer({ mode: "arpeggiator" as SequencerMode })
					}
				>
					Arpeggiator
				</ModeButton>
				<ModeButton
					active={isStepMode}
					onClick={() => updateSequencer({ mode: "step" as SequencerMode })}
				>
					Step
				</ModeButton>
			</div>

			<div className="grid shrink-0 @min-[800px]/phase:grid-cols-4 grid-cols-2 gap-2">
				<SelectControl
					label="Rate"
					value={params.rate ?? "eighth"}
					options={SEQUENCER_RATES}
					labels={rateLabels}
					onChange={(rate) => updateSequencer({ rate })}
				/>
				<SelectControl
					label="Direction"
					value={
						directions.includes(params.direction ?? "up")
							? (params.direction ?? "up")
							: directions[0]
					}
					options={directions}
					labels={directionLabels}
					onChange={(direction) => updateSequencer({ direction })}
				/>
				<SelectControl
					label="Input"
					value={params.holdMode ?? "hold"}
					options={SEQUENCER_HOLD_MODES}
					labels={{ hold: "HOLD NOTES", latch: "LATCH NOTES" }}
					onChange={(holdMode) => updateSequencer({ holdMode })}
				/>
				<RangeControl
					label="Gate"
					value={params.gate ?? 0.75}
					min={0.05}
					max={1}
					step={0.01}
					format={(value) => `${Math.round(value * 100)}%`}
					onChange={(gate) => updateSequencer({ gate })}
				/>
			</div>

			<div className="flex shrink-0 gap-3">
				<RangeControl
					label="Swing"
					value={params.swing ?? 0}
					min={0}
					max={0.5}
					step={0.01}
					format={(value) => `${Math.round(value * 100)}%`}
					onChange={(swing) => updateSequencer({ swing })}
				/>
				{isStepMode ? (
					<RangeControl
						label="Length"
						value={params.patternLength ?? 8}
						min={1}
						max={16}
						step={1}
						format={(value) => String(Math.round(value))}
						onChange={(patternLength) => updateSequencer({ patternLength })}
					/>
				) : (
					<>
						<RangeControl
							label="Octaves"
							value={params.octaveRange ?? 1}
							min={1}
							max={4}
							step={1}
							format={(value) => `${Math.round(value)}x`}
							onChange={(octaveRange) => updateSequencer({ octaveRange })}
						/>
						<RangeControl
							label="Repeat"
							value={params.repeat ?? 1}
							min={1}
							max={4}
							step={1}
							format={(value) => `${Math.round(value)}x`}
							onChange={(repeat) => updateSequencer({ repeat })}
						/>
					</>
				)}
			</div>

			{isStepMode ? (
				<div className="min-h-0 overflow-x-auto rounded border border-cz-border bg-cz-surface p-2">
					<div className="flex min-w-225 gap-1">
						{steps.map((step, index) => (
							<SequencerStepCell
								key={sequencerStepKeys[index] ?? "sequencer-step"}
								index={index}
								step={step}
								active={runtime.playing && runtime.currentStep === index}
								onChange={(patch) => updateSteps(index, patch)}
							/>
						))}
					</div>
				</div>
			) : (
				<div className="flex min-h-0 flex-1 items-center justify-center rounded border border-cz-border bg-cz-surface p-6 text-center">
					<div>
						<div className="text-2xl text-cz-light-blue/65">↗ ↘ ↗</div>
						<div className="mt-3 font-semibold text-[0.68rem] text-cz-cream/70 uppercase tracking-[0.2em]">
							Hold notes to play
						</div>
						<div className="mt-2 max-w-md text-cz-cream/45 text-xs leading-relaxed">
							{params.holdMode === "latch"
								? "Notes stay active until Clear or Panic."
								: "The held chord becomes the source for the selected direction."}
						</div>
					</div>
				</div>
			)}

			{isStepMode ? (
				<div className="flex shrink-0 items-center justify-between text-[0.55rem] text-cz-cream/40 uppercase tracking-wider">
					<span>Pitch is relative to the lowest held note</span>
					<Button
						type="button"
						className={`btn btn-xs min-h-0 border px-2 text-[0.55rem] uppercase tracking-wider ${
							params.resetOnTransport
								? "border-cz-light-blue/50 text-cz-light-blue"
								: "border-cz-border text-cz-cream/40"
						}`}
						onClick={() =>
							updateSequencer({ resetOnTransport: !params.resetOnTransport })
						}
					>
						{params.resetOnTransport ? "Reset on transport" : "Free-running"}
					</Button>
				</div>
			) : null}
		</section>
	);
});
