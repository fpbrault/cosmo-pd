import { useEffect, useState } from "react";
import type { StandaloneAppSettings } from "./lib/auv3Bridge";

const DEFAULT_SETTINGS: StandaloneAppSettings = {
	midiChannel: 0,
	keepRunningInBackground: false,
	bufferSize: 128,
};

const BUFFER_SIZES = [128, 256, 512, 1024] as const;

function channelLabel(channel: number) {
	return channel === 0 ? "Omni" : `${channel}`;
}

function clampSettings(settings: Partial<StandaloneAppSettings>) {
	return {
		midiChannel:
			typeof settings.midiChannel === "number"
				? Math.max(0, Math.min(16, Math.round(settings.midiChannel)))
				: DEFAULT_SETTINGS.midiChannel,
		keepRunningInBackground:
			typeof settings.keepRunningInBackground === "boolean"
				? settings.keepRunningInBackground
				: DEFAULT_SETTINGS.keepRunningInBackground,
		bufferSize: BUFFER_SIZES.includes(
			settings.bufferSize as (typeof BUFFER_SIZES)[number],
		)
			? (settings.bufferSize as StandaloneAppSettings["bufferSize"])
			: DEFAULT_SETTINGS.bufferSize,
	};
}

export default function Auv3StandaloneSettingsSection() {
	const [settings, setSettings] =
		useState<StandaloneAppSettings>(DEFAULT_SETTINGS);

	useEffect(() => {
		let cancelled = false;
		window
			.__czGetStandaloneAppSettings?.()
			.then((next) => {
				if (!cancelled) {
					setSettings(clampSettings(next));
				}
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, []);

	const updateSettings = (patch: Partial<StandaloneAppSettings>) => {
		const next = clampSettings({ ...settings, ...patch });
		setSettings(next);
		void window
			.__czSetStandaloneAppSettings?.(next)
			.then((applied) => setSettings(clampSettings(applied)))
			.catch(() => {});
	};

	return (
		<div className="space-y-3 border-cz-border/70 border-t pt-3">
			<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.18em]">
				AUv3 App
			</p>
			<div className="space-y-1.5">
				<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
					MIDI Channel
				</p>
				<select
					className="select select-xs w-full border-cz-border bg-cz-inset font-mono text-[0.6rem] text-cz-cream"
					value={String(settings.midiChannel)}
					onChange={(event) =>
						updateSettings({
							midiChannel: Number.parseInt(event.currentTarget.value, 10),
						})
					}
				>
					{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
						(channel) => (
							<option key={`midi-channel-${channel}`} value={channel}>
								{channelLabel(channel)}
							</option>
						),
					)}
				</select>
			</div>
			<div className="flex items-center justify-between gap-3">
				<span className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
					Run In Background
				</span>
				<input
					type="checkbox"
					className="toggle toggle-sm"
					checked={settings.keepRunningInBackground}
					onChange={(event) =>
						updateSettings({
							keepRunningInBackground: event.currentTarget.checked,
						})
					}
				/>
			</div>
			<div className="space-y-1.5">
				<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
					Buffer Size
				</p>
				<div className="flex gap-1">
					{BUFFER_SIZES.map((bufferSize) => (
						<button
							key={`buffer-${bufferSize}`}
							type="button"
							onClick={() => updateSettings({ bufferSize })}
							className={`btn btn-xs flex-1 border px-1 text-[0.6rem] ${
								settings.bufferSize === bufferSize
									? "border-cz-gold bg-cz-gold/10 text-cz-gold"
									: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
							}`}
						>
							{bufferSize}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
