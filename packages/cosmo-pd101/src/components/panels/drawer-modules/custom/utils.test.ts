import { describe, expect, it } from "vitest";
import { FX_SLOT_MODULE_CONFIGS } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import { getPresetModuleKey, resolvePresetPatchParams } from "./utils";

describe("FX preset module mapping", () => {
	it("maps eq8Band preset lookups to the eq patch key", () => {
		const config = FX_SLOT_MODULE_CONFIGS.eq8Band;
		if (!config) {
			throw new Error("Missing eq8Band config");
		}
		const presetPatch = {
			eq: {
				enabled: true,
				gainBand1: 6,
			},
		};

		expect(getPresetModuleKey(config.moduleKey)).toBe("eq");
		expect(resolvePresetPatchParams(config, presetPatch)).toEqual(
			presetPatch.eq,
		);
	});
});
