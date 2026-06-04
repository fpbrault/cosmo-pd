import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(import.meta.dir, "..");
const controllerPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/UI/AudioUnitViewController.swift",
);
const audioUnitPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/Audio Unit/CosmoPD101AUv3Ext_macOSExtensionAudioUnit.swift",
);
const infoPlistPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Info.plist",
);

function readText(filePath: string): string {
	return readFileSync(filePath, "utf8");
}

describe("AUv3 bridge contract", () => {
	it("keeps the custom webview controller as the extension entry point", () => {
		const infoPlist = readText(infoPlistPath);
		expect(infoPlist).toContain(
			"<string>$(PRODUCT_MODULE_NAME).AudioUnitViewController</string>",
		);
		expect(infoPlist).not.toContain("<string>AudioUnitFactory</string>");
	});

	it("forwards ordinary webview RPC to the Rust editor contract", () => {
		const controller = readText(controllerPath);
		expect(controller).toContain("callbacks.pointee.custom_editor_request(");
		expect(controller).toContain(
			"callbacks.pointee.custom_editor_response_free(",
		);
		expect(controller).not.toContain('case "getPresetLibrary"');
		expect(controller).not.toContain('case "getMidiLearnState"');
	});

	it("uses Truce callbacks for audio, state, parameters, and MIDI CC delivery", () => {
		const audioUnit = readText(audioUnitPath);
		const controller = readText(controllerPath);
		expect(audioUnit).toContain("cb.pointee.process(");
		expect(audioUnit).toContain("cb.pointee.state_save(");
		expect(audioUnit).toContain("cb.pointee.state_load(");
		expect(audioUnit).toContain("cb.pointee.param_set_value(");
		expect(audioUnit).not.toContain("cosmo_pd101_ffi_");
		expect(controller).toContain('rustResult(method: "drainMidiCcEvents")');
		expect(controller).toContain("window.__czOnMidiCc?.(");
	});
});
