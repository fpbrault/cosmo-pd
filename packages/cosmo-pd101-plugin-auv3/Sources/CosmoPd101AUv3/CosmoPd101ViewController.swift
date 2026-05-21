import CoreAudioKit
import Foundation
import WebKit

#if os(iOS)
import UIKit
#endif

public final class CosmoPd101ViewController: AUViewController, @preconcurrency AUAudioUnitFactory, WKNavigationDelegate, WKScriptMessageHandler {
    private static let preferredWidth: CGFloat = 1024
    private static let preferredHeight: CGFloat = 1536
    private static let minimumWidth: CGFloat = 1024
    private static let minimumHeight: CGFloat = 768
    private static let preferredAspectRatio = preferredWidth / preferredHeight

    private var webView: WKWebView?
    private var audioUnit: CosmoPd101AudioUnit?

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
        unit.paramsChangedHandler = { [weak self] json, presetName in
            DispatchQueue.main.async { [weak self] in
                self?.pushStateToWebView(json, selectedPresetName: presetName)
            }
        }
        return unit
    }

    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        NSLog("[CzVC] userContentController: name=%@ auNil=%@", message.name, audioUnit == nil ? "YES" : "NO")
        guard message.name == "cosmoPd101" else { return }
        guard let payload = message.body as? [String: Any] else { return }

        let id = payload["id"] as? Int ?? 0
        let method = payload["method"] as? String ?? ""
        let args = payload["args"] as? [Any] ?? []
        NSLog("[CzVC] IPC method=%@ id=%d auNil=%@", method, id, audioUnit == nil ? "YES" : "NO")

        guard let audioUnit else {
            // Audio unit not yet assigned — respond with an error so JS promises
            // reject immediately rather than hanging forever.
            sendError(id: id, message: "audioUnit not ready")
            return
        }

        switch method {
        case "getParams":
            sendResponse(id: id, result: audioUnit.paramsJson() ?? "{}")
        case "setParams":
            if let json = args.first as? String, audioUnit.setParamsJson(json) {
                sendResponse(id: id, result: NSNull())
            } else {
                NSLog("[CzVC] setParams FAILED: jsonOk=%@", (args.first as? String) != nil ? "yes" : "no")
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
        case "getRuntimeModSources":
            sendResponse(id: id, result: audioUnit.runtimeModSourcesJson() ?? "{}")
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
        let configuration = WKWebViewConfiguration()
        configuration.allowsAirPlayForMediaPlayback = false
        configuration.mediaTypesRequiringUserActionForPlayback = .all
        configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
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

        let webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.autoresizingMask = []
        webView.navigationDelegate = self
        #if os(macOS)
        // Keep a non-transparent background on macOS so load failures are visible.
        webView.setValue(true, forKey: "drawsBackground")
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
            webView.loadHTMLString(diagnosticHtml(title: "UI Bundle Missing", message: "Could not find index.html in the AU bundle."), baseURL: nil)
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
        webView.loadHTMLString(diagnosticHtml(title: "Navigation Failed", message: error.localizedDescription), baseURL: nil)
    }

    public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        webView.loadHTMLString(diagnosticHtml(title: "Provisional Navigation Failed", message: error.localizedDescription), baseURL: nil)
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

    /// Pushes updated engine params and optional preset metadata to the WebView.
    /// Called when native-side state changes (factory preset selection, state restore).
    private func pushStateToWebView(_ paramsJson: String, selectedPresetName: String? = nil) {
        // Wrap in a JSON object so JSONSerialization handles all string escaping correctly.
        let container: [String: String] = ["p": paramsJson]
        guard let data = try? JSONSerialization.data(withJSONObject: container),
              let containerStr = String(data: data, encoding: .utf8) else { return }
        var script = "window.__czOnParams?.(JSON.parse(\(containerStr)).p);"
        if let selectedPresetName {
            let presetContainer: [String: String] = ["n": selectedPresetName]
            if let presetData = try? JSONSerialization.data(withJSONObject: presetContainer),
               let presetContainerStr = String(data: presetData, encoding: .utf8) {
                script += "window.__czOnHostPresetSelected?.(JSON.parse(\(presetContainerStr)).n);"
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
}
