import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_MIDI_BINDINGS,
	MIDI_LEARN_STORAGE_KEY,
	refreshMidiLearnState,
	resetMidiLearnPersistenceForTests,
	subscribeMidiLearnState,
	useMidiLearnStore,
} from "./midiLearnStore";

describe("midiLearnStore", () => {
	beforeEach(() => {
		localStorage.clear();
		resetMidiLearnPersistenceForTests();
		(
			window as Window & {
				__czGetMidiLearnState?: () => Promise<unknown>;
			}
		).__czGetMidiLearnState = undefined;
		useMidiLearnStore.setState({
			learnMode: false,
			bindings: [],
			pendingLearnParam: null,
		});
	});

	it("starts with empty bindings", () => {
		expect(useMidiLearnStore.getState().bindings).toHaveLength(0);
	});

	it("setLearnMode resets pending on false", () => {
		useMidiLearnStore.setState({
			learnMode: true,
			pendingLearnParam: "macro1",
		});
		useMidiLearnStore.getState().setLearnMode(false);
		expect(useMidiLearnStore.getState().pendingLearnParam).toBeNull();
	});

	it("initFromEngineState syncs state from Rust", () => {
		useMidiLearnStore.getState().initFromEngineState({
			learnMode: true,
			pendingParamKey: "macro2",
			bindings: [{ paramKey: "macro2", channel: 3, cc: 19 }],
			version: 1,
		});

		expect(useMidiLearnStore.getState().learnMode).toBe(true);
		expect(useMidiLearnStore.getState().pendingLearnParam).toBe("macro2");
		expect(useMidiLearnStore.getState().bindings).toHaveLength(1);
		expect(useMidiLearnStore.getState().bindings[0]).toEqual({
			paramKey: "macro2",
			channel: 3,
			cc: 19,
		});
	});

	it("supports get/remove helper APIs", () => {
		useMidiLearnStore.setState({
			bindings: [
				{ paramKey: "macro1", channel: 5, cc: 99 },
				{ paramKey: "macro2", channel: 5, cc: 77 },
			],
		});
		const store = useMidiLearnStore.getState();

		expect(store.getBindingForParam("macro1")).toEqual({
			paramKey: "macro1",
			channel: 5,
			cc: 99,
		});
		expect(store.getBindingsForMidi(5, 77)).toHaveLength(1);
		expect(store.getBindingsForParam("macro1")).toHaveLength(1);
		expect(store.getBindingForParam("nonexistent")).toBeUndefined();
		expect(store.getBindingsForParam("nonexistent")).toHaveLength(0);

		store.removeBinding({ paramKey: "macro1", channel: 5, cc: 99 });
		expect(store.getBindingForParam("macro1")).toBeUndefined();
	});

	it("addBinding replaces the existing binding for the same param key", () => {
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "macro1", channel: 5, cc: 99 }],
		});

		useMidiLearnStore.getState().addBinding("macro1", 6, 12);

		expect(useMidiLearnStore.getState().bindings).toEqual([
			{ paramKey: "macro1", channel: 6, cc: 12 },
		]);
	});

	it("clearBindings removes all bindings and resets pending", () => {
		useMidiLearnStore.setState({
			bindings: [
				{ paramKey: "macro1", channel: 0, cc: 8 },
				{ paramKey: "macro2", channel: 0, cc: 41 },
			],
			pendingLearnParam: "macro1",
		});
		useMidiLearnStore.getState().clearBindings();
		expect(useMidiLearnStore.getState().bindings).toHaveLength(0);
		expect(useMidiLearnStore.getState().pendingLearnParam).toBeNull();
	});

	it("refreshMidiLearnState hydrates bindings from the engine bridge", async () => {
		(
			window as Window & {
				__czGetMidiLearnState?: () => Promise<unknown>;
			}
		).__czGetMidiLearnState = vi.fn().mockResolvedValue({
			learnMode: true,
			pendingParamKey: "macro3",
			bindings: [{ paramKey: "macro3", channel: 2, cc: 42 }],
			version: 7,
		});

		await refreshMidiLearnState();

		expect(useMidiLearnStore.getState()).toMatchObject({
			learnMode: true,
			pendingLearnParam: "macro3",
			bindings: [{ paramKey: "macro3", channel: 2, cc: 42 }],
		});
	});

	it("subscribeMidiLearnState requests the latest engine state immediately", async () => {
		(
			window as Window & {
				__czGetMidiLearnState?: () => Promise<unknown>;
			}
		).__czGetMidiLearnState = vi.fn().mockResolvedValue({
			learnMode: false,
			pendingParamKey: null,
			bindings: [{ paramKey: "macro4", channel: 0, cc: 43 }],
			version: 9,
		});

		const unsubscribe = subscribeMidiLearnState();
		await Promise.resolve();

		expect(useMidiLearnStore.getState().bindings).toEqual([
			{ paramKey: "macro4", channel: 0, cc: 43 },
		]);

		unsubscribe();
	});

	it("seeds default bindings for web mode when no persisted state exists", async () => {
		const unsubscribe = subscribeMidiLearnState();
		await Promise.resolve();

		expect(useMidiLearnStore.getState().bindings).toEqual(
			DEFAULT_MIDI_BINDINGS,
		);
		expect(localStorage.getItem(MIDI_LEARN_STORAGE_KEY)).toBe(
			JSON.stringify({ bindings: DEFAULT_MIDI_BINDINGS }),
		);

		unsubscribe();
	});

	it("hydrates persisted bindings for web mode", async () => {
		localStorage.setItem(
			MIDI_LEARN_STORAGE_KEY,
			JSON.stringify({
				bindings: [{ paramKey: "macro1", channel: 9, cc: 17 }],
			}),
		);

		const unsubscribe = subscribeMidiLearnState();
		await Promise.resolve();

		expect(useMidiLearnStore.getState().bindings).toEqual([
			{ paramKey: "macro1", channel: 9, cc: 17 },
		]);

		unsubscribe();
	});

	it("persists binding mutations in web mode", () => {
		subscribeMidiLearnState()();

		const store = useMidiLearnStore.getState();
		store.addBinding("macro1", 3, 88);
		expect(localStorage.getItem(MIDI_LEARN_STORAGE_KEY)).toBe(
			JSON.stringify({
				bindings: [
					{ paramKey: "macro2", channel: 0, cc: 41 },
					{ paramKey: "macro3", channel: 0, cc: 42 },
					{ paramKey: "macro4", channel: 0, cc: 43 },
					{ paramKey: "macro1", channel: 3, cc: 88 },
				],
			}),
		);

		store.removeBinding({ paramKey: "macro1", channel: 3, cc: 88 });
		expect(localStorage.getItem(MIDI_LEARN_STORAGE_KEY)).toBe(
			JSON.stringify({
				bindings: [
					{ paramKey: "macro2", channel: 0, cc: 41 },
					{ paramKey: "macro3", channel: 0, cc: 42 },
					{ paramKey: "macro4", channel: 0, cc: 43 },
				],
			}),
		);

		store.clearBindings();
		expect(localStorage.getItem(MIDI_LEARN_STORAGE_KEY)).toBe(
			JSON.stringify({ bindings: [] }),
		);
	});
});
