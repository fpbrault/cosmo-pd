import { beforeEach, describe, expect, it } from "vitest";
import {
	SYNTH_UI_STATE_STORAGE_KEY,
	useSynthUiStore,
} from "@/features/synth/synthUiStore";

describe("synthUiStore", () => {
	beforeEach(() => {
		localStorage.clear();
		useSynthUiStore.persist.clearStorage();
		useSynthUiStore.setState({
			workspaceMode: "edit",
			scopeVisualizationMode: "spectrumWaterfall",
			mainPanelMode: "phase",
			phaseLinePanelTab: "line1-algos",
			activeEnvTab: "dcw",
			simpleExpandedSection: "sound",
			simpleEditedLine: 1,
			simpleEditedAlgo: "a",
			keyboardVisible: true,
			pcKeyboardOverlayVisible: false,
		});
	});

	it("persists the current synth UI state", async () => {
		useSynthUiStore.getState().setWorkspaceMode("performance");
		useSynthUiStore.getState().setScopeVisualizationMode("scopeHistory");
		useSynthUiStore.getState().setMainPanelMode("fx");
		useSynthUiStore.getState().setPhaseLinePanelTab("line2-envelopes");
		useSynthUiStore.getState().setActiveEnvTab("dca");
		useSynthUiStore.getState().setSimpleExpandedSection("effects");
		useSynthUiStore.getState().setSimpleEditedLine(2);
		useSynthUiStore.getState().setSimpleEditedAlgo("b");
		useSynthUiStore.getState().setKeyboardVisible(false);
		useSynthUiStore.getState().setPcKeyboardOverlayVisible(true);
		const savedState = localStorage.getItem(SYNTH_UI_STATE_STORAGE_KEY);

		useSynthUiStore.setState({
			workspaceMode: "edit",
			scopeVisualizationMode: "spectrumWaterfall",
			mainPanelMode: "phase",
			phaseLinePanelTab: "line1-algos",
			activeEnvTab: "dcw",
			simpleExpandedSection: "sound",
			simpleEditedLine: 1,
			simpleEditedAlgo: "a",
			keyboardVisible: true,
			pcKeyboardOverlayVisible: false,
		});
		expect(savedState).not.toBeNull();
		localStorage.setItem(SYNTH_UI_STATE_STORAGE_KEY, savedState ?? "");

		await useSynthUiStore.persist.rehydrate();

		expect(useSynthUiStore.getState()).toMatchObject({
			workspaceMode: "performance",
			scopeVisualizationMode: "scopeHistory",
			mainPanelMode: "fx",
			phaseLinePanelTab: "line2-envelopes",
			activeEnvTab: "dca",
			simpleExpandedSection: "effects",
			simpleEditedLine: 2,
			simpleEditedAlgo: "b",
			keyboardVisible: false,
			pcKeyboardOverlayVisible: true,
		});
	});

	it("falls back to defaults when stored values are invalid", async () => {
		localStorage.setItem(
			SYNTH_UI_STATE_STORAGE_KEY,
			JSON.stringify({
				state: {
					mainPanelMode: "drawer",
					phaseLinePanelTab: "line3-algos",
					activeEnvTab: "pitch",
					simpleExpandedSection: "drawer",
					simpleEditedLine: 3,
					simpleEditedAlgo: "c",
					keyboardVisible: "nope",
				},
				version: 0,
			}),
		);

		await useSynthUiStore.persist.rehydrate();

		expect(useSynthUiStore.getState()).toMatchObject({
			workspaceMode: "edit",
			scopeVisualizationMode: "spectrumWaterfall",
			mainPanelMode: "phase",
			phaseLinePanelTab: "line1-algos",
			activeEnvTab: "dcw",
			simpleExpandedSection: "sound",
			simpleEditedLine: 1,
			simpleEditedAlgo: "a",
			keyboardVisible: true,
			pcKeyboardOverlayVisible: false,
		});
	});

	it("preserves an explicitly persisted PC key label preference", async () => {
		localStorage.setItem(
			SYNTH_UI_STATE_STORAGE_KEY,
			JSON.stringify({
				state: { pcKeyboardOverlayVisible: true },
				version: 0,
			}),
		);

		await useSynthUiStore.persist.rehydrate();

		expect(useSynthUiStore.getState().pcKeyboardOverlayVisible).toBe(true);
	});
});
