import type { ReactNode, RefObject } from "react";
import Button from "@/components/controls/Button";
import Popover from "@/components/primitives/Popover";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

export function KeyboardSettingsPopover({
	open,
	triggerRef,
	onClose,
	extraSettings,
}: {
	open: boolean;
	triggerRef: RefObject<Element | null>;
	onClose: () => void;
	extraSettings?: ReactNode;
}) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const pcKeyboardOverlayVisible = useSynthUiStore(
		(s) => s.pcKeyboardOverlayVisible,
	);
	const debugEnabled = useSynthUiStore((s) => s.debugEnabled);
	const displayQualityOverride = useSynthUiStore(
		(s) => s.displayQualityOverride,
	);
	const setKeyboardOctaves = useSynthUiStore((s) => s.setKeyboardOctaves);
	const setKeyboardRange = useSynthUiStore((s) => s.setKeyboardRange);
	const setKeyboardInputMode = useSynthUiStore((s) => s.setKeyboardInputMode);
	const setPcKeyboardOverlayVisible = useSynthUiStore(
		(s) => s.setPcKeyboardOverlayVisible,
	);
	const setDebugEnabled = useSynthUiStore((s) => s.setDebugEnabled);
	const setDisplayQualityOverride = useSynthUiStore(
		(s) => s.setDisplayQualityOverride,
	);

	return (
		<Popover
			open={open}
			onClose={onClose}
			triggerRef={triggerRef}
			role="dialog"
			ariaLabel="Keyboard settings"
			placement="top-end"
		>
			<div className="w-[min(26rem,94vw)] p-3">
				<div className="mb-2 flex items-center justify-between px-1">
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.18em]">
						Settings
					</p>
				</div>
				<div className="space-y-3">
					<div className="space-y-1.5">
						<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Octave Range
						</p>
						<div className="flex gap-1">
							{[-2, -1, 0, 1, 2].map((value) => (
								<Button
									key={`range-${value}`}
									type="button"
									onClick={() => setKeyboardRange(value)}
									className={`btn btn-sm flex-1 border text-xs ${
										keyboardRange === value
											? "border-cz-gold bg-cz-gold/10 text-cz-gold"
											: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
									}`}
								>
									{value > 0 ? `+${value}` : `${value}`}
								</Button>
							))}
						</div>
					</div>
					<div className="space-y-1.5">
						<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Octaves
						</p>
						<div className="flex gap-1">
							{[1, 2, 3, 4, 5].map((value) => (
								<Button
									key={`octaves-${value}`}
									type="button"
									onClick={() => setKeyboardOctaves(value)}
									className={`btn btn-sm flex-1 border text-xs ${
										keyboardOctaves === value
											? "border-cz-gold bg-cz-gold/10 text-cz-gold"
											: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
									}`}
								>
									{value}
								</Button>
							))}
						</div>
					</div>
					<div className="space-y-1.5">
						<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Key Touch
						</p>
						<div className="flex gap-1">
							<Button
								type="button"
								onClick={() => setKeyboardInputMode("velocity")}
								className={`btn btn-sm flex-1 border text-xs ${
									keyboardInputMode === "velocity"
										? "border-cz-gold bg-cz-gold/10 text-cz-gold"
										: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
								}`}
							>
								Velocity
							</Button>
							<Button
								type="button"
								onClick={() => setKeyboardInputMode("aftertouch")}
								className={`btn btn-sm flex-1 border text-xs ${
									keyboardInputMode === "aftertouch"
										? "border-cz-gold bg-cz-gold/10 text-cz-gold"
										: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
								}`}
							>
								Aftertouch
							</Button>
						</div>
						<p className="pt-1 font-mono text-4xs text-cz-cream-dim/60">
							{keyboardInputMode === "velocity"
								? "Press position on key sets velocity. Top = 127, bottom = 1."
								: "Note-on uses default velocity. Drag up after pressing for aftertouch."}
						</p>
					</div>
					<div className="space-y-1.5">
						<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
							PC Key Labels
						</p>
						<div className="flex gap-1">
							<Button
								type="button"
								onClick={() => setPcKeyboardOverlayVisible(true)}
								className={`btn btn-sm flex-1 border text-xs ${
									pcKeyboardOverlayVisible
										? "border-cz-gold bg-cz-gold/10 text-cz-gold"
										: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
								}`}
							>
								Show
							</Button>
							<Button
								type="button"
								onClick={() => setPcKeyboardOverlayVisible(false)}
								className={`btn btn-sm flex-1 border text-xs ${
									!pcKeyboardOverlayVisible
										? "border-cz-gold bg-cz-gold/10 text-cz-gold"
										: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
								}`}
							>
								Hide
							</Button>
						</div>
						<p className="pt-1 font-mono text-4xs text-cz-cream-dim/60">
							Shows PC keyboard key labels on the on-screen mini keyboard.
						</p>
					</div>
					<div className="space-y-2 border-cz-border border-t pt-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-mono text-3xs text-cz-gold uppercase tracking-[0.18em]">
									Debug Diagnostics
								</p>
								<p className="mt-1 max-w-[18rem] font-mono text-4xs text-cz-cream-dim/60">
									Shows live scope FPS, display quality, long tasks, and audio
									engine load.
								</p>
							</div>
							<button
								type="button"
								role="switch"
								aria-checked={debugEnabled}
								className={`relative h-5 w-9 rounded-full border transition-colors ${debugEnabled ? "border-cz-gold bg-cz-gold/25" : "border-cz-border bg-cz-inset"}`}
								onClick={() => setDebugEnabled(!debugEnabled)}
								aria-label="Enable debug diagnostics"
							>
								<span
									className={`absolute top-0.5 size-3.5 rounded-full transition-transform ${debugEnabled ? "translate-x-4 bg-cz-gold" : "translate-x-0.5 bg-cz-cream/50"}`}
								/>
							</button>
						</div>
						<div className="space-y-1.5">
							<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
								Display Quality
							</p>
							<div className="grid grid-cols-4 gap-1">
								{(["auto", "high", "balanced", "low"] as const).map(
									(quality) => (
										<Button
											key={quality}
											type="button"
											onClick={() => setDisplayQualityOverride(quality)}
											className={`btn btn-sm border text-[0.58rem] uppercase ${displayQualityOverride === quality ? "border-cz-gold bg-cz-gold/10 text-cz-gold" : "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"}`}
											aria-pressed={displayQualityOverride === quality}
										>
											{quality}
										</Button>
									),
								)}
							</div>
							<p className="font-mono text-4xs text-cz-cream-dim/60">
								Auto adapts to keep the display responsive. Manual quality is
								remembered locally.
							</p>
						</div>
					</div>
					{extraSettings}
				</div>
			</div>
		</Popover>
	);
}
