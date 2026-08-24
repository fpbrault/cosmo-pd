import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { EnvelopeKeyFollowControl } from "@/components/editor/EnvelopeKeyFollowControl";
import { EnvelopePresetControls } from "@/components/editor/EnvelopePresetControls";
import type { PhaseLineEnvelopeModel } from "@/components/editor/phaseLineTypes";
import StepEnvelopeEditor from "@/components/editor/StepEnvelopeEditor";
import Popover from "@/components/primitives/Popover";
import type { EnvTab } from "@/features/synth/synthUiStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { normalizeEnvelope } from "@/lib/synth/envelopeData";
import { drawEnvPreview } from "../editor/stepEnvelopeGeometry";
import { useEnvelopePresetController } from "../editor/useEnvelopePresetController";

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

export const EnvelopeCanvas = memo(function EnvelopeCanvas({
	envelope,
	color,
	large,
	className = "",
}: {
	envelope: StepEnvData;
	color: string;
	large: boolean;
	className?: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const normalized = useMemo(() => normalizeEnvelope(envelope), [envelope]);
	const draw = useCallback(() => {
		if (canvasRef.current) {
			drawEnvPreview(canvasRef.current, normalized, color, null, [], true);
		}
	}, [color, normalized]);

	useEffect(() => {
		draw();
		const canvas = canvasRef.current;
		if (!canvas || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(draw);
		observer.observe(canvas);
		return () => observer.disconnect();
	}, [draw]);

	return (
		<canvas
			ref={canvasRef}
			width={large ? 240 : 160}
			height={large ? 96 : 48}
			className={`${large ? "h-24" : "h-10"} w-full rounded-sm bg-black/25 ${className}`}
		/>
	);
});

type CompactEnvelopePresetProps = {
	envKind: EnvTab;
	envelope: StepEnvData;
	color: string;
	onApply: (envelope: StepEnvData) => void;
	lineIndex: 1 | 2;
	lineColor: string;
	envelopes: PhaseLineEnvelopeModel;
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
	large = false,
}: CompactEnvelopePresetProps) {
	const [presetOpen, setPresetOpen] = useState(false);
	const [editorOpen, setEditorOpen] = useState(false);
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
			className={`flex min-w-0 flex-1 flex-col rounded border bg-cz-inset/65 ${large ? "max-w-[18rem] p-2" : "p-1"} ${border}`}
			data-testid={`simple-envelope-${envKind}`}
		>
			<span
				className={`mb-0.5 text-center font-bold font-mono text-[0.55rem] tracking-[0.16em] ${text}`}
			>
				{title}
			</span>
			<button
				ref={editorTriggerRef}
				type="button"
				aria-label={`Edit Line ${lineIndex} ${title} envelope`}
				aria-haspopup="dialog"
				aria-expanded={editorOpen}
				onClick={() => setEditorOpen((current) => !current)}
				className="group relative min-w-0 rounded-sm focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			>
				<EnvelopeCanvas envelope={envelope} color={color} large={large} />
				<span className="absolute top-1 right-1 rounded-sm border border-cz-light-blue/50 bg-cz-body/80 px-1 font-mono text-[0.43rem] text-cz-light-blue opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
					Edit
				</span>
			</button>
			<button
				ref={presetTriggerRef}
				type="button"
				aria-label={`${title} envelope preset: ${selectedLabel}`}
				aria-haspopup="listbox"
				aria-expanded={presetOpen}
				onClick={() => setPresetOpen((current) => !current)}
				className="mt-0.5 truncate rounded-sm font-mono text-[0.48rem] text-cz-cream uppercase tracking-[0.1em] hover:bg-cz-body/60 focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			>
				{selectedLabel} ▾
			</button>
			<Popover
				open={presetOpen}
				onClose={() => setPresetOpen(false)}
				triggerRef={presetTriggerRef}
				role="listbox"
				ariaLabel={`${title} envelope presets`}
				placement="top"
			>
				<div className="grid max-h-72 w-48 grid-cols-1 overflow-y-auto p-1">
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
							className="btn btn-ghost btn-sm min-h-0 justify-start rounded-sm border border-transparent px-2 font-mono text-[0.65rem] uppercase aria-selected:border-cz-light-blue aria-selected:bg-cz-inset"
						>
							<span className={`mr-1 size-1.5 rounded-full ${text}`}>●</span>
							{option.label}
						</button>
					))}
				</div>
			</Popover>
			<Popover
				open={editorOpen}
				onClose={() => setEditorOpen(false)}
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
									onClick={() => setEditorOpen(false)}
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
