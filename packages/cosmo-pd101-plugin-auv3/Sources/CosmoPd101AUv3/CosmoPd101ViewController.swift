import CoreAudioKit
import Foundation
import WebKit

#if os(iOS)
import UIKit
#endif

public final class CosmoPd101ViewController: AUViewController, @preconcurrency AUAudioUnitFactory, WKNavigationDelegate, WKScriptMessageHandler {
    private static let preferredWidth: CGFloat = 2048
    private static let preferredHeight: CGFloat = 1536
    private static let minimumWidth: CGFloat = 1024
    private static let minimumHeight: CGFloat = 768
    private static let preferredAspectRatio = preferredWidth / preferredHeight

    private var webView: WKWebView?
    private weak var audioUnit: CosmoPd101AudioUnit?

    #if os(iOS)
    public override var prefersStatusBarHidden: Bool { true }
    public override var prefersHomeIndicatorAutoHidden: Bool { true }
    public override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }
    #endif

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

    public func createAudioUnit(with componentDescription: AudioComponentDescription) throws -> AUAudioUnit {
        let unit = try CosmoPd101AudioUnit(componentDescription: componentDescription)
        audioUnit = unit
        return unit
    }

    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "cosmoPd101", let audioUnit else { return }
        guard let payload = message.body as? [String: Any] else { return }

        let id = payload["id"] as? Int ?? 0
        let method = payload["method"] as? String ?? ""
        let args = payload["args"] as? [Any] ?? []
        switch method {
        case "getParams":
            sendResponse(id: id, result: audioUnit.paramsJson() ?? "{}")
        case "setParams":
            if let json = args.first as? String, audioUnit.setParamsJson(json) {
                sendResponse(id: id, result: NSNull())
            } else {
                sendError(id: id, message: "invalid setParams payload")
            }
        case "getScopeData":
            let scope = audioUnit.scopeData()
            sendResponse(id: id, result: [
                "samples": scope.samples,
                "sampleRate": scope.sampleRate,
                "hz": scope.hz,
            ])
        case "getRuntimeVoiceStates":
            sendResponse(id: id, result: audioUnit.runtimeVoiceStatesJson() ?? "[]")
        case "clientLog":
            sendResponse(id: id, result: NSNull())
        case "noteOn", "noteOff", "sustain", "pitchBend", "modWheel", "aftertouch", "panic":
            audioUnit.handleEngineEvent(type: method, payload: args.first as? [String: Any] ?? [:])
            sendResponse(id: id, result: NSNull())
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

        guard let indexUrl = resourceBundle.url(forResource: "index", withExtension: "html", subdirectory: "ui") else {
            webView.loadHTMLString("<html><body>Cosmo PD-101 UI bundle missing.</body></html>", baseURL: nil)
            return
        }
        webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
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

    private var resourceBundle: Bundle {
#if SWIFT_PACKAGE
        Bundle.module
#else
        Bundle(for: CosmoPd101ViewController.self)
#endif
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