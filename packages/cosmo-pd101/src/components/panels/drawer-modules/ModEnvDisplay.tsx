import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import {
	adsrPreviewPath,
	type buildAdsrGeometry,
	type estimateEnvelopeMarker,
	type ModEnvPreviewMode,
} from "./modEnvelopePreview";

interface ModEnvDisplayProps {
	previewSvgRef: Ref<SVGSVGElement>;
	envGeometry: ReturnType<typeof buildAdsrGeometry>;
	envMarker: ReturnType<typeof estimateEnvelopeMarker>;
	attack: number;
	decay: number;
	sustain: number;
	release: number;
	mode: ModEnvPreviewMode;
	onDragHandle: (handle: "attack" | "decaySustain" | "release") => void;
}

export default function ModEnvDisplay({
	previewSvgRef,
	envGeometry,
	envMarker,
	attack,
	decay,
	sustain,
	release,
	mode,
	onDragHandle,
}: ModEnvDisplayProps) {
	const { t } = useTranslation("synth");
	return (
		<div className="col-span-full rounded-md border border-cz-border/55 bg-cz-bg/35 px-2 py-1.5">
			<svg ref={previewSvgRef} viewBox="0 0 220 64" className="h-16 w-full">
				<title>{t("modEnv.displayTitle")}</title>
				<defs>
					<linearGradient id="mod-env-preview" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#c24587" stopOpacity="0.55" />
						<stop offset="100%" stopColor="#c24587" stopOpacity="0.9" />
					</linearGradient>
				</defs>
				<line
					x1="0"
					y1="56"
					x2="220"
					y2="56"
					stroke="rgba(255,255,255,0.1)"
					strokeWidth="1"
				/>
				<path
					d={adsrPreviewPath(attack, decay, sustain, release, mode)}
					fill="none"
					stroke="url(#mod-env-preview)"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<g>
					<circle
						cx={envGeometry.x1}
						cy={envGeometry.top}
						r={8}
						fill="transparent"
						onPointerDown={() => onDragHandle("attack")}
						style={{ cursor: "ew-resize" }}
					/>
					<circle
						cx={envGeometry.x1}
						cy={envGeometry.top}
						r={3.5}
						fill="#2a2a2a"
						stroke="#c24587"
						strokeWidth="1.4"
						pointerEvents="none"
					/>
					<circle
						cx={envGeometry.x2}
						cy={envGeometry.ySustain}
						r={8}
						fill="transparent"
						onPointerDown={() => onDragHandle("decaySustain")}
						style={{ cursor: "move" }}
					/>
					<circle
						cx={envGeometry.x2}
						cy={envGeometry.ySustain}
						r={3.5}
						fill="#2a2a2a"
						stroke="#c24587"
						strokeWidth="1.4"
						pointerEvents="none"
					/>
					<circle
						cx={envGeometry.x4}
						cy={envGeometry.bottom}
						r={8}
						fill="transparent"
						onPointerDown={() => onDragHandle("release")}
						style={{ cursor: "ew-resize" }}
					/>
					<circle
						cx={envGeometry.x4}
						cy={envGeometry.bottom}
						r={3.5}
						fill="#2a2a2a"
						stroke="#c24587"
						strokeWidth="1.4"
						pointerEvents="none"
					/>
				</g>
				<circle
					cx={envMarker.x}
					cy={envMarker.y}
					r={3}
					fill="#c24587"
					stroke="rgba(10,10,10,0.85)"
					strokeWidth="1"
				/>
			</svg>
		</div>
	);
}
