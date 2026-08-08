import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import {
	MAX_VOICE_LIMIT,
	MIN_VOICE_LIMIT,
	useGlobalSynthSettings,
} from "@/features/synth/globalSynthSettingsStore";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import { useSynthParam } from "@/features/synth/SynthParamController";

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
	const { value: tempoBpm, setValue: setTempoBpm } = useSynthParam("tempoBpm");
	const tempoDisplayBpm =
		typeof tempoBpm === "number" && Number.isFinite(tempoBpm) ? tempoBpm : 120;
	const voiceLimit = useGlobalSynthSettings((s) => s.voiceLimit);
	const setVoiceLimit = useGlobalSynthSettings((s) => s.setVoiceLimit);
	const tempoTooltip = t("tooltips.voice.tempo");
	const voiceLimitTooltip = t("tooltips.voice.voiceLimit");
	const tempoHoverHandlers = useHoverInfoHandlers(tempoTooltip);
	const voiceLimitHoverHandlers = useHoverInfoHandlers(voiceLimitTooltip);
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
						title={tempoTooltip}
						data-hover-info={tempoTooltip}
						{...tempoHoverHandlers}
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
			<GlobalSection title={t("globalVoice.voiceSection")}>
				<label className="form-control w-full">
					<div className="label">
						<span className="label-text font-mono text-4xs text-cz-cream/55 uppercase tracking-[0.24em]">
							{t("globalVoice.voiceLimit")}
						</span>
					</div>
					<select
						className="select select-sm select-bordered bg-neutral font-mono text-cz-cream/80"
						value={voiceLimit}
						onChange={(e) => setVoiceLimit(Number(e.target.value))}
						aria-label={t("globalVoice.voiceLimitAria", {
							value: voiceLimit,
						})}
						title={voiceLimitTooltip}
						data-hover-info={voiceLimitTooltip}
						{...voiceLimitHoverHandlers}
					>
						{Array.from(
							{ length: MAX_VOICE_LIMIT - MIN_VOICE_LIMIT + 1 },
							(_, i) => {
								const v = MIN_VOICE_LIMIT + i;
								return (
									<option key={v} value={v}>
										{v}
									</option>
								);
							},
						)}
					</select>
				</label>
			</GlobalSection>
		</div>
	);
}
