import CosmoPd101AUv3Support
import Foundation
import os
import WebKit

#if os(iOS)
import UIKit
typealias WebEditorHostView = UIView
#else
import AppKit
typealias WebEditorHostView = NSView
#endif

struct WebEditorHostContext: Equatable {
	let runtimeMode: String
	let fitMode: String
	let supportsStandaloneAppSettings: Bool

	func script(dispatchEvent: Bool) -> String {
		let runtimeMode = Self.javaScriptStringLiteral(runtimeMode)
		let fitMode = Self.javaScriptStringLiteral(fitMode)
		let supportsStandaloneAppSettings = supportsStandaloneAppSettings ? "true" : "false"
		let eventScript = dispatchEvent
			? "window.dispatchEvent(new CustomEvent('cz-host-context-changed',{detail:{runtimeMode:window.__czRuntimeMode,fitMode:window.__czAuv3FitMode,supportsStandaloneAppSettings:window.__czSupportsStandaloneAppSettings}}));"
			: ""
		return "window.__czRuntimeMode=\(runtimeMode);window.__czAuv3FitMode=\(fitMode);window.__czSupportsStandaloneAppSettings=\(supportsStandaloneAppSettings);\(eventScript)"
	}

	private static func javaScriptStringLiteral(_ value: String) -> String {
		guard
			let data = try? JSONSerialization.data(withJSONObject: [value], options: []),
			let json = String(data: data, encoding: .utf8),
			json.count >= 2
		else {
			return "\"\""
		}
		return String(json.dropFirst().dropLast())
	}
}

protocol WebEditorSessionDelegate: AnyObject {
	func webEditorSessionDidReceiveMessage(_ session: WebEditorSession, payload: [String: Any])
	func webEditorSessionDidBecomeReady(_ session: WebEditorSession)
	func webEditorSessionDidRequestReplacement(_ session: WebEditorSession, reason: String)
	func webEditorSessionNeedsScopeFrame(_ session: WebEditorSession) -> ScopeBinaryFrame?
	func webEditorSessionNeedsTelemetryScript(
		_ session: WebEditorSession,
		telemetryController: TelemetryController,
		forceChannels: Set<TelemetryChannel>
	) -> String?
}

final class WebEditorSession: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
	let id = UUID()

	private weak var delegate: WebEditorSessionDelegate?
	private weak var hostView: WebEditorHostView?
	private let log: OSLog
	private let bundle: Bundle
	private let platformScript: String
	private var hostContext: WebEditorHostContext
	private let dispatcher = WebViewScriptDispatcher()
	private lazy var telemetryController = TelemetryController { [weak self] in
		self?.pushTelemetryUpdates()
	}

	private var webView: WKWebView?
	private var evaluator: WebViewJavaScriptEvaluator?
	private var isDestroyed = false
	private var isReady = false

	init(
		delegate: WebEditorSessionDelegate,
		hostContext: WebEditorHostContext,
		bundle: Bundle,
		log: OSLog
	) {
		self.delegate = delegate
		self.hostContext = hostContext
		self.bundle = bundle
		self.log = log
		#if os(macOS)
		platformScript = "window.__czHostPlatform='macos';"
		#else
		platformScript = "window.__czHostPlatform='ios';"
		#endif
		super.init()
	}

	var canEvaluateNow: Bool {
		!isDestroyed && isReady && dispatcher.canEvaluateNow
	}

	func install(in view: WebEditorHostView, bounds: CGRect) {
		guard !isDestroyed else { return }
		guard webView == nil else {
			os_log("webEditorSession install skipped id=%{public}@", log: log, type: .fault, id.uuidString)
			return
		}

		hostView = view
		isReady = false
		dispatcher.setViewVisible(true)
		dispatcher.setHostActive(true, resumeHold: 0.25)
		dispatcher.setWebContentAlive(true)
		dispatcher.setNavigationFinished(false)

		let indexUrl = bundle.url(forResource: "index", withExtension: "html", subdirectory: "ui")
			?? bundle.url(forResource: "index", withExtension: "html")
		let configuration = makeConfiguration(indexUrl: indexUrl)
		let webView = WKWebView(frame: bounds, configuration: configuration)
		webView.navigationDelegate = self
		webView.isHidden = false
		#if os(macOS)
		webView.wantsLayer = true
		webView.layer?.backgroundColor = NSColor.clear.cgColor
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
		let evaluator = WebViewJavaScriptEvaluator(webView: webView) { [weak self] in
			self?.canEvaluateNow ?? false
		}
		self.evaluator = evaluator
		dispatcher.setEvaluator(evaluator)

		layout(bounds: bounds, reason: "installWebEditorSession")

		guard indexUrl != nil else {
			os_log("index.html missing from bundle session=%{public}@", log: log, type: .error, id.uuidString)
			return
		}

		os_log("webEditorSession install id=%{public}@", log: log, type: .default, id.uuidString)
		webView.load(URLRequest(url: URL(string: "cosmo-ext://bundle/index.html")!))
	}

	func layout(bounds: CGRect, reason: String) {
		guard !isDestroyed, let webView else { return }
		webView.frame = bounds
		#if os(macOS)
		webView.needsLayout = true
		#else
		webView.setNeedsLayout()
		#endif
		publishHostSize(reason: reason)
	}

	func makeSnapshotView() -> WebEditorHostView? {
		guard !isDestroyed, let webView else { return nil }
		#if os(iOS)
		return webView.snapshotView(afterScreenUpdates: false)
		#else
		return nil
		#endif
	}

	func destroy(reason: String) {
		guard !isDestroyed else { return }
		os_log("webEditorSession destroy reason=%{public}@ id=%{public}@", log: log, type: .default, reason, id.uuidString)

		isDestroyed = true
		isReady = false
		telemetryController.invalidate()
		dispatcher.setHostActive(false)
		dispatcher.setViewVisible(false)
		dispatcher.setWebContentAlive(false)
		dispatcher.setNavigationFinished(false)
		evaluator?.invalidate()
		dispatcher.setEvaluator(nil)
		dispatcher.clearPendingMessagesForDestroyedWebContent()

		if let webView {
			webView.configuration.userContentController.removeScriptMessageHandler(forName: "cosmoPd101")
			webView.navigationDelegate = nil
			webView.stopLoading()
			webView.removeFromSuperview()
		}

		webView = nil
		evaluator = nil
		hostView = nil
	}

	func markWebReady() {
		guard !isDestroyed else { return }
		isReady = true
		dispatcher.setWebContentAlive(true)
		dispatcher.setNavigationFinished(true)
		delegate?.webEditorSessionDidBecomeReady(self)
	}

	func clearResumeHold() {
		guard !isDestroyed else { return }
		dispatcher.clearResumeHold()
	}

	func publishHostContext(_ context: WebEditorHostContext, reason: String) {
		guard !isDestroyed else { return }
		hostContext = context
		os_log("webEditorSession hostContext reason=%{public}@ id=%{public}@", log: log, type: .default, reason, id.uuidString)
		_ = dispatcher.sendLifecycleEvent(
			name: "cz-host-context-changed",
			assignments: [
				"__czRuntimeMode": javaScriptStringLiteral(context.runtimeMode),
				"__czAuv3FitMode": javaScriptStringLiteral(context.fitMode),
				"__czSupportsStandaloneAppSettings": context.supportsStandaloneAppSettings ? "true" : "false",
			]
		)
	}

	func pushParams(json: String, selectedPresetName: String? = nil) {
		guard !isDestroyed else { return }
		_ = dispatcher.enqueueParams(json: json, selectedPresetName: selectedPresetName)
	}

	func sendResponse(id: Int, result: Any) {
		sendScriptPayload(["id": id, "result": result])
	}

	func sendError(id: Int, message: String) {
		sendScriptPayload(["id": id, "error": message])
	}

	@discardableResult
	func setTelemetrySubscription(_ channel: TelemetryChannel, active: Bool) -> Bool {
		guard !isDestroyed else { return false }
		if active {
			let inserted = telemetryController.subscribe(channel)
			if inserted {
				pushTelemetryUpdates(forceChannels: [channel])
			}
			return inserted
		}
		return telemetryController.unsubscribe(channel)
	}

	func pushTelemetryUpdates(forceChannels: Set<TelemetryChannel> = []) {
		guard !isDestroyed, isReady else { return }
		guard let script = delegate?.webEditorSessionNeedsTelemetryScript(
			self,
			telemetryController: telemetryController,
			forceChannels: forceChannels
		), !script.isEmpty else {
			return
		}
		_ = dispatcher.sendTelemetry(script: script)
	}

	func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		guard !isDestroyed, message.name == "cosmoPd101" else { return }
		guard let payload = message.body as? [String: Any] else { return }
		let method = payload["method"] as? String ?? ""
		if method == "webReady" {
			markWebReady()
			sendResponse(id: payload["id"] as? Int ?? 0, result: NSNull())
			return
		}
		delegate?.webEditorSessionDidReceiveMessage(self, payload: payload)
	}

	func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
		guard !isDestroyed else { return }
		isReady = false
		dispatcher.setNavigationFinished(false)
		os_log("webEditorSession didStart id=%{public}@", log: log, type: .default, id.uuidString)
	}

	func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
		guard !isDestroyed else { return }
		isReady = false
		dispatcher.setNavigationFinished(false)
		publishHostSize(reason: "didFinish")
		os_log("webEditorSession didFinish waitingForWebReady id=%{public}@", log: log, type: .default, id.uuidString)
	}

	func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
		handleNavigationFailure(error, reason: "didFailNavigation")
	}

	func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
		handleNavigationFailure(error, reason: "didFailProvisionalNavigation")
	}

	func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
		guard !isDestroyed else { return }
		os_log("webEditorSession webContentTerminated id=%{public}@", log: log, type: .error, id.uuidString)
		delegate?.webEditorSessionDidRequestReplacement(self, reason: "webContentProcessDidTerminate")
	}

	private func makeConfiguration(indexUrl: URL?) -> WKWebViewConfiguration {
		let configuration = WKWebViewConfiguration()
		configuration.allowsAirPlayForMediaPlayback = false
		configuration.mediaTypesRequiringUserActionForPlayback = .all
		configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
		configuration.userContentController.addUserScript(
			WKUserScript(source: platformScript, injectionTime: .atDocumentStart, forMainFrameOnly: true)
		)
		configuration.userContentController.addUserScript(
			WKUserScript(source: hostContext.script(dispatchEvent: false), injectionTime: .atDocumentStart, forMainFrameOnly: true)
		)
		configuration.userContentController.addUserScript(
			WKUserScript(source: "window.__czBridgeReloadPolicy={ignoreCancelledNavigation:true};", injectionTime: .atDocumentStart, forMainFrameOnly: true)
		)
		configuration.userContentController.add(WeakScriptMessageHandler(self), name: "cosmoPd101")

		if let baseUrl = indexUrl?.deletingLastPathComponent() {
			configuration.setURLSchemeHandler(
				BundleSchemeHandler(baseURL: baseUrl, scopeFrameProvider: { [weak self] in
					guard let self else { return nil }
					return self.delegate?.webEditorSessionNeedsScopeFrame(self)
				}),
				forURLScheme: "cosmo-ext"
			)
		}

		return configuration
	}

	private func publishHostSize(reason: String) {
		guard !isDestroyed, let webView else { return }
		let size = webView.bounds.size
		guard size.width > 0, size.height > 0 else { return }
		let deviceInfo = currentDeviceSizingInfo()
		let reasonLiteral = javaScriptStringLiteral(reason)
		let script = """
		window.__czHostSize = {
		  width: \(size.width),
		  height: \(size.height),
		  scale: \(deviceInfo.scale),
		  deviceLandscapeAspectRatio: \(deviceInfo.landscapeAspectRatio),
		  fitMode: "\(hostContext.fitMode)",
		  reason: \(reasonLiteral)
		};
		window.dispatchEvent(new CustomEvent('cz-host-size-changed', {
		  detail: window.__czHostSize
		}));
		window.dispatchEvent(new Event('resize'));
		"""
		_ = dispatcher.enqueueHostSizeScript(script)
	}

	private func currentDeviceSizingInfo() -> (scale: CGFloat, landscapeAspectRatio: CGFloat) {
		#if os(iOS)
		let screen = hostView?.window?.windowScene?.screen ?? hostView?.window?.screen ?? UIScreen.main
		let bounds = screen.bounds
		let scale = screen.scale
		#else
		let screen = hostView?.window?.screen ?? NSScreen.main
		let bounds = screen?.frame ?? .zero
		let scale = hostView?.window?.backingScaleFactor ?? screen?.backingScaleFactor ?? 1
		#endif
		let landscapeWidth = max(bounds.width, bounds.height)
		let landscapeHeight = min(bounds.width, bounds.height)
		let ratio = landscapeHeight > 0 ? landscapeWidth / landscapeHeight : 4.0 / 3.0
		return (scale, ratio)
	}

	private func sendScriptPayload(_ payload: [String: Any]) {
		guard !isDestroyed else { return }
		guard JSONSerialization.isValidJSONObject(payload) else {
			os_log(.error, log: log, "webEditorSession failed to serialize response id=%{public}d", payload["id"] as? Int ?? -1)
			return
		}
		if !dispatcher.sendIpcResponse(payload: payload) {
			os_log(.debug, log: log, "webEditorSession response dropped id=%{public}d", payload["id"] as? Int ?? -1)
		}
	}

	private func handleNavigationFailure(_ error: Error, reason: String) {
		guard !isDestroyed else { return }
		let nsError = error as NSError
		os_log(
			"%{public}@ domain=%{public}@ code=%{public}d description=%{public}@ session=%{public}@",
			log: log,
			type: .error,
			reason,
			nsError.domain,
			nsError.code,
			error.localizedDescription,
			id.uuidString
		)
		guard WebViewReloadPolicy.shouldReloadAfterNavigationError(error) else { return }
		delegate?.webEditorSessionDidRequestReplacement(self, reason: reason)
	}

	private func javaScriptStringLiteral(_ value: String) -> String {
		guard
			let data = try? JSONSerialization.data(withJSONObject: [value], options: []),
			let json = String(data: data, encoding: .utf8),
			json.count >= 2
		else {
			return "\"\""
		}
		return String(json.dropFirst().dropLast())
	}
}

private final class WebViewJavaScriptEvaluator: JavaScriptEvaluating {
	private weak var webView: WKWebView?
	private let shouldEvaluate: () -> Bool
	private var invalidated = false

	init(webView: WKWebView, shouldEvaluate: @escaping () -> Bool) {
		self.webView = webView
		self.shouldEvaluate = shouldEvaluate
	}

	func invalidate() {
		invalidated = true
	}

	func evaluateJavaScript(_ javaScriptString: String) {
		Task { @MainActor [weak self] in
			guard let self, !self.invalidated, self.shouldEvaluate() else { return }
			_ = try? await self.webView?.evaluateJavaScript(javaScriptString)
		}
	}
}

private final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
	private let baseURL: URL
	private let scopeFrameProvider: () -> ScopeBinaryFrame?

	init(baseURL: URL, scopeFrameProvider: @escaping () -> ScopeBinaryFrame? = { nil }) {
		self.baseURL = baseURL
		self.scopeFrameProvider = scopeFrameProvider
	}

	func webView(_ webView: WKWebView, start urlSchemeTask: any WKURLSchemeTask) {
		guard let requestURL = urlSchemeTask.request.url else {
			urlSchemeTask.didFailWithError(URLError(.badURL))
			return
		}

		let relativePath = requestURL.path.hasPrefix("/")
			? String(requestURL.path.dropFirst())
			: requestURL.path
		if relativePath == "__scope__" {
			serveScope(urlSchemeTask: urlSchemeTask, requestURL: requestURL)
			return
		}
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
			urlSchemeTask.didFailWithError(error)
		}
	}

	func webView(_ webView: WKWebView, stop urlSchemeTask: any WKURLSchemeTask) {}

	private func serveScope(urlSchemeTask: any WKURLSchemeTask, requestURL: URL) {
		let data = ScopeBinaryFrameEncoder.encode(scopeFrameProvider())
		let response = HTTPURLResponse(
			url: requestURL,
			statusCode: 200,
			httpVersion: "HTTP/1.1",
			headerFields: [
				"Access-Control-Allow-Origin": "*",
				"Content-Length": String(data.count),
				"Content-Type": "application/octet-stream",
			]
		) ?? URLResponse(
			url: requestURL,
			mimeType: "application/octet-stream",
			expectedContentLength: data.count,
			textEncodingName: nil
		)
		urlSchemeTask.didReceive(response)
		urlSchemeTask.didReceive(data)
		urlSchemeTask.didFinish()
	}

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
