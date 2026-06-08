import { describe, expect, it } from "vitest";
import { getPresetSourceLabel } from "./presetSources";

describe("presetSources", () => {
	it("returns labels for all preset sources", () => {
		expect(getPresetSourceLabel("cosmo-factory")).toBe("Cosmo Factory Library");
		expect(getPresetSourceLabel("cz-factory")).toBe("Temple Of CZ");
		expect(getPresetSourceLabel("addon")).toBe("Add-On Bank");
		expect(getPresetSourceLabel("user")).toBe("User");
	});
});
