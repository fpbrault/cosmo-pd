import type {
	MidiBinding,
	SessionEditorState,
	SessionMidiMapping,
} from "@cosmo/cosmo-pd101";
import { useMidiLearnStore, useSynthUiStore } from "@cosmo/cosmo-pd101";
import { useEffect, useRef } from "react";

function hasBridgeApi(name: string): boolean {
	return (
		typeof (window as Record<string, unknown>)[`__cz${name}`] === "function"
	);
}

function isBridgeAvailable(): boolean {
	return (
		hasBridgeApi("GetEditorState") ||
		hasBridgeApi("SetEditorState") ||
		hasBridgeApi("GetMidiMappings") ||
		hasBridgeApi("SetMidiMappings")
	);
}

function loadInitialEditorState(): void {
	if (!hasBridgeApi("GetEditorState")) return;
	void (window as { __czGetEditorState: () => Promise<unknown> })
		.__czGetEditorState()
		.then((result: unknown) => {
			if (result && typeof result === "object") {
				const state = result as Record<string, unknown>;
				const editorState: Record<string, unknown> = {};
				const keys: Array<keyof SessionEditorState> = [
					"mainPanelMode",
					"phaseLinePanelTab",
					"activeEnvTab",
					"keyboardVisible",
					"keyboardOctaves",
					"keyboardRange",
					"keyboardHeight",
					"keyboardInputMode",
					"libraryModeOpen",
					"scopeCycles",
					"scopeVerticalZoom",
					"scopeTriggerLevel",
					"scopeVisualizationMode",
					"scopeColorTheme",
				];
				for (const key of keys) {
					if (key in state) {
						editorState[key] = state[key];
					}
				}
				useSynthUiStore.setState(editorState);
			}
		});
}

function loadInitialMidiMappings(): void {
	if (!hasBridgeApi("GetMidiMappings")) return;
	void (window as { __czGetMidiMappings: () => Promise<unknown> })
		.__czGetMidiMappings()
		.then((result: unknown) => {
			if (Array.isArray(result) && result.length > 0) {
				const mappings = result as SessionMidiMapping[];
				const bindings: Partial<Record<string, MidiBinding>> = {};
				for (const m of mappings) {
					bindings[m.paramKey] = {
						paramKey: m.paramKey,
						channel: m.channel,
						cc: m.cc,
					};
				}
				useMidiLearnStore.setState({ bindings });
			}
		});
}

function subscribeEditorState(): () => void {
	const setEditor = (window as { __czSetEditorState: (s: string) => void })
		.__czSetEditorState;
	const pushState = (state: SessionEditorState) => {
		setEditor(JSON.stringify(state));
	};

	pushState({
		mainPanelMode: useSynthUiStore.getState().mainPanelMode,
		phaseLinePanelTab: useSynthUiStore.getState().phaseLinePanelTab,
		activeEnvTab: useSynthUiStore.getState().activeEnvTab,
		keyboardVisible: useSynthUiStore.getState().keyboardVisible,
		keyboardOctaves: useSynthUiStore.getState().keyboardOctaves,
		keyboardRange: useSynthUiStore.getState().keyboardRange,
		keyboardHeight: useSynthUiStore.getState().keyboardHeight,
		keyboardInputMode: useSynthUiStore.getState().keyboardInputMode,
		libraryModeOpen: useSynthUiStore.getState().libraryModeOpen,
		scopeCycles: useSynthUiStore.getState().scopeCycles,
		scopeVerticalZoom: useSynthUiStore.getState().scopeVerticalZoom,
		scopeTriggerLevel: useSynthUiStore.getState().scopeTriggerLevel,
		scopeVisualizationMode: useSynthUiStore.getState().scopeVisualizationMode,
		scopeColorTheme: useSynthUiStore.getState().scopeColorTheme,
	});

	return useSynthUiStore.subscribe((state) => {
		const editorState: SessionEditorState = {
			mainPanelMode: state.mainPanelMode,
			phaseLinePanelTab: state.phaseLinePanelTab,
			activeEnvTab: state.activeEnvTab,
			keyboardVisible: state.keyboardVisible,
			keyboardOctaves: state.keyboardOctaves,
			keyboardRange: state.keyboardRange,
			keyboardHeight: state.keyboardHeight,
			keyboardInputMode: state.keyboardInputMode,
			libraryModeOpen: state.libraryModeOpen,
			scopeCycles: state.scopeCycles,
			scopeVerticalZoom: state.scopeVerticalZoom,
			scopeTriggerLevel: state.scopeTriggerLevel,
			scopeVisualizationMode: state.scopeVisualizationMode,
			scopeColorTheme: state.scopeColorTheme,
		};
		pushState(editorState);
	});
}

function subscribeMidiMappings(): () => void {
	const setMidi = (window as { __czSetMidiMappings: (s: string) => void })
		.__czSetMidiMappings;
	const pushMappings = (bindings: Partial<Record<string, MidiBinding>>) => {
		const mappings: SessionMidiMapping[] = [];
		for (const b of Object.values(bindings)) {
			if (b) {
				mappings.push({ paramKey: b.paramKey, channel: b.channel, cc: b.cc });
			}
		}
		setMidi(JSON.stringify(mappings));
	};

	pushMappings(useMidiLearnStore.getState().bindings);

	return useMidiLearnStore.subscribe((state) => {
		pushMappings(state.bindings);
	});
}

export function useSessionStateSync(): void {
	const initializedRef = useRef(false);

	useEffect(() => {
		if (initializedRef.current) return;

		const setupBridgeSync = () => {
			initializedRef.current = true;
			const unsubscribes: (() => void)[] = [];

			loadInitialEditorState();
			loadInitialMidiMappings();

			if (hasBridgeApi("SetEditorState")) {
				unsubscribes.push(subscribeEditorState());
			}
			if (hasBridgeApi("SetMidiMappings")) {
				unsubscribes.push(subscribeMidiMappings());
			}

			return () => {
				for (const fn of unsubscribes) {
					fn();
				}
			};
		};

		if (!isBridgeAvailable()) {
			const intervalId = window.setInterval(() => {
				if (isBridgeAvailable()) {
					window.clearInterval(intervalId);
					setupBridgeSync();
				}
			}, 100);
			return () => {
				window.clearInterval(intervalId);
			};
		}

		return setupBridgeSync();
	}, []);
}
