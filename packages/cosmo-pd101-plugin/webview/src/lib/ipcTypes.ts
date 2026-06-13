import type { PluginIpcMethods } from "@cosmo/cosmo-pd101";

/** RPC response envelope shared by all native bridges. */
export type IpcRpcResponse = {
	id: number;
	result?: unknown;
	error?: string;
};

declare global {
	interface Window {
		__czIpcResponse?: (response: IpcRpcResponse) => void;
	}
}

type InvokeArguments<T extends keyof PluginIpcMethods> =
	PluginIpcMethods[T]["request"] extends null
		? []
		: [payload: PluginIpcMethods[T]["request"]];

export function createTypedInvoke(
	invoke: (method: string, payload?: unknown) => Promise<unknown>,
) {
	return <T extends keyof PluginIpcMethods>(
		method: T,
		...args: InvokeArguments<T>
	): Promise<PluginIpcMethods[T]["response"]> => {
		const payload = args[0];
		return invoke(method as string, payload) as Promise<
			PluginIpcMethods[T]["response"]
		>;
	};
}
