import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { normalizeEnvelope } from "@/lib/synth/envelopeData";
import { drawEnvPreview } from "../editor/stepEnvelopeGeometry";

type EnvelopeCanvasProps = {
	envelope: StepEnvData;
	color: string;
	large: boolean;
	className?: string;
};

export default memo(function EnvelopeCanvas({
	envelope,
	color,
	large,
	className = "",
}: EnvelopeCanvasProps) {
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
