import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { drawEnvPreview, normalizeEnvelope } from "./stepEnvelopeGeometry";

interface StepEnvelopePreviewProps {
	env: StepEnvData;
	color: string;
	title: string;
	active?: boolean;
	onClick: () => void;
}

export const StepEnvelopePreview = memo(function StepEnvelopePreview({
	env,
	color,
	title,
	active = false,
	onClick,
}: StepEnvelopePreviewProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const normalizedEnv = useMemo(() => normalizeEnvelope(env), [env]);
	const drawPreview = useCallback(() => {
		if (canvasRef.current) {
			drawEnvPreview(canvasRef.current, normalizedEnv, color, null, [], true);
		}
	}, [color, normalizedEnv]);
	const tooltip = `Select the ${title} envelope for this line.`;
	const hoverHandlers = useHoverInfoHandlers(tooltip);

	useEffect(() => {
		drawPreview();
		const canvas = canvasRef.current;
		if (!canvas || typeof ResizeObserver === "undefined") {
			return;
		}

		const observer = new ResizeObserver(drawPreview);
		observer.observe(canvas);
		return () => observer.disconnect();
	}, [drawPreview]);

	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			aria-label={`Show ${title} envelope`}
			title={tooltip}
			data-hover-info={tooltip}
			{...hoverHandlers}
			className={`group min-w-0 rounded-md border bg-cz-inset/80 p-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-cz-light-blue ${
				active
					? "border-cz-gold/70 shadow-[0_0_0_1px_rgba(251,191,36,0.28)]"
					: "border-cz-border/70 hover:border-cz-cream/50"
			}`}
		>
			<canvas
				ref={canvasRef}
				width={220}
				height={50}
				className="block @max-[780px]:hidden h-10 w-full rounded bg-black/25"
			/>
			<div className="mt-1 flex items-center justify-between gap-2 px-0.5">
				<span className="truncate font-semibold text-[0.55rem] text-cz-cream-dim uppercase tracking-[0.18em] group-hover:text-cz-cream">
					{title}
				</span>
				<span
					className={`h-1.5 w-1.5 shrink-0 rounded-full ${
						active ? "bg-cz-gold" : "bg-cz-border"
					}`}
				/>
			</div>
		</button>
	);
});
