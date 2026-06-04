import { ensureAuv3Bridge } from "./auv3Bridge";
import { postHostLog } from "./hostLogger";
import { ensureIPCBridge } from "./IPCBridge";
import { ensureStandaloneBridge } from "./standaloneBridge";

export function ensurePluginBridge(): boolean {
	try {
		return ensureAuv3Bridge() || ensureIPCBridge() || ensureStandaloneBridge();
	} catch (error) {
		postHostLog(
			"error",
			`[pluginBridge] bridge installation failed: ${String(error)}`,
		);
		console.error("[pluginBridge] bridge installation failed", error);
		return false;
	}
}
