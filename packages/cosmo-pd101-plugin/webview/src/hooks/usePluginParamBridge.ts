import {
	type PluginPresetSession,
	refreshMidiLearnState,
	subscribeMidiLearnState,
	useMidiLearnBindings,
	usePluginBridgeSynthEngine,
} from "@cosmo/cosmo-pd101";
import { useEffect, useRef, useState } from "react";
import { ensurePluginBridge } from "@/lib/pluginBridge";
import { useSessionStateSync } from "./useSessionStateSync";

export function usePluginParamBridge(
	options: { onExternalParamChange?: () => void } = {},
): {
	bridgeReady: boolean;
	loadPresetData: (id: string) => Promise<string>;
	getPresetSession: () => Promise<PluginPresetSession | null>;
	setPresetSession: (session: PluginPresetSession) => Promise<void>;
} {
	const bridgeReadyRef = useRef(false);
	const [bridgeReady, setBridgeReady] = useState(false);
	useMidiLearnBindings({ applyBindings: true });

	useEffect(() => {
		if (bridgeReadyRef.current) {
			return;
		}

		if (ensurePluginBridge()) {
			bridgeReadyRef.current = true;
			setBridgeReady(true);
			void refreshMidiLearnState();
			return;
		}

		const intervalId = window.setInterval(() => {
			if (ensurePluginBridge()) {
				bridgeReadyRef.current = true;
				setBridgeReady(true);
				void refreshMidiLearnState();
				window.clearInterval(intervalId);
			}
		}, 50);

		return () => {
			window.clearInterval(intervalId);
		};
	}, []);

	const { loadPresetData, getPresetSession, setPresetSession } =
		usePluginBridgeSynthEngine(options);
	useSessionStateSync();

	useEffect(() => {
		const unsubscribe = subscribeMidiLearnState();
		return unsubscribe;
	}, []);

	return { bridgeReady, loadPresetData, getPresetSession, setPresetSession };
}
