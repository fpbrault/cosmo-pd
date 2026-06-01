import { beforeEach, describe, expect, it } from "vitest";
import { useMidiLearnStore } from "./midiLearnStore";

describe("midiLearnStore", () => {
	beforeEach(() => {
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

		store.removeBinding("macro1");
		expect(store.getBindingForParam("macro1")).toBeUndefined();
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
});
