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
		<div className="rounded-sm border border-cz-border bg-cz-inset/70 p-2.5 shadow-inner">
			<div className="mb-2 flex items-center gap-2">
				<span className="h-1.5 w-1.5 rounded-full bg-cz-gold/80 shadow-[0_0_5px_rgba(223,226,0,0.45)]" />
				<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.2em]">
					{title}
				</p>
			</div>
			{children}
		</div>
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
		<div className="grid grid-cols-2 gap-2">
			<GlobalSection title={t("globalVoice.transportSection")}>
				<div className="flex items-center gap-2">
					<label className="min-w-0 flex-1">
						<span className="sr-only">{t("globalVoice.tempo")}</span>
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
								if (!Number.isFinite(nextValue)) return;
								setTempoBpm(Math.min(300, Math.max(20, nextValue)));
							}}
							className="input input-sm h-8 w-full border-cz-border bg-cz-body font-mono text-xs text-cz-cream disabled:text-cz-cream/45"
						/>
					</label>
					<span className="font-mono text-4xs text-cz-cream/45 uppercase tracking-[0.15em]">
						{t("globalVoice.bpm")}
					</span>
				</div>
				<p className="mt-1.5 font-mono text-4xs text-cz-cream-dim/55">
					{transport.available ? "Controlled by host transport" : "Manual synth tempo"}
				</p>
			</GlobalSection>

			<GlobalSection title={t("globalVoice.voiceSection")}>
				<label className="block">
					<span className="sr-only">{t("globalVoice.voiceLimit")}</span>
					<select
						className="select select-sm h-8 w-full border-cz-border bg-cz-body font-mono text-xs text-cz-cream"
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
										{v} {v === 1 ? "voice" : "voices"}
									</option>
								);
							},
						)}
					</select>
				</label>
				<p className="mt-1.5 font-mono text-4xs text-cz-cream-dim/55">
					Maximum simultaneous voices
				</p>
			</GlobalSection>
		</div>
	);
}
