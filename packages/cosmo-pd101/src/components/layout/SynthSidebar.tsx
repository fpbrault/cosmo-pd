import { memo } from "react";
import { ScopeMiniDisplay } from "@/components/panels/analysis/ScopeDisplay";

import MidiLearnPanel from "@/components/panels/midi/MidiLearnPanel";
import PresetVoiceSettingsPanel from "@/components/panels/voice/PresetVoiceSettingsPanel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import SynthSidebarButtons from "./SynthSidebarButtons";

export default memo(function SynthSidebar() {
	const midiLearnOpen = useSynthUiStore((s) => s.midiLearnOpen);

	return (
		<aside className="flex h-full min-h-0 flex-col overflow-hidden">
			<div className="min-w-full">
				<div className="relative h-60 overflow-hidden">
					<div className="absolute inset-0 p-3">
						<ScopeMiniDisplay />
					</div>
				</div>
			</div>
			<SynthSidebarButtons />
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				{midiLearnOpen ? <MidiLearnPanel /> : <PresetVoiceSettingsPanel />}
			</div>
		</aside>
	);
});
