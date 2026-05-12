import { ensureAuv3Bridge } from "./auv3Bridge";
import { ensureNihPlugBridge } from "./nihPlugBridge";
import { ensureStandaloneBridge } from "./standaloneBridge";

export function ensurePluginBridge(): boolean {
	try {
		return (
			ensureAuv3Bridge() || ensureNihPlugBridge() || ensureStandaloneBridge()
		);
	} catch (error) {
		console.error("[pluginBridge] bridge installation failed", error);
		return false;
	}
}
