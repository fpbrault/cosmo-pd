import { memo, useRef, useState } from "react";
import { MdClose, MdSettings } from "react-icons/md";
import { EnvelopeKeyFollowControl } from "@/components/editor/EnvelopeKeyFollowControl";
import { EnvelopePresetControls } from "@/components/editor/EnvelopePresetControls";
import type { PhaseLineEnvelopeModel } from "@/components/editor/phaseLineTypes";
import StepEnvelopeEditor from "@/components/editor/StepEnvelopeEditor";
import Popover from "@/components/primitives/Popover";
import type { EnvTab } from "@/features/synth/synthUiStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { useEnvelopePresetController } from "../editor/useEnvelopePresetController";
import EnvelopeCanvas from "./EnvelopeCanvas";

const ENVELOPE_CLASSES: Record<
	EnvTab,
	{ title: string; text: string; border: string }
> = {
	dco: {
		title: "DCO",
		text: "text-[#9cb937]",
		border: "border-[#9cb937]/65",
	},
	dcw: {
		title: "DCW",
		text: "text-[#60a5fa]",
		border: "border-[#60a5fa]/65",
	},
	dca: {
		title: "DCA",
		text: "text-[#f97316]",
		border: "border-[#f97316]/65",
	},
};

type CompactEnvelopePresetProps = {
	envKind: EnvTab;
	envelope: StepEnvData;
	color: string;
	onApply: (envelope: StepEnvData) => void;
	lineIndex: 1 | 2;
	lineColor: string;
	envelopes: PhaseLineEnvelopeModel;
	editorOpen: boolean;
	onEditorToggle: () => void;
	onPresetOpen: () => void;
	large?: boolean;
};

export default memo(function CompactEnvelopePreset({
	envKind,
	envelope,
	color,
	onApply,
	lineIndex,
	lineColor,
	envelopes,
	editorOpen,
	onEditorToggle,
	onPresetOpen,
	large = false,
}: CompactEnvelopePresetProps) {
	const [presetOpen, setPresetOpen] = useState(false);
	const presetTriggerRef = useRef<HTMLButtonElement>(null);
	const editorTriggerRef = useRef<HTMLButtonElement>(null);
	const { title, text, border } = ENVELOPE_CLASSES[envKind];
	const { selectedPreset, presetOptions, handlePresetChange } =
		useEnvelopePresetController({ envelope, onApply });
	const selectedLabel =
		presetOptions.find((option) => option.id === selectedPreset)?.label ??
		"Custom";

	return (
		<div
			className={`relative flex min-w-0 flex-1 flex-col rounded border bg-cz-inset/65 ${large ? "max-w-[18rem] p-2" : "p-1"} ${border}`}
			data-testid={`simple-envelope-${envKind}`}
		>
			<span
				className={`mb-0.5 text-center font-bold font-mono text-[0.55rem] tracking-[0.16em] ${text}`}
			>
				{title}
			</span>
			<button
				ref={presetTriggerRef}
				type="button"
				aria-label={`${title} envelope preset: ${selectedLabel}`}
				aria-haspopup="listbox"
				aria-expanded={presetOpen}
				onClick={() =>
					setPresetOpen((current) => {
						if (!current) onPresetOpen();
						return !current;
					})
				}
				className="relative min-w-0 rounded-sm focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			>
				<EnvelopeCanvas envelope={envelope} color={color} large={large} />
			</button>
			<button
				ref={editorTriggerRef}
				type="button"
				aria-label={`Edit Line ${lineIndex} ${title} envelope`}
				aria-haspopup="dialog"
				aria-expanded={editorOpen}
				onClick={(event) => {
					event.stopPropagation();
					setPresetOpen(false);
					onEditorToggle();
				}}
				className="absolute top-0.5 right-0.5 z-10 flex size-4 items-center justify-center rounded-sm bg-cz-inset/80 text-cz-cream/70 hover:text-cz-cream focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			>
				<MdSettings className="size-3" aria-hidden="true" />
			</button>
			<Popover
				open={presetOpen}
				onClose={() => setPresetOpen(false)}
				triggerRef={presetTriggerRef}
				role="listbox"
				ariaLabel={`${title} envelope presets`}
				placement="top"
			>
				<div className="grid max-h-72 w-72 grid-cols-1 overflow-y-auto p-1">
					{presetOptions.map((option) => (
						<button
							key={option.id}
							type="button"
							role="option"
							aria-selected={option.id === selectedPreset}
							onClick={() => {
								handlePresetChange(option.id);
								setPresetOpen(false);
							}}
							className="btn btn-ghost h-auto min-h-0 justify-start gap-2 rounded-sm border border-transparent px-2 py-1 font-mono text-[0.65rem] uppercase aria-selected:border-cz-light-blue aria-selected:bg-cz-inset"
						>
							<span className="w-24 shrink-0" aria-hidden="true">
								<EnvelopeCanvas
									envelope={option.envelope}
									color={color}
									large={false}
								/>
							</span>
							<span className="truncate">{option.label}</span>
						</button>
					))}
				</div>
			</Popover>
			<Popover
				open={editorOpen}
				onClose={onEditorToggle}
				triggerRef={editorTriggerRef}
				role="dialog"
				modal={false}
				closeOnOutsidePress={false}
				ariaLabel={`Edit Line ${lineIndex} ${title} envelope`}
				placement="top"
			>
				<div className="h-[23rem] w-[min(38rem,calc(100vw-2rem))] p-3">
					<StepEnvelopeEditor
						title={`Line ${lineIndex} ${title}`}
						env={envelope}
						onChange={onApply}
						color={color}
						levelKnobColor={lineColor}
						lineIndex={lineIndex}
						envKind={envKind}
						headerActions={
							<EnvelopePresetControls
								envKind={envKind}
								lineIndex={lineIndex}
								envelopes={envelopes}
							/>
						}
						headerRightActions={
							<>
								<EnvelopeKeyFollowControl
									envKind={envKind}
									lineIndex={lineIndex}
									envelopes={envelopes}
								/>
								<button
									type="button"
									aria-label={`Close Line ${lineIndex} ${title} envelope editor`}
									onClick={onEditorToggle}
									className="btn btn-ghost btn-xs size-6 min-h-0 rounded-sm p-0 text-cz-cream/65 hover:text-cz-cream"
								>
									<MdClose className="size-4" />
								</button>
							</>
						}
					/>
				</div>
			</Popover>
		</div>
	);
});
