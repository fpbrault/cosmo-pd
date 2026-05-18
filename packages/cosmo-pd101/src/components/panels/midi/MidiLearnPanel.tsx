import { useCallback } from "react";
import type { AsidePanelComponent } from "@/components/layout/AsidePanelSwitcher";
import SynthPanelContainer from "@/components/layout/SynthPanelContainer";
import { useMidiLearnStore } from "@/features/synth/midiLearnStore";

const MidiLearnPanel: AsidePanelComponent<"midi"> = Object.assign(
	function MidiLearnPanel() {
		const learnMode = useMidiLearnStore((s) => s.learnMode);
		const setLearnMode = useMidiLearnStore((s) => s.setLearnMode);
		const pendingLearnParam = useMidiLearnStore((s) => s.pendingLearnParam);
		const lastCapturedCc = useMidiLearnStore((s) => s.lastCapturedCc);
		const bindings = useMidiLearnStore((s) => s.bindings);
		const clearLastCapturedCc = useMidiLearnStore((s) => s.clearLastCapturedCc);
		const resetPendingLearnParam = useMidiLearnStore(
			(s) => s.resetPendingLearnParam,
		);

		const handleToggle = useCallback(() => {
			if (learnMode) {
				setLearnMode(false);
				clearLastCapturedCc();
				resetPendingLearnParam();
			} else {
				setLearnMode(true);
			}
		}, [learnMode, setLearnMode, clearLastCapturedCc, resetPendingLearnParam]);

		const bindingCount = Object.keys(bindings).length;

		return (
			<SynthPanelContainer className="p-3">
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handleToggle}
							className={`btn btn-xs ${
								learnMode ? "btn-error animate-pulse!" : "btn-ghost"
							}`}
						>
							{learnMode ? "Learn: ON" : "Learn: OFF"}
						</button>
						<span className="text-3xs text-base-content/40">
							{bindingCount} binding{bindingCount !== 1 ? "s" : ""}
						</span>
					</div>

					{learnMode && (
						<div className="rounded border border-warning/30 bg-warning/5 p-2 text-3xs text-warning">
							{pendingLearnParam ? (
								<span>
									Click a MIDI controller to bind to this parameter...
								</span>
							) : lastCapturedCc ? (
								<span>
									CC {lastCapturedCc.cc} (ch {lastCapturedCc.channel}) captured.
									Click a parameter to bind it.
								</span>
							) : (
								<span>
									Click a MIDI controller or a parameter first, then the other.
								</span>
							)}
						</div>
					)}

					{!learnMode && bindingCount === 0 && (
						<p className="text-3xs text-base-content/30">
							Enable Learn mode, then move a MIDI controller and click a
							parameter to create a binding. Right-click any bound control to
							unlearn.
						</p>
					)}
				</div>
			</SynthPanelContainer>
		);
	},
	{
		panelId: "midi" as const,
		panelTab: { topLabel: "MIDI", bottomLabel: "Learn" },
	},
);

export default MidiLearnPanel;
