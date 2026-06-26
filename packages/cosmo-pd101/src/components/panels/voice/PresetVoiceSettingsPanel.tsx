import { memo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import SynthPanelContainer from "@/components/layout/SynthPanelContainer";
import Card from "@/components/primitives/Card";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { PORTAMENTO_MODE_TOOLTIPS } from "@/lib/synth/paramMeta";
import { applyVelocityCurve } from "@/lib/synth/velocityCurve";

const PREVIEW_W = 56;
const PREVIEW_H = 30;
const PREVIEW_PAD = 3;
const PREVIEW_INNER_W = PREVIEW_W - PREVIEW_PAD * 2;
const PREVIEW_INNER_H = PREVIEW_H - PREVIEW_PAD * 2;

function buildCurvePath(curve: number): string {
	const pts = Array.from({ length: 33 }, (_, i) => {
		const x = i / 32;
		const y = applyVelocityCurve(x, curve);
		return `${(PREVIEW_PAD + x * PREVIEW_INNER_W).toFixed(1)},${(PREVIEW_PAD + (1 - y) * PREVIEW_INNER_H).toFixed(1)}`;
	});
	return `M ${pts.join(" L ")}`;
}

const VelocityCurvePreview = memo(function VelocityCurvePreview({
	curve,
}: {
	curve: number;
}) {
	const { t } = useTranslation("synth");
	return (
		<svg
			aria-label={t("presetVoice.velCurveAria", {
				value: curve.toFixed(2),
			})}
			width={PREVIEW_W}
			height={PREVIEW_H}
			viewBox={`0 0 ${PREVIEW_W} ${PREVIEW_H}`}
			className="rounded border border-cz-border bg-cz-lcd-bg [image-rendering:pixelated]"
		>
			<line
				x1={PREVIEW_PAD}
				y1={PREVIEW_PAD + PREVIEW_INNER_H / 2}
				x2={PREVIEW_PAD + PREVIEW_INNER_W}
				y2={PREVIEW_PAD + PREVIEW_INNER_H / 2}
				stroke="rgba(255,255,255,0.08)"
				strokeWidth={0.5}
			/>
			<line
				x1={PREVIEW_PAD + PREVIEW_INNER_W / 2}
				y1={PREVIEW_PAD}
				x2={PREVIEW_PAD + PREVIEW_INNER_W / 2}
				y2={PREVIEW_PAD + PREVIEW_INNER_H}
				stroke="rgba(255,255,255,0.08)"
				strokeWidth={0.5}
			/>
			<line
				x1={PREVIEW_PAD}
				y1={PREVIEW_PAD + PREVIEW_INNER_H}
				x2={PREVIEW_PAD + PREVIEW_INNER_W}
				y2={PREVIEW_PAD}
				stroke="rgba(255,255,255,0.15)"
				strokeWidth={0.5}
				strokeDasharray="2,2"
			/>
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

export default memo(function PresetVoiceSettingsPanel() {
	const { t } = useTranslation("synth");
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
	const isRateMode = portamentoMode === "rate";
	const nextMode = isRateMode ? "time" : "rate";

	return (
		<SynthPanelContainer>
			<div className="flex h-full min-h-0 flex-col">
				<div className="cz-collapse-header cz-section-slanted-title shrink-0 justify-center py-0">
					{t("presetVoice.title")}
				</div>

				<div className="grid min-h-0 flex-1 grid-cols-3 content-center items-center justify-items-center gap-x-1 gap-y-1.5 bg-cz-panel [grid-template-rows:auto_auto]">
					<Button
						type="button"
						onClick={() => setPortamentoMode(nextMode)}
						title={PORTAMENTO_MODE_TOOLTIPS[nextMode]}
						className={`btn btn-xs h-5 min-h-0 px-2 font-mono text-[0.54rem] uppercase tracking-[0.14em] ${
							isRateMode ? "btn-primary" : "btn-neutral"
						}`}
					>
						{isRateMode ? t("presetVoice.rateMode") : t("presetVoice.timeMode")}
					</Button>
					<div aria-hidden="true" className="h-5" />
					<VelocityCurvePreview curve={velocityCurve as number} />

					<div className="flex items-end justify-center self-end">
						<SynthParamKnob
							paramKey={isRateMode ? "portamentoRate" : "portamentoTime"}
							value={(isRateMode ? portamentoRate : portamentoTime) as number}
							min={isRateMode ? 0.01 : undefined}
							max={isRateMode ? 100 : undefined}
							step={isRateMode ? 0.01 : undefined}
							onChange={isRateMode ? setPortamentoRate : setPortamentoTime}
							color="#7f9de4"
							size={52}
							label={t("presetVoice.portamento")}
						/>
					</div>
					<div className="flex items-end justify-center self-end">
						<SynthParamKnob
							paramKey="pitchBendRange"
							value={pitchBendRange as number}
							min={0}
							max={24}
							step={1}
							onChange={setPitchBendRange}
							color="#5bc8d4"
							size={52}
							label={t("presetVoice.pitchBend")}
						/>
					</div>
					<div className="flex items-end justify-center self-end">
						<SynthParamKnob
							paramKey="velocityCurve"
							value={velocityCurve as number}
							onChange={setVelocityCurve}
							min={-1}
							color="#c46eb4"
							size={44}
							label={t("presetVoice.velCurve")}
						/>
					</div>
				</div>
			</div>
		</SynthPanelContainer>
	);
});
