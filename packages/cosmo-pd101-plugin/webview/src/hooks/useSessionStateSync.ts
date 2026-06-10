import type { SessionEditorState } from "@cosmo/cosmo-pd101";
import { useSynthUiStore } from "@cosmo/cosmo-pd101";
import { useEffect, useRef } from "react";

function hasBridgeApi(name: string): boolean {
	return (
		typeof (window as Record<string, unknown>)[`__cz${name}`] === "function"
	);
}

function isBridgeAvailable(): boolean {
	return hasBridgeApi("GetEditorState") || hasBridgeApi("SetEditorState");
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
		})
		.catch((error: unknown) => {
			console.error("[auv3Bridge] getEditorState error", error);
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

export function useSessionStateSync(): void {
	const initializedRef = useRef(false);

	useEffect(() => {
		if (initializedRef.current) return;

		let cleanup: (() => void) | undefined;

		const setupBridgeSync = () => {
			initializedRef.current = true;
			const unsubscribes: (() => void)[] = [];

			loadInitialEditorState();

			if (hasBridgeApi("SetEditorState")) {
				unsubscribes.push(subscribeEditorState());
			}

			cleanup = () => {
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
				cleanup?.();
			};
		}

		setupBridgeSync();
		return () => {
			cleanup?.();
		};
	}, []);
}
