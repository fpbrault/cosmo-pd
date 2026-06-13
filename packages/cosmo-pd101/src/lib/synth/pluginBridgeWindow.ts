import type { PluginIpcMethods } from "@/lib/synth/bindings/plugin-bridge";

type PluginIpcWindowName<M extends string> = `__cz${Capitalize<M>}`;

type PluginIpcWindowMethod<M extends keyof PluginIpcMethods> =
	PluginIpcMethods[M]["request"] extends null | undefined
		? () => Promise<PluginIpcMethods[M]["response"]>
		: (
				payload: PluginIpcMethods[M]["request"],
			) => Promise<PluginIpcMethods[M]["response"]>;

type PluginIpcWindowBridge = {
	[M in keyof PluginIpcMethods as PluginIpcWindowName<
		string & M
	>]?: PluginIpcWindowMethod<M>;
};

type Assert<T extends true> = T;
type IsEqual<A, B> =
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
		? true
		: false;

type _AssertGetVoiceLimit = Assert<
	IsEqual<
		ReturnType<NonNullable<PluginIpcWindowBridge["__czGetVoiceLimit"]>>,
		Promise<PluginIpcMethods["getVoiceLimit"]["response"]>
	>
>;
type _AssertSetVoiceLimit = Assert<
	IsEqual<
		Parameters<NonNullable<PluginIpcWindowBridge["__czSetVoiceLimit"]>>,
		[PluginIpcMethods["setVoiceLimit"]["request"]]
	>
>;
type _AssertLoadPreset = Assert<
	IsEqual<
		Parameters<NonNullable<PluginIpcWindowBridge["__czLoadPreset"]>>,
		[PluginIpcMethods["loadPreset"]["request"]]
	>
>;
type _AssertSetParams = Assert<
	IsEqual<
		Parameters<NonNullable<PluginIpcWindowBridge["__czSetParams"]>>,
		[PluginIpcMethods["setParams"]["request"]]
	>
>;

declare global {
	interface Window extends PluginIpcWindowBridge {
		ipc?: { postMessage: (message: string) => void };
		__czOnParams?: (json: string) => void;
		__czOnScope?: (
			samples: Float32Array | number[],
			sampleRate: number,
			hz: number,
		) => void;
		__czOnMidiCc?: (channel: number, cc: number, value: number) => void;
		__czOnMidiLearnState?: (json: string) => void;
	}
}
