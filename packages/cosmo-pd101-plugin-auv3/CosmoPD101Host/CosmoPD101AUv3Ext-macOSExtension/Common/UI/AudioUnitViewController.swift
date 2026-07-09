import CoreAudioKit
import CosmoPd101AUv3Support
import Foundation
import os
import WebKit

private let czVCLog = OSLog(subsystem: "com.cosmo.pd101.auv3", category: "CzVC")
private let czWebViewLog = OSLog(subsystem: "com.cosmo.pd101.auv3", category: "CzWebView")

#if os(iOS)
import UIKit
#endif

private enum VoiceLimitSettings {
	static let defaultValue = 8
	static let userDefaultsKey = "com.cosmo.pd101.voiceLimit"

	static func clamp(_ value: Int) -> Int {
		max(1, min(value, 16))
	}

	static func load() -> Int {
		let stored = UserDefaults.standard.integer(forKey: userDefaultsKey)
		return stored == 0 ? defaultValue : clamp(stored)
	}

	static func save(_ value: Int) -> Int {
		let clamped = clamp(value)
		UserDefaults.standard.set(clamped, forKey: userDefaultsKey)
		return clamped
	}
}

private enum StandaloneAppSettings {
	static let groupId = "group.ca.purraudio.CosmoPD101Host"
	static let midiChannelKey = "com.cosmo.pd101.standalone.midiChannel"
	static let keepRunningInBackgroundKey = "com.cosmo.pd101.standalone.keepRunningInBackground"
	static let bufferSizeKey = "com.cosmo.pd101.standalone.bufferSize"
	static let defaultMidiChannel = 0
	static let defaultKeepRunningInBackground = false
	static let defaultBufferSize = 128
	static let allowedBufferSizes = [128, 256, 512, 1024]

	private static var defaults: UserDefaults {
		UserDefaults(suiteName: groupId) ?? .standard
	}

	static func clampMidiChannel(_ value: Int) -> Int {
		max(0, min(value, 16))
	}

	static func clampBufferSize(_ value: Int) -> Int {
		allowedBufferSizes.contains(value) ? value : defaultBufferSize
	}

	static func load() -> [String: Any] {
		let storedMidiChannel = defaults.object(forKey: midiChannelKey) as? Int
		let storedBufferSize = defaults.object(forKey: bufferSizeKey) as? Int
		return [
			"midiChannel": clampMidiChannel(storedMidiChannel ?? defaultMidiChannel),
			"keepRunningInBackground": defaults.object(forKey: keepRunningInBackgroundKey) as? Bool ?? defaultKeepRunningInBackground,
			"bufferSize": clampBufferSize(storedBufferSize ?? defaultBufferSize),
		]
	}

	static func save(_ payload: [String: Any]) -> [String: Any] {
		let midiChannel = clampMidiChannel(payload["midiChannel"] as? Int ?? defaultMidiChannel)
		let keepRunningInBackground = payload["keepRunningInBackground"] as? Bool ?? defaultKeepRunningInBackground
		let bufferSize = clampBufferSize(payload["bufferSize"] as? Int ?? defaultBufferSize)
		defaults.set(midiChannel, forKey: midiChannelKey)
		defaults.set(keepRunningInBackground, forKey: keepRunningInBackgroundKey)
		defaults.set(bufferSize, forKey: bufferSizeKey)
		return [
			"midiChannel": midiChannel,
			"keepRunningInBackground": keepRunningInBackground,
			"bufferSize": bufferSize,
		]
	}
}

public class AudioUnitViewController: AUViewController, AUAudioUnitFactory, WebEditorSessionDelegate {
	private static let minimumWidth: CGFloat = 640
	private static let minimumHeight: CGFloat = 480
	#if DEBUG
	private static let isSizingDebugEnabled = true
	#else
	private static let isSizingDebugEnabled = false
	#endif
	private var presetSessionState = PresetSessionState()
	private var editorState = [String: Any]()
	private var midiLearnState = MidiLearnState()
	private var paramsVersion = 0
	private let instanceID = UUID().uuidString
	private var cachedVoiceLimit: Int = 0
	private var voiceLimit: Int {
		get {
			if cachedVoiceLimit == 0 {
				cachedVoiceLimit = VoiceLimitSettings.load()
			}
			return cachedVoiceLimit
		}
		set {
			cachedVoiceLimit = VoiceLimitSettings.save(newValue)
		}
	}

	@objc public var cosmoAuv3FitMode: String = "fit-bounds" {
		didSet { currentSession?.publishHostContext(currentHostContext(), reason: "fitMode") }
	}
	@objc public var cosmoAuv3RuntimeMode: String = "auv3-hosted" {
		didSet { currentSession?.publishHostContext(currentHostContext(), reason: "runtimeMode") }
	}
	@objc public var cosmoAuv3SupportsStandaloneAppSettings = false {
		didSet { currentSession?.publishHostContext(currentHostContext(), reason: "standaloneAppSettingsSupport") }
	}

	nonisolated(unsafe) var audioUnit: AUAudioUnit?
	private var currentSession: WebEditorSession?
	private var inactiveSnapshotView: WebEditorHostView?
	private var hostInactiveAt: Date?
	private var pushStateCount = 0
	private var lastWebViewRecreateAt: Date?
	private var webViewRecreateCountInWindow = 0

	#if os(iOS)
	public override var prefersStatusBarHidden: Bool { true }
	public override var prefersHomeIndicatorAutoHidden: Bool { true }
	public override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }
	#endif

	nonisolated(unsafe) private var observation: NSKeyValueObservation?

	deinit {
		currentSession?.destroy(reason: "deinit")
		observation?.invalidate()
		observation = nil
		#if os(iOS)
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.NSExtensionHostDidBecomeActive, object: nil)
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.NSExtensionHostWillResignActive, object: nil)
		#endif
		os_log("deinit (instance=%@)", log: czVCLog, type: .default, instanceID)
	}

	public override func loadView() {
		os_log("loadView", log: czVCLog, type: .default)

		#if os(iOS)
		view = UIView(frame: CGRect(x: 0, y: 0, width: Self.minimumWidth, height: Self.minimumHeight))
		view.backgroundColor = UIColor(red: 0.15, green: 0.15, blue: 0.15, alpha: 1)
		preferredContentSize = CGSize(width: Self.minimumWidth, height: Self.minimumHeight)
		#else
		view = NSView(frame: NSRect(x: 0, y: 0, width: Self.minimumWidth, height: Self.minimumHeight))
		
		view.wantsLayer = true
		view.layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.15, alpha: 1).cgColor
		preferredContentSize = NSSize(width: Self.minimumWidth, height: Self.minimumHeight)
		#endif
		logSizing("loadView")

		#if os(iOS)
        NotificationCenter.default.addObserver(self, selector: #selector(handleHostDidBecomeActive(_:)), name: NSNotification.Name.NSExtensionHostDidBecomeActive, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handleHostWillResignActive(_:)), name: NSNotification.Name.NSExtensionHostWillResignActive, object: nil)
		#endif
	}

	#if os(iOS)
	public override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews()
		currentSession?.layout(bounds: view.bounds, reason: "viewDidLayoutSubviews")
		inactiveSnapshotView?.frame = view.bounds
		logSizing("viewDidLayoutSubviews")
	}

	public override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
		super.viewWillTransition(to: size, with: coordinator)
		logSizing("viewWillTransition")
		coordinator.animate(alongsideTransition: nil) { [weak self] _ in
			guard let self else { return }
			self.currentSession?.layout(bounds: self.view.bounds, reason: "viewWillTransitionComplete")
			self.inactiveSnapshotView?.frame = self.view.bounds
			self.logSizing("viewWillTransitionComplete")
		}
	}

	public override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		os_log("viewWillAppear (instance=%@)", log: czVCLog, type: .default, instanceID)
		installEditorSession(reason: "viewWillAppear")
	}

	public override func viewDidDisappear(_ animated: Bool) {
		super.viewDidDisappear(animated)
		os_log("viewDidDisappear (instance=%@)", log: czVCLog, type: .default, instanceID)
		hostInactiveAt = Date()
		destroyEditorSession(reason: "viewDidDisappear")
		removeInactiveSnapshot(reason: "viewDidDisappear")
	}

	#else
	public override func viewDidAppear() {
		super.viewDidAppear()
		os_log("viewDidAppear", log: czVCLog, type: .default)
		guard let window = view.window else { return }
		window.contentMinSize = NSSize(width: Self.minimumWidth, height: Self.minimumHeight)
		logSizing("viewDidAppear")
	}

	public override func viewWillAppear() {
		super.viewWillAppear()
		os_log("viewWillAppear (instance=%@)", log: czVCLog, type: .default, instanceID)
		installEditorSession(reason: "viewWillAppear")
	}

	public override func viewDidDisappear() {
		super.viewDidDisappear()
		os_log("viewDidDisappear (instance=%@)", log: czVCLog, type: .default, instanceID)
		hostInactiveAt = Date()
		destroyEditorSession(reason: "viewDidDisappear")
		removeInactiveSnapshot(reason: "viewDidDisappear")
	}

	public override func viewDidLayout() {
		super.viewDidLayout()
		currentSession?.layout(bounds: view.bounds, reason: "viewDidLayout")
		inactiveSnapshotView?.frame = view.bounds
		logSizing("viewDidLayout")
	}
	#endif

	nonisolated public func createAudioUnit(with componentDescription: AudioComponentDescription) throws -> AUAudioUnit {
		let unit = try CosmoPD101AUv3Ext_macOSExtensionAudioUnit(componentDescription: componentDescription, options: [])
		unit.setVoiceLimit(VoiceLimitSettings.load())
		Task { @MainActor in
			self.applyStandaloneAppSettings(StandaloneAppSettings.load(), to: unit)
		}
		audioUnit = unit
		observation = unit.observe(\.allParameterValues, options: [.new]) { _, _ in }
		unit.paramsChangedHandler = { [weak self] json, presetName in
			DispatchQueue.main.async { [weak self] in
				self?.pushStateToCurrentSession(json, selectedPresetName: presetName)
			}
		}
		os_log("createAudioUnit: unit created", log: czVCLog, type: .default)
		return unit
	}

	private func handleSessionMessage(_ session: WebEditorSession, payload: [String: Any]) {
		guard session === currentSession else { return }

		let id = payload["id"] as? Int ?? 0
		let method = payload["method"] as? String ?? ""
		let methodPayload = payload["payload"]

		os_log(
			"ipc from JS method=%{public}@ id=%{public}d instance=%{public}@ session=%{public}@",
			log: czVCLog,
			type: .debug,
			method,
			id,
			instanceID,
			session.id.uuidString
		)

		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else {
			// Audio unit not yet assigned — respond with an error so JS promises
			// reject immediately rather than hanging forever.
			sendError(session: session, id: id, message: "audioUnit not ready")
			return
		}

		switch method {
		case "getParams":
			sendResponse(session: session, id: id, result: audioUnit.paramsJson() ?? "{}")
		case "getParamsVersion":
			sendResponse(session: session, id: id, result: paramsVersion)
		case "setParams":
			if
				let params = methodPayload as? [String: Any],
				let data = try? JSONSerialization.data(withJSONObject: params),
				let json = String(data: data, encoding: .utf8),
				audioUnit.setParamsJson(json)
			{
				paramsVersion += 1
				sendResponse(session: session, id: id, result: NSNull())
			} else {
				os_log("setParams FAILED: invalid object payload", log: czVCLog, type: .error)
				sendError(session: session, id: id, message: "invalid setParams payload")
			}
		case "getTransportInfo":
			sendResponse(session: session, id: id, result: transportInfoResult())
		case "getScopeData":
			let scope = audioUnit.scopeData()
			sendResponse(session: session, id: id, result: [
				"samples": scope.samples,
				"sampleRate": scope.sampleRate,
				"hz": scope.hz,
			])
		case "getRuntimeVoiceStates":
			sendResponse(session: session, id: id, result: audioUnit.runtimeVoiceStatesJson() ?? "[]")
		case "getRuntimeModSources":
			sendResponse(session: session, id: id, result: audioUnit.runtimeModSourcesJson() ?? "{}")
		case "subscribeRuntimeVoiceStates":
			setTelemetrySubscription(.runtimeVoiceStates, active: true, session: session)
			sendResponse(session: session, id: id, result: NSNull())
		case "unsubscribeRuntimeVoiceStates":
			setTelemetrySubscription(.runtimeVoiceStates, active: false, session: session)
			sendResponse(session: session, id: id, result: NSNull())
		case "subscribeRuntimeModSources":
			setTelemetrySubscription(.runtimeModSources, active: true, session: session)
			sendResponse(session: session, id: id, result: NSNull())
		case "unsubscribeRuntimeModSources":
			setTelemetrySubscription(.runtimeModSources, active: false, session: session)
			sendResponse(session: session, id: id, result: NSNull())
		case "subscribeTransport":
			setTelemetrySubscription(.transport, active: true, session: session)
			sendResponse(session: session, id: id, result: NSNull())
		case "unsubscribeTransport":
			setTelemetrySubscription(.transport, active: false, session: session)
			sendResponse(session: session, id: id, result: NSNull())
		case "getPresetSession":
			sendResponse(session: session, id: id, result: currentPresetSession(for: audioUnit))
		case "setPresetSession":
			presetSessionState = PresetSessionState(payload: methodPayload as? [String: Any])
			sendResponse(session: session, id: id, result: NSNull())
		case "getPresetLibrary":
			sendResponse(session: session, id: id, result: [
				"entries": presetLibraryEntries(for: audioUnit),
				"status": ["state": "ready", "message": NSNull()],
			])
		case "loadPreset":
			guard
				let payload = methodPayload as? [String: Any],
				let presetId = payload["presetId"] as? String,
				let preset = preset(for: audioUnit, id: presetId)
			else {
				sendError(session: session, id: id, message: "invalid loadPreset payload")
				return
			}
			audioUnit.currentPreset = preset
			paramsVersion += 1
			presetSessionState.activePresetId = presetId
			presetSessionState.loadedPresetId = presetId
			presetSessionState.activePresetNameBase = preset.name
			presetSessionState.isDirty = false
			sendResponse(session: session, id: id, result: ["presetName": preset.name])
		case "setEditorState":
			editorState = methodPayload as? [String: Any] ?? [:]
			sendResponse(session: session, id: id, result: NSNull())
		case "getEditorState":
			sendResponse(session: session, id: id, result: editorState)
		case "getMidiLearnState":
			sendResponse(session: session, id: id, result: midiLearnState.payload)
		case "setMidiLearnMode":
			midiLearnState.learnMode = methodPayload as? Bool ?? false
			midiLearnState.version += 1
			sendResponse(session: session, id: id, result: NSNull())
		case "setPendingMidiLearnParam":
			midiLearnState.pendingParamKey = methodPayload as? String
			midiLearnState.version += 1
			sendResponse(session: session, id: id, result: NSNull())
		case "addMidiBinding":
			guard
				let payload = methodPayload as? [String: Any],
				let paramKey = payload["paramKey"] as? String,
				let channel = payload["channel"] as? Int,
				let cc = payload["cc"] as? Int
			else {
				sendError(session: session, id: id, message: "invalid addMidiBinding payload")
				return
			}
			midiLearnState.bindings.removeAll { $0.paramKey == paramKey }
			midiLearnState.bindings.append(MidiLearnBinding(paramKey: paramKey, channel: channel, cc: cc))
			midiLearnState.version += 1
			sendResponse(session: session, id: id, result: NSNull())
		case "removeMidiBinding":
			guard let payload = methodPayload as? [String: Any], let binding = MidiLearnBinding(payload: payload) else {
				sendError(session: session, id: id, message: "invalid removeMidiBinding payload")
				return
			}
			midiLearnState.bindings.removeAll { $0 == binding }
			midiLearnState.version += 1
			sendResponse(session: session, id: id, result: NSNull())
		case "clearMidiLearnBindings":
			midiLearnState.bindings.removeAll()
			midiLearnState.version += 1
			sendResponse(session: session, id: id, result: NSNull())
		case "getVoiceLimit":
			sendResponse(session: session, id: id, result: voiceLimit)
		case "setVoiceLimit":
			let requested = methodPayload as? Int
			if let limit = methodPayload as? Int {
				voiceLimit = limit
				audioUnit.setVoiceLimit(voiceLimit)
			}
			let applied = audioUnit.setVoiceLimit(voiceLimit)
			os_log(
				.default,
				log: czVCLog,
				"setVoiceLimit requested=%d persisted=%d applied=%{public}@",
				requested ?? -1,
				voiceLimit,
				applied ? "true" : "false"
			)
			sendResponse(session: session, id: id, result: NSNull())
		case "getStandaloneAppSettings":
			sendResponse(session: session, id: id, result: StandaloneAppSettings.load())
		case "setStandaloneAppSettings":
			let settings = StandaloneAppSettings.save(methodPayload as? [String: Any] ?? [:])
			applyStandaloneAppSettings(settings, to: audioUnit)
			sendResponse(session: session, id: id, result: settings)
		case "addPreset", "savePreset", "deletePreset", "renamePreset", "toggleStarred", "setPresetAuthor", "setPresetDescription", "setPresetTags", "exportPreset", "importPresetBank", "listFxModulePresets", "saveFxModulePreset", "deleteFxModulePreset":
			sendError(session: session, id: id, message: "AUv3 preset library editing is not supported yet")
		case "clientLog":
			let logPayload = methodPayload as? [String: Any]
			let logLevel = logPayload?["level"] as? String ?? "info"
			let logMessage = logPayload?["message"] as? String ?? ""
			os_log("%{public}@: %{public}@", log: czWebViewLog, type: .default, logLevel, logMessage)
			sendResponse(session: session, id: id, result: NSNull())
		case "noteOn", "noteOff", "sustain", "pitchBend", "modWheel", "aftertouch", "polyAftertouch", "macroValue", "panic":
			audioUnit.handleEngineEvent(type: method, payload: methodPayload as? [String: Any] ?? [:])
			sendResponse(session: session, id: id, result: NSNull())
		default:
			sendError(session: session, id: id, message: "unknown method: \(method)")
		}
	}

	private func installEditorSession(reason: String) {
		guard isViewLoaded else { return }
		if let currentSession {
			currentSession.layout(bounds: view.bounds, reason: reason)
			return
		}

		let session = WebEditorSession(
			delegate: self,
			hostContext: currentHostContext(),
			bundle: Bundle(for: AudioUnitViewController.self),
			log: czVCLog
		)
		currentSession = session
		session.install(in: view, bounds: view.bounds)
		logSizing(reason)
	}

	private func destroyEditorSession(reason: String) {
		currentSession?.destroy(reason: reason)
		currentSession = nil
	}

	private func replaceEditorSession(_ session: WebEditorSession, reason: String) {
		guard session === currentSession else { return }
		guard shouldRecreateWebView(reason: reason) else {
			destroyEditorSession(reason: "\(reason):recreateLimit")
			return
		}
		destroyEditorSession(reason: reason)
		installEditorSession(reason: reason)
	}

	private func shouldRecreateWebView(reason: String) -> Bool {
		let now = Date()
		if let lastWebViewRecreateAt, now.timeIntervalSince(lastWebViewRecreateAt) <= 8 {
			webViewRecreateCountInWindow += 1
		} else {
			webViewRecreateCountInWindow = 1
		}
		lastWebViewRecreateAt = now

		guard webViewRecreateCountInWindow <= 3 else {
			os_log(
				"webEditorSession recreate suppressed reason=%{public}@ count=%{public}d instance=%{public}@",
				log: czVCLog,
				type: .fault,
				reason,
				webViewRecreateCountInWindow,
				instanceID
			)
			return false
		}

		return true
	}

	private func currentHostContext() -> WebEditorHostContext {
		WebEditorHostContext(
			runtimeMode: cosmoAuv3RuntimeMode,
			fitMode: cosmoAuv3FitMode,
			supportsStandaloneAppSettings: cosmoAuv3SupportsStandaloneAppSettings
		)
	}

	func webEditorSessionDidReceiveMessage(_ session: WebEditorSession, payload: [String: Any]) {
		handleSessionMessage(session, payload: payload)
	}

	func webEditorSessionDidBecomeReady(_ session: WebEditorSession) {
		guard session === currentSession else { return }
		os_log(
			"webEditorSession ready instance=%{public}@ session=%{public}@",
			log: czVCLog,
			type: .default,
			instanceID,
			session.id.uuidString
		)
		session.publishHostContext(currentHostContext(), reason: "webReady")
		session.layout(bounds: view.bounds, reason: "webReady")
		logSizing("webReady")
		pushCurrentStateToSession(session, reason: "webReady")
		session.pushTelemetryUpdates()
		removeInactiveSnapshot(reason: "webReady")
	}

	func webEditorSessionDidRequestReplacement(_ session: WebEditorSession, reason: String) {
		replaceEditorSession(session, reason: reason)
	}

	func webEditorSessionNeedsScopeFrame(_ session: WebEditorSession) -> ScopeBinaryFrame? {
		guard session === currentSession else { return nil }
		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else { return nil }
		let scope = audioUnit.scopeData()
		return ScopeBinaryFrame(samples: scope.samples, sampleRate: scope.sampleRate, hz: scope.hz)
	}

	func webEditorSessionNeedsTelemetryScript(
		_ session: WebEditorSession,
		telemetryController: TelemetryController,
		forceChannels: Set<TelemetryChannel>
	) -> String? {
		guard session === currentSession else { return nil }
		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else { return nil }
		return telemetryScript(audioUnit: audioUnit, telemetryController: telemetryController, forceChannels: forceChannels)
	}

	private func logSizing(_ reason: String) {
		guard Self.isSizingDebugEnabled else { return }
		guard isViewLoaded else { return }

		#if os(iOS)
		let window = view.window
		let scene = window?.windowScene
		let screenBounds = scene?.screen.bounds ?? window?.screen.bounds ?? .zero
		let minSize = scene?.sizeRestrictions?.minimumSize ?? .zero
		let geometry: String
		if #available(iOS 16.0, *) {
			geometry = String(describing: scene?.effectiveGeometry)
		} else {
			geometry = "unavailable"
		}
		os_log(
			"size[%{public}@] view.bounds=%{public}@ view.frame=%{public}@ preferred=%{public}@ safeArea=%{public}@ window.bounds=%{public}@ window.frame=%{public}@ screen.bounds=%{public}@ effectiveGeometry=%{public}@ minSize=%{public}@",
			log: czVCLog,
			type: .default,
			reason,
			NSCoder.string(for: view.bounds),
			NSCoder.string(for: view.frame),
			NSCoder.string(for: preferredContentSize),
			NSCoder.string(for: view.safeAreaInsets),
			NSCoder.string(for: window?.bounds ?? .zero),
			NSCoder.string(for: window?.frame ?? .zero),
			NSCoder.string(for: screenBounds),
			geometry,
			NSCoder.string(for: minSize)
		)
		#else
		let window = view.window
		let screenFrame = window?.screen?.frame ?? .zero
		os_log(
			"size[%{public}@] view.bounds=%{public}@ view.frame=%{public}@ preferred=%{public}@ window.frame=%{public}@ screen.frame=%{public}@",
			log: czVCLog,
			type: .default,
			reason,
			NSStringFromRect(view.bounds),
			NSStringFromRect(view.frame),
			NSStringFromSize(preferredContentSize),
			NSStringFromRect(window?.frame ?? .zero),
			NSStringFromRect(screenFrame)
		)
		#endif
	}

	private func applyStandaloneAppSettings(_ settings: [String: Any], to audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit) {
		let midiChannel = StandaloneAppSettings.clampMidiChannel(settings["midiChannel"] as? Int ?? StandaloneAppSettings.defaultMidiChannel)
		let bufferSize = StandaloneAppSettings.clampBufferSize(settings["bufferSize"] as? Int ?? StandaloneAppSettings.defaultBufferSize)
		audioUnit.setMidiChannel(midiChannel)
		audioUnit.maximumFramesToRender = AUAudioFrameCount(bufferSize)
		os_log(
			.default,
			log: czVCLog,
			"standalone app settings applied midiChannel=%d bufferSize=%d keepBackground=%{public}@",
			midiChannel,
			bufferSize,
			(settings["keepRunningInBackground"] as? Bool ?? StandaloneAppSettings.defaultKeepRunningInBackground) ? "true" : "false"
		)
	}

	private func sendResponse(session: WebEditorSession, id: Int, result: Any) {
		guard session === currentSession else { return }
		session.sendResponse(id: id, result: result)
	}

	private func sendError(session: WebEditorSession, id: Int, message: String) {
		guard session === currentSession else { return }
		session.sendError(id: id, message: message)
	}

	private func freezeCurrentSessionForHostInactive() {
		guard isViewLoaded else {
			destroyEditorSession(reason: "hostWillResignActive")
			return
		}

		if let snapshot = currentSession?.makeSnapshotView() {
			removeInactiveSnapshot(reason: "replaceSnapshot")
			snapshot.frame = view.bounds
			#if os(macOS)
			snapshot.autoresizingMask = [.width, .height]
			#else
			snapshot.autoresizingMask = [.flexibleWidth, .flexibleHeight]
			#endif
			view.addSubview(snapshot)
			inactiveSnapshotView = snapshot
			os_log(
				"inactive snapshot installed instance=%{public}@",
				log: czVCLog,
				type: .default,
				instanceID
			)
		}

		destroyEditorSession(reason: "hostWillResignActive")
	}

	private func removeInactiveSnapshot(reason: String) {
		guard let inactiveSnapshotView else { return }
		inactiveSnapshotView.removeFromSuperview()
		self.inactiveSnapshotView = nil
		os_log(
			"inactive snapshot removed reason=%{public}@ instance=%{public}@",
			log: czVCLog,
			type: .default,
			reason,
			instanceID
		)
	}

	/// Pushes updated engine params and optional preset metadata to the WebView.
	/// Called when native-side state changes (factory preset selection, state restore).
	private func pushStateToCurrentSession(_ paramsJson: String, selectedPresetName: String? = nil) {
		guard let session = currentSession else { return }
		pushStateToSession(session, paramsJson: paramsJson, selectedPresetName: selectedPresetName)
	}

	private func pushStateToSession(_ session: WebEditorSession, paramsJson: String, selectedPresetName: String? = nil) {
		guard session === currentSession else { return }
		pushStateCount += 1

		os_log(
			"pushStateToSession #%{public}d instance=%{public}@ session=%{public}@ bytes=%{public}d preset=%{public}@",
			log: czVCLog,
			type: .default,
			pushStateCount,
			instanceID,
			session.id.uuidString,
			paramsJson.utf8.count,
			selectedPresetName ?? "nil"
		)

		session.pushParams(json: paramsJson, selectedPresetName: selectedPresetName)
	}

	private func setTelemetrySubscription(_ channel: TelemetryChannel, active: Bool, session: WebEditorSession) {
		guard session === currentSession else { return }
		let changed = session.setTelemetrySubscription(channel, active: active)
		os_log(
			"telemetry subscription channel=%{public}@ active=%{public}d changed=%{public}d instance=%{public}@ session=%{public}@",
			log: czVCLog,
			type: .default,
			channel.rawValue,
			active,
			changed,
			instanceID,
			session.id.uuidString
		)
	}

	@objc private func handleHostDidBecomeActive(_ notification: Notification) {
		DispatchQueue.main.async { [weak self] in
			guard let self else { return }

			let inactiveSeconds = self.hostInactiveAt.map { Date().timeIntervalSince($0) } ?? -1

			os_log(
				"host did become active instance=%{public}@ inactiveSeconds=%{public}.2f",
				log: czVCLog,
				type: .default,
				self.instanceID,
				inactiveSeconds
			)

			if self.isViewLoaded {
				self.installEditorSession(reason: "hostDidBecomeActive")
			}
			let resumedSession = self.currentSession
			// Short hold allows WebKit to resume WebContent before any JS eval.
			DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { [weak self, weak resumedSession] in
				guard let self, let resumedSession, resumedSession === self.currentSession else { return }
				resumedSession.clearResumeHold()
				os_log(
					"host active resume hold cleared instance=%{public}@ session=%{public}@",
					log: czVCLog,
					type: .default,
					self.instanceID,
					resumedSession.id.uuidString
				)
			}
		}
	}

	@objc private func handleHostWillResignActive(_ notification: Notification) {
		DispatchQueue.main.async { [weak self] in
			guard let self else { return }

			self.hostInactiveAt = Date()
			os_log(
				"host will resign active instance=%{public}@",
				log: czVCLog,
				type: .default,
				self.instanceID
			)
			self.freezeCurrentSessionForHostInactive()
		}
	}

	private func pushCurrentStateToSession(_ session: WebEditorSession, reason: String) {
		guard session === currentSession else { return }
		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else { return }
		guard let json = audioUnit.paramsJson() else { return }

		os_log(
			"pushCurrentStateToSession reason=%{public}@ instance=%{public}@ session=%{public}@",
			log: czVCLog,
			type: .default,
			reason,
			instanceID,
			session.id.uuidString
		)

		pushStateToSession(session, paramsJson: json)
	}

	private func telemetryScript(
		audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit,
		telemetryController: TelemetryController,
		forceChannels: Set<TelemetryChannel> = []
	) -> String? {
		guard !telemetryController.activeChannels.isEmpty else {
			return nil
		}

		var script = ""

		if telemetryController.hasChannel(.runtimeVoiceStates) {
			let next = audioUnit.runtimeVoiceStatesJson() ?? "[]"
			if telemetryController.shouldPush(channel: .runtimeVoiceStates, value: next, force: forceChannels.contains(.runtimeVoiceStates)) {
				appendJavascriptJsonCallback(&script, functionName: "__czOnRuntimeVoiceStates", json: next)
			}
		}

		if telemetryController.hasChannel(.runtimeModSources) {
			let next = audioUnit.runtimeModSourcesJson() ?? "{}"
			if telemetryController.shouldPush(channel: .runtimeModSources, value: next, force: forceChannels.contains(.runtimeModSources)) {
				appendJavascriptJsonCallback(&script, functionName: "__czOnRuntimeModSources", json: next)
			}
		}

		if telemetryController.hasChannel(.transport), let next = transportInfoJson() {
			if telemetryController.shouldPush(channel: .transport, value: next, force: forceChannels.contains(.transport)) {
				appendJavascriptJsonCallback(&script, functionName: "__czOnTransport", json: next)
			}
		}

		guard !script.isEmpty else {
			return nil
		}
		return script
	}

	private func appendJavascriptJsonCallback(_ script: inout String, functionName: String, json: String) {
		let container = ["payload": json]
		guard let data = try? JSONSerialization.data(withJSONObject: container, options: [.sortedKeys]),
			let encoded = String(data: data, encoding: .utf8) else {
			return
		}
		script += "window.\(functionName)?.(\(encoded).payload);"
	}

	private func transportInfoJson() -> String? {
		guard let data = try? JSONSerialization.data(withJSONObject: transportInfoResult(), options: [.sortedKeys]),
			let json = String(data: data, encoding: .utf8) else {
			return nil
		}
		return json
	}

	private func currentPresetSession(for audioUnit: AUAudioUnit) -> [String: Any] {
		let preset = audioUnit.currentPreset
		let presetId = presetId(for: preset)
		return [
			"activePresetId": presetSessionState.activePresetId ?? presetId as Any,
			"loadedPresetId": presetSessionState.loadedPresetId ?? presetId as Any,
			"activePresetNameBase": presetSessionState.activePresetNameBase ?? preset?.name ?? "Current State",
			"isDirty": presetSessionState.isDirty,
		]
	}

	private func presetLibraryEntries(for audioUnit: AUAudioUnit) -> [[String: Any]] {
		(audioUnit.factoryPresets ?? []).enumerated().map { index, preset in
			[
				"id": presetId(for: preset) ?? String(index),
				"name": preset.name,
				"source": "cosmo-factory",
				"author": "",
				"description": "",
				"starred": false,
				"sortIndex": index,
				"bankId": NSNull(),
				"bankName": NSNull(),
				"favorite": false,
				"tags": [],
			]
		}
	}

	private func preset(for audioUnit: AUAudioUnit, id: String) -> AUAudioUnitPreset? {
		(audioUnit.factoryPresets ?? []).first { presetId(for: $0) == id }
	}

	private func presetId(for preset: AUAudioUnitPreset?) -> String? {
		guard let preset else { return nil }
		return String(Int(preset.number))
	}

	private func transportInfoResult() -> [String: Any] {
		[
			"playing": false,
			"recording": false,
			"tempo": 120,
			"timeSigNum": 4,
			"timeSigDen": 4,
			"positionSamples": 0,
			"positionSeconds": 0,
			"positionBeats": 0,
			"barStartBeats": 0,
			"loopActive": false,
			"loopStartBeats": 0,
			"loopEndBeats": 0,
		]
	}
}

	private struct PresetSessionState {
		var activePresetId: String?
		var loadedPresetId: String?
		var activePresetNameBase: String?
		var isDirty = false

		init() {}

		init(payload: [String: Any]?) {
			activePresetId = payload?["activePresetId"] as? String
			loadedPresetId = payload?["loadedPresetId"] as? String
			activePresetNameBase = payload?["activePresetNameBase"] as? String
			isDirty = payload?["isDirty"] as? Bool ?? false
		}
	}

	private struct MidiLearnBinding: Equatable {
		let paramKey: String
		let channel: Int
		let cc: Int

		init(paramKey: String, channel: Int, cc: Int) {
			self.paramKey = paramKey
			self.channel = channel
			self.cc = cc
		}

		init?(payload: [String: Any]) {
			guard
				let paramKey = payload["paramKey"] as? String,
				let channel = payload["channel"] as? Int,
				let cc = payload["cc"] as? Int
			else {
				return nil
			}
			self.init(paramKey: paramKey, channel: channel, cc: cc)
		}

		var payload: [String: Any] {
			[
				"paramKey": paramKey,
				"channel": channel,
				"cc": cc,
			]
		}
	}

	private struct MidiLearnState {
		var learnMode = false
		var pendingParamKey: String?
		var bindings: [MidiLearnBinding] = []
		var version = 0

		var payload: [String: Any] {
			[
				"learnMode": learnMode,
				"pendingParamKey": pendingParamKey ?? NSNull(),
				"bindings": bindings.map(\.payload),
				"version": version,
			]
		}
	}

