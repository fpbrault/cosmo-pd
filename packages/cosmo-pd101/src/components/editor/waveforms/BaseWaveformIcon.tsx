import type { ReactNode } from "react";
import type { BaseWaveform } from "@/lib/synth/bindings/synth";

// viewBox: 0 0 40 24  (mid-y=12, top=4, bottom=20, left=4, right=36)
const PATHS: Record<BaseWaveform, ReactNode> = {
	sine: (
		<polyline
			points="4,12 8,6 12,4 16,6 20,12 24,18 28,20 32,18 36,12"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	),
	cosine: (
		<polyline
			points="4,4 8,6 12,12 16,18 20,20 24,18 28,12 32,6 36,4"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	),
	triangle: (
		<polyline
			points="4,12 12,4 20,12 28,20 36,12"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	),
	saw: (
		<polyline
			points="4,20 28,4 28,20 36,4"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	),
	square: (
		<polyline
			points="4,4 18,4 18,20 32,20 32,4 36,4"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	),
};

interface BaseWaveformIconProps {
	waveform: BaseWaveform;
	size?: number;
	className?: string;
}

export function BaseWaveformIcon({
	waveform,
	size = 36,
	className,
}: BaseWaveformIconProps) {
	return (
		<svg
			width={size}
			height={size * 0.6}
			viewBox="0 0 40 24"
			className={className}
			aria-hidden="true"
		>
			{PATHS[waveform]}
		</svg>
	);
}
