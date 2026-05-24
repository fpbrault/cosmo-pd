import { beforeEach, describe, expect, it } from "vitest";
import { useMidiLearnStore } from "./midiLearnStore";

describe("midiLearnStore", () => {
	beforeEach(() => {
		localStorage.clear();
		useMidiLearnStore.setState({
			learnMode: false,
			lastCapturedCc: null,
			pendingLearnParam: null,
			bindings: {
				macro1: { paramKey: "macro1", channel: 0, cc: 8 },
				macro2: { paramKey: "macro2", channel: 0, cc: 41 },
				macro3: { paramKey: "macro3", channel: 0, cc: 42 },
				macro4: { paramKey: "macro4", channel: 0, cc: 43 },
			},
		});
	});

	it("starts with 4 default macro bindings", () => {
		expect(Object.keys(useMidiLearnStore.getState().bindings)).toHaveLength(4);
	});

	it("setLearnMode clears captured cc and resets pending on false", () => {
		useMidiLearnStore.setState({
			learnMode: true,
			lastCapturedCc: { channel: 1, cc: 2, rawValue: 64 },
			pendingLearnParam: "macro1",
		});
		useMidiLearnStore.getState().setLearnMode(false);
		expect(useMidiLearnStore.getState().lastCapturedCc).toBeNull();
		expect(useMidiLearnStore.getState().pendingLearnParam).toBeNull();
	});

	it("captureMidiCc is no-op when learn mode is off", () => {
		useMidiLearnStore.getState().captureMidiCc(0, 12, 80);
		expect(useMidiLearnStore.getState().lastCapturedCc).toBeNull();
	});

	it("captureMidiCc with pending param creates binding", () => {
		useMidiLearnStore.getState().setLearnMode(true);
		useMidiLearnStore.getState().setPendingLearnParam("macro2");
		useMidiLearnStore.getState().captureMidiCc(3, 19, 101);

		expect(useMidiLearnStore.getState().bindings.macro2).toEqual({
			paramKey: "macro2",
			channel: 3,
			cc: 19,
		});
		expect(useMidiLearnStore.getState().lastCapturedCc).toEqual({
			channel: 3,
			cc: 19,
			rawValue: 101,
		});
	});

	it("captureMidiCc with no pending only updates last captured", () => {
		useMidiLearnStore.getState().setLearnMode(true);
		useMidiLearnStore.getState().captureMidiCc(2, 4, 17);
		expect(useMidiLearnStore.getState().lastCapturedCc).toEqual({
			channel: 2,
			cc: 4,
			rawValue: 17,
		});
	});

	it("supports update/remove/get helper APIs", () => {
		const store = useMidiLearnStore.getState();
		store.addOrReplaceBinding(5, 99, "macro1");
		store.updateBinding("macro1", { cc: 77 });
		expect(store.getBindingForParam("macro1")).toEqual({
			paramKey: "macro1",
			channel: 5,
			cc: 77,
		});
		expect(store.getBindingsForMidi(5, 77)).toHaveLength(1);
		expect(store.getBindingsForParam("macro1")).toHaveLength(1);
		store.removeBindingsForParam("macro1");
		expect(store.getBindingForParam("macro1")).toBeUndefined();
	});
});
