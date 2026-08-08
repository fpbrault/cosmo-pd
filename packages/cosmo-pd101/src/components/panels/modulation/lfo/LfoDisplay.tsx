import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

interface LfoDisplayProps {
	id: 1 | 2;
	color: string;
	waveform: string;
	symmetry: number;
	offset: number;
	depth: number;
	phase: number;
	rateHz: number;
	animate: boolean;
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
}: Pick<
	LfoDisplayProps,
	"waveform" | "symmetry" | "offset" | "depth" | "phase"
>) {
	const width = 220;
	const centerY = 28;
	const amp = 6 + clamp01(depth) * 14;
	const x = (((phase % 1) + 1) % 1) * width;
	const sample = sampleLfoWaveform(waveform, symmetry, phase, Math.floor(x));
	const shaped = Math.max(-1, Math.min(1, sample + offset));
	const y = centerY - shaped * amp;
	return { x, y };
}

export default function LfoDisplay({
	id,
	color,
	waveform,
	symmetry,
	offset,
	depth,
	phase,
	rateHz,
	animate,
	transportStatus,
	showLoop,
}: LfoDisplayProps) {
	const { t } = useTranslation("synth");
	const markerRef = useRef<SVGCircleElement | null>(null);
	const phaseRef = useRef(phase);
	const previewPath = useMemo(
		() => lfoPreviewPath(waveform, symmetry, offset, depth),
		[depth, offset, symmetry, waveform],
	);
	const point = lfoPlayheadPoint({ waveform, symmetry, offset, depth, phase });

	useEffect(() => {
		phaseRef.current = phase;
		const marker = markerRef.current;
		if (!marker) {
			return;
		}
		const nextPoint = lfoPlayheadPoint({
			waveform,
			symmetry,
			offset,
			depth,
			phase,
		});
		marker.setAttribute("cx", String(nextPoint.x));
		marker.setAttribute("cy", String(nextPoint.y));
	}, [depth, offset, phase, symmetry, waveform]);

	useEffect(() => {
		if (!animate || rateHz <= 0) {
			return;
		}

		let rafId = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			phaseRef.current = (phaseRef.current + dt * rateHz) % 1;
			const marker = markerRef.current;
			if (marker) {
				const nextPoint = lfoPlayheadPoint({
					waveform,
					symmetry,
					offset,
					depth,
					phase: phaseRef.current,
				});
				marker.setAttribute("cx", String(nextPoint.x));
				marker.setAttribute("cy", String(nextPoint.y));
			}
			rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [animate, depth, offset, rateHz, symmetry, waveform]);

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
					d={previewPath}
					fill="none"
					stroke={`url(#lfo-preview-${id})`}
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<circle
					ref={markerRef}
					cx={point.x}
					cy={point.y}
					r={4.5}
					fill={color}
					stroke={color}
				/>
			</svg>
			<div className="mt-0.5 flex items-center justify-between font-mono text-5xs text-cz-cream/55 uppercase tracking-[0.18em]">
				<span>{transportStatus}</span>
				{showLoop ? <span>{t("lfo.loop")}</span> : null}
			</div>
		</div>
	);
}
