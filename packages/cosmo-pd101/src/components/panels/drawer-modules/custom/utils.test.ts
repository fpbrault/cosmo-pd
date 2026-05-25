import { describe, expect, it } from "vitest";
import { FX_SLOT_MODULE_CONFIGS } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import { getPresetModuleKey, resolvePresetPatchParams } from "./utils";

describe("FX preset module mapping", () => {
	it("maps eq5Band preset lookups to the eq patch key", () => {
		const config = FX_SLOT_MODULE_CONFIGS.eq5Band;
		if (!config) {
			throw new Error("Missing eq5Band config");
		}
		const presetPatch = {
			eq: {
				enabled: true,
				gain80: 6,
			},
		};

		expect(getPresetModuleKey(config.moduleKey)).toBe("eq");
		expect(resolvePresetPatchParams(config, presetPatch)).toEqual(
			presetPatch.eq,
		);
	});
});
