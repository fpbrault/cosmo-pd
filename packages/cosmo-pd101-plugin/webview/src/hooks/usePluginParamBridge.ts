import { usePluginBridgeSynthEngine } from "@cosmo/cosmo-pd101";
import { useEffect, useRef } from "react";
import { ensurePluginBridge } from "@/lib/pluginBridge";
import { useSessionStateSync } from "./useSessionStateSync";

export function usePluginParamBridge(): {
	loadPresetData: (id: string) => Promise<string>;
} {
	const bridgeReadyRef = useRef(false);

	useEffect(() => {
		if (bridgeReadyRef.current) {
			return;
		}

		if (ensurePluginBridge()) {
			bridgeReadyRef.current = true;
			return;
		}

		const intervalId = window.setInterval(() => {
			if (ensurePluginBridge()) {
				bridgeReadyRef.current = true;
				window.clearInterval(intervalId);
			}
		}, 50);

		return () => {
			window.clearInterval(intervalId);
		};
	}, []);

	const { loadPresetData } = usePluginBridgeSynthEngine();
	useSessionStateSync();

	return { loadPresetData };
}
