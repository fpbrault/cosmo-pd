import type { EditorState } from "@cosmo/cosmo-pd101";
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
	void (window as { __czGetEditorState: () => Promise<EditorState | null> })
		.__czGetEditorState()
		.then((result) => {
			if (result && typeof result === "object") {
				const editorState: Record<string, unknown> = {};
				for (const key of KEYS) {
					if (key in result) {
						editorState[key] = result[key as keyof EditorState];
					}
				}
				useSynthUiStore.setState(editorState);
			}
		})
		.catch((error: unknown) => {
			console.error("[sessionSync] getEditorState error", error);
		});
}

const KEYS: Array<keyof EditorState> = [
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

function buildEditorState(): EditorState {
	return {
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
	};
}

function subscribeEditorState(): () => void {
	const setEditor = (window as { __czSetEditorState: (s: EditorState) => void })
		.__czSetEditorState;

	setEditor(buildEditorState());

	return useSynthUiStore.subscribe(() => {
		setEditor(buildEditorState());
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
