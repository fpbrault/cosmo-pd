//
//  AudioUnitViewController.swift
//  CosmoPD101AUv3Ext-macOSExtension
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import CoreAudioKit
import Foundation
import WebKit

#if os(iOS)
import UIKit
#endif

@MainActor
public class AudioUnitViewController: AUViewController, AUAudioUnitFactory, WKNavigationDelegate, WKScriptMessageHandler {
	private static let preferredWidth: CGFloat = 2048
	private static let preferredHeight: CGFloat = 1536
	private static let minimumWidth: CGFloat = 1024
	private static let minimumHeight: CGFloat = 768
	private static let preferredAspectRatio = preferredWidth / preferredHeight

    var audioUnit: AUAudioUnit?
	private var webView: WKWebView?

	#if os(iOS)
	public override var prefersStatusBarHidden: Bool { true }
	public override var prefersHomeIndicatorAutoHidden: Bool { true }
	public override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }
	#endif

    private var observation: NSKeyValueObservation?

	/* iOS View lifcycle
	public override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)

		// Recreate any view related resources here..
	}

	public override func viewDidDisappear(_ animated: Bool) {
		super.viewDidDisappear(animated)

		// Destroy any view related content here..
	}
	*/

	/* macOS View lifcycle
	public override func viewWillAppear() {
		super.viewWillAppear()
		
		// Recreate any view related resources here..
	}

	public override func viewDidDisappear() {
		super.viewDidDisappear()

		// Destroy any view related content here..
	}
	*/

	deinit {
	}

	public override func loadView() {
		#if os(iOS)
		view = UIView(frame: CGRect(x: 0, y: 0, width: Self.preferredWidth, height: Self.preferredHeight))
		view.backgroundColor = .black
		preferredContentSize = CGSize(width: Self.preferredWidth, height: Self.preferredHeight)
		#else
		view = NSView(frame: NSRect(x: 0, y: 0, width: Self.preferredWidth, height: Self.preferredHeight))
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
		view.window?.contentMinSize = NSSize(width: Self.minimumWidth, height: Self.minimumHeight)
		view.window?.contentAspectRatio = NSSize(width: Self.preferredWidth, height: Self.preferredHeight)
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
		return try DispatchQueue.main.sync {
			audioUnit = try CosmoPD101AUv3Ext_macOSExtensionAudioUnit(componentDescription: componentDescription, options: [])

			guard let audioUnit = self.audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit else {
				return audioUnit!
			}

			audioUnit.setupParameterTree(CosmoPD101AUv3Ext_macOSExtensionParameterSpecs.createAUParameterTree())

			self.observation = audioUnit.observe(\.allParameterValues, options: [.new]) { object, change in
				guard let tree = audioUnit.parameterTree else { return }

				// This insures the Audio Unit gets initial values from the host.
				for param in tree.allParameters { param.value = param.value }
			}

			guard audioUnit.parameterTree != nil else {
				return audioUnit
			}

			return audioUnit
		}
	}

	public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		guard message.name == "cosmoPd101" else { return }
		guard let payload = message.body as? [String: Any] else { return }

		let id = payload["id"] as? Int ?? 0
		let method = payload["method"] as? String ?? ""
		let args = payload["args"] as? [Any] ?? []
		let eventPayload = args.first as? [String: Any] ?? [:]

		switch method {
		case "getParams":
			sendResponse(id: id, result: "{}")
		case "noteOn", "noteOff", "sustain", "panic":
			(audioUnit as? CosmoPD101AUv3Ext_macOSExtensionAudioUnit)?.handleBridgeEvent(type: method, payload: eventPayload)
			sendResponse(id: id, result: NSNull())
		case "setParams", "pitchBend", "modWheel", "aftertouch", "clientLog":
			sendResponse(id: id, result: NSNull())
		case "getScopeData":
			sendResponse(id: id, result: [
				"samples": [Int](),
				"sampleRate": 44_100,
				"hz": 0,
			])
		case "getRuntimeVoiceStates":
			sendResponse(id: id, result: "[]")
		default:
			sendError(id: id, message: "unknown method: \(method)")
		}
	}

	private func installWebView() {
		let configuration = WKWebViewConfiguration()
		configuration.allowsAirPlayForMediaPlayback = false
		configuration.mediaTypesRequiringUserActionForPlayback = .all
		configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
		configuration.userContentController.add(self, name: "cosmoPd101")

		let webView = WKWebView(frame: view.bounds, configuration: configuration)
		webView.autoresizingMask = []
		webView.navigationDelegate = self
		#if os(macOS)
		webView.setValue(false, forKey: "drawsBackground")
		#else
		webView.isOpaque = false
		webView.backgroundColor = .clear
		webView.scrollView.backgroundColor = .clear
		webView.scrollView.contentInsetAdjustmentBehavior = .never
		webView.scrollView.automaticallyAdjustsScrollIndicatorInsets = false
		#endif
		view.addSubview(webView)
		self.webView = webView
		layoutWebView()

		let bundle = Bundle(for: AudioUnitViewController.self)
		let indexUrl = bundle.url(forResource: "index", withExtension: "html", subdirectory: "ui")
			?? bundle.url(forResource: "index", withExtension: "html")

		guard let indexUrl else {
			webView.loadHTMLString("<html><body>Cosmo PD-101 UI bundle missing.</body></html>", baseURL: nil)
			return
		}

		let baseUrl = indexUrl.deletingLastPathComponent()
		let assetsDirectory = baseUrl.appendingPathComponent("assets", isDirectory: true)
		let hasAssetsDirectory = FileManager.default.fileExists(atPath: assetsDirectory.path)
		if !hasAssetsDirectory,
		   let htmlData = try? Data(contentsOf: indexUrl),
		   var html = String(data: htmlData, encoding: .utf8) {
			html = html.replacingOccurrences(of: "./assets/", with: "./")
			webView.loadHTMLString(html, baseURL: baseUrl)
			return
		}

		webView.loadFileURL(indexUrl, allowingReadAccessTo: baseUrl)
	}

	private func layoutWebView() {
		guard let webView else { return }

		let bounds = view.bounds
		#if os(iOS)
		webView.frame = bounds
		#else
		let widthConstrainedHeight = bounds.width / Self.preferredAspectRatio
		let size: CGSize
		if widthConstrainedHeight <= bounds.height {
			size = CGSize(width: bounds.width, height: widthConstrainedHeight)
		} else {
			size = CGSize(width: bounds.height * Self.preferredAspectRatio, height: bounds.height)
		}

		webView.frame = CGRect(
			x: bounds.midX - size.width / 2,
			y: bounds.midY - size.height / 2,
			width: size.width,
			height: size.height
		)
		#endif
	}

	public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
		webView.loadHTMLString("<html><body style='font-family: -apple-system; padding: 24px;'>Cosmo PD-101 UI failed to load.<br>\(error.localizedDescription)</body></html>", baseURL: nil)
	}

	public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
		webView.loadHTMLString("<html><body style='font-family: -apple-system; padding: 24px;'>Cosmo PD-101 UI failed to load.<br>\(error.localizedDescription)</body></html>", baseURL: nil)
	}

	private func sendResponse(id: Int, result: Any) {
		sendScriptPayload(["id": id, "result": result])
	}

	private func sendError(id: Int, message: String) {
		sendScriptPayload(["id": id, "error": message])
	}

	private func sendScriptPayload(_ payload: [String: Any]) {
		guard JSONSerialization.isValidJSONObject(payload),
			let data = try? JSONSerialization.data(withJSONObject: payload),
			let json = String(data: data, encoding: .utf8) else {
			return
		}
		webView?.evaluateJavaScript("window.__czIpcResponse?.(\(json));", completionHandler: nil)
	}
}
