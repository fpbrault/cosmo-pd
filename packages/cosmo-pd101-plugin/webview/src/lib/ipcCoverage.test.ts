/**
 * ipcCoverage.test.ts — Auto-extending IPC contract test.
 *
 * Every method the AUv3 JS bridge calls must have a corresponding native Swift
 * handler. The test parses the AUv3 bridge source and the Swift
 * `userContentController` switch and ensures every called method either has
 * a real `sendResponse` implementation or is in the `AUV3_KNOWN_STUBS`
 * allow-list.
 *
 * The Rust side is NOT tested here — the typed `invoke()` wrapper constrains
 * method names to `PluginIpcMethods` keys, and the Rust compiler enforces
 * match exhaustiveness on the `PluginIpcRequest` enum.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const webviewDir = resolve(here, "..", "..");
const pluginDir = resolve(webviewDir, "..");

// ─── File paths ──────────────────────────────────────────────────────────────

const AUV3_BRIDGE_TS = resolve(webviewDir, "src/lib/auv3Bridge.ts");
const SWIFT_VIEW_CONTROLLER = resolve(
	pluginDir,
	"../cosmo-pd101-plugin-auv3/CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/UI/AudioUnitViewController.swift",
);

// ─── Known-intentional AUv3 stubs ─────────────────────────────────────────────
//
// AUv3 preset management goes through the system AUAudioUnit preset mechanism,
// not the plugin's own library editor. These methods are called by the JS
// bridge but the Swift controller explicitly returns an error for them.
//
// Adding any NEW method to this list should be a deliberate, documented
// decision.

const AUV3_KNOWN_STUBS = new Set([
	"addPreset",
	"savePreset",
	"deletePreset",
	"renamePreset",
	"setPresetAuthor",
	"setPresetDescription",
	"setPresetTags",
	"toggleStarred",
	"exportPreset",
	"importPresetBank",
	"listFxModulePresets",
	"saveFxModulePreset",
	"deleteFxModulePreset",
]);

// ─── Parsers ─────────────────────────────────────────────────────────────────

function extractInvokeMethods(source: string): Set<string> {
	const out = new Set<string>();
	// Match both invokeAuv3("name") and invoke("name") calls
	const re =
		/(?:invokeAuv3|invoke)(?:<[^>]+>)?\(\s*(["'`])([A-Za-z][A-Za-z0-9_]*)\1/g;
	for (const match of source.matchAll(re)) {
		out.add(match[2]);
	}
	return out;
}

function extractSwiftMethods(source: string): {
	implemented: Set<string>;
	stubbed: Set<string>;
} {
	const implemented = new Set<string>();
	const stubbed = new Set<string>();

	const switchMatch = source.match(/^(\s*)switch method \{/m);
	if (!switchMatch) return { implemented, stubbed };
	const switchIndent = switchMatch[1];

	if (switchMatch.index === undefined) return { implemented, stubbed };
	const afterSwitch = source.slice(switchMatch.index + switchMatch[0].length);
	const lines = afterSwitch.split("\n");

	let currentNames: string[] | null = null;
	let bodyLines: string[] = [];

	function flush() {
		if (currentNames === null) return;
		const bodyText = bodyLines.join("\n");
		if (bodyText.includes("sendResponse(")) {
			for (const name of currentNames) implemented.add(name);
		} else {
			for (const name of currentNames) stubbed.add(name);
		}
		currentNames = null;
		bodyLines = [];
	}

	for (const line of lines) {
		const caseMatch = line.match(
			/^\s*case\s+((?:"[A-Za-z][A-Za-z0-9_]*"(?:\s*,\s*)?)+)\s*:\s*$/,
		);
		if (caseMatch) {
			flush();
			const inner = caseMatch[1];
			const names: string[] = [];
			const nameRe = /"([A-Za-z][A-Za-z0-9_]*)"/g;
			for (const m of inner.matchAll(nameRe)) {
				names.push(m[1]);
			}
			currentNames = names.length > 0 ? names : null;
			continue;
		}

		if (/^\s*default:\s*$/.test(line)) {
			flush();
			continue;
		}

		if (line === `${switchIndent}}`) {
			flush();
			break;
		}

		if (currentNames) {
			bodyLines.push(line);
		}
	}

	return { implemented, stubbed };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function diffList(items: readonly string[]): string {
	if (items.length === 0) return "  (none)";
	return items.map((name) => `  - ${name}`).join("\n");
}

function failMessage(
	title: string,
	action: string,
	methods: readonly string[],
): string {
	return (
		`${title}\n\n` +
		`The JS bridge calls ${methods.length} method(s) that the native ` +
		`${action}:\n${diffList(methods)}\n`
	);
}

// ─── Test suite ──────────────────────────────────────────────────────────────

describe("IPC contract coverage", () => {
	const auv3BridgeSource = readFileSync(AUV3_BRIDGE_TS, "utf8");
	const swiftSource = readFileSync(SWIFT_VIEW_CONTROLLER, "utf8");

	const auv3Called = extractInvokeMethods(auv3BridgeSource);
	const { implemented: swiftImplemented, stubbed: swiftStubbed } =
		extractSwiftMethods(swiftSource);

	describe("AUv3 bridge (JS) ↔ Swift userContentController", () => {
		it("every AUv3 bridge method has a matching Swift case arm", () => {
			const allSwift = new Set([...swiftImplemented, ...swiftStubbed]);
			const missing = [...auv3Called].filter((m) => !allSwift.has(m));
			if (missing.length > 0) {
				throw new Error(
					failMessage(
						"Missing Swift case arms",
						'controller does not handle at all. Add a `case "<name>":` arm to CosmoPd101ViewController.userContentController',
						missing,
					),
				);
			}
			expect(missing).toEqual([]);
		});

		it("every AUv3 bridge method is fully implemented (not just a stub)", () => {
			const unrecognizedStubs = [...auv3Called].filter(
				(m) => !swiftImplemented.has(m) && !AUV3_KNOWN_STUBS.has(m),
			);
			if (unrecognizedStubs.length > 0) {
				throw new Error(
					failMessage(
						"Unrecognized Swift stubs",
						"controller only returns `sendError(...)` for. Either add a real `sendResponse(...)` to the case body in CosmoPd101ViewController.swift, or — if the stub is deliberate — add the method name to the `AUV3_KNOWN_STUBS` set at the top of this test file",
						unrecognizedStubs,
					),
				);
			}
			expect(unrecognizedStubs).toEqual([]);
		});

		it("extracts at least the well-known AUv3 methods from the bridge", () => {
			expect(auv3Called.has("getParams")).toBe(true);
			expect(auv3Called.has("getScopeData")).toBe(true);
		});

		it("uses only the canonical payload envelope", () => {
			expect(auv3BridgeSource).not.toContain("loadPresetData");
			expect(swiftSource).not.toContain('payload["args"]');
			expect(swiftSource).toContain('payload["payload"]');
			expect(swiftSource).toContain('case "loadPreset":');
		});
	});

	describe("diagnostic report", () => {
		it("prints the full coverage matrix", () => {
			const report = {
				auv3: {
					calledByJs: [...auv3Called].sort(),
					implemented: [...swiftImplemented].sort(),
					stubbed: [...swiftStubbed].sort(),
					allowlisted: [...AUV3_KNOWN_STUBS].sort(),
					missing: [...auv3Called]
						.filter((m) => !swiftImplemented.has(m) && !swiftStubbed.has(m))
						.sort(),
				},
			};
			expect(report).toBeDefined();
		});
	});
});
