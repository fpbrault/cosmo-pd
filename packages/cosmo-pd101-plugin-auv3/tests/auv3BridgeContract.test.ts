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
const xcodeAudioUnitPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/Audio Unit/CosmoPD101AUv3Ext_macOSExtensionAudioUnit.swift",
);
const xcodeWebEditorSessionPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/UI/WebEditorSession.swift",
);
const xcodeHostAppPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOS/CosmoPD101AUv3Ext_macOSApp.swift",
);
const standaloneHostModelPath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOS/Model/AudioUnitHostModel.swift",
);
const simplePlayEnginePath = path.join(
	packageRoot,
	"CosmoPD101Host/CosmoPD101AUv3Ext-macOS/Common/Audio/SimplePlayEngine.swift",
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

	it("suppresses nonessential polling RPCs while the AUv3 host is inactive", () => {
		const bridgeSource = readText(auv3BridgePath);

		expect(bridgeSource).toContain(
			"const inactiveSuppressedMethods = new Set([",
		);
		expect(bridgeSource).toContain('"getParamsVersion"');
		expect(bridgeSource).toContain('"getPendingParamChanges"');
		expect(bridgeSource).toContain("suppressed while host inactive");
	});

	it("freezes a snapshot before destroying the WebView session on host inactive", () => {
		const swiftSource = readText(xcodeControllerPath);
		const handlerMatch = swiftSource.match(
			/@objc private func handleHostWillResignActive[\s\S]*?\n\t}\n/m,
		);

		expect(handlerMatch).not.toBeNull();
		expect(handlerMatch?.[0]).toContain(
			"freezeCurrentSessionForHostInactive()",
		);
		expect(swiftSource).toContain("makeSnapshotView()");
		expect(swiftSource).toContain(
			'destroyEditorSession(reason: "hostWillResignActive")',
		);
		expect(swiftSource).toContain('removeInactiveSnapshot(reason: "webReady")');
		expect(swiftSource).toContain(
			'destroyEditorSession(reason: "viewDidDisappear")',
		);
	});

	it("keeps AUv3 scope polling enabled behind visibility gates", () => {
		const bridgeSource = readText(auv3BridgePath);

		expect(bridgeSource).toContain("const AUV3_SCOPE_POLLING_ENABLED = true");
		expect(bridgeSource).toContain(
			"const isPageVisible = () => !document.hidden",
		);
		expect(bridgeSource).toContain('window.addEventListener("pagehide"');
	});

	it("fades standalone audio on background instead of stopping on inactive", () => {
		const hostModelSource = readText(standaloneHostModelPath);
		const playEngineSource = readText(simplePlayEnginePath);

		expect(hostModelSource).toContain("case .inactive:");
		expect(hostModelSource).toContain("case .background:");
		expect(hostModelSource).toContain("playEngine.fadeOutAndStop()");
		expect(playEngineSource).toContain("public func fadeOutAndStop(");
		expect(playEngineSource).toContain("engine.mainMixerNode.outputVolume");
	});

	it("tears down the stale standalone AU before reconnecting the graph", () => {
		const playEngineSource = readText(simplePlayEnginePath);
		const connectMatch = playEngineSource.match(
			/public func connect\(avAudioUnit nextAudioUnit:[\s\S]*?\n {4}\}/,
		);

		expect(playEngineSource).toContain("connect(avAudioUnit: nil)");
		expect(playEngineSource).toContain("self.avAudioUnit = nextAudioUnit");
		expect(playEngineSource).toContain("scheduleMIDIEventListBlock = nil");
		expect(playEngineSource).toContain(
			"if isPlaying && self.avAudioUnit?.wantsAudioInput == true",
		);
		expect(connectMatch?.[0]).not.toContain(
			"guard let avAudioUnit = self.avAudioUnit",
		);
		expect(connectMatch?.[0]).toContain(
			"guard let avAudioUnit = nextAudioUnit else",
		);
	});

	it("retains the AUv3 engine without holding the lifecycle lock during render", () => {
		const audioUnitSource = readText(xcodeAudioUnitPath);
		const renderBlockMatch = audioUnitSource.match(
			/public override var internalRenderBlock:[\s\S]*?\n\t}\n\n\tpublic func setParamsJson/,
		);

		expect(audioUnitSource).toContain("private let engineLock = NSLock()");
		expect(audioUnitSource).toContain("private func withRetainedEngine");
		expect(audioUnitSource).toContain("private func withEngineLock");
		expect(renderBlockMatch?.[0]).toContain("engineLock.try()");
		expect(renderBlockMatch?.[0]).toContain(
			"cosmo_pd101_ffi_engine_retain(engine)",
		);
		expect(renderBlockMatch?.[0]).toContain("engineLock.unlock()");
		expect(renderBlockMatch?.[0]).toContain(
			"defer { cosmo_pd101_ffi_engine_destroy(engine) }",
		);
		expect(renderBlockMatch?.[0]).toContain("clearOutput(");
		expect(renderBlockMatch?.[0]).toContain(
			"consumeEvents(realtimeEventListHead, engine: engine)",
		);
		expect(renderBlockMatch?.[0]).not.toContain("engineLock.lock()");
	});

	it("detaches the AUv3 engine before snapshotting and releasing it", () => {
		const audioUnitSource = readText(xcodeAudioUnitPath);
		const deallocateMatch = audioUnitSource.match(
			/public override func deallocateRenderResources\(\)[\s\S]*?\n\t}\n\n\tpublic override func reset/,
		);

		expect(deallocateMatch?.[0]).toContain("withEngineLock");
		expect(deallocateMatch?.[0]).toContain("engine = nil");
		expect(deallocateMatch?.[0]).toContain(
			"savedStateJson = paramsJsonLocked(engineToDestroy)",
		);
		expect(deallocateMatch?.[0]).toContain(
			"cosmo_pd101_ffi_engine_destroy(engineToDestroy)",
		);
		expect(deallocateMatch?.[0]).not.toContain("savedStateJson = paramsJson()");
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
		const swiftSource = readText(xcodeWebEditorSessionPath);

		expect(swiftSource).toContain("private func publishHostSize(reason:");
		expect(swiftSource).toContain("deviceLandscapeAspectRatio:");
		expect(swiftSource).toContain("cz-host-size-changed");
		expect(swiftSource).toContain("window.dispatchEvent(new Event('resize'))");
	});

	it("keeps hosted AUv3 runtime mode as the controller default", () => {
		const controllerSource = readText(xcodeControllerPath);
		const sessionSource = readText(xcodeWebEditorSessionPath);

		expect(controllerSource).toContain(
			'@objc public var cosmoAuv3FitMode: String = "fit-width"',
		);
		expect(controllerSource).toContain(
			'@objc public var cosmoAuv3RuntimeMode: String = "auv3-hosted"',
		);
		expect(controllerSource).toContain("currentHostContext()");
		expect(sessionSource).toContain("func script(dispatchEvent: Bool)");
		expect(sessionSource).toContain("window.__czRuntimeMode=\\(runtimeMode);");
	});

	it("marks the containing standalone app as standalone before embedding the AU view", () => {
		const hostAppSource = readText(xcodeViewControllerRepresentablePath);
		const controllerSource = readText(xcodeControllerPath);
		const simplePlayEngineSource = readText(
			path.join(
				packageRoot,
				"CosmoPD101Host/CosmoPD101AUv3Ext-macOS/Common/Audio/SimplePlayEngine.swift",
			),
		);

		expect(hostAppSource).toContain(
			'viewController.setValue("fit-bounds", forKey: "cosmoAuv3FitMode")',
		);
		expect(hostAppSource).toContain(
			'viewController.setValue("standalone", forKey: "cosmoAuv3RuntimeMode")',
		);
		expect(hostAppSource).toContain(
			'viewController.setValue(true, forKey: "cosmoAuv3SupportsStandaloneAppSettings")',
		);
		expect(simplePlayEngineSource).toContain(
			"configureStandaloneAuv3ViewController(viewController)",
		);
		expect(simplePlayEngineSource).toContain(
			'standaloneState["CosmoStandaloneHostPresentation"] = true',
		);
		expect(controllerSource).toContain(
			"cosmoAudioUnit.isStandaloneHostPresentation",
		);
	});

	it("injects standalone app settings support into the AUv3 webview", () => {
		const controllerSource = readText(xcodeControllerPath);
		const sessionSource = readText(xcodeWebEditorSessionPath);

		expect(controllerSource).toContain(
			"@objc public var cosmoAuv3SupportsStandaloneAppSettings = false",
		);
		expect(sessionSource).toContain(
			"window.__czSupportsStandaloneAppSettings=\\(supportsStandaloneAppSettings);",
		);
		expect(controllerSource).toContain(
			"publishHostContext(currentHostContext()",
		);
		expect(sessionSource).toContain("func publishHostContext(");
		expect(sessionSource).toContain("cz-host-context-changed");
	});

	it("keeps restored document params on the raw restore path", () => {
		const swiftSource = readText(
			path.join(
				packageRoot,
				"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/Audio Unit/CosmoPD101AUv3Ext_macOSExtensionAudioUnit.swift",
			),
		);

		expect(swiftSource).toContain("paramsJson() ?? savedStateJson");
		expect(swiftSource).toContain(
			"_ = setParamsJson(json, notifyWebView: true, isRaw: true)",
		);
		expect(swiftSource).toContain(
			"_ = setParamsJson(pending, notifyWebView: true, isRaw: true)",
		);
		expect(swiftSource).toContain("savedStateJson = json");
	});

	it("keeps AUv3 standalone buffer choices aligned and applies the render frame limit", () => {
		const swiftSource = readText(xcodeControllerPath);
		const audioUnitSource = readText(
			path.join(
				packageRoot,
				"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/Audio Unit/CosmoPD101AUv3Ext_macOSExtensionAudioUnit.swift",
			),
		);

		expect(swiftSource).toContain(
			"static let allowedBufferSizes = [128, 256, 512, 1024]",
		);
		expect(swiftSource).toContain(
			"audioUnit.maximumFramesToRender = AUAudioFrameCount(bufferSize)",
		);
		expect(audioUnitSource).toContain(
			"static let maxSupportedFrameCount = 1024",
		);
		expect(audioUnitSource).toContain(
			"maximumFramesToRender = AUAudioFrameCount(Self.maxSupportedFrameCount)",
		);
		expect(audioUnitSource).toContain(
			"maxFrames = max(Int(maximumFramesToRender), Self.maxSupportedFrameCount)",
		);
	});

	it("sends all notes off before changing the AUv3 MIDI channel filter", () => {
		const audioUnitSource = readText(
			path.join(
				packageRoot,
				"CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/Common/Audio Unit/CosmoPD101AUv3Ext_macOSExtensionAudioUnit.swift",
			),
		);

		expect(audioUnitSource).toContain(
			"guard nextChannel != withEngineLock({ midiChannel }) else { return }",
		);
		expect(audioUnitSource).toContain("cosmo_pd101_ffi_all_notes_off(engine)");
	});
});
