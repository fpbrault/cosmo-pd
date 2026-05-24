import { describe, expect, it, vi } from "vitest";
import {
	applyRegisteredMidiLearnTarget,
	getMidiLearnTargetLabel,
	getMidiLearnTargetRegistration,
	registerMidiLearnTarget,
} from "./midiLearnRegistry";

describe("midiLearnRegistry", () => {
	it("registers targets and applies them", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("k1", {
			label: "Macro 1",
			apply,
		});
		expect(getMidiLearnTargetLabel("k1")).toBe("Macro 1");
		expect(applyRegisteredMidiLearnTarget("k1", 88)).toBe(true);
		expect(apply).toHaveBeenCalledWith(88);
		cleanup();
		expect(applyRegisteredMidiLearnTarget("k1", 1)).toBe(false);
	});

	it("cleanup only removes the same registration ref", () => {
		const first = registerMidiLearnTarget("k2", { apply: vi.fn() });
		registerMidiLearnTarget("k2", { apply: vi.fn() });
		first();
		expect(getMidiLearnTargetRegistration("k2")).toBeDefined();
	});
});
