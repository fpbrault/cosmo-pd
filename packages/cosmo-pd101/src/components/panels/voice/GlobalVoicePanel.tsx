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
					<div className="min-w-0">
						<div className="cz-light-blue mb-0.5 text-center">Portamento</div>
						<div className="mt-0.5 flex justify-center gap-1">
							<Button
								active={portamentoMode === "rate"}
								onClick={() => setPortamentoMode("rate")}
								title={PORTAMENTO_MODE_TOOLTIPS.rate}
								className={`btn btn-xs px-3 py-1 tracking-wide ${
									portamentoMode === "rate"
										? "btn-primary"
										: "btn-outline border-cz-border text-cz-cream/70"
								}`}
							>
								Rate
							</Button>
							<Button
								active={portamentoMode === "time"}
								onClick={() => setPortamentoMode("time")}
								title={PORTAMENTO_MODE_TOOLTIPS.time}
								className={`btn btn-xs px-3 py-1 tracking-wide ${
									portamentoMode === "time"
										? "btn-primary"
										: "btn-outline border-cz-border text-cz-cream/70"
								}`}
							>
								Time
							</Button>
						</div>
						<div className="mt-0.5 flex justify-center">
							{portamentoMode === "rate" ? (
								<SynthParamKnob
									paramKey="portamentoRate"
									value={portamentoRate}
									min={0.01}
									max={100}
									step={0.01}
									onChange={setPortamentoRate}
									color="#7f9de4"
									label="Rate"
								/>
							) : (
								<SynthParamKnob
									paramKey="portamentoTime"
									value={portamentoTime}
									onChange={setPortamentoTime}
									color="#7f9de4"
									label="Time"
								/>
							)}
						</div>
					</div>

					<div className="grid grid-cols-[auto_1fr_auto] items-end gap-1.5 pt-0.5">
						<div className="flex justify-center">
							<SynthParamKnob
								paramKey="pitchBendRange"
								value={pitchBendRange}
								min={0}
								max={24}
								step={1}
								onChange={setPitchBendRange}
								color="#5bc8d4"
								label="Bend"
							/>
						</div>
						<div className="flex justify-center">
							<VelocityCurvePreview curve={velocityCurve} />
						</div>
						<div className="flex justify-center">
							<SynthParamKnob
								paramKey="velocityCurve"
								value={velocityCurve}
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
