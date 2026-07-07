import type { RefObject } from "react";
import Button from "@/components/controls/Button";
import Popover from "@/components/primitives/Popover";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

export function KeyboardSettingsPopover({
	open,
	triggerRef,
	onClose,
}: {
	open: boolean;
	triggerRef: RefObject<Element | null>;
	onClose: () => void;
}) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const pcKeyboardOverlayVisible = useSynthUiStore(
		(s) => s.pcKeyboardOverlayVisible,
	);
	const setKeyboardOctaves = useSynthUiStore((s) => s.setKeyboardOctaves);
	const setKeyboardRange = useSynthUiStore((s) => s.setKeyboardRange);
	const setKeyboardInputMode = useSynthUiStore((s) => s.setKeyboardInputMode);
	const setPcKeyboardOverlayVisible = useSynthUiStore(
		(s) => s.setPcKeyboardOverlayVisible,
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
						Keyboard Settings
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
				</div>
			</div>
		</Popover>
	);
}
