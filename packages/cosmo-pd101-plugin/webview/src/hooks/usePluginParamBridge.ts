import {
	refreshMidiLearnState,
	subscribeMidiLearnState,
	useMidiLearnBindings,
	usePluginBridgeSynthEngine,
} from "@cosmo/cosmo-pd101";
import { useEffect, useRef } from "react";
import { ensurePluginBridge } from "@/lib/pluginBridge";
import { useSessionStateSync } from "./useSessionStateSync";

export function usePluginParamBridge(): {
	loadPresetData: (id: string) => Promise<string>;
} {
	const bridgeReadyRef = useRef(false);
	useMidiLearnBindings({ applyBindings: true });

	useEffect(() => {
		if (bridgeReadyRef.current) {
			return;
		}

		if (ensurePluginBridge()) {
			bridgeReadyRef.current = true;
			void refreshMidiLearnState();
			return;
		}

		const intervalId = window.setInterval(() => {
			if (ensurePluginBridge()) {
				bridgeReadyRef.current = true;
				void refreshMidiLearnState();
				window.clearInterval(intervalId);
			}
		}, 50);

		return () => {
			window.clearInterval(intervalId);
		};
	}, []);

	const { loadPresetData } = usePluginBridgeSynthEngine();
	useSessionStateSync();

	useEffect(() => {
		const unsubscribe = subscribeMidiLearnState();
		return unsubscribe;
	}, []);

	return { loadPresetData };
}
