import Button from "@/components/controls/Button";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { SynthOverlayModal } from "./SynthOverlayModal";

export function KeyboardSettingsModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const setKeyboardOctaves = useSynthUiStore((s) => s.setKeyboardOctaves);
	const setKeyboardRange = useSynthUiStore((s) => s.setKeyboardRange);
	const setKeyboardInputMode = useSynthUiStore((s) => s.setKeyboardInputMode);

	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title="Keyboard Settings"
			ariaLabel="Keyboard settings"
			widthClassName="w-[min(26rem,94vw)]"
		>
			<div className="space-y-4">
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
			</div>
		</SynthOverlayModal>
	);
}
