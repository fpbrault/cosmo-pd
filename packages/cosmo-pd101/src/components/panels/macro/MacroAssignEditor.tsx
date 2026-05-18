import { memo, useState } from "react";
import Button from "@/components/controls/Button";
import { ControlKnob } from "@/components/controls/ControlKnob";
import { useSynthStore } from "@/features/synth/synthStore";
import type { MacroAssignment } from "@/features/synth/types/macro";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import {
	getModDestinationGroups,
	getModDestinationLabel,
} from "@/lib/synth/modTargets";

const DESTINATION_GROUPS = getModDestinationGroups();

type MacroAssignEditorProps = {
	macroIndex: number;
	onClose: () => void;
};

export default function MacroAssignEditor({
	macroIndex,
	onClose,
}: MacroAssignEditorProps) {
	const assignments = useSynthStore((s) =>
		s.macroAssignments.filter((a) => a.macroIndex === macroIndex),
	);
	const setMacroAssignments = useSynthStore((s) => s.setMacroAssignments);
	const allAssignments = useSynthStore((s) => s.macroAssignments);
	const [showAddPicker, setShowAddPicker] = useState(false);

	const handleRemove = (idx: number) => {
		const toRemove = assignments[idx];
		const next = allAssignments.filter((a) => a !== toRemove);
		setMacroAssignments(next);
	};

	const handleToggle = (idx: number) => {
		const target = assignments[idx];
		const next = allAssignments.map((a) =>
			a === target ? { ...a, enabled: !a.enabled } : a,
		);
		setMacroAssignments(next);
	};

	const handleDepth = (idx: number, depth: number) => {
		const target = assignments[idx];
		const next = allAssignments.map((a) =>
			a === target ? { ...a, depth } : a,
		);
		setMacroAssignments(next);
	};

	const handleAdd = (destination: ModDestination) => {
		const newAssignment: MacroAssignment = {
			macroIndex,
			destination,
			depth: 0,
			enabled: true,
		};
		setMacroAssignments([...allAssignments, newAssignment]);
		setShowAddPicker(false);
	};

	const macroLabel = `Macro ${macroIndex + 1}`;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: event propagation stop only
		// biome-ignore lint/a11y/useKeyWithClickEvents: event propagation stop only
		<div
			className="absolute bottom-full left-0 z-30 mb-2 w-80 rounded-xl border border-cz-border/80 bg-cz-surface p-3 shadow-2xl"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="mb-2 flex items-center justify-between">
				<span className="font-bold font-mono text-cz-light-blue text-xs uppercase tracking-[0.24em]">
					{macroLabel} — Assignments
				</span>
				<Button
					type="button"
					onClick={onClose}
					className="btn btn-ghost btn-square btn-xs h-6 w-6 text-cz-cream-dim/70 hover:bg-cz-border/40 hover:text-cz-cream"
					aria-label="Close assignments"
				>
					✕
				</Button>
			</div>

			<div className="max-h-48 space-y-1.5 overflow-y-auto">
				{assignments.length === 0 && (
					<div className="flex h-12 items-center justify-center rounded-lg border border-cz-border/50 border-dashed font-mono text-5xs text-cz-cream-dim/50 uppercase tracking-[0.18em]">
						No assignments
					</div>
				)}
				{assignments.map((assignment, idx) => (
					<MacroAssignmentRow
						key={`${assignment.macroIndex}-${assignment.destination}`}
						assignment={assignment}
						onToggleEnabled={() => handleToggle(idx)}
						onRemove={() => handleRemove(idx)}
						onDepthChange={(depth) => handleDepth(idx, depth)}
					/>
				))}
			</div>

			{showAddPicker ? (
				<div className="mt-2 max-h-48 space-y-1.5 overflow-y-auto rounded-lg border border-cz-border/60 bg-cz-inset p-2">
					{DESTINATION_GROUPS.map((group) => (
						<div key={group.label}>
							<div className="mb-0.5 font-mono text-5xs text-cz-cream-dim/60 uppercase tracking-[0.16em]">
								{group.label}
							</div>
							<div className="grid grid-cols-2 gap-1">
								{group.destinations.map((option) => (
									<Button
										key={option.value}
										type="button"
										onClick={() => handleAdd(option.value)}
										className="btn btn-sm btn-neutral truncate font-mono text-4xs uppercase leading-tight tracking-widest"
									>
										{option.label}
									</Button>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<Button
					type="button"
					onClick={() => setShowAddPicker(true)}
					className="btn btn-sm mt-2 w-full border-cz-border bg-cz-inset font-mono text-5xs text-cz-light-blue uppercase tracking-[0.15em] hover:border-cz-light-blue/60"
				>
					+ Add Parameter
				</Button>
			)}
		</div>
	);
}

type MacroAssignmentRowProps = {
	assignment: MacroAssignment;
	onToggleEnabled: () => void;
	onRemove: () => void;
	onDepthChange: (depth: number) => void;
};

const MacroAssignmentRow = memo(function MacroAssignmentRow({
	assignment,
	onToggleEnabled,
	onRemove,
	onDepthChange,
}: MacroAssignmentRowProps) {
	return (
		<div
			className={`rounded-lg border px-2 py-1.5 transition-colors ${
				assignment.enabled
					? "border-cz-border/60 bg-cz-inset/80"
					: "border-cz-border/30 bg-cz-inset/30 opacity-60"
			}`}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						className="toggle toggle-secondary toggle-xs"
						checked={assignment.enabled}
						onChange={onToggleEnabled}
						aria-label={assignment.enabled ? "Disable" : "Enable"}
					/>
					<span
						className="max-w-28 truncate font-mono text-4xs text-cz-cream-dim uppercase tracking-widest"
						title={getModDestinationLabel(assignment.destination)}
					>
						{getModDestinationLabel(assignment.destination)}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<ControlKnob
						value={assignment.depth}
						onChange={onDepthChange}
						min={-1}
						max={1}
						bipolar
						color="#7f9de4"
						size={36}
						valueFormatter={(v) => v.toFixed(2)}
						valueVisibility="hover"
					/>
					<Button
						type="button"
						onClick={onRemove}
						aria-label="Remove assignment"
						className="btn btn-error btn-xs h-6 min-h-0 w-6 p-0"
					>
						✕
					</Button>
				</div>
			</div>
		</div>
	);
});
