import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function EnvelopeCanvas({
	envelope,
	color,
	large,
}: {
	envelope: StepEnvData;
	color: string;
	large: boolean;
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
			className={`${large ? "h-24" : "h-10"} w-full rounded-sm bg-black/25`}
		/>
	);
}

type CompactEnvelopePresetProps = {
	envKind: EnvTab;
	envelope: StepEnvData;
	color: string;
	onApply: (envelope: StepEnvData) => void;
	large?: boolean;
};

export default memo(function CompactEnvelopePreset({
	envKind,
	envelope,
	color,
	onApply,
	large = false,
}: CompactEnvelopePresetProps) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { title, text, border } = ENVELOPE_CLASSES[envKind];
	const { selectedPreset, presetOptions, handlePresetChange } =
		useEnvelopePresetController({ envelope, onApply });
	const selectedLabel =
		presetOptions.find((option) => option.id === selectedPreset)?.label ??
		"Custom";

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				aria-label={`${title} envelope preset: ${selectedLabel}`}
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen((current) => !current)}
				className={`flex min-w-0 flex-1 flex-col rounded border bg-cz-inset/65 focus:outline-none focus:ring-1 focus:ring-cz-light-blue ${large ? "max-w-[18rem] p-2" : "p-1"} ${border}`}
				data-testid={`simple-envelope-${envKind}`}
			>
				<span
					className={`mb-0.5 font-bold font-mono text-[0.55rem] tracking-[0.16em] ${text}`}
				>
					{title}
				</span>
				<EnvelopeCanvas envelope={envelope} color={color} large={large} />
				<span className="mt-0.5 truncate font-mono text-[0.48rem] text-cz-cream uppercase tracking-[0.1em]">
					{selectedLabel} ▾
				</span>
			</button>
			<Popover
				open={open}
				onClose={() => setOpen(false)}
				triggerRef={triggerRef}
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
								setOpen(false);
							}}
							className="btn btn-ghost btn-sm min-h-0 justify-start rounded-sm border border-transparent px-2 font-mono text-[0.65rem] uppercase aria-selected:border-cz-light-blue aria-selected:bg-cz-inset"
						>
							<span className={`mr-1 size-1.5 rounded-full ${text}`}>●</span>
							{option.label}
						</button>
					))}
				</div>
			</Popover>
		</>
	);
});
