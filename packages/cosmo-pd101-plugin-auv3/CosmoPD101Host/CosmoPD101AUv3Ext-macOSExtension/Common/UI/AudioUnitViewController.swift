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

public class AudioUnitViewController: AUViewController, AUAudioUnitFactory, WKNavigationDelegate, WKScriptMessageHandler {
	private static let minimumWidth: CGFloat = 640
	private static let minimumHeight: CGFloat = 480
	private static let isSizingDebugEnabled = true
	private var presetSessionState = PresetSessionState()
	private var editorState = [String: Any]()
	private var midiLearnState = MidiLearnState()
	private var paramsVersion = 0
	private lazy var telemetryController = TelemetryController { [weak self] in
		MainActor.assumeIsolated {
			self?.handleTelemetryTimer()
		}
	}
	private let instanceID = UUID().uuidString
	private var cachedVoiceLimit: Int = 0
	private static let voiceLimitDefault: Int = 8
	private static let voiceLimitUserDefaultsKey = "com.cosmo.pd101.voiceLimit"
	private var voiceLimit: Int {
		get {
			if cachedVoiceLimit == 0 {
				cachedVoiceLimit = UserDefaults.standard.integer(forKey: Self.voiceLimitUserDefaultsKey)
				if cachedVoiceLimit == 0 { cachedVoiceLimit = Self.voiceLimitDefault }
			}
			return cachedVoiceLimit
		}
		set {
			let clamped = max(1, min(newValue, 16))
			cachedVoiceLimit = clamped
			UserDefaults.standard.set(clamped, forKey: Self.voiceLimitUserDefaultsKey)
		}
	}

	nonisolated(unsafe) var audioUnit: AUAudioUnit?
	private var webView: WKWebView?
	private var webContentTerminationCount = 0
	private var hostInactiveAt: Date?
	private var webAppReady = false
	private var pendingStatePushReason: String?
	private var pushStateCount = 0
	private var telemetryTickCount = 0

	#if os(iOS)
	public override var prefersStatusBarHidden: Bool { true }
	public override var prefersHomeIndicatorAutoHidden: Bool { true }
	public override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }
	#endif

	nonisolated(unsafe) private var observation: NSKeyValueObservation?

	deinit {
		telemetryController.invalidate()
		observation?.invalidate()
		observation = nil
		webView?.configuration.userContentController.removeScriptMessageHandler(forName: "cosmoPd101")
		webView?.navigationDelegate = nil
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
		view.backgroundColor = .black
		preferredContentSize = CGSize(width: Self.minimumWidth, height: Self.minimumHeight)
		#else
		view = NSView(frame: NSRect(x: 0, y: 0, width: Self.minimumWidth, height: Self.minimumHeight))
		
		view.wantsLayer = true
		view.layer?.backgroundColor = NSColor.black.cgColor
		preferredContentSize = NSSize(width: Self.minimumWidth, height: Self.minimumHeight)
		#endif
		installWebView()
		logSizing("loadView")

		#if os(iOS)
        NotificationCenter.default.addObserver(self, selector: #selector(handleHostDidBecomeActive(_:)), name: NSNotification.Name.NSExtensionHostDidBecomeActive, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handleHostWillResignActive(_:)), name: NSNotification.Name.NSExtensionHostWillResignActive, object: nil)
		#endif
	}

	#if os(iOS)
	public override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews()
		layoutWebView(reason: "viewDidLayoutSubviews")
		logSizing("viewDidLayoutSubviews")
	}

	public override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
		super.viewWillTransition(to: size, with: coordinator)
		logSizing("viewWillTransition")
		coordinator.animate(alongsideTransition: nil) { [weak self] _ in
			self?.layoutWebView(reason: "viewWillTransitionComplete")
			self?.logSizing("viewWillTransitionComplete")
		}
	}

	public override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		os_log("viewWillAppear (instance=%@)", log: czVCLog, type: .default, instanceID)
		telemetryController.viewWillAppear()
	}

	public override func viewDidDisappear(_ animated: Bool) {
		super.viewDidDisappear(animated)
		os_log("viewDidDisappear (instance=%@)", log: czVCLog, type: .default, instanceID)
		telemetryController.viewDidDisappear()
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
		telemetryController.viewWillAppear()
	}

	public override func viewDidDisappear() {
		super.viewDidDisappear()
		os_log("viewDidDisappear (instance=%@)", log: czVCLog, type: .default, instanceID)
		telemetryController.viewDidDisappear()
	}

	public override func viewDidLayout() {
		super.viewDidLayout()
		layoutWebView(reason: "viewDidLayout")
		logSizing("viewDidLayout")
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
		os_log("createAudioUnit: unit created", log: czVCLog, type: .default)
		return unit
	}

	public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		guard message.name == "cosmoPd101" else { return }
		guard let payload = message.body as? [String: Any] else { return }

		let id = payload["id"] as? Int ?? 0
		let method = payload["method"] as? String ?? ""
		let methodPayload = payload["payload"]

		os_log(
			"ipc from JS method=%{public}@ id=%{public}d instance=%{public}@ webReady=%{public}d",
			log: czVCLog,
			type: .debug,
			method,
			id,
			instanceID,
			webAppReady
		)

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
			if
				let params = methodPayload as? [String: Any],
				let data = try? JSONSerialization.data(withJSONObject: params),
				let json = String(data: data, encoding: .utf8),
				audioUnit.setParamsJson(json)
			{
				paramsVersion += 1
				sendResponse(id: id, result: NSNull())
			} else {
				os_log("setParams FAILED: invalid object payload", log: czVCLog, type: .error)
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
			presetSessionState = PresetSessionState(payload: methodPayload as? [String: Any])
			sendResponse(id: id, result: NSNull())
		case "getPresetLibrary":
			sendResponse(id: id, result: [
				"entries": presetLibraryEntries(for: audioUnit),
				"status": ["state": "ready", "message": NSNull()],
			])
		case "loadPreset":
			guard
				let payload = methodPayload as? [String: Any],
				let presetId = payload["presetId"] as? String,
				let preset = preset(for: audioUnit, id: presetId)
			else {
				sendError(id: id, message: "invalid loadPreset payload")
				return
			}
			audioUnit.currentPreset = preset
			paramsVersion += 1
			presetSessionState.activePresetId = presetId
			presetSessionState.loadedPresetId = presetId
			presetSessionState.activePresetNameBase = preset.name
			presetSessionState.isDirty = false
			sendResponse(id: id, result: ["presetName": preset.name])
		case "setEditorState":
			editorState = methodPayload as? [String: Any] ?? [:]
			sendResponse(id: id, result: NSNull())
		case "getEditorState":
			sendResponse(id: id, result: editorState)
		case "getMidiLearnState":
			sendResponse(id: id, result: midiLearnState.payload)
		case "setMidiLearnMode":
			midiLearnState.learnMode = methodPayload as? Bool ?? false
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "setPendingMidiLearnParam":
			midiLearnState.pendingParamKey = methodPayload as? String
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "addMidiBinding":
			guard
				let payload = methodPayload as? [String: Any],
				let paramKey = payload["paramKey"] as? String,
				let channel = payload["channel"] as? Int,
				let cc = payload["cc"] as? Int
			else {
				sendError(id: id, message: "invalid addMidiBinding payload")
				return
			}
			midiLearnState.bindings.removeAll { $0.paramKey == paramKey }
			midiLearnState.bindings.append(MidiLearnBinding(paramKey: paramKey, channel: channel, cc: cc))
			midiLearnState.version += 1
			sendResponse(id: id, result: NSNull())
		case "removeMidiBinding":
			guard let payload = methodPayload as? [String: Any], let binding = MidiLearnBinding(payload: payload) else {
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
		case "getVoiceLimit":
			sendResponse(id: id, result: voiceLimit)
		case "setVoiceLimit":
			if let limit = methodPayload as? Int {
				voiceLimit = limit
			}
			sendResponse(id: id, result: NSNull())
		case "addPreset", "savePreset", "deletePreset", "renamePreset", "toggleStarred", "setPresetAuthor", "setPresetDescription", "setPresetTags", "exportPreset", "importPresetBank", "listFxModulePresets", "saveFxModulePreset", "deleteFxModulePreset":
			sendError(id: id, message: "AUv3 preset library editing is not supported yet")
		case "clientLog":
			let logPayload = methodPayload as? [String: Any]
			let logLevel = logPayload?["level"] as? String ?? "info"
			let logMessage = logPayload?["message"] as? String ?? ""
			os_log("%{public}@: %{public}@", log: czWebViewLog, type: .default, logLevel, logMessage)
			sendResponse(id: id, result: NSNull())
		case "webReady":
			handleWebReady(audioUnit: audioUnit)
			sendResponse(id: id, result: NSNull())
		case "noteOn", "noteOff", "sustain", "pitchBend", "modWheel", "aftertouch", "polyAftertouch", "macroValue", "panic":
			audioUnit.handleEngineEvent(type: method, payload: methodPayload as? [String: Any] ?? [:])
			sendResponse(id: id, result: NSNull())
		default:
			sendError(id: id, message: "unknown method: \(method)")
		}
	}

	private func installWebView() {
		if webView != nil {
			os_log("installWebView skipped; webView already exists instance=%{public}@", log: czVCLog, type: .fault, instanceID)
			return
		}

		os_log("installWebView instance=%{public}@ subviews=%{public}d", log: czVCLog, type: .default, instanceID, view.subviews.count)

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
		configuration.userContentController.addUserScript(
			WKUserScript(
				source: "window.__czRuntimeMode='auv3-hosted';",
				injectionTime: .atDocumentStart,
				forMainFrameOnly: true
			)
		)
		let diagnosticsScript = """
		(function () {
		  if (window.__czDiagInstalled) return;
		  window.__czDiagInstalled = true;

		  var _showCount = 0;
		  var _dismissTimer = null;

		  function timestampIso() {
		    var d = new Date();
		    return d.toISOString().replace('T', ' ').replace('Z', '');
		  }

		  function safeStringify(obj, depth) {
		    if (depth === undefined) depth = 0;
		    if (depth > 3) return '[maxDepth]';
		    if (obj === null) return 'null';
		    if (obj === undefined) return 'undefined';
		    if (typeof obj === 'string') return obj.length > 500 ? obj.slice(0, 500) + '...' : obj;
		    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
		    if (obj instanceof Error) return obj.stack || obj.message || String(obj);
		    if (Array.isArray(obj)) return '[' + obj.map(function (v) { return safeStringify(v, depth + 1); }).join(', ') + ']';
		    if (typeof obj === 'object') {
		      try {
		        var keys = Object.keys(obj);
		        if (keys.length > 20) keys = keys.slice(0, 20).concat(['... (' + (keys.length - 20) + ' more)']);
		        return '{' + keys.map(function (k) { return (k.length > 50 ? k.slice(0, 50) + '...' : k) + ': ' + safeStringify(obj[k], depth + 1); }).join(', ') + '}';
		      } catch (_) { return String(obj); }
		    }
		    try { return String(obj); } catch (_) { return '[unstringifiable]'; }
		  }

		  function reportError(kind, msg, obj, stack) {
		    var lines = [
		      '[' + timestampIso() + '] ' + kind,
		      'message: ' + (msg || '(empty)'),
		    ];
		    if (stack) lines.push('stack:\\n' + stack);
		    if (obj) lines.push('source: ' + safeStringify(obj));
		    var full = lines.join('\\n');

		    try {
		      var pre = document.getElementById('__czFatal');
		      if (!pre) {
		        pre = document.createElement('pre');
		        pre.id = '__czFatal';
		        pre.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:2147483647;padding:8px 12px;margin:0;max-height:40vh;overflow:auto;background:rgba(17,17,17,0.95);color:#ff8080;font:11px/1.4 -apple-system,monospace;white-space:pre-wrap;border-top:1px solid #ff4040;';
		        var dismissBtn = document.createElement('button');
		        dismissBtn.textContent = 'Dismiss';
		        dismissBtn.style.cssText = 'position:absolute;top:4px;right:4px;background:#444;color:#fff;border:none;border-radius:3px;padding:2px 8px;font:11px -apple-system;cursor:pointer;';
		        dismissBtn.onclick = function () { pre.remove(); };
		        pre.appendChild(dismissBtn);
		        document.body.appendChild(pre);
		      }
		      var content = pre.childNodes[0];
		      if (!content || content.nodeType !== 3) {
		        content = document.createTextNode('');
		        pre.insertBefore(content, pre.firstChild);
		      }
		      content.nodeValue = 'Cosmo PD-101 UI runtime error [' + _showCount + ']\\n\\n' + full + '\\n';
		      pre.style.display = 'block';

		      _showCount++;
		      if (_dismissTimer) clearTimeout(_dismissTimer);
		      _dismissTimer = setTimeout(function () {
		        var el = document.getElementById('__czFatal');
		        if (el) el.remove();
		      }, 8000);
		    } catch (_) {}
		  }

		  window.__czDismissOverlay = function () {
		    var el = document.getElementById('__czFatal');
		    if (el) el.remove();
		  };
		  window.__czClearOverlay = window.__czDismissOverlay;

		  document.addEventListener('DOMContentLoaded', function () {
		    var stale = document.getElementById('__czFatal');
		    if (stale) stale.remove();
		    window.__czDiagClear = true;
		  });

		  window.addEventListener('error', function (e) {
		    var msg = (e && e.message) ? (e.message + ' @ ' + e.filename + ':' + e.lineno) : 'Unknown window error';
		    reportError('window.error', msg, e, e && e.error && e.error.stack ? e.error.stack : null);
		    try {
		      window.webkit.messageHandlers.cosmoPd101.postMessage({ id: 0, method: 'clientLog', args: ['error', 'window.error: ' + msg + '\\n' + (e && e.error && e.error.stack ? e.error.stack : '')] });
		    } catch (_) {}
		  });

		  window.addEventListener('unhandledrejection', function (e) {
		    var reason = e && e.reason;
		    var msg = reason && (reason.stack || reason.message) ? (reason.stack || reason.message) : String(reason || 'Unhandled promise rejection');
		    reportError('unhandledrejection', msg, reason, reason && reason.stack ? reason.stack : null);
		    try {
		      window.webkit.messageHandlers.cosmoPd101.postMessage({ id: 0, method: 'clientLog', args: ['error', 'unhandledrejection: ' + msg] });
		    } catch (_) {}
		  });

		  window.addEventListener('rejectionhandled', function (e) {
		    var reason = e && e.reason;
		    var msg = reason && (reason.stack || reason.message) ? (reason.stack || reason.message) : String(reason || 'Promise rejection handled late');
		    try {
		      window.webkit.messageHandlers.cosmoPd101.postMessage({ id: 0, method: 'clientLog', args: ['warn', 'rejectionhandled: ' + msg] });
		    } catch (_) {}
		  });

		  var _origFetch = window.fetch;
		  if (_origFetch) {
		    window.fetch = function (input, init) {
		      return _origFetch.call(window, input, init).catch(function (err) {
		        try {
		          var url = typeof input === 'string' ? input : (input && input.url ? input.url : String(input));
		          window.webkit.messageHandlers.cosmoPd101.postMessage({ id: 0, method: 'clientLog', args: ['warn', 'fetch failed: ' + url + '\\n' + String(err)] });
		        } catch (_) {}
		        throw err;
		      });
		    };
		  }

		  window.addEventListener('unload', function () {
		    try {
		      window.webkit.messageHandlers.cosmoPd101.postMessage({ id: 0, method: 'clientLog', args: ['log', 'page unload at ' + timestampIso()] });
		    } catch (_) {}
		  });
		})();
		"""
		configuration.userContentController.addUserScript(
			WKUserScript(source: diagnosticsScript, injectionTime: .atDocumentStart, forMainFrameOnly: true)
		)
		configuration.userContentController.add(WeakScriptMessageHandler(self), name: "cosmoPd101")

		if let baseUrl = indexUrl?.deletingLastPathComponent() {
			configuration.setURLSchemeHandler(BundleSchemeHandler(baseURL: baseUrl), forURLScheme: "cosmo-ext")
		}

		let webView = WKWebView(frame: view.bounds, configuration: configuration)
		webView.navigationDelegate = self
		#if os(macOS)
		webView.wantsLayer = true
		webView.layer?.backgroundColor = NSColor.black.cgColor
		webView.setValue(false, forKey: "drawsBackground")
		webView.autoresizingMask = [.width, .height]
		#else
		webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
		webView.isOpaque = true
		webView.backgroundColor = .black
		webView.scrollView.backgroundColor = .black
		webView.scrollView.contentInsetAdjustmentBehavior = .never
		webView.scrollView.automaticallyAdjustsScrollIndicatorInsets = false
		#endif
		view.addSubview(webView)
		self.webView = webView
		layoutWebView(reason: "installWebView")
		logSizing("installWebView")

		guard let indexUrl else {
			os_log("index.html missing from bundle", log: czVCLog, type: .error)
			webView.loadHTMLString(diagnosticHtml(title: "UI Bundle Missing", message: "Could not find index.html in the AU bundle."), baseURL: nil)
			return
		}
		os_log("indexUrl=%{public}@", log: czVCLog, type: .default, indexUrl.path)

		webView.load(URLRequest(url: URL(string: "cosmo-ext://bundle/index.html")!))
	}

	private func layoutWebView(reason: String = "layout") {
		guard let webView else { return }
		webView.frame = view.bounds
		webView.setNeedsLayout()
		publishHostSizeToWebView(reason: reason)
	}

	private func publishHostSizeToWebView(reason: String) {
		guard let webView else { return }
		let size = webView.bounds.size
		guard size.width > 0, size.height > 0 else { return }
		let deviceInfo = currentDeviceSizingInfo()
		let reasonLiteral = jsonStringLiteral(reason)
		let script = """
		window.__czHostSize = {
		  width: \(size.width),
		  height: \(size.height),
		  scale: \(deviceInfo.scale),
		  deviceLandscapeAspectRatio: \(deviceInfo.landscapeAspectRatio),
		  reason: \(reasonLiteral)
		};
		window.dispatchEvent(new CustomEvent('cz-host-size-changed', {
		  detail: window.__czHostSize
		}));
		window.dispatchEvent(new Event('resize'));
		"""
		webView.evaluateJavaScript(script, completionHandler: nil)
	}

	private func currentDeviceSizingInfo() -> (scale: CGFloat, landscapeAspectRatio: CGFloat) {
		#if os(iOS)
		let screen = view.window?.windowScene?.screen ?? view.window?.screen ?? UIScreen.main
		let bounds = screen.bounds
		let scale = screen.scale
		#else
		let screen = view.window?.screen ?? NSScreen.main
		let bounds = screen?.frame ?? .zero
		let scale = view.window?.backingScaleFactor ?? screen?.backingScaleFactor ?? 1
		#endif
		let landscapeWidth = max(bounds.width, bounds.height)
		let landscapeHeight = min(bounds.width, bounds.height)
		let ratio = landscapeHeight > 0 ? landscapeWidth / landscapeHeight : 4.0 / 3.0
		return (scale, ratio)
	}

	private func jsonStringLiteral(_ value: String) -> String {
		guard let data = try? JSONSerialization.data(withJSONObject: [value]),
			let json = String(data: data, encoding: .utf8),
			json.count >= 2 else {
			return "\"\""
		}
		return String(json.dropFirst().dropLast())
	}

	private func logSizing(_ reason: String) {
		guard Self.isSizingDebugEnabled else { return }
		guard isViewLoaded else { return }

		#if os(iOS)
		let webBounds = webView?.bounds ?? .zero
		let webFrame = webView?.frame ?? .zero
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
			"size[%{public}@] view.bounds=%{public}@ view.frame=%{public}@ web.bounds=%{public}@ web.frame=%{public}@ preferred=%{public}@ safeArea=%{public}@ window.bounds=%{public}@ window.frame=%{public}@ screen.bounds=%{public}@ effectiveGeometry=%{public}@ minSize=%{public}@",
			log: czVCLog,
			type: .default,
			reason,
			NSCoder.string(for: view.bounds),
			NSCoder.string(for: view.frame),
			NSCoder.string(for: webBounds),
			NSCoder.string(for: webFrame),
			NSCoder.string(for: preferredContentSize),
			NSCoder.string(for: view.safeAreaInsets),
			NSCoder.string(for: window?.bounds ?? .zero),
			NSCoder.string(for: window?.frame ?? .zero),
			NSCoder.string(for: screenBounds),
			geometry,
			NSCoder.string(for: minSize)
		)
		#else
		let webBounds = webView?.bounds ?? .zero
		let webFrame = webView?.frame ?? .zero
		let window = view.window
		let screenFrame = window?.screen?.frame ?? .zero
		os_log(
			"size[%{public}@] view.bounds=%{public}@ view.frame=%{public}@ web.bounds=%{public}@ web.frame=%{public}@ preferred=%{public}@ window.frame=%{public}@ screen.frame=%{public}@",
			log: czVCLog,
			type: .default,
			reason,
			NSStringFromRect(view.bounds),
			NSStringFromRect(view.frame),
			NSStringFromRect(webBounds),
			NSStringFromRect(webFrame),
			NSStringFromSize(preferredContentSize),
			NSStringFromRect(window?.frame ?? .zero),
			NSStringFromRect(screenFrame)
		)
		#endif
	}

	public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
		os_log("didFail navigation: %{public}@", log: czVCLog, type: .error, error.localizedDescription)
		webView.loadHTMLString(diagnosticHtml(title: "Navigation Failed", message: error.localizedDescription), baseURL: nil)
	}

	public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
		os_log("didFailProvisionalNavigation: %{public}@", log: czVCLog, type: .error, error.localizedDescription)
		webView.loadHTMLString(diagnosticHtml(title: "Provisional Navigation Failed", message: error.localizedDescription), baseURL: nil)
	}

	public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
		os_log("didFinish navigation instance=%{public}@", log: czVCLog, type: .default, instanceID)
		layoutWebView(reason: "didFinish")
		logSizing("didFinish")

		webAppReady = false
		pendingStatePushReason = pendingStatePushReason ?? "didFinish"

		os_log(
			"waiting for webReady after didFinish instance=%{public}@ pendingReason=%{public}@",
			log: czVCLog,
			type: .default,
			instanceID,
			pendingStatePushReason ?? "nil"
		)
	}

	public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
		os_log("didStartProvisionalNavigation instance=%{public}@", log: czVCLog, type: .default, instanceID)
	}

	public func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
		webContentTerminationCount += 1
		webAppReady = false
		pendingStatePushReason = "webContentProcessDidTerminate"

		telemetryController.hostWillResignActive()
		telemetryController.resetAllCaches()

		os_log(
			"web content process terminated count=%{public}d instance=%{public}@",
			log: czVCLog,
			type: .error,
			webContentTerminationCount,
			instanceID
		)

		DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self, weak webView] in
			guard let self, let webView, webView === self.webView else { return }

			if self.webContentTerminationCount == 1 {
				os_log(
					"reloading webView after content termination instance=%{public}@",
					log: czVCLog,
					type: .default,
					self.instanceID
				)
				webView.reload()
				return
			}

			os_log(
				"showing diagnostic after repeated content termination instance=%{public}@ count=%{public}d",
				log: czVCLog,
				type: .error,
				self.instanceID,
				self.webContentTerminationCount
			)

			webView.loadHTMLString(
				self.diagnosticHtml(title: "Web Content Process Terminated", message: "WebKit crashed while loading or resuming the bundled UI."),
				baseURL: nil
			)
		}
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
		pushStateCount += 1

		os_log(
			"pushStateToWebView #%{public}d instance=%{public}@ bytes=%{public}d preset=%{public}@ webReady=%{public}d",
			log: czVCLog,
			type: .default,
			pushStateCount,
			instanceID,
			paramsJson.utf8.count,
			selectedPresetName ?? "nil",
			webAppReady
		)

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
			os_log(.error, log: czVCLog, "sendScriptPayload: failed to serialize payload id=%{public}d", payload["id"] as? Int ?? -1)
			return
		}
		webView?.evaluateJavaScript("window.__czIpcResponse?.(\(json));", completionHandler: nil)
	}

	private func setTelemetrySubscription(_ channel: TelemetryChannel, active: Bool, audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit) {
		if active {
			let wasSubscribed = telemetryController.subscribe(channel)
			os_log("telemetry subscribe %{public}@ (instance=%@, new=%{public}d)", log: czVCLog, type: .default, channel.rawValue, instanceID, wasSubscribed)
			guard wasSubscribed else { return }
			pushTelemetryUpdates(audioUnit: audioUnit, forceChannels: [channel])
			return
		}

		telemetryController.unsubscribe(channel)
		os_log("telemetry unsubscribe %{public}@ (instance=%@)", log: czVCLog, type: .default, channel.rawValue, instanceID)
	}

	private func handleTelemetryTimer() {
		telemetryTickCount += 1

		if telemetryTickCount % 50 == 0 {
			os_log(
				"telemetry tick #%{public}d instance=%{public}@ channels=%{public}@ webReady=%{public}d",
				log: czVCLog,
				type: .debug,
				telemetryTickCount,
				instanceID,
				telemetryController.activeChannels.map(\.rawValue).joined(separator: ","),
				webAppReady
			)
		}

		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else {
			telemetryController.viewDidDisappear()
			return
		}

		guard webAppReady else { return }

		pushTelemetryUpdates(audioUnit: audioUnit)
	}

	@objc private func handleHostDidBecomeActive(_ notification: Notification) {
		DispatchQueue.main.async { [weak self] in
			guard let self else { return }

			let inactiveSeconds = self.hostInactiveAt.map { Date().timeIntervalSince($0) } ?? -1

			os_log(
				"host did become active instance=%{public}@ inactiveSeconds=%{public}.2f webReady=%{public}d webContentTerminationCount=%{public}d",
				log: czVCLog,
				type: .default,
				self.instanceID,
				inactiveSeconds,
				self.webAppReady,
				self.webContentTerminationCount
			)

			self.layoutWebView(reason: "hostDidBecomeActive")
			self.logSizing("hostDidBecomeActive")
			self.requestStatePushWhenWebReady(reason: "hostDidBecomeActive")
		}
	}

	@objc private func handleHostWillResignActive(_ notification: Notification) {
		DispatchQueue.main.async { [weak self] in
			guard let self else { return }

			self.hostInactiveAt = Date()
			self.pendingStatePushReason = nil

			os_log(
				"host will resign active instance=%{public}@",
				log: czVCLog,
				type: .default,
				self.instanceID
			)

			self.telemetryController.hostWillResignActive()
		}
	}

	private func requestStatePushWhenWebReady(reason: String) {
		pendingStatePushReason = reason

		guard webAppReady else {
			os_log(
				"state push deferred reason=%{public}@ instance=%{public}@",
				log: czVCLog,
				type: .default,
				reason,
				instanceID
			)
			return
		}

		pendingStatePushReason = nil
		pushCurrentStateToWebView(reason: reason)
		telemetryController.hostDidBecomeActive()
	}

	private func handleWebReady(audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit) {
		webAppReady = true

		let reason = pendingStatePushReason ?? "webReady"
		pendingStatePushReason = nil

		os_log(
			"webReady received instance=%{public}@ pendingReason=%{public}@",
			log: czVCLog,
			type: .default,
			instanceID,
			reason
		)

		layoutWebView(reason: "webReady")
		logSizing("webReady")
		pushCurrentStateToWebView(reason: reason)
		telemetryController.hostDidBecomeActive()
	}

	private func pushCurrentStateToWebView(reason: String) {
		guard let audioUnit = audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else { return }
		guard let json = audioUnit.paramsJson() else { return }

		os_log(
			"pushCurrentStateToWebView reason=%{public}@ instance=%{public}@",
			log: czVCLog,
			type: .default,
			reason,
			instanceID
		)

		pushStateToWebView(json)
	}

	private func pushTelemetryUpdates(
		audioUnit: CosmoPD101AUv3Ext_macOSExtensionAudioUnit,
		forceChannels: Set<TelemetryChannel> = []
	) {
		guard !telemetryController.activeChannels.isEmpty else {
			return
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
			os_log("BundleSchemeHandler failed for %{public}@: %{public}@", log: czVCLog, type: .error, fileURL.path, error.localizedDescription)
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
