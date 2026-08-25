import { describe, expect, it } from "vitest";
import { normalizePresetAuthor } from "./presetSources";

describe("normalizePresetAuthor", () => {
	it("defaults blank user preset authors to User", () => {
		expect(normalizePresetAuthor("", "user")).toBe("User");
		expect(normalizePresetAuthor("   ", "user")).toBe("User");
		expect(normalizePresetAuthor(undefined, "user")).toBe("User");
	});

	it("preserves explicit authors and does not label factory presets as User", () => {
		expect(normalizePresetAuthor("  Ada  ", "user")).toBe("Ada");
		expect(normalizePresetAuthor("", "cosmo-factory")).toBe("");
	});
});
