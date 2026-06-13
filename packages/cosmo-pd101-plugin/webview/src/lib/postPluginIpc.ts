import type { PluginIpcMethods } from "@cosmo/cosmo-pd101";

type IpcPayloadArgs<K extends keyof PluginIpcMethods> =
	PluginIpcMethods[K]["request"] extends null
		? []
		: [payload: PluginIpcMethods[K]["request"]];

export function postPluginIpc<K extends keyof PluginIpcMethods>(
	postMessage: (message: string) => void,
	method: K,
	...args: IpcPayloadArgs<K>
): void {
	const payload = args[0];
	const envelope =
		payload === undefined ? { id: 0, method } : { id: 0, method, payload };

	postMessage(JSON.stringify(envelope));
}
