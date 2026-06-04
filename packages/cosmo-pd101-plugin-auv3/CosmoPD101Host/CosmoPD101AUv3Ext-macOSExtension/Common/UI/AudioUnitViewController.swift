import CoreAudioKit
import Foundation
import WebKit

#if os(iOS)
import UIKit
#endif

public final class AudioUnitViewController: AUViewController, AUAudioUnitFactory, WKNavigationDelegate, WKScriptMessageHandler {
	private static let preferredSize = CGSize(width: 1368, height: 912)
	private static let pollInterval: TimeInterval = 0.1

	private var audioUnitInstance: TruceAUAudioUnit?
	private var webView: WKWebView?
	private var pollTimer: Timer?
	private var activeTelemetryChannels = Set<TelemetryChannel>()
	private var lastParamsVersion: Int64 = -1
	private var lastMidiLearnVersion: Int64 = -1
	private var nextInternalRequestId = -1

	public override func loadView() {
		#if os(iOS)
		view = UIView(frame: CGRect(origin: .zero, size: Self.preferredSize))
		view.backgroundColor = .black
		#else
		view = NSView(frame: CGRect(origin: .zero, size: Self.preferredSize))
		view.wantsLayer = true
		view.layer?.backgroundColor = NSColor.black.cgColor
		#endif
		preferredContentSize = Self.preferredSize
		installWebView()
	}

	public nonisolated func createAudioUnit(with componentDescription: AudioComponentDescription) throws -> AUAudioUnit {
		Self.configureSharedDataDirectory()
		let unit = try TruceAUAudioUnit(componentDescription: componentDescription, options: [])
		DispatchQueue.main.async { [weak self] in
			self?.audioUnitInstance = unit
			self?.startPolling()
		}
		return unit
	}

	public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		guard message.name == "cosmoPd101", let payload = message.body as? [String: Any] else {
			return
		}
		let id = payload["id"] as? Int ?? 0
		let method = payload["method"] as? String ?? ""

		if let channel = TelemetryChannel.subscribeMethod(method) {
			activeTelemetryChannels.insert(channel)
			sendResponse(id: id, result: NSNull())
			return
		}
		if let channel = TelemetryChannel.unsubscribeMethod(method) {
			activeTelemetryChannels.remove(channel)
			sendResponse(id: id, result: NSNull())
			return
		}

		guard let response = rustResponse(for: payload) else {
			sendError(id: id, message: "Rust editor request unavailable")
			return
		}
		webView?.evaluateJavaScript("window.__czIpcResponse?.(\(response));")
	}

	#if os(iOS)
	public override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews()
		webView?.frame = view.bounds
	}

	public override func viewDidDisappear(_ animated: Bool) {
		super.viewDidDisappear(animated)
		stopPolling()
	}

	public override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		startPolling()
	}
	#else
	public override func viewDidLayout() {
		super.viewDidLayout()
		webView?.frame = view.bounds
	}

	public override func viewDidDisappear() {
		super.viewDidDisappear()
		stopPolling()
	}

	public override func viewWillAppear() {
		super.viewWillAppear()
		startPolling()
	}
	#endif

	private nonisolated static func configureSharedDataDirectory() {
		let groupId = "group.ca.purraudio.CosmoPD101Host"
		guard let container = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: groupId) else {
			NSLog("[CzVC] app group container unavailable: %@", groupId)
			return
		}
		setenv("COSMO_PD101_DATA_DIR", container.path, 1)
	}

	private func installWebView() {
		let bundle = Bundle(for: AudioUnitViewController.self)
		guard let indexUrl = bundle.url(forResource: "index", withExtension: "html", subdirectory: "ui")
			?? bundle.url(forResource: "index", withExtension: "html")
		else {
			return
		}

		let configuration = WKWebViewConfiguration()
		let platform = {
			#if os(macOS)
			return "macos"
			#else
			return "ios"
			#endif
		}()
		configuration.userContentController.addUserScript(
			WKUserScript(
				source: "window.__czHostPlatform='\(platform)';",
				injectionTime: .atDocumentStart,
				forMainFrameOnly: true
			)
		)
		configuration.userContentController.add(self, name: "cosmoPd101")
		configuration.setURLSchemeHandler(BundleSchemeHandler(baseURL: indexUrl.deletingLastPathComponent()), forURLScheme: "cosmo-ext")

		let webView = WKWebView(frame: view.bounds, configuration: configuration)
		webView.navigationDelegate = self
		#if os(macOS)
		webView.autoresizingMask = [.width, .height]
		webView.setValue(false, forKey: "drawsBackground")
		#else
		webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
		webView.isOpaque = false
		webView.backgroundColor = .clear
		webView.scrollView.backgroundColor = .clear
		webView.scrollView.contentInsetAdjustmentBehavior = .never
		#endif
		view.addSubview(webView)
		self.webView = webView
		webView.load(URLRequest(url: URL(string: "cosmo-ext://bundle/index.html")!))
	}

	private func startPolling() {
		guard audioUnitInstance != nil, pollTimer == nil else {
			return
		}
		let timer = Timer.scheduledTimer(timeInterval: Self.pollInterval, target: self, selector: #selector(pollRustState), userInfo: nil, repeats: true)
		pollTimer = timer
		RunLoop.main.add(timer, forMode: .common)
		pollRustState()
	}

	private func stopPolling() {
		pollTimer?.invalidate()
		pollTimer = nil
	}

	@objc private func pollRustState() {
		guard audioUnitInstance != nil else {
			stopPolling()
			return
		}

		if let version = rustResult(method: "getParamsVersion") as? NSNumber, version.int64Value != lastParamsVersion {
			lastParamsVersion = version.int64Value
			if let params = rustResult(method: "getParams"), let json = jsonString(params) {
				evaluateCallback("__czOnParams", jsonString: json)
			}
			syncHostParameters()
		}

		if let state = rustResult(method: "getMidiLearnState") as? [String: Any] {
			let version = (state["version"] as? NSNumber)?.int64Value ?? -1
			if version != lastMidiLearnVersion, let json = jsonString(state) {
				lastMidiLearnVersion = version
				evaluateCallback("__czOnMidiLearnState", jsonString: json)
			}
		}

		if let events = rustResult(method: "drainMidiCcEvents") as? [[String: Any]] {
			for event in events {
				guard let channel = event["channel"] as? NSNumber,
					let cc = event["cc"] as? NSNumber,
					let value = event["value"] as? NSNumber
				else {
					continue
				}
				webView?.evaluateJavaScript("window.__czOnMidiCc?.(\(channel.intValue),\(cc.intValue),\(value.intValue));")
			}
		}

		for channel in activeTelemetryChannels {
			if let result = rustResult(method: channel.snapshotMethod), let json = jsonString(result) {
				evaluateCallback(channel.callbackName, jsonString: json)
			}
		}
	}

	private func syncHostParameters() {
		guard let unit = audioUnitInstance, let ctx = unit.rustCtx, let callbacks = g_callbacks, let tree = unit.parameterTree else {
			return
		}
		unit.isSyncingToHost = true
		for parameter in tree.allParameters {
			let value = AUValue(callbacks.pointee.param_get_value(ctx, UInt32(parameter.address)))
			if abs(parameter.value - value) > 0.0001 {
				parameter.setValue(value, originator: nil)
			}
		}
		unit.isSyncingToHost = false
	}

	private func rustResult(method: String, args: [Any] = []) -> Any? {
		nextInternalRequestId -= 1
		let request: [String: Any] = ["id": nextInternalRequestId, "method": method, "args": args]
		guard let response = rustResponse(for: request),
			let data = response.data(using: .utf8),
			let envelope = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
			envelope["error"] == nil
		else {
			return nil
		}
		return envelope["result"]
	}

	private func rustResponse(for request: [String: Any]) -> String? {
		guard let unit = audioUnitInstance,
			let ctx = unit.rustCtx,
			let callbacks = g_callbacks,
			JSONSerialization.isValidJSONObject(request),
			let requestData = try? JSONSerialization.data(withJSONObject: request)
		else {
			return nil
		}

		var responseLength: UInt32 = 0
		let response = requestData.withUnsafeBytes { bytes in
			callbacks.pointee.custom_editor_request(
				ctx,
				bytes.baseAddress?.assumingMemoryBound(to: UInt8.self),
				UInt32(requestData.count),
				&responseLength
			)
		}
		guard let response, responseLength > 0 else {
			return nil
		}
		defer {
			callbacks.pointee.custom_editor_response_free(response, responseLength)
		}
		return String(bytes: UnsafeBufferPointer(start: response, count: Int(responseLength)), encoding: .utf8)
	}

	private func sendResponse(id: Int, result: Any) {
		sendEnvelope(["id": id, "result": result])
	}

	private func sendError(id: Int, message: String) {
		sendEnvelope(["id": id, "error": message])
	}

	private func sendEnvelope(_ envelope: [String: Any]) {
		guard let json = jsonString(envelope) else {
			return
		}
		webView?.evaluateJavaScript("window.__czIpcResponse?.(\(json));")
	}

	private func evaluateCallback(_ callback: String, jsonString: String) {
		guard let encoded = encodeJsonStringLiteral(jsonString) else {
			return
		}
		webView?.evaluateJavaScript("window.\(callback)?.(\(encoded));")
	}

	private func encodeJsonStringLiteral(_ string: String) -> String? {
		guard let data = try? JSONSerialization.data(withJSONObject: [string]),
			let arrayJson = String(data: data, encoding: .utf8),
			arrayJson.count >= 2
		else {
			return nil
		}
		return String(arrayJson.dropFirst().dropLast())
	}

	private func jsonString(_ value: Any) -> String? {
		guard JSONSerialization.isValidJSONObject(value),
			let data = try? JSONSerialization.data(withJSONObject: value),
			let json = String(data: data, encoding: .utf8)
		else {
			return nil
		}
		return json
	}
}

private enum TelemetryChannel: Hashable {
	case runtimeVoiceStates
	case runtimeModSources
	case transport

	var snapshotMethod: String {
		switch self {
		case .runtimeVoiceStates: return "getRuntimeVoiceStates"
		case .runtimeModSources: return "getRuntimeModSources"
		case .transport: return "getTransportInfo"
		}
	}

	var callbackName: String {
		switch self {
		case .runtimeVoiceStates: return "__czOnRuntimeVoiceStates"
		case .runtimeModSources: return "__czOnRuntimeModSources"
		case .transport: return "__czOnTransport"
		}
	}

	static func subscribeMethod(_ method: String) -> Self? {
		switch method {
		case "subscribeRuntimeVoiceStates": return .runtimeVoiceStates
		case "subscribeRuntimeModSources": return .runtimeModSources
		case "subscribeTransport": return .transport
		default: return nil
		}
	}

	static func unsubscribeMethod(_ method: String) -> Self? {
		switch method {
		case "unsubscribeRuntimeVoiceStates": return .runtimeVoiceStates
		case "unsubscribeRuntimeModSources": return .runtimeModSources
		case "unsubscribeTransport": return .transport
		default: return nil
		}
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
		let relativePath = requestURL.path.hasPrefix("/") ? String(requestURL.path.dropFirst()) : requestURL.path
		let requestedURL = relativePath.isEmpty ? baseURL.appendingPathComponent("index.html") : baseURL.appendingPathComponent(relativePath)
		let flattenedURL = baseURL.appendingPathComponent(requestedURL.lastPathComponent)
		let fileURL = FileManager.default.fileExists(atPath: requestedURL.path) ? requestedURL : flattenedURL

		do {
			let data = try Data(contentsOf: fileURL)
			let response = URLResponse(url: requestURL, mimeType: Self.mimeType(fileURL.pathExtension), expectedContentLength: data.count, textEncodingName: nil)
			urlSchemeTask.didReceive(response)
			urlSchemeTask.didReceive(data)
			urlSchemeTask.didFinish()
		} catch {
			urlSchemeTask.didFailWithError(error)
		}
	}

	func webView(_ webView: WKWebView, stop urlSchemeTask: any WKURLSchemeTask) {}

	private static func mimeType(_ ext: String) -> String {
		switch ext.lowercased() {
		case "html": return "text/html"
		case "js": return "application/javascript"
		case "css": return "text/css"
		case "json", "map": return "application/json"
		case "wasm": return "application/wasm"
		case "svg": return "image/svg+xml"
		case "png": return "image/png"
		default: return "application/octet-stream"
		}
	}
}
