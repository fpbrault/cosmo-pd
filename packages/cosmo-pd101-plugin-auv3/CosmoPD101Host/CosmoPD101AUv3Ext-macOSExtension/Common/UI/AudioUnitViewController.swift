import CoreAudioKit
import Foundation
import WebKit

#if os(iOS)
import UIKit
#endif

public class AudioUnitViewController: AUViewController, AUAudioUnitFactory, WKNavigationDelegate, WKScriptMessageHandler {
	private static let preferredWidth: CGFloat = 1368
	private static let preferredHeight: CGFloat = 912
	private static let minimumWidth: CGFloat = 1024
	private static let minimumHeight: CGFloat = 768
	private static let telemetryPushInterval: TimeInterval = 0.1
	private var presetSessionState = PresetSessionState()
	private var editorState = [String: Any]()
	private var midiLearnState = MidiLearnState()
	private var paramsVersion = 0
	private var activeTelemetryChannels = Set<TelemetryChannel>()
	private var telemetryTimer: Timer?
	private var lastRuntimeVoiceStatesJson: String?
	private var lastRuntimeModSourcesJson: String?
	private var lastTransportJson: String?

	nonisolated(unsafe) var audioUnit: AUAudioUnit?
	private var webView: WKWebView?
	private var webContentTerminationCount = 0

	#if os(iOS)
	public override var prefersStatusBarHidden: Bool { true }
	public override var prefersHomeIndicatorAutoHidden: Bool { true }
	public override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }
	#endif

	nonisolated(unsafe) private var observation: NSKeyValueObservation?

	deinit {}

	public override func loadView() {
		NSLog("[CzVC] loadView")
		#if os(iOS)
		view = UIView(frame: CGRect(x: 0, y: 0, width: Self.preferredWidth, height: Self.preferredHeight))
		view.backgroundColor = .black
		preferredContentSize = CGSize(width: Self.preferredWidth, height: Self.preferredHeight)
		#else
		view = NSView(frame: NSRect(x: 0, y: 0, width: Self.preferredWidth, height: Self.preferredHeight))
		
		view.wantsLayer = true
		view.layer?.backgroundColor = NSColor.black.cgColor
		preferredContentSize = NSSize(width: Self.preferredWidth, height: Self.preferredHeight)
		#endif
		installWebView()
	}

	#if os(iOS)
	public override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews()
		configureWindowSceneSizing()
		layoutWebView()
	}
	#else
	public override func viewDidAppear() {
		super.viewDidAppear()
		NSLog("[CzVC] viewDidAppear")
		guard let window = view.window else { return }
		window.contentMinSize = NSSize(width: Self.minimumWidth, height: Self.minimumHeight)
		window.contentAspectRatio = NSSize(width: Self.preferredWidth, height: Self.preferredHeight)
	}

	public override func viewDidLayout() {
		super.viewDidLayout()
		layoutWebView()
	}
	#endif

	#if os(iOS)
	private func configureWindowSceneSizing() {
		view.window?.windowScene?.sizeRestrictions?.minimumSize = CGSize(width: Self.minimumWidth, height: Self.minimumHeight)
	}
	#endif

	nonisolated public func createAudioUnit(with componentDescription: AudioComponentDescription) throws -> AUAudioUnit {
		let unit = try CosmoPD101AUv3Ext_macOSExtensionAudioUnit(componentDescription: componentDescription, options: [])
		audioUnit = unit
		observation = unit.observe(\.allParameterValues, options: [.new]) { _, _ in }
		unit.paramsChangedHandler = { [weak self] json, presetName in
			DispatchQueue.main.async { [weak self] in
				self?.pushStateToWebView(json, selectedPresetName: presetName)
			}
		}
		NSLog("[CzVC] createAudioUnit: unit created")
		return unit
	}

	public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		guard message.name == "cosmoPd101" else { return }
		guard let payload = message.body as? [String: Any] else { return }

		let id = payload["id"] as? Int ?? 0
		let method = payload["method"] as? String ?? ""
		let args = payload["args"] as? [Any] ?? []

		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else {
			// Audio unit not yet assigned — respond with an error so JS promises
			// reject immediately rather than hanging forever.
			sendError(id: id, message: "audioUnit not ready")
			return
		}

		switch method {
		case "getParams":
			sendResponse(id: id, result: audioUnit.paramsJson() ?? "{}")
		case "getParamsVersion":
			sendResponse(id: id, result: paramsVersion)
		case "setParams":
			if let json = args.first as? String, audioUnit.setParamsJson(json) {
				paramsVersion += 1
				sendResponse(id: id, result: NSNull())
			} else {
				NSLog("[CzVC] setParams FAILED: jsonOk=%@", (args.first as? String) != nil ? "yes" : "no")
				sendError(id: id, message: "invalid setParams payload")
			}
		case "getTransportInfo":
			sendResponse(id: id, result: transportInfoResult())
		case "getScopeData":
			let scope = audioUnit.scopeData()
			sendResponse(id: id, result: [
				"samples": scope.samples,
				"sampleRate": scope.sampleRate,
				"hz": scope.hz,
			])
		case "getRuntimeVoiceStates":
			sendResponse(id: id, result: audioUnit.runtimeVoiceStatesJson() ?? "[]")
		case "getRuntimeModSources":
			sendResponse(id: id, result: audioUnit.runtimeModSourcesJson() ?? "{}")
		case "subscribeRuntimeVoiceStates":
			setTelemetrySubscription(.runtimeVoiceStates, active: true, audioUnit: audioUnit)
			sendResponse(id: id, result: NSNull())
		case "unsubscribeRuntimeVoiceStates":
			setTelemetrySubscription(.runtimeVoiceStates, active: false, audioUnit: audioUnit)
			sendResponse(id: id, result: NSNull())
		case "subscribeRuntimeModSources":
			setTelemetrySubscription(.runtimeModSources, active: true, audioUnit: audioUnit)
			sendResponse(id: id, result: NSNull())
		case "unsubscribeRuntimeModSources":
			setTelemetrySubscription(.runtimeModSources, active: false, audioUnit: audioUnit)
			sendResponse(id: id, result: NSNull())
		case "subscribeTransport":
			setTelemetrySubscription(.transport, active: true, audioUnit: audioUnit)
			sendResponse(id: id, result: NSNull())
		case "unsubscribeTransport":
			setTelemetrySubscription(.transport, active: false, audioUnit: audioUnit)
			sendResponse(id: id, result: NSNull())
		case "getPresetSession":
			sendResponse(id: id, result: currentPresetSession(for: audioUnit))
		case "setPresetSession":
			presetSessionState = PresetSessionState(payload: args.first as? [String: Any])
			sendResponse(id: id, result: NSNull())
		case "getPresetLibrary":
			sendResponse(id: id, result: ["entries": presetLibraryEntries(for: audioUnit)])
		case "loadPresetData":
			guard
				let payload = args.first as? [String: Any],
				let presetId = payload["id"] as? String,
				let preset = preset(for: audioUnit, id: presetId)
			else {
				sendError(id: id, message: "invalid loadPresetData payload")
				return
			}
			audioUnit.currentPreset = preset
			paramsVersion += 1
			presetSessionState.activePresetId = presetId
			presetSessionState.loadedPresetId = presetId
			presetSessionState.activePresetNameBase = preset.name
			presetSessionState.isDirty = false
			sendResponse(id: id, result: ["preset_name": preset.name])
		case "setEditorState":
			editorState = args.first as? [String: Any] ?? [:]
			sendResponse(id: id, result: NSNull())
		case "getEditorState":
			sendResponse(id: id, result: editorState)
		case "getMidiLearnState":
			sendResponse(id: id, result: midiLearnState.payload)
		case "setMidiLearnMode":
			midiLearnState.learnMode = args.first as? Bool ?? false
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "setPendingMidiLearnParam":
			midiLearnState.pendingParamKey = args.first as? String
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "addMidiBinding":
			guard
				let paramKey = args.first as? String,
				let channel = args.dropFirst().first as? Int,
				let cc = args.dropFirst(2).first as? Int
			else {
				sendError(id: id, message: "invalid addMidiBinding payload")
				return
			}
			midiLearnState.bindings.removeAll { $0.paramKey == paramKey }
			midiLearnState.bindings.append(MidiLearnBinding(paramKey: paramKey, channel: channel, cc: cc))
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "removeMidiBinding":
			guard let payload = args.first as? [String: Any], let binding = MidiLearnBinding(payload: payload) else {
				sendError(id: id, message: "invalid removeMidiBinding payload")
				return
			}
			midiLearnState.bindings.removeAll { $0 == binding }
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "clearMidiLearnBindings":
			midiLearnState.bindings.removeAll()
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "addPreset", "savePreset", "deletePreset", "renamePreset", "toggleStarred", "setPresetAuthor", "setPresetTags", "exportPreset", "importPresetBank", "listFxModulePresets", "saveFxModulePreset", "deleteFxModulePreset":
			sendError(id: id, message: "AUv3 preset library editing is not supported yet")
		case "clientLog":
			let logLevel = args.first as? String ?? "info"
			let logMessage = args.count > 1 ? (args[1] as? String ?? "") : ""
			NSLog("[CzWebView][%@] %@", logLevel, logMessage)
			sendResponse(id: id, result: NSNull())
		case "noteOn", "noteOff", "sustain", "pitchBend", "modWheel", "aftertouch", "polyAftertouch", "panic":
			audioUnit.handleEngineEvent(type: method, payload: args.first as? [String: Any] ?? [:])
			sendResponse(id: id, result: NSNull())
		default:
			sendError(id: id, message: "unknown method: \(method)")
		}
	}

	private func installWebView() {
		NSLog("[CzVC] installWebView")

		// Resolve the bundle URL up-front so we can register the cosmo-ext scheme
		// handler on the WKWebViewConfiguration before the WKWebView is created
		// (the API requires this ordering).
		let bundle = Bundle(for: AudioUnitViewController.self)
		let indexUrl = bundle.url(forResource: "index", withExtension: "html", subdirectory: "ui")
			?? bundle.url(forResource: "index", withExtension: "html")

		let configuration = WKWebViewConfiguration()
		configuration.allowsAirPlayForMediaPlayback = false
		configuration.mediaTypesRequiringUserActionForPlayback = .all
		configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
		#if os(macOS)
		let hostPlatformScript = "window.__czHostPlatform='macos';"
		#else
		let hostPlatformScript = "window.__czHostPlatform='ios';"
		#endif
		configuration.userContentController.addUserScript(
			WKUserScript(source: hostPlatformScript, injectionTime: .atDocumentStart, forMainFrameOnly: true)
		)
		let diagnosticsScript = """
		(function () {
		  if (window.__czDiagInstalled) return;
		  window.__czDiagInstalled = true;

		  function show(msg) {
		    try {
		      var pre = document.getElementById('__czFatal');
		      if (!pre) {
		        pre = document.createElement('pre');
		        pre.id = '__czFatal';
		        pre.style.cssText = 'position:fixed;inset:0;z-index:2147483647;padding:16px;margin:0;overflow:auto;background:#111;color:#ff8080;font:12px/1.45 -apple-system,monospace;white-space:pre-wrap;';
		        document.body.appendChild(pre);
		      }
		      pre.textContent = 'Cosmo PD-101 UI runtime error\\n\\n' + msg;
		    } catch (_) {}
		  }

		  window.addEventListener('error', function (e) {
		    var msg = (e && e.message) ? (e.message + ' @ ' + e.filename + ':' + e.lineno) : 'Unknown window error';
		    show(msg);
		    try {
		      window.webkit.messageHandlers.cosmoPd101.postMessage({ id: 0, method: 'clientLog', args: ['error', 'window.error: ' + msg] });
		    } catch (_) {}
		  });

		  window.addEventListener('unhandledrejection', function (e) {
		    var reason = e && e.reason;
		    var msg = reason && (reason.stack || reason.message) ? (reason.stack || reason.message) : String(reason || 'Unhandled promise rejection');
		    show(msg);
		    try {
		      window.webkit.messageHandlers.cosmoPd101.postMessage({ id: 0, method: 'clientLog', args: ['error', 'unhandledrejection: ' + msg] });
		    } catch (_) {}
		  });
		})();
		"""
		configuration.userContentController.addUserScript(
			WKUserScript(source: diagnosticsScript, injectionTime: .atDocumentStart, forMainFrameOnly: true)
		)
		configuration.userContentController.add(self, name: "cosmoPd101")

		if let baseUrl = indexUrl?.deletingLastPathComponent() {
			configuration.setURLSchemeHandler(BundleSchemeHandler(baseURL: baseUrl), forURLScheme: "cosmo-ext")
		}

		let webView = WKWebView(frame: view.bounds, configuration: configuration)
		webView.navigationDelegate = self
		#if os(macOS)
		webView.setValue(false, forKey: "drawsBackground")
		webView.autoresizingMask = [.width, .height]
		#else
		webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
		webView.isOpaque = false
		webView.backgroundColor = .clear
		webView.scrollView.backgroundColor = .clear
		webView.scrollView.contentInsetAdjustmentBehavior = .never
		webView.scrollView.automaticallyAdjustsScrollIndicatorInsets = false
		#endif
		view.addSubview(webView)
		self.webView = webView
		layoutWebView()

		guard let indexUrl else {
			NSLog("[CzVC] index.html missing from bundle")
			webView.loadHTMLString(diagnosticHtml(title: "UI Bundle Missing", message: "Could not find index.html in the AU bundle."), baseURL: nil)
			return
		}
		NSLog("[CzVC] indexUrl=%@", indexUrl.path)

		webView.load(URLRequest(url: URL(string: "cosmo-ext://bundle/index.html")!))
	}

	private func layoutWebView() {
		guard let webView else { return }
		#if os(iOS)
		webView.frame = view.bounds
		#else
		webView.frame = view.bounds
		#endif
	}

	public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
		NSLog("[CzVC] didFail navigation: %@", error.localizedDescription)
		webView.loadHTMLString(diagnosticHtml(title: "Navigation Failed", message: error.localizedDescription), baseURL: nil)
	}

	public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
		NSLog("[CzVC] didFailProvisionalNavigation: %@", error.localizedDescription)
		webView.loadHTMLString(diagnosticHtml(title: "Provisional Navigation Failed", message: error.localizedDescription), baseURL: nil)
	}

	public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
		NSLog("[CzVC] didFinish navigation")
	}

	public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
		NSLog("[CzVC] didStartProvisionalNavigation")
	}

	public func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
		webContentTerminationCount += 1
		NSLog("[CzVC] web content process terminated (count=%d)", webContentTerminationCount)

		if webContentTerminationCount == 1 {
			// Retry once in case the first content process launch was transiently killed.
			webView.reload()
			return
		}

		webView.loadHTMLString(
			diagnosticHtml(title: "Web Content Process Terminated", message: "WebKit crashed while loading the bundled UI."),
			baseURL: nil
		)
	}

	private func diagnosticHtml(title: String, message: String) -> String {
		"""
		<html>
			<body style='margin:0;background:#0f1115;color:#f3f4f6;font-family:-apple-system,system-ui,sans-serif;'>
				<div style='padding:24px;'>
					<h2 style='margin:0 0 10px 0;'>Cosmo PD-101 UI: \(title)</h2>
					<p style='margin:0;white-space:pre-wrap;line-height:1.4;'>\(message)</p>
				</div>
			</body>
		</html>
		"""
	}

	private func sendResponse(id: Int, result: Any) {
		sendScriptPayload(["id": id, "result": result])
	}

	private func sendError(id: Int, message: String) {
		sendScriptPayload(["id": id, "error": message])
	}

	/// Pushes updated engine params and optional preset metadata to the WebView.
	/// Called when native-side state changes (factory preset selection, state restore).
	private func pushStateToWebView(_ paramsJson: String, selectedPresetName: String? = nil) {
		// Wrap in a JSON object so JSONSerialization handles all string escaping correctly.
		let container: [String: String] = ["p": paramsJson]
		guard let data = try? JSONSerialization.data(withJSONObject: container),
			  let containerStr = String(data: data, encoding: .utf8) else { return }
		var script = "window.__czOnParams?.(\(containerStr).p);"
		if let selectedPresetName {
			let presetContainer: [String: String] = ["n": selectedPresetName]
			if let presetData = try? JSONSerialization.data(withJSONObject: presetContainer),
			   let presetContainerStr = String(data: presetData, encoding: .utf8) {
				script += "window.__czOnHostPresetSelected?.(\(presetContainerStr).n);"
			}
		}
		webView?.evaluateJavaScript(script, completionHandler: nil)
	}

	private func sendScriptPayload(_ payload: [String: Any]) {
		guard JSONSerialization.isValidJSONObject(payload),
			let data = try? JSONSerialization.data(withJSONObject: payload),
			let json = String(data: data, encoding: .utf8) else {
			return
		}
		webView?.evaluateJavaScript("window.__czIpcResponse?.(\(json));", completionHandler: nil)
	}

	private func setTelemetrySubscription(_ channel: TelemetryChannel, active: Bool, audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit) {
		if active {
			let inserted = activeTelemetryChannels.insert(channel).inserted
			if inserted {
				resetTelemetryCache(for: channel)
				updateTelemetryTimer(audioUnit: audioUnit)
				pushTelemetryUpdates(audioUnit: audioUnit, forceChannels: [channel])
			}
			return
		}

		guard activeTelemetryChannels.remove(channel) != nil else {
			return
		}
		resetTelemetryCache(for: channel)
		updateTelemetryTimer(audioUnit: audioUnit)
	}

	private func updateTelemetryTimer(audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit) {
		if activeTelemetryChannels.isEmpty {
			telemetryTimer?.invalidate()
			telemetryTimer = nil
			return
		}

		guard telemetryTimer == nil else {
			return
		}

		let timer = Timer.scheduledTimer(timeInterval: Self.telemetryPushInterval, target: self, selector: #selector(handleTelemetryTimer), userInfo: nil, repeats: true)
		telemetryTimer = timer
		RunLoop.main.add(timer, forMode: .common)
	}

	@objc private func handleTelemetryTimer() {
		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else {
			telemetryTimer?.invalidate()
			telemetryTimer = nil
			return
		}
		pushTelemetryUpdates(audioUnit: audioUnit)
	}

	private func pushTelemetryUpdates(
		audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit,
		forceChannels: Set<TelemetryChannel> = []
	) {
		guard !activeTelemetryChannels.isEmpty else {
			return
		}

		var script = ""

		if activeTelemetryChannels.contains(.runtimeVoiceStates) {
			let next = audioUnit.runtimeVoiceStatesJson() ?? "[]"
			if forceChannels.contains(.runtimeVoiceStates) || next != lastRuntimeVoiceStatesJson {
				appendJavascriptJsonCallback(&script, functionName: "__czOnRuntimeVoiceStates", json: next)
				lastRuntimeVoiceStatesJson = next
			}
		}

		if activeTelemetryChannels.contains(.runtimeModSources) {
			let next = audioUnit.runtimeModSourcesJson() ?? "{}"
			if forceChannels.contains(.runtimeModSources) || next != lastRuntimeModSourcesJson {
				appendJavascriptJsonCallback(&script, functionName: "__czOnRuntimeModSources", json: next)
				lastRuntimeModSourcesJson = next
			}
		}

		if activeTelemetryChannels.contains(.transport), let next = transportInfoJson() {
			if forceChannels.contains(.transport) || next != lastTransportJson {
				appendJavascriptJsonCallback(&script, functionName: "__czOnTransport", json: next)
				lastTransportJson = next
			}
		}

		guard !script.isEmpty else {
			return
		}
		webView?.evaluateJavaScript(script, completionHandler: nil)
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

	private func resetTelemetryCache(for channel: TelemetryChannel) {
		switch channel {
		case .runtimeVoiceStates:
			lastRuntimeVoiceStatesJson = nil
		case .runtimeModSources:
			lastRuntimeModSourcesJson = nil
		case .transport:
			lastTransportJson = nil
		}
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
				"starred": false,
				"sortIndex": index,
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

private enum TelemetryChannel: Hashable {
	case runtimeVoiceStates
	case runtimeModSources
	case transport
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
				"bindings": bindings.map(\ .payload),
				"version": version,
			]
		}
	}

private final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
	private let baseURL: URL

	init(baseURL: URL) {
		self.baseURL = baseURL
	}

	func webView(_ webView: WKWebView, start urlSchemeTask: any WKURLSchemeTask) {
		guard let requestURL = urlSchemeTask.request.url else {
			urlSchemeTask.didFailWithError(URLError(.badURL))
			return
		}

		let relativePath = requestURL.path.hasPrefix("/")
			? String(requestURL.path.dropFirst())
			: requestURL.path
		let requestedFileURL = relativePath.isEmpty
			? baseURL.appendingPathComponent("index.html")
			: baseURL.appendingPathComponent(relativePath)
		let fileURL = Self.existingFileURL(for: requestedFileURL, relativePath: relativePath, baseURL: baseURL)

		do {
			let data = try Data(contentsOf: fileURL)
			let mimeType = Self.mimeType(for: fileURL.pathExtension)
			let response = HTTPURLResponse(
				url: requestURL,
				statusCode: 200,
				httpVersion: "HTTP/1.1",
				headerFields: Self.corsHeaders.merging(
					["Content-Type": mimeType.hasPrefix("text/") || mimeType == "application/javascript" ? "\(mimeType); charset=utf-8" : mimeType]
				) { $1 }
			) ?? URLResponse(
				url: requestURL,
				mimeType: mimeType,
				expectedContentLength: data.count,
				textEncodingName: nil
			)
			urlSchemeTask.didReceive(response)
			urlSchemeTask.didReceive(data)
			urlSchemeTask.didFinish()
		} catch {
			NSLog("[CzVC] BundleSchemeHandler failed for %@: %@", fileURL.path, error.localizedDescription)
			urlSchemeTask.didFailWithError(error)
		}
	}

	func webView(_ webView: WKWebView, stop urlSchemeTask: any WKURLSchemeTask) {}

	private static let corsHeaders = [
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET",
		"Access-Control-Allow-Headers": "Content-Type",
	]

	private static func existingFileURL(for requestedFileURL: URL, relativePath: String, baseURL: URL) -> URL {
		if FileManager.default.fileExists(atPath: requestedFileURL.path) {
			return requestedFileURL
		}

		if relativePath.hasPrefix("assets/") {
			let flattenedURL = baseURL.appendingPathComponent((relativePath as NSString).lastPathComponent)
			if FileManager.default.fileExists(atPath: flattenedURL.path) {
				return flattenedURL
			}
		}

		return requestedFileURL
	}

	private static func mimeType(for ext: String) -> String {
		switch ext.lowercased() {
		case "html": return "text/html"
		case "js", "mjs": return "application/javascript"
		case "css": return "text/css"
		case "wasm": return "application/wasm"
		case "json", "map": return "application/json"
		case "png": return "image/png"
		case "jpg", "jpeg": return "image/jpeg"
		case "gif": return "image/gif"
		case "svg": return "image/svg+xml"
		case "woff2": return "font/woff2"
		case "woff": return "font/woff"
		case "ttf": return "font/ttf"
		default: return "application/octet-stream"
		}
	}
}
