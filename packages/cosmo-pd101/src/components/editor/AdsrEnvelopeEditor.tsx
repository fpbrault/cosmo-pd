import { memo, useEffect, useRef } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import type { AdsrData, CurveShape } from "@/lib/synth/bindings/synth";
import type { AdsrVoiceMarker } from "./adsrEnvelopeGeometry";
import { drawAdsrPreview } from "./adsrEnvelopeGeometry";

const CURVE_OPTIONS: { value: CurveShape; label: string }[] = [
	{ value: "linear", label: "Lin" },
	{ value: "exp", label: "Exp" },
	{ value: "log", label: "Log" },
];

interface AdsrEnvelopeEditorProps {
	title: string;
	env: AdsrData;
	onChange: (env: AdsrData) => void;
	color?: string;
	levelKnobColor?: string;
	voiceMarkers?: AdsrVoiceMarker[];
}

export const AdsrEnvelopeEditor = memo(function AdsrEnvelopeEditor({
	title,
	env,
	onChange,
	color = "#60a5fa",
	levelKnobColor = color,
	voiceMarkers = [],
}: AdsrEnvelopeEditorProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			drawAdsrPreview(canvasRef.current, env, color, voiceMarkers);
		}
	}, [env, color, voiceMarkers]);

	const updateField = <K extends keyof AdsrData>(
		key: K,
		value: AdsrData[K],
	) => {
		onChange({ ...env, [key]: value });
	};

	return (
		<div className="flex h-full flex-col space-y-3">
			<div className="flex items-center justify-between">
				<span className="font-semibold text-2xs text-base-content/70 uppercase tracking-[0.24em]">
					{title}
				</span>
			</div>

			<canvas
				ref={canvasRef}
				width={1200}
				height={200}
				className="max-w-full rounded-xl border border-base-300/60 bg-base-300/30"
				style={{ imageRendering: "auto" }}
			/>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<ControlKnob
					value={env.attackTimeSecs}
					onChange={(v) => updateField("attackTimeSecs", v)}
					min={0.001}
					max={10}
					size={64}
					label="Atk"
					tooltip="Attack time in seconds"
					valueFormatter={(v) => `${v.toFixed(3)}s`}
					color={levelKnobColor}
				/>
				<ControlKnob
					value={env.decayTimeSecs}
					onChange={(v) => updateField("decayTimeSecs", v)}
					min={0.001}
					max={10}
					size={64}
					label="Dec"
					tooltip="Decay time in seconds"
					valueFormatter={(v) => `${v.toFixed(3)}s`}
					color={levelKnobColor}
				/>
				<ControlKnob
					value={env.sustainLevel}
					onChange={(v) => updateField("sustainLevel", v)}
					min={0}
					max={1}
					size={64}
					label="Sus"
					tooltip="Sustain level (0-1)"
					valueFormatter={(v) => `${(v * 100).toFixed(0)}%`}
					color={levelKnobColor}
				/>
				<ControlKnob
					value={env.releaseTimeSecs}
					onChange={(v) => updateField("releaseTimeSecs", v)}
					min={0.001}
					max={10}
					size={64}
					label="Rel"
					tooltip="Release time in seconds"
					valueFormatter={(v) => `${v.toFixed(3)}s`}
					color={levelKnobColor}
				/>
			</div>

			<div className="grid grid-cols-3 gap-3">
				{(
					[
						{ key: "attackCurve" as const, label: "Atk Curve" },
						{ key: "decayCurve" as const, label: "Dec Curve" },
						{ key: "releaseCurve" as const, label: "Rel Curve" },
					] as const
				).map(({ key, label }) => (
					<div key={key}>
						<div className="mb-1 font-semibold text-2xs text-base-content/70 uppercase tracking-[0.24em]">
							{label}
						</div>
						<div className="flex gap-1">
							{CURVE_OPTIONS.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => updateField(key, option.value)}
									aria-pressed={env[key] === option.value}
									className={`flex-1 rounded border px-2 py-1 font-semibold text-[0.6rem] uppercase tracking-[0.15em] transition-colors ${
										env[key] === option.value
											? "border-cz-gold/60 bg-cz-gold/15 text-cz-gold"
											: "border-base-300/60 bg-base-100/40 text-base-content/70 hover:border-base-300"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

export default AdsrEnvelopeEditor;
