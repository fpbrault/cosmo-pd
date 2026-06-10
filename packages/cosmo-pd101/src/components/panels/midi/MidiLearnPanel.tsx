import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import Button from "@/components/controls/Button";
import SynthPanelContainer from "@/components/layout/SynthPanelContainer";
import { getMidiLearnTargetLabel } from "@/features/synth/midiLearnRegistry";
import {
	type MidiBinding,
	subscribeMidiLearnState,
	useMidiLearnStore,
} from "@/features/synth/midiLearnStore";

function clampChannelDisplay(value: number): number {
	return Math.min(16, Math.max(1, value));
}

function clampCc(value: number): number {
	return Math.min(127, Math.max(0, value));
}

function formatControlLabel(paramKey: string): string {
	const registeredLabel = getMidiLearnTargetLabel(paramKey);
	if (registeredLabel) {
		return registeredLabel;
	}

	return paramKey
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/(\D)(\d)/g, "$1 $2")
		.replace(/(\d)(\D)/g, "$1 $2")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/^./, (value) => value.toUpperCase());
}

function bindingKey(binding: MidiBinding): string {
	return `${binding.paramKey}:${binding.channel}:${binding.cc}`;
}

type InlineNumberEditorProps = {
	min: number;
	max: number;
	defaultValue: number;
	widthClass: string;
	ariaLabel: string;
	editorRef: RefObject<HTMLInputElement | null>;
	onCommit: (value: number) => void;
	onCancel: () => void;
};

function InlineNumberEditor({
	min,
	max,
	defaultValue,
	widthClass,
	ariaLabel,
	editorRef,
	onCommit,
	onCancel,
}: InlineNumberEditorProps) {
	return (
		<input
			ref={editorRef}
			type="number"
			min={min}
			max={max}
			defaultValue={defaultValue}
			onBlur={(event) => {
				onCommit(Number(event.currentTarget.value || min));
			}}
			onKeyDown={(event) => {
				if (event.key === "Enter") {
					onCommit(Number(event.currentTarget.value || min));
				}
				if (event.key === "Escape") {
					onCancel();
				}
			}}
			className={`h-5 ${widthClass} rounded-sm border border-cz-border bg-cz-inset px-1 text-center font-mono text-3xs text-cz-cream leading-none outline-none focus:border-cz-light-blue`}
			aria-label={ariaLabel}
		/>
	);
}

type ControlTooltipProps = {
	label: string;
};

function ControlTooltip({ label }: ControlTooltipProps) {
	const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

	const handleMouseEnter = useCallback(
		(e: React.MouseEvent<HTMLSpanElement>) => {
			setPos({ x: e.clientX, y: e.clientY });
		},
		[],
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLSpanElement>) => {
			setPos({ x: e.clientX, y: e.clientY });
		},
		[],
	);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <tooltip>
		<span
			className="block truncate"
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
			onMouseLeave={() => setPos(null)}
		>
			{label}
			{pos &&
				createPortal(
					<div
						className="pointer-events-none fixed z-[9999] max-w-xs whitespace-nowrap rounded border border-cz-border bg-cz-panel px-2 py-1 font-mono text-[0.58rem] text-cz-cream tracking-[0.06em] shadow-lg"
						style={{ left: pos.x + 12, top: pos.y - 8 }}
					>
						{label}
					</div>,
					document.body,
				)}
		</span>
	);
}

type MidiBindingRowProps = {
	binding: MidiBinding;
	isEditingChannel: boolean;
	isEditingCc: boolean;
	editorRef: RefObject<HTMLInputElement | null>;
	onStartEditChannel: () => void;
	onStartEditCc: () => void;
	onCommitChannel: (value: number) => void;
	onCommitCc: (value: number) => void;
	onCancelEdit: () => void;
	onRemove: () => void;
};

function MidiBindingRow({
	binding,
	isEditingChannel,
	isEditingCc,
	editorRef,
	onStartEditChannel,
	onStartEditCc,
	onCommitChannel,
	onCommitCc,
	onCancelEdit,
	onRemove,
}: MidiBindingRowProps) {
	const controlLabel = formatControlLabel(binding.paramKey);

	return (
		<tr className="hover:bg-cz-surface/20">
			<td>
				{isEditingChannel ? (
					<InlineNumberEditor
						min={1}
						max={16}
						defaultValue={binding.channel + 1}
						widthClass="w-8"
						ariaLabel={`MIDI channel for ${binding.paramKey}`}
						editorRef={editorRef}
						onCommit={(v) => onCommitChannel(clampChannelDisplay(v) - 1)}
						onCancel={onCancelEdit}
					/>
				) : (
					<button
						type="button"
						className="w-8 text-center text-cz-cream hover:text-cz-light-blue"
						onClick={onStartEditChannel}
					>
						{binding.channel + 1}
					</button>
				)}
			</td>
			<td>
				{isEditingCc ? (
					<InlineNumberEditor
						min={0}
						max={127}
						defaultValue={binding.cc}
						widthClass="w-10"
						ariaLabel={`MIDI CC for ${binding.paramKey}`}
						editorRef={editorRef}
						onCommit={(v) => onCommitCc(clampCc(v))}
						onCancel={onCancelEdit}
					/>
				) : (
					<button
						type="button"
						className="w-10 text-center text-cz-cream hover:text-cz-light-blue"
						onClick={onStartEditCc}
					>
						{binding.cc}
					</button>
				)}
			</td>
			<td className="min-w-0 text-cz-cream">
				<ControlTooltip label={controlLabel} />
			</td>
			<td>
				<Button
					type="button"
					className="btn btn-xs btn-square btn-error h-5"
					onClick={onRemove}
					aria-label={`Remove MIDI binding for ${binding.paramKey}`}
				>
					X
				</Button>
			</td>
		</tr>
	);
}

const MidiLearnPanel = Object.assign(
	function MidiLearnPanel() {
		const setLearnMode = useMidiLearnStore((s) => s.setLearnMode);
		const bindings = useMidiLearnStore((s) => s.bindings);
		const removeBinding = useMidiLearnStore((s) => s.removeBinding);
		const addBinding = useMidiLearnStore((s) => s.addBinding);
		const resetPendingLearnParam = useMidiLearnStore(
			(s) => s.resetPendingLearnParam,
		);

		useEffect(() => {
			setLearnMode(true);
			return () => {
				setLearnMode(false);
				resetPendingLearnParam();
			};
		}, [setLearnMode, resetPendingLearnParam]);

		useEffect(() => {
			const unsubscribe = subscribeMidiLearnState();
			return unsubscribe;
		}, []);

		const bindingList = [...bindings].sort(
			(a, b) =>
				a.channel - b.channel ||
				a.cc - b.cc ||
				a.paramKey.localeCompare(b.paramKey),
		);
		const bindingCount = bindingList.length;
		const [editingCell, setEditingCell] = useState<{
			paramKey: string;
			field: "channel" | "cc";
		} | null>(null);
		const activeEditorRef = useRef<HTMLInputElement | null>(null);

		useEffect(() => {
			if (!editingCell || !activeEditorRef.current) {
				return;
			}

			activeEditorRef.current.focus();
			activeEditorRef.current.select();
		}, [editingCell]);

		return (
			<SynthPanelContainer>
				{bindingCount > 0 ? (
					<div className="scrollbar-thin h-full overflow-y-auto overflow-x-hidden rounded border border-cz-border/60 bg-cz-panel pr-3">
						<table className="table-pin-rows table-pin-cols table-xs table w-full table-fixed">
							<thead>
								<tr className="z-100 bg-cz-panel font-mono text-[0.62rem] text-cz-cream-dim uppercase tracking-[0.14em]">
									<th className="w-6">Ch</th>
									<th className="w-10">CC</th>
									<th className="min-w-0">Control</th>
									<th className="w-6 px-1 py-1" />
								</tr>
							</thead>
							<tbody className="font-mono text-3xs text-cz-cream-dim">
								{bindingList.map((binding) => {
									const key = bindingKey(binding);
									const isEditingChannel =
										editingCell?.paramKey === key &&
										editingCell.field === "channel";
									const isEditingCc =
										editingCell?.paramKey === key && editingCell.field === "cc";
									return (
										<MidiBindingRow
											key={key}
											binding={binding}
											isEditingChannel={isEditingChannel}
											isEditingCc={isEditingCc}
											editorRef={activeEditorRef}
											onStartEditChannel={() =>
												setEditingCell({ paramKey: key, field: "channel" })
											}
											onStartEditCc={() =>
												setEditingCell({ paramKey: key, field: "cc" })
											}
											onCommitChannel={(newChannel) => {
												removeBinding(binding);
												addBinding(binding.paramKey, newChannel, binding.cc);
												setEditingCell(null);
											}}
											onCommitCc={(newCc) => {
												removeBinding(binding);
												addBinding(binding.paramKey, binding.channel, newCc);
												setEditingCell(null);
											}}
											onCancelEdit={() => setEditingCell(null)}
											onRemove={() => removeBinding(binding)}
										/>
									);
								})}
							</tbody>
						</table>
					</div>
				) : (
					<div className="flex h-full items-center justify-center rounded border border-cz-border/60 bg-cz-panel text-center font-mono text-3xs text-base-content/30 uppercase tracking-[0.14em]">
						No MIDI bindings yet
					</div>
				)}
			</SynthPanelContainer>
		);
	},
	{
		panelId: "midi" as const,
		panelTab: { topLabel: "MIDI", bottomLabel: "Learn" },
	},
);

export default MidiLearnPanel;
