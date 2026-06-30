import { useTranslation } from "react-i18next";

interface RandomDisplayProps {
	color: string;
	values: number[];
	currentValue: number;
	phase: number;
	live: boolean;
}

const WIDTH = 220;
const CENTER_Y = 28;
const AMPLITUDE = 18;

function clampSigned(value: number): number {
	return Math.max(-1, Math.min(1, value));
}

function valueToY(value: number): number {
	return CENTER_Y - clampSigned(value) * AMPLITUDE;
}

function randomPreviewPath(values: number[]): string {
	if (values.length < 1) {
		return `M0 ${CENTER_Y} H${WIDTH}`;
	}

	const stepWidth = WIDTH / Math.max(1, values.length);
	let d = `M0 ${valueToY(values[0]).toFixed(2)} `;

	for (let i = 0; i < values.length; i++) {
		const xEnd = Math.min(WIDTH, (i + 1) * stepWidth).toFixed(2);
		d += `H${xEnd} `;
		if (i < values.length - 1) {
			const nextY = valueToY(values[i + 1]).toFixed(2);
			d += `V${nextY} `;
		}
	}

	return d.trim();
}

export default function RandomDisplay({
	color,
	values,
	currentValue,
	phase,
	live,
}: RandomDisplayProps) {
	const { t } = useTranslation("synth");
	const safePhase = ((phase % 1) + 1) % 1;
	const markerX = live ? WIDTH : safePhase * WIDTH;
	const markerY = valueToY(currentValue);

	return (
		<div className="col-span-full rounded-md border border-cz-border/55 bg-cz-bg/35 px-2 py-1.5">
			<svg
				viewBox="0 0 220 56"
				className="h-14 w-full"
				data-testid="random-display"
				data-current-value={currentValue.toFixed(4)}
				data-live={live ? "true" : "false"}
			>
				<title>{t("randomModule.displayTitle")}</title>
				<defs>
					<linearGradient id="random-preview" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor={color} stopOpacity="0.55" />
						<stop offset="100%" stopColor={color} stopOpacity="0.9" />
					</linearGradient>
				</defs>
				<line
					x1="0"
					y1={CENTER_Y}
					x2={WIDTH}
					y2={CENTER_Y}
					stroke="rgba(255,255,255,0.1)"
					strokeWidth="1"
				/>
				<path
					d={randomPreviewPath(values)}
					fill="none"
					stroke="url(#random-preview)"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<circle
					cx={markerX}
					cy={markerY}
					r="4.5"
					fill={color}
					stroke="rgba(10,10,10,0.85)"
					strokeWidth="1"
				/>
			</svg>
		</div>
	);
}
