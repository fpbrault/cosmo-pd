import { memo } from "react";
import { ScopeMiniDisplay } from "@/components/panels/analysis/ScopeDisplay";

import MidiLearnPanel from "@/components/panels/midi/MidiLearnPanel";
import PresetVoiceSettingsPanel from "@/components/panels/voice/PresetVoiceSettingsPanel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import SynthSidebarButtons from "./SynthSidebarButtons";

export default memo(function SynthSidebar() {
	const midiLearnOpen = useSynthUiStore((s) => s.midiLearnOpen);
	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const waveDrawerOpen = mainPanelMode === "display";

	return (
		<aside
			data-auv3-passive-surface
			className="flex h-full min-h-0 flex-col overflow-hidden"
		>
			<div className="min-w-full">
				<div
					data-auv3-passive-surface
					className="relative h-60 overflow-hidden"
				>
					<div className="absolute inset-0 p-3">
						<ScopeMiniDisplay expanded={waveDrawerOpen} />
					</div>
				</div>
			</div>
			<SynthSidebarButtons />
			<div
				data-auv3-passive-surface
				className="flex min-h-0 flex-1 flex-col overflow-hidden"
			>
				{midiLearnOpen ? <MidiLearnPanel /> : <PresetVoiceSettingsPanel />}
			</div>
		</aside>
	);
});
