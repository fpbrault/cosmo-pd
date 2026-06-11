interface LfoDisplayProps {
	id: 1 | 2;
	color: string;
	waveform: string;
	symmetry: number;
	offset: number;
	depth: number;
	phase: number;
	transportStatus: string;
	showLoop: boolean;
}

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, value));
}

function lfoPreviewPath(
	waveform: string,
	symmetry: number,
	offset: number,
	depth: number,
): string {
	const width = 220;
	const centerY = 28;
	const points = 72;
	const amp = 6 + clamp01(depth) * 14;

	let d = "";
	for (let i = 0; i < points; i++) {
		const x = (i / (points - 1)) * width;
		const sample = sampleLfoWaveform(waveform, symmetry, i / (points - 1), i);
		const shaped = Math.max(-1, Math.min(1, sample + offset));
		const y = centerY - shaped * amp;
		d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
	}

	return d.trim();
}

function warpPhase(phase: number, symmetry: number): number {
	const p = ((phase % 1) + 1) % 1;
	const center = 0.5;
	const phaseOffset = (clamp01(symmetry) - center) * 0.8;
	const pivot = Math.max(0.1, Math.min(0.9, center + phaseOffset));
	if (p <= pivot) {
		return (p / pivot) * 0.5;
	}
	return 0.5 + ((p - pivot) / (1 - pivot)) * 0.5;
}

function sampleLfoWaveform(
	waveform: string,
	symmetry: number,
	phase: number,
	index: number,
): number {
	const sym = clamp01(symmetry);
	const warped = warpPhase(phase, sym);
	const duty = Math.max(0.1, Math.min(0.9, 0.5 + (sym - 0.5) * 0.8));

	switch (waveform) {
		case "triangle":
			return warped < duty
				? -1 + (warped / duty) * 2
				: 1 - ((warped - duty) / (1 - duty)) * 2;
		case "square":
			return warped < duty ? 1 : -1;
		case "saw":
			return warped * 2 - 1;
		case "invertedSaw":
			return 1 - warped * 2;
		default:
			return Math.sin(warped * Math.PI * 2 + index * 0.001);
	}
}

function lfoPlayheadPoint({
	waveform,
	symmetry,
	offset,
	depth,
	phase,
}: Omit<LfoDisplayProps, "id" | "color" | "transportStatus" | "showLoop">) {
	const width = 220;
	const centerY = 28;
	const amp = 6 + clamp01(depth) * 14;
	const x = (((phase % 1) + 1) % 1) * width;
	const sample = sampleLfoWaveform(waveform, symmetry, phase, Math.floor(x));
	const shaped = Math.max(-1, Math.min(1, sample + offset));
	const y = centerY - shaped * amp;
	return { x, y };
}

import { useTranslation } from "react-i18next";

export default function LfoDisplay({
	id,
	color,
	waveform,
	symmetry,
	offset,
	depth,
	phase,
	transportStatus,
	showLoop,
}: LfoDisplayProps) {
	const { t } = useTranslation("synth");
	const point = lfoPlayheadPoint({ waveform, symmetry, offset, depth, phase });

	return (
		<div className="col-span-4 rounded-md border border-cz-border/55 bg-cz-bg/35 px-2 py-0.5">
			<svg viewBox="0 0 220 56" className="h-10 w-full" aria-hidden="true">
				<defs>
					<linearGradient id={`lfo-preview-${id}`} x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor={color} stopOpacity="0.55" />
						<stop offset="100%" stopColor={color} stopOpacity="0.9" />
					</linearGradient>
				</defs>
				<line
					x1="0"
					y1="28"
					x2="220"
					y2="28"
					stroke="rgba(255,255,255,0.1)"
					strokeWidth="1"
				/>
				<path
					d={lfoPreviewPath(waveform, symmetry, offset, depth)}
					fill="none"
					stroke={`url(#lfo-preview-${id})`}
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<circle cx={point.x} cy={point.y} r={4.5} fill={color} stroke={color} />
			</svg>
			<div className="mt-0.5 flex items-center justify-between font-mono text-5xs text-cz-cream/55 uppercase tracking-[0.18em]">
				<span>{transportStatus}</span>
				{showLoop ? <span>{t("lfo.loop")}</span> : null}
			</div>
		</div>
	);
}
