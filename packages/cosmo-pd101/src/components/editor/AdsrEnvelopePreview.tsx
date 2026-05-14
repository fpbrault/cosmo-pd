import { memo, useEffect, useRef } from "react";
import type { AdsrData } from "@/lib/synth/bindings/synth";
import { drawAdsrPreview } from "./adsrEnvelopeGeometry";

interface AdsrEnvelopePreviewProps {
	env: AdsrData;
	color: string;
	title: string;
	active?: boolean;
	onClick: () => void;
}

export const AdsrEnvelopePreview = memo(function AdsrEnvelopePreview({
	env,
	color,
	title,
	active = false,
	onClick,
}: AdsrEnvelopePreviewProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			drawAdsrPreview(canvasRef.current, env, color, [], true);
		}
	}, [env, color]);

	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			aria-label={`Show ${title} envelope`}
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
				className="block h-10 w-full rounded bg-black/25"
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
