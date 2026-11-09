import type { ReactNode, RefObject } from "react";
import Button from "@/components/controls/Button";
import GlobalVoicePanel from "@/components/panels/voice/GlobalVoicePanel";
import Popover from "@/components/primitives/Popover";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

function SettingsSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="rounded-sm border border-cz-border/80 bg-cz-panel/70 p-2.5 shadow-inner">
			<div className="mb-2 flex items-center gap-2">
				<span className="h-px flex-1 bg-cz-border/70" />
				<h3 className="font-mono text-3xs text-cz-light-blue/80 uppercase tracking-[0.22em]">
					{title}
				</h3>
				<span className="h-px flex-1 bg-cz-border/70" />
			</div>
			{children}
		</section>
	);
}

const choiceClass = (active: boolean) =>
	`btn btn-sm flex-1 border text-xs ${
		active
			? "border-cz-gold bg-cz-gold/10 text-cz-gold"
			: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
	}`;

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
			ariaLabel="Synth settings"
			placement="top-end"
			initialFocus={-1}
		>
			<div className="w-[min(30rem,94vw)] bg-cz-body/95 p-3">
				<div className="mb-3 flex items-center gap-2 px-1">
					<span className="h-2 w-2 rounded-full bg-cz-gold shadow-[0_0_6px_rgba(223,226,0,0.55)]" />
					<p className="font-mono text-2xs text-cz-cream uppercase tracking-[0.22em]">
						Settings
					</p>
					<span className="h-px flex-1 bg-cz-border" />
				</div>

				<div className="max-h-[min(34rem,75vh)] space-y-2.5 overflow-y-auto pr-0.5">
					<SettingsSection title="Performance">
						<GlobalVoicePanel />
					</SettingsSection>

					<SettingsSection title="Keyboard">
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
											className={choiceClass(keyboardRange === value)}
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
											className={choiceClass(keyboardOctaves === value)}
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
										className={choiceClass(keyboardInputMode === "velocity")}
									>
										Velocity
									</Button>
									<Button
										type="button"
										onClick={() => setKeyboardInputMode("aftertouch")}
										className={choiceClass(keyboardInputMode === "aftertouch")}
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
										className={choiceClass(pcKeyboardOverlayVisible)}
									>
										Show
									</Button>
									<Button
										type="button"
										onClick={() => setPcKeyboardOverlayVisible(false)}
										className={choiceClass(!pcKeyboardOverlayVisible)}
									>
										Hide
									</Button>
								</div>
							</div>
						</div>
					</SettingsSection>

					{extraSettings}
				</div>
			</div>
		</Popover>
	);
}
