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
});
