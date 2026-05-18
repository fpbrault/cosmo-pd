import { memo } from "react";
import Button from "@/components/controls/Button";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import type { AsidePanelComponent } from "@/components/layout/AsidePanelSwitcher";
import SynthPanelContainer from "@/components/layout/SynthPanelContainer";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { PORTAMENTO_MODE_TOOLTIPS } from "@/lib/synth/paramMeta";
import { applyVelocityCurve } from "@/lib/synth/velocityCurve";

const W = 72;
const H = 42;
const PAD = 4;
const INNER_W = W - PAD * 2;
const INNER_H = H - PAD * 2;

function buildCurvePath(curve: number): string {
	const pts = Array.from({ length: 33 }, (_, i) => {
		const x = i / 32;
		const y = applyVelocityCurve(x, curve);
		return `${(PAD + x * INNER_W).toFixed(1)},${(PAD + (1 - y) * INNER_H).toFixed(1)}`;
	});
	return `M ${pts.join(" L ")}`;
}

const VelocityCurvePreview = memo(function VelocityCurvePreview({
	curve,
}: {
	curve: number;
}) {
	return (
		<svg
			aria-label={`Velocity curve preview. Curve value: ${curve.toFixed(2)}`}
			width={W}
			height={H}
			viewBox={`0 0 ${W} ${H}`}
			className="rounded border border-cz-border bg-cz-lcd-bg"
			style={{ imageRendering: "pixelated" }}
		>
			{/* Grid lines */}
			<line
				x1={PAD}
				y1={PAD + INNER_H / 2}
				x2={PAD + INNER_W}
				y2={PAD + INNER_H / 2}
				stroke="rgba(255,255,255,0.08)"
				strokeWidth={0.5}
			/>
			<line
				x1={PAD + INNER_W / 2}
				y1={PAD}
				x2={PAD + INNER_W / 2}
				y2={PAD + INNER_H}
				stroke="rgba(255,255,255,0.08)"
				strokeWidth={0.5}
			/>
			{/* Linear reference */}
			<line
				x1={PAD}
				y1={PAD + INNER_H}
				x2={PAD + INNER_W}
				y2={PAD}
				stroke="rgba(255,255,255,0.15)"
				strokeWidth={0.5}
				strokeDasharray="2,2"
			/>
			{/* Curve */}
			<path
				d={buildCurvePath(curve)}
				fill="none"
				stroke="#7f9de4"
				strokeWidth={1.5}
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
		</svg>
	);
});

const GlobalVoicePanel: AsidePanelComponent<"global"> = Object.assign(
	function GlobalVoicePanel() {
		const { value: velocityCurve, setValue: setVelocityCurve } =
			useSynthParam("velocityCurve");
		const { value: pitchBendRange, setValue: setPitchBendRange } =
			useSynthParam("pitchBendRange");
		const { value: portamentoMode, setValue: setPortamentoMode } =
			useSynthParam("portamentoMode");
		const { value: portamentoRate, setValue: setPortamentoRate } =
			useSynthParam("portamentoRate");
		const { value: portamentoTime, setValue: setPortamentoTime } =
			useSynthParam("portamentoTime");
		return (
			<SynthPanelContainer className="p-2">
				<div className="space-y-2">
					<div className="grid grid-cols-[auto_1fr_auto] items-end gap-1.5 pt-0.5">
						<div className="mt-0.5 flex flex-col justify-center">
							<Button
								type="button"
								onClick={() =>
									setPortamentoMode(
										(portamentoMode as string) === "rate" ? "time" : "rate",
									)
								}
								title={
									PORTAMENTO_MODE_TOOLTIPS[
										(portamentoMode as string) === "rate" ? "time" : "rate"
									]
								}
								className={`btn btn-xs h-fit min-h-0 w-fit self-center justify-self-center p-2 ${
									(portamentoMode as string) === "rate"
										? "border-amber-500/60 bg-amber-500/20 text-amber-300"
										: "border-cz-border bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
								}`}
							>
								{(portamentoMode as string) === "rate" ? "● Rate" : "○ Time"}
							</Button>
							{(portamentoMode as string) === "rate" ? (
								<SynthParamKnob
									paramKey="portamentoRate"
									value={portamentoRate as number}
									min={0.01}
									max={100}
									step={0.01}
									onChange={setPortamentoRate}
									color="#7f9de4"
									label="Portamento"
								/>
							) : (
								<SynthParamKnob
									paramKey="portamentoTime"
									value={portamentoTime as number}
									onChange={setPortamentoTime}
									color="#7f9de4"
									label="Portamento"
								/>
							)}
						</div>
						<div className="flex justify-center">
							<SynthParamKnob
								paramKey="pitchBendRange"
								value={pitchBendRange as number}
								min={0}
								max={24}
								step={1}
								onChange={setPitchBendRange}
								color="#5bc8d4"
								label="Pitch Bend"
							/>
						</div>
						<div className="flex flex-col justify-center">
							<VelocityCurvePreview curve={velocityCurve as number} />
							<SynthParamKnob
								paramKey="velocityCurve"
								value={velocityCurve as number}
								onChange={setVelocityCurve}
								min={-1}
								color="#c46eb4"
								label="Vel Curve"
							/>
						</div>
					</div>
				</div>
			</SynthPanelContainer>
		);
	},
	{
		panelId: "global" as const,
		panelTab: { topLabel: "Global", bottomLabel: "" },
	},
);

export default GlobalVoicePanel;
