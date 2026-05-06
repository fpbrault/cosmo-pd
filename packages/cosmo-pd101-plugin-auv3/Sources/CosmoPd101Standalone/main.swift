import AppKit
import AVFoundation
import CoreMIDI
import WebKit

final class StandaloneAudioHost {
    private let audioEngine = AVAudioEngine()
    private var sourceNode: AVAudioSourceNode?
    private var midiClient = MIDIClientRef()
    private var midiPort = MIDIPortRef()
    private var engine: CosmoPd101FfiEngineRef?
    private let maxFrames = 4096

    deinit {
        stop()
    }

    func start() throws {
        let output = audioEngine.outputNode
        let sampleRate = Float(output.outputFormat(forBus: 0).sampleRate)
        engine = cosmo_pd101_ffi_engine_create(sampleRate, maxFrames)
        guard engine != nil else {
            throw NSError(domain: "CosmoPd101Standalone", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not create synth engine"])
        }

        let format = AVAudioFormat(standardFormatWithSampleRate: Double(sampleRate), channels: 2)!
        let node = AVAudioSourceNode(format: format) { [weak self] _, _, frameCount, audioBufferList -> OSStatus in
            guard let self, let engine = self.engine else {
                return kAudioUnitErr_Uninitialized
            }
            let frames = Int(frameCount)
            let buffers = UnsafeMutableAudioBufferListPointer(audioBufferList)
            guard buffers.count >= 2,
                  let leftData = buffers[0].mData,
                  let rightData = buffers[1].mData else {
                return kAudioUnitErr_InvalidPropertyValue
            }
            let left = leftData.bindMemory(to: Float.self, capacity: frames)
            let right = rightData.bindMemory(to: Float.self, capacity: frames)
            let status = cosmo_pd101_ffi_render_stereo(engine, left, right, frames)
            return status == CosmoPd101FfiStatus.ok.rawValue ? noErr : kAudioUnitErr_FailedInitialization
        }

        audioEngine.attach(node)
        audioEngine.connect(node, to: output, format: format)
        sourceNode = node
        try audioEngine.start()
        connectMidiSources()
    }

    func stop() {
        if midiPort != 0 {
            MIDIPortDispose(midiPort)
            midiPort = 0
        }
        if midiClient != 0 {
            MIDIClientDispose(midiClient)
            midiClient = 0
        }
        audioEngine.stop()
        sourceNode = nil
        cosmo_pd101_ffi_engine_destroy(engine)
        engine = nil
    }

    func setParamsJson(_ json: String) -> Bool {
        json.withCString { pointer in
            cosmo_pd101_ffi_set_params_json(engine, pointer) == CosmoPd101FfiStatus.ok.rawValue
        }
    }

    func paramsJson() -> String? {
        let required = cosmo_pd101_ffi_get_params_json(engine, nil, 0)
        guard required > 0 else { return nil }
        var bytes = [UInt8](repeating: 0, count: required)
        let written = bytes.withUnsafeMutableBufferPointer { buffer in
            cosmo_pd101_ffi_get_params_json(engine, buffer.baseAddress, buffer.count)
        }
        guard written == required else { return nil }
        return String(bytes: bytes, encoding: .utf8)
    }

    func runtimeVoiceStatesJson() -> String? {
        let required = cosmo_pd101_ffi_get_runtime_voice_states_json(engine, nil, 0)
        guard required > 0 else { return nil }
        var bytes = [UInt8](repeating: 0, count: required)
        let written = bytes.withUnsafeMutableBufferPointer { buffer in
            cosmo_pd101_ffi_get_runtime_voice_states_json(engine, buffer.baseAddress, buffer.count)
        }
        guard written == required else { return nil }
        return String(bytes: bytes, encoding: .utf8)
    }

    func scopeData() -> (samples: [Float], sampleRate: Float, hz: Float) {
        let required = cosmo_pd101_ffi_copy_scope_f32(engine, nil, 0, nil, nil)
        guard required > 0 else { return ([], 44_100, 0) }
        var samples = [Float](repeating: 0, count: required)
        var sampleRate: Float = 0
        var hz: Float = 0
        let copied = samples.withUnsafeMutableBufferPointer { buffer in
            cosmo_pd101_ffi_copy_scope_f32(engine, buffer.baseAddress, buffer.count, &sampleRate, &hz)
        }
        if copied < samples.count {
            samples.removeSubrange(copied..<samples.count)
        }
        if samples.count > 1024 {
            samples = Array(samples.suffix(1024))
        }
        samples = samples.map { sample in
            sample.isFinite ? min(1, max(-1, sample)) : 0
        }
        return (samples, sampleRate, hz)
    }

    func handleEngineEvent(type: String, payload: [String: Any]) {
        switch type {
        case "noteOn":
            let note = UInt8(clamping: payload["note"] as? Int ?? 60)
            let frequency = Float(payload["frequency"] as? Double ?? 0)
            let velocity = Float(payload["velocity"] as? Double ?? 1)
            _ = cosmo_pd101_ffi_note_on(engine, note, frequency, velocity)
        case "noteOff":
            let note = UInt8(clamping: payload["note"] as? Int ?? 60)
            _ = cosmo_pd101_ffi_note_off(engine, note)
        case "sustain":
            _ = cosmo_pd101_ffi_set_sustain(engine, payload["on"] as? Bool ?? false)
        case "pitchBend":
            _ = cosmo_pd101_ffi_set_pitch_bend(engine, Float(payload["value"] as? Double ?? 0))
        case "modWheel":
            _ = cosmo_pd101_ffi_set_mod_wheel(engine, Float(payload["value"] as? Double ?? 0))
        case "aftertouch":
            _ = cosmo_pd101_ffi_set_aftertouch(engine, Float(payload["value"] as? Double ?? 0))
        case "panic":
            _ = cosmo_pd101_ffi_all_notes_off(engine)
        default:
            break
        }
    }

    private func connectMidiSources() {
        MIDIClientCreate("Cosmo PD-101" as CFString, nil, nil, &midiClient)
        MIDIInputPortCreateWithBlock(midiClient, "Cosmo PD-101 MIDI In" as CFString, &midiPort) { [weak self] packetList, _ in
            self?.handleMidiPacketList(packetList)
        }

        for index in 0..<MIDIGetNumberOfSources() {
            let source = MIDIGetSource(index)
            MIDIPortConnectSource(midiPort, source, nil)
        }
    }

    private func handleMidiPacketList(_ packetListPointer: UnsafePointer<MIDIPacketList>) {
        let packetList = packetListPointer.pointee
        var packet = packetList.packet
        for _ in 0..<packetList.numPackets {
            handleMidiPacket(packet)
            let nextPacket = withUnsafePointer(to: packet) { packetPointer in
                MIDIPacketNext(packetPointer).pointee
            }
            packet = nextPacket
        }
    }

    private func handleMidiPacket(_ packet: MIDIPacket) {
        let length = Int(packet.length)
        guard length > 0 else { return }
        let bytes = Mirror(reflecting: packet.data).children.compactMap { $0.value as? UInt8 }
        var index = 0
        while index < length && index < bytes.count {
            let status = bytes[index]
            let message = status & 0xF0
            let data1 = index + 1 < length ? bytes[index + 1] : 0
            let data2 = index + 2 < length ? bytes[index + 2] : 0
            handleMidi(status: status, data1: data1, data2: data2)
            index += message == 0xC0 || message == 0xD0 ? 2 : 3
        }
    }

    private func handleMidi(status: UInt8, data1: UInt8, data2: UInt8) {
        let message = status & 0xF0
        switch message {
        case 0x80:
            _ = cosmo_pd101_ffi_note_off(engine, data1)
        case 0x90:
            let velocity = Float(data2) / 127.0
            if velocity <= 0.0001 {
                _ = cosmo_pd101_ffi_note_off(engine, data1)
            } else {
                _ = cosmo_pd101_ffi_note_on(engine, data1, 0, velocity)
            }
        case 0xB0:
            handleControlChange(cc: data1, value: data2)
        case 0xE0:
            let raw = Int(data1) | (Int(data2) << 7)
            let normalized = (Float(raw) - 8192.0) / 8192.0
            _ = cosmo_pd101_ffi_set_pitch_bend(engine, normalized)
        default:
            break
        }
    }

    private func handleControlChange(cc: UInt8, value: UInt8) {
        let normalized = Float(value) / 127.0
        switch cc {
        case 1:
            _ = cosmo_pd101_ffi_set_mod_wheel(engine, normalized)
        case 64:
            _ = cosmo_pd101_ffi_set_sustain(engine, normalized >= 0.5)
        case 120, 123:
            _ = cosmo_pd101_ffi_all_notes_off(engine)
        default:
            break
        }
    }
}

final class StandaloneAppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate, WKScriptMessageHandler {
    private static let preferredWidth: CGFloat = 2048
    private static let preferredHeight: CGFloat = 1536
    private static let minimumWidth: CGFloat = 1024
    private static let minimumHeight: CGFloat = 768

    private let audioHost = StandaloneAudioHost()
    private var window: NSWindow?
    private var webView: WKWebView?

    func applicationDidFinishLaunching(_ notification: Notification) {
        do {
            try audioHost.start()
        } catch {
            showErrorWindow(message: error.localizedDescription)
            return
        }

        let frame = NSRect(x: 0, y: 0, width: Self.preferredWidth, height: Self.preferredHeight)
        let window = NSWindow(
            contentRect: frame,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Cosmo PD-101"
        window.delegate = self
        window.contentMinSize = NSSize(width: Self.minimumWidth, height: Self.minimumHeight)
        window.contentAspectRatio = NSSize(width: Self.preferredWidth, height: Self.preferredHeight)
        window.center()

        let configuration = WKWebViewConfiguration()
        configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        configuration.userContentController.add(self, name: "cosmoPd101")

        let webView = WKWebView(frame: frame, configuration: configuration)
        webView.autoresizingMask = [.width, .height]
        webView.navigationDelegate = self
        webView.setValue(false, forKey: "drawsBackground")
        window.contentView?.addSubview(webView)

        self.window = window
        self.webView = webView
        loadWebUi()

        NSApp.activate(ignoringOtherApps: true)
        window.makeKeyAndOrderFront(nil)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "cosmoPd101", let payload = message.body as? [String: Any] else { return }
        let id = payload["id"] as? Int ?? 0
        let method = payload["method"] as? String ?? ""
        let args = payload["args"] as? [Any] ?? []
        switch method {
        case "getParams":
            sendResponse(id: id, result: audioHost.paramsJson() ?? "{}")
        case "setParams":
            if let json = args.first as? String, audioHost.setParamsJson(json) {
                sendResponse(id: id, result: NSNull())
            } else {
                sendError(id: id, message: "invalid setParams payload")
            }
        case "getScopeData":
            let scope = audioHost.scopeData()
            sendResponse(id: id, result: [
                "samples": scope.samples,
                "sampleRate": scope.sampleRate,
                "hz": scope.hz,
            ])
        case "getRuntimeVoiceStates":
            sendResponse(id: id, result: audioHost.runtimeVoiceStatesJson() ?? "[]")
        case "clientLog":
            sendResponse(id: id, result: NSNull())
        case "noteOn", "noteOff", "sustain", "pitchBend", "modWheel", "aftertouch", "panic":
            audioHost.handleEngineEvent(type: method, payload: args.first as? [String: Any] ?? [:])
            sendResponse(id: id, result: NSNull())
        default:
            sendError(id: id, message: "unknown method: \(method)")
        }
    }

    private func loadWebUi() {
        guard let webView else { return }
        guard let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "ui") else {
            webView.loadHTMLString("<html><body style='font-family: -apple-system; padding: 24px;'>Cosmo PD-101 UI bundle missing.</body></html>", baseURL: nil)
            return
        }
        webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
    }

    private func showErrorWindow(message: String) {
        let frame = NSRect(x: 0, y: 0, width: 640, height: 260)
        let window = NSWindow(contentRect: frame, styleMask: [.titled, .closable], backing: .buffered, defer: false)
        window.title = "Cosmo PD-101"
        window.center()
        let label = NSTextField(wrappingLabelWithString: "Cosmo PD-101 could not start.\n\n\(message)")
        label.frame = frame.insetBy(dx: 32, dy: 32)
        window.contentView?.addSubview(label)
        self.window = window
        NSApp.activate(ignoringOtherApps: true)
        window.makeKeyAndOrderFront(nil)
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

let app = NSApplication.shared
let delegate = StandaloneAppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
