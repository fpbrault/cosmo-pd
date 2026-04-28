import { usePluginBridgeSynthEngine } from "@cosmo/cosmo-pd101";
import { useEffect, useState } from "react";
import { ensureBeamerBridge } from "@/lib/beamerBridge";

export function usePluginParamBridge(): void {
	const [bridgeReady, setBridgeReady] = useState(false);

	useEffect(() => {
		if (bridgeReady) {
			return;
		}

		let cancelled = false;
		const finalizeBridgeReady = () => {
			void window.__BEAMER__?.ready
				.then(() => {
					if (!cancelled) {
						setBridgeReady(true);
					}
				})
				.catch(() => {
					if (!cancelled) {
						setBridgeReady(true);
					}
				});
		};

		if (ensureBeamerBridge()) {
			finalizeBridgeReady();
			return () => {
				cancelled = true;
			};
		}

		const intervalId = window.setInterval(() => {
			if (ensureBeamerBridge()) {
				window.clearInterval(intervalId);
				finalizeBridgeReady();
			}
		}, 50);

		return () => {
			cancelled = true;
			window.clearInterval(intervalId);
		};
	}, [bridgeReady]);

	usePluginBridgeSynthEngine({ enabled: bridgeReady });
}
