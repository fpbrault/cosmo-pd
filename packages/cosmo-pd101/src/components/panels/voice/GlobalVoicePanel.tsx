import { memo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import {
	MAX_VOICE_LIMIT,
	MIN_VOICE_LIMIT,
	useGlobalSynthSettings,
} from "@/features/synth/globalSynthSettingsStore";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
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
	const { t } = useTranslation("synth");
	return (
		<svg
			aria-label={t("globalVoice.velCurveAria", { value: curve.toFixed(2) })}
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

function GlobalSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<fieldset className="fieldset rounded-box border border-cz-cream bg-cz-panel px-3">
			<legend className="fieldset-legend font-mono text-4xs text-cz-cream/60 uppercase tracking-[0.24em]">
				{title}
			</legend>
			{children}
		</fieldset>
	);
}

export default function GlobalVoicePanel() {
	const { t } = useTranslation("synth");
	const transport = useHostTransport();
	const { value: velocityCurve, setValue: setVelocityCurve } =
		useSynthParam("velocityCurve");
	const { value: pitchBendRange, setValue: setPitchBendRange } =
		useSynthParam("pitchBendRange");
	const { value: tempoBpm, setValue: setTempoBpm } = useSynthParam("tempoBpm");
	const { value: portamentoMode, setValue: setPortamentoMode } =
		useSynthParam("portamentoMode");
	const { value: portamentoRate, setValue: setPortamentoRate } =
		useSynthParam("portamentoRate");
	const { value: portamentoTime, setValue: setPortamentoTime } =
		useSynthParam("portamentoTime");
	const tempoDisplayBpm =
		typeof tempoBpm === "number" && Number.isFinite(tempoBpm) ? tempoBpm : 120;
	const voiceLimit = useGlobalSynthSettings((s) => s.voiceLimit);
	const setVoiceLimit = useGlobalSynthSettings((s) => s.setVoiceLimit);
	return (
		<div className="grid grid-cols-2 gap-4">
			<GlobalSection title={t("globalVoice.transportSection")}>
				<label className="input bg-neutral">
					<span className="label pr-2 font-mono text-4xs text-cz-cream/55 uppercase tracking-[0.24em]">
						{t("globalVoice.tempo")}
					</span>
					<input
						type="number"
						min={20}
						max={300}
						step={0.1}
						value={tempoDisplayBpm.toFixed(1)}
						disabled={transport.available}
						onChange={(event) => {
							const nextValue = Number(event.target.value);
							if (!Number.isFinite(nextValue)) {
								return;
							}
							setTempoBpm(Math.min(300, Math.max(20, nextValue)));
						}}
					/>
					<span className="label font-mono text-4xs text-cz-cream/45 uppercase tracking-[0.18em]">
						{t("globalVoice.bpm")}
					</span>
				</label>
			</GlobalSection>

			<GlobalSection title={t("globalVoice.portamentoSection")}>
				<div className="flex flex-col items-center justify-center">
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
						className={`btn btn-xs h-fit min-h-0 px-2 py-1 ${
							(portamentoMode as string) === "rate"
								? "btn-primary"
								: "btn-neutral"
						}`}
					>
						{(portamentoMode as string) === "rate"
							? t("globalVoice.rateMode")
							: t("globalVoice.timeMode")}
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
							label={t("globalVoice.portamento")}
						/>
					) : (
						<SynthParamKnob
							paramKey="portamentoTime"
							value={portamentoTime as number}
							onChange={setPortamentoTime}
							color="#7f9de4"
							label={t("globalVoice.portamento")}
						/>
					)}
				</div>
			</GlobalSection>

			<GlobalSection title={t("globalVoice.expressionSection")}>
				<SynthParamKnob
					paramKey="pitchBendRange"
					value={pitchBendRange as number}
					min={0}
					max={24}
					step={1}
					onChange={setPitchBendRange}
					color="#5bc8d4"
					label={t("globalVoice.pitchBend")}
				/>
			</GlobalSection>
			<GlobalSection title={t("globalVoice.expressionSection")}>
				<div className="flex flex-col items-center justify-center">
					<VelocityCurvePreview curve={velocityCurve as number} />
					<div className="flex justify-center">
						<SynthParamKnob
							paramKey="velocityCurve"
							value={velocityCurve as number}
							onChange={setVelocityCurve}
							min={-1}
							color="#c46eb4"
							label={t("globalVoice.velCurve")}
						/>
					</div>
				</div>
			</GlobalSection>
			<GlobalSection title={t("globalVoice.voiceSection")}>
				<label className="input bg-neutral">
					<span className="label pr-2 font-mono text-4xs text-cz-cream/55 uppercase tracking-[0.24em]">
						{t("globalVoice.voiceLimit")}
					</span>
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="btn btn-xs btn-square btn-ghost"
							disabled={voiceLimit <= MIN_VOICE_LIMIT}
							onClick={() => setVoiceLimit(voiceLimit - 1)}
							aria-label="Decrease voice limit"
						>
							−
						</button>
						<span
							className="min-w-[2ch] text-center font-mono text-cz-cream/80 text-sm tabular-nums"
							role="status"
							aria-label={t("globalVoice.voiceLimitAria", {
								value: voiceLimit,
							})}
						>
							{voiceLimit}
						</span>
						<button
							type="button"
							className="btn btn-xs btn-square btn-ghost"
							disabled={voiceLimit >= MAX_VOICE_LIMIT}
							onClick={() => setVoiceLimit(voiceLimit + 1)}
							aria-label="Increase voice limit"
						>
							+
						</button>
					</div>
				</label>
			</GlobalSection>
		</div>
	);
}
