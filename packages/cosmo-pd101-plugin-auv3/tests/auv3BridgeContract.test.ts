import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(import.meta.dir, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");

const auv3BridgePath = path.join(
	repoRoot,
	"packages/cosmo-pd101-plugin/webview/src/lib/auv3Bridge.ts",
);
const xcodeControllerPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/UI/AudioUnitViewController.swift",
);
const xcodeHostAppPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOS/CosmoPD101AUv3Ext_macOSApp.swift",
);
const xcodeViewControllerRepresentablePath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOS/Common/UI/ViewControllerRepresentable.swift",
);

const nativeEngineEventMethods = new Set([
	"noteOn",
	"noteOff",
	"sustain",
	"pitchBend",
	"modWheel",
	"aftertouch",
	"polyAftertouch",
	"panic",
	"clientLog",
]);

/// Keys returned by `currentPresetSession(for:)` in the Swift ViewController.
/// Must match `PluginPresetSession` from `pluginBridgeSynthEngineAdapter.ts`.
const PRESET_SESSION_KEYS = [
	"activePresetId",
	"loadedPresetId",
	"activePresetNameBase",
	"isDirty",
] as const;

/// The fallback chain when `presetSessionState` fields are nil:
///   `activePresetNameBase` -> `audioUnit.currentPreset?.name` -> "Current State"
const PRESET_SESSION_FALLBACK_UNSELECTED_NAME = "Current State";

function readText(filePath: string): string {
	return readFileSync(filePath, "utf8");
}

function extractBridgeMethods(source: string): Set<string> {
	const matches = source.matchAll(/invokeAuv3\("([A-Za-z0-9]+)"/g);
	return new Set([...matches].map((match) => match[1]));
}

function extractSwiftSwitchMethods(source: string): Set<string> {
	const switchBlockMatch = source.match(/switch method \{([\s\S]*?)default:/m);
	if (!switchBlockMatch) {
		throw new Error("Could not find AUv3 method switch block");
	}

	const caseClauses = switchBlockMatch[1].matchAll(/^\s*case\s+(.+?):/gm);
	const methods = new Set<string>();
	for (const [, clause] of caseClauses) {
		for (const match of clause.matchAll(/"([A-Za-z0-9]+)"/g)) {
			methods.add(match[1]);
		}
	}
	return methods;
}

describe("AUv3 bridge contract", () => {
	it("keeps startup-critical bridge methods implemented in the Swift controller", () => {
		const bridgeMethods = extractBridgeMethods(readText(auv3BridgePath));
		const requiredBridgeMethods = new Set(bridgeMethods);
		for (const method of nativeEngineEventMethods) {
			requiredBridgeMethods.add(method);
		}

		const xcodeControllerMethods = extractSwiftSwitchMethods(
			readText(xcodeControllerPath),
		);

		expect([...requiredBridgeMethods].sort()).toEqual(
			[...new Set([...requiredBridgeMethods])].sort(),
		);

		expect(
			[...requiredBridgeMethods].filter(
				(method) => !xcodeControllerMethods.has(method),
			),
		).toEqual([]);
	});

	it("has currentPresetSession keys matching PluginPresetSession", () => {
		const swiftSource = readText(xcodeControllerPath);

		// Extract the dictionary keys from currentPresetSession(for:)
		const dictMatch = swiftSource.match(
			/private func currentPresetSession[\s\S]*?return \[([\s\S]*?)\]/m,
		);
		expect(dictMatch).not.toBeNull();
		const dictBody = dictMatch?.[1];
		expect(dictBody).toBeDefined();

		// Find all string keys used as dictionary literal keys
		const swiftKeys = new Set(
			[...dictBody.matchAll(/"([^"]+)":\s/g)].map((m) => m[1]),
		);

		for (const key of PRESET_SESSION_KEYS) {
			expect(swiftKeys.has(key)).toBeTrue();
		}
		expect(swiftKeys.size).toBe(PRESET_SESSION_KEYS.length);
	});

	it("falls back to Current State in currentPresetSession when no preset selected", () => {
		const swiftSource = readText(xcodeControllerPath);
		const containsFallback = swiftSource.includes(
			PRESET_SESSION_FALLBACK_UNSELECTED_NAME,
		);
		expect(containsFallback).toBeTrue();
	});

	it("advertises the AUv3 minimum host size", () => {
		const swiftSource = readText(xcodeControllerPath);
		const hostAppSource = readText(xcodeHostAppPath);
		const widthMatch = swiftSource.match(
			/private static let minimumWidth: CGFloat = ([0-9.]+)/,
		);
		const heightMatch = swiftSource.match(
			/private static let minimumHeight: CGFloat = ([0-9.]+)/,
		);

		expect(widthMatch).not.toBeNull();
		expect(heightMatch).not.toBeNull();
		expect(Number(widthMatch?.[1])).toBe(640);
		expect(Number(heightMatch?.[1])).toBe(480);
		expect(hostAppSource).toContain("minimumWindowWidth: CGFloat = 640");
		expect(hostAppSource).toContain("minimumWindowHeight: CGFloat = 480");
	});

	it("does not clamp AUv3 native hosts to the web renderer design size", () => {
		const swiftSource = readText(xcodeControllerPath);
		const hostAppSource = readText(xcodeHostAppPath);

		expect(swiftSource).not.toContain("preferredWidth");
		expect(swiftSource).not.toContain("preferredHeight");
		expect(hostAppSource).not.toContain("fixedWindowWidth");
		expect(hostAppSource).not.toContain("fixedWindowHeight");
		expect(hostAppSource).not.toContain("maxWidth:");
		expect(hostAppSource).not.toContain("maxHeight:");
	});

	it("publishes native AUv3 view bounds to the web renderer on layout", () => {
		const swiftSource = readText(xcodeControllerPath);

		expect(swiftSource).toContain("publishHostSizeToWebView(reason:");
		expect(swiftSource).toContain("deviceLandscapeAspectRatio:");
		expect(swiftSource).toContain("cz-host-size-changed");
		expect(swiftSource).toContain("window.dispatchEvent(new Event('resize'))");
	});

	it("keeps hosted AUv3 runtime mode as the controller default", () => {
		const swiftSource = readText(xcodeControllerPath);

		expect(swiftSource).toContain(
			'@objc public var cosmoAuv3FitMode: String = "fit-bounds"',
		);
		expect(swiftSource).toContain(
			'@objc public var cosmoAuv3RuntimeMode: String = "auv3-hosted"',
		);
		expect(swiftSource).toContain(
			"source: \"window.__czRuntimeMode='\\(cosmoAuv3RuntimeMode)';\"",
		);
	});

	it("marks the containing standalone app as standalone before embedding the AU view", () => {
		const hostAppSource = readText(xcodeViewControllerRepresentablePath);

		expect(hostAppSource).toContain(
			'viewController.setValue("fit-bounds", forKey: "cosmoAuv3FitMode")',
		);
		expect(hostAppSource).toContain(
			'viewController.setValue("standalone", forKey: "cosmoAuv3RuntimeMode")',
		);
	});
});
