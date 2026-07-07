//
//  SimplePlayEngine.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import Foundation
import CoreAudioKit
import AVFoundation
@preconcurrency import AVFAudio
import os

private let speLog = OSLog(subsystem: "com.cosmo.pd101.auv3", category: "SPE")

#if os(iOS) || os(visionOS)
import UIKit
#elseif os(macOS)
import AppKit
#endif

/// Wraps and Audio Unit extension and provides helper functions.
extension AVAudioUnit {

    var wantsAudioInput: Bool {
        let componentType = self.auAudioUnit.componentDescription.componentType
        return componentType == kAudioUnitType_MusicEffect || componentType == kAudioUnitType_Effect
    }

    static fileprivate func componentDescription(type: String, subType: String, manufacturer: String) -> AudioComponentDescription {
        AudioComponentDescription(componentType: type.fourCharCode!,
                                  componentSubType: subType.fourCharCode!,
                                  componentManufacturer: manufacturer.fourCharCode!,
                                  componentFlags: 0,
                                  componentFlagsMask: 0)
    }

    static fileprivate func componentURLs(type: String, subType: String, manufacturer: String) -> [URL] {
        let description = componentDescription(type: type, subType: subType, manufacturer: manufacturer)
        return AVAudioUnitComponentManager.shared().components(matching: description).compactMap {
            $0.value(forKey: "componentURL") as? URL
        }
    }
    
    static fileprivate func findComponent(type: String, subType: String, manufacturer: String) -> AVAudioUnitComponent? {
        let description = componentDescription(type: type, subType: subType, manufacturer: manufacturer)
        let components = AVAudioUnitComponentManager.shared().components(matching: description)
        NSLog("[SPE] findComponent: matches=%d for %@/%@/%@", components.count, type, subType, manufacturer)
        let appBundlePath = Bundle.main.bundleURL.path
        for component in components {
            let componentURL = component.value(forKey: "componentURL") as? URL
            #if os(macOS)
            NSLog(
                "[SPE] candidate AU: name=%@ manufacturer=%@ version=%@ hasCustomView=%@ url=%@",
                component.name,
                component.manufacturerName,
                component.versionString,
                component.hasCustomView ? "yes" : "no",
                componentURL?.path ?? "<nil>"
            )
            #else
            NSLog(
                "[SPE] candidate AU: name=%@ manufacturer=%@ version=%@ url=%@",
                component.name,
                component.manufacturerName,
                component.versionString,
                componentURL?.path ?? "<nil>"
            )
            #endif
        }

        if let embedded = components.first(where: { component in
            guard let url = component.value(forKey: "componentURL") as? URL else { return false }
            return url.path.hasPrefix(appBundlePath)
        }) {
            NSLog("[SPE] selected embedded AU: %@", embedded.name)
            return embedded
        }

        #if DEBUG && os(macOS)
        if !components.isEmpty {
            NSLog(
                "[SPE] no embedded AU match for host bundle=%@; falling back to registered non-embedded match",
                appBundlePath
            )
        }
        #endif

        #if os(macOS)
        if let preferred = components.first(where: { $0.hasCustomView }) {
            NSLog("[SPE] selected AU with custom view: %@", preferred.name)
            return preferred
        }
        #endif

        if let first = components.first {
            NSLog("[SPE] selected first AU (no custom-view match): %@", first.name)
        }
        return components.first
    }
    
	fileprivate func loadAudioUnitViewController() async -> ViewController? {
		NSLog("[SPE] loadAudioUnitViewController: requesting VC...")
        let viewController = await withTaskGroup(of: ViewController?.self) { group in
            group.addTask {
                let vc = await self.auAudioUnit.requestViewController()
                NSLog("[SPE] requestViewController returned: %@", vc == nil ? "nil" : String(describing: type(of: vc!)))
                return vc
            }
            group.addTask {
                do {
                    try await Task.sleep(nanoseconds: 8_000_000_000)
                } catch {
                    // Cancelled because requestViewController returned first.
                    return nil
                }
                NSLog("[SPE] requestViewController timed out after 8s")
                return nil
            }

            let first = await group.next() ?? nil
            group.cancelAll()
            return first
        }
		NSLog("[SPE] chosen VC: %@", viewController == nil ? "nil" : String(describing: type(of: viewController!)))
		if let viewController {
			await MainActor.run {
				configureStandaloneAuv3ViewController(viewController)
			}
		}

		if #available(macOS 13.0, iOS 16.0, *) {
			if viewController == nil {
                NSLog("[SPE] falling back to AUGenericViewController")
                let genericViewController = await MainActor.run { AUGenericViewController() }
                await MainActor.run {
					genericViewController.auAudioUnit = self.auAudioUnit
				}
				return genericViewController
			}
		}

		return viewController
	}
}

/// Manages the interaction with the AudioToolbox and AVFoundation frameworks.
@MainActor
@Observable
public class SimplePlayEngine {
    
    var avAudioUnit: AVAudioUnit?
	private(set) var lastInitErrorMessage: String?
    
    // Synchronizes starting/stopping the engine and scheduling file segments.
    private let stateChangeQueue = DispatchQueue(label: "com.example.apple-samplecode.StateChangeQueue")
    
    // Playback engine.
    private let engine = AVAudioEngine()
    
    // Engine's player node.
    private let player = AVAudioPlayerNode()
    
    // File to play.
    private var file: AVAudioFile?
    
    // Whether we are playing.
    private(set) var isPlaying = false
	private let normalOutputVolume: Float = 1
	private var fadeOutGeneration = 0
    
    // This block will be called every render cycle and will receive MIDI events
    private let midiOutBlock: AUMIDIOutputEventBlock = { sampleTime, cable, length, data in return noErr }
    
    // This block can be used to send MIDI UMP events to the Audio Unit
    var scheduleMIDIEventListBlock: AUMIDIEventListBlock? = nil
    
    // MARK: Initialization
    
    public init() {
        engine.attach(player)
        
        guard let fileURL = Bundle.main.url(forResource: "Synth", withExtension: "aif") else {
            os_log(.error, log: speLog, "\"Synth.aif\" file not found; running without playback file")
            return
        }
        setPlayerFile(fileURL)
        
        engine.prepare()
        setupMIDI()
    }
    
    private func setupMIDI() {
        let ok = MIDIManager.shared.setupPort(midiProtocol: MIDIProtocolID._2_0, receiveBlock: { [weak self] eventList, _ in
            if let scheduleMIDIEventListBlock = self?.scheduleMIDIEventListBlock {
                _ = scheduleMIDIEventListBlock(AUEventSampleTimeImmediate, 0, eventList)
            }
        })
        if !ok {
            // Core MIDI is unavailable in the iOS Simulator — this is expected.
            // Web keyboard events are routed through the JS bridge and do not require Core MIDI.
            print("[SimplePlayEngine] Core MIDI unavailable — hardware MIDI input disabled.")
        }
    }

    private func logEmbeddedExtensions() {
        guard let pluginsURL = Bundle.main.builtInPlugInsURL else {
            NSLog("[SPE] builtInPlugInsURL is nil for host bundle: %@", Bundle.main.bundleURL.path)
            return
        }

        let fileManager = FileManager.default
        let pluginPaths = (try? fileManager.contentsOfDirectory(at: pluginsURL, includingPropertiesForKeys: nil)) ?? []
        NSLog("[SPE] embedded PlugIns dir: %@ entries=%d", pluginsURL.path, pluginPaths.count)
        for path in pluginPaths {
            NSLog("[SPE] embedded plugin entry: %@", path.lastPathComponent)
        }
    }

    private func missingComponentMessage(type: String, subType: String, manufacturer: String) -> String {
        let base = "Audio Unit not found for \(type)/\(subType)/\(manufacturer)."

        #if os(iOS)
        if ProcessInfo.processInfo.isiOSAppOnMac {
            return "\(base) Running as Designed for iPad on macOS does not reliably register embedded AUv3 components in dev wrapper builds. Run the native macOS host target (not iOS-on-Mac) to register and load the extension."
        }
        #endif

        return "\(base) Verify the extension is embedded in the app and that the app is launched from a stable installed path so LaunchServices can register the AU extension."
    }

    #if DEBUG && os(macOS)
    @discardableResult
    private func runProcess(executablePath: String, arguments: [String]) -> Int32? {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: executablePath)
        process.arguments = arguments

        let outputPipe = Pipe()
        process.standardOutput = outputPipe
        process.standardError = outputPipe

        do {
            try process.run()
            process.waitUntilExit()
            let data = outputPipe.fileHandleForReading.readDataToEndOfFile()
            if let output = String(data: data, encoding: .utf8), !output.isEmpty {
                NSLog("[SPE] %@ %@ -> %d\n%@", executablePath, arguments.joined(separator: " "), process.terminationStatus, output)
            } else {
                NSLog("[SPE] %@ %@ -> %d", executablePath, arguments.joined(separator: " "), process.terminationStatus)
            }
            return process.terminationStatus
        } catch {
            NSLog("[SPE] process run failed: %@ %@", executablePath, error.localizedDescription)
            return nil
        }
    }

    private func shouldForceRegistrationRefresh() -> Bool {
        ProcessInfo.processInfo.environment["COSMO_FORCE_AUV3_REGISTRATION_REFRESH"] == "1"
    }

    private func shouldAutoRegistrationRefreshOnMiss() -> Bool {
        ProcessInfo.processInfo.environment["COSMO_AUTO_AUV3_REGISTRATION_REFRESH_ON_MISS"] != "0"
    }

    private func bestEffortRegisterEmbeddedAudioUnits(type: String, subType: String, manufacturer: String) {
        guard ProcessInfo.processInfo.environment["COSMO_SKIP_AUV3_REGISTRATION_REFRESH"] != "1" else {
            NSLog("[SPE] skipping embedded AUv3 registration refresh")
            return
        }

        guard let pluginsURL = Bundle.main.builtInPlugInsURL else { return }
        let fileManager = FileManager.default
        let entries = (try? fileManager.contentsOfDirectory(at: pluginsURL, includingPropertiesForKeys: nil)) ?? []
        let appexEntries = entries.filter { $0.pathExtension.lowercased() == "appex" }
        guard !appexEntries.isEmpty else {
            NSLog("[SPE] no embedded appex found in %@", pluginsURL.path)
            return
        }

        let hostBundlePath = Bundle.main.bundleURL.path
        for url in AVAudioUnit.componentURLs(type: type, subType: subType, manufacturer: manufacturer) where !url.path.hasPrefix(hostBundlePath) {
            NSLog("[SPE] unregistering stale AUv3 match at %@", url.path)
            _ = runProcess(executablePath: "/usr/bin/pluginkit", arguments: ["-r", url.path])
        }

        let lsregister = "/System/Library/Frameworks/CoreServices.framework/Versions/Current/Frameworks/LaunchServices.framework/Versions/Current/Support/lsregister"
        _ = runProcess(executablePath: lsregister, arguments: ["-f", "-R", "-trusted", Bundle.main.bundleURL.path])

        for appexURL in appexEntries {
            NSLog("[SPE] attempting pluginkit registration for %@", appexURL.path)
            _ = runProcess(executablePath: "/usr/bin/pluginkit", arguments: ["-r", appexURL.path])
            _ = runProcess(executablePath: "/usr/bin/pluginkit", arguments: ["-a", appexURL.path])
        }

        _ = runProcess(executablePath: "/usr/bin/killall", arguments: ["-9", "AudioComponentRegistrar"])
    }
    #endif
    
    func initComponent(type: String, subType: String, manufacturer: String) async -> ViewController? {
        lastInitErrorMessage = nil
        // Reset the engine to remove any configured audio units.
        reset()
        logEmbeddedExtensions()
        #if DEBUG && os(macOS)
        if shouldForceRegistrationRefresh() {
            NSLog("[SPE] forcing embedded AUv3 registration refresh")
            bestEffortRegisterEmbeddedAudioUnits(type: type, subType: subType, manufacturer: manufacturer)
        } else {
            NSLog("[SPE] registration refresh disabled (set COSMO_FORCE_AUV3_REGISTRATION_REFRESH=1 to enable)")
        }
        #endif

        let maxAttempts = 12
        var selectedComponent: AVAudioUnitComponent?
        #if DEBUG && os(macOS)
        var didAutoRefreshRegistration = false
        #endif
        for attempt in 1...maxAttempts {
            if let component = AVAudioUnit.findComponent(type: type, subType: subType, manufacturer: manufacturer) {
                selectedComponent = component
                break
            }

            #if DEBUG && os(macOS)
            if !didAutoRefreshRegistration && attempt == 2 && shouldAutoRegistrationRefreshOnMiss() {
                didAutoRefreshRegistration = true
                NSLog("[SPE] component still missing after initial retries; running one-time AUv3 registration refresh")
                bestEffortRegisterEmbeddedAudioUnits(type: type, subType: subType, manufacturer: manufacturer)
            }
            #endif

            if attempt < maxAttempts {
                NSLog("[SPE] component not found on attempt %d/%d; retrying...", attempt, maxAttempts)
                try? await Task.sleep(nanoseconds: 500_000_000)
            }
        }

        guard let component = selectedComponent else {
            let message = missingComponentMessage(type: type, subType: subType, manufacturer: manufacturer)
            NSLog("[SPE] %@", message)
            lastInitErrorMessage = message
            return nil
        }
        
        // Instantiate the audio unit.
        do {
            let description = component.audioComponentDescription
            let audioUnit: AVAudioUnit
            do {
                audioUnit = try await AVAudioUnit.instantiate(
                    with: description,
                    options: .loadOutOfProcess
                )
            } catch {
                #if os(macOS)
                let nsError = error as NSError
                let isInstantiateNotPermitted = nsError.code == -3000
                if isInstantiateNotPermitted {
                    NSLog("[SPE] instantiate out-of-process failed with -3000; retrying in-process")
                    audioUnit = try await AVAudioUnit.instantiate(
                        with: description,
                        options: .loadInProcess
                    )
                } else {
                    throw error
                }
                #else
                throw error
                #endif
            }
            
            self.avAudioUnit = audioUnit
            
            self.connect(avAudioUnit: audioUnit)
            
            return await audioUnit.loadAudioUnitViewController()
        } catch {
			let message = "Failed to instantiate AVAudioUnit: \(error.localizedDescription)"
			print("[SimplePlayEngine] \(message)")
			lastInitErrorMessage = message
            return nil
        }
    }
    
    private func setPlayerFile(_ fileURL: URL) {
        do {
            let file = try AVAudioFile(forReading: fileURL)
            self.file = file
            engine.connect(player, to: engine.mainMixerNode, format: file.processingFormat)
        } catch {
            os_log(.error, log: speLog, "Could not create AVAudioFile instance: %@", error.localizedDescription)
        }
    }
    
    private func setSessionActive(_ active: Bool) {
#if os(iOS) || os(visionOS)
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default)
            try session.setActive(active)
        } catch {
            os_log(.error, log: speLog, "Could not set Audio Session active: %@", error.localizedDescription)
        }
#endif
    }
    
    // MARK: Playback State
    
    public func startPlaying() {
        stateChangeQueue.sync {
            self.cancelFadeOutLocked()
            if !self.isPlaying { self.startPlayingInternal() }
        }
    }
    
    public func stopPlaying() {
        stateChangeQueue.sync {
            self.cancelFadeOutLocked()
            if self.isPlaying { self.stopPlayingInternal() }
        }
    }

    public func cancelPendingFadeOut() {
        stateChangeQueue.sync {
            self.cancelFadeOutLocked()
        }
    }

    public func fadeOutAndStop(duration: TimeInterval = 0.25) {
        stateChangeQueue.sync {
            guard self.isPlaying else { return }
            self.fadeOutGeneration += 1
            let generation = self.fadeOutGeneration
            let initialVolume = max(0, self.engine.mainMixerNode.outputVolume)
            let clampedDuration = max(0, duration)
            guard clampedDuration > 0, initialVolume > 0 else {
                self.stopPlayingInternal()
                self.engine.mainMixerNode.outputVolume = self.normalOutputVolume
                return
            }

            let steps = 12
            let interval = clampedDuration / Double(steps)
            for step in 1...steps {
                DispatchQueue.main.asyncAfter(deadline: .now() + interval * Double(step)) { [weak self] in
                    Task { @MainActor in
                        self?.applyFadeOutStep(
                            generation: generation,
                            step: step,
                            steps: steps,
                            initialVolume: initialVolume
                        )
                    }
                }
            }
        }
    }
    
    public func togglePlay() -> Bool {
        if isPlaying {
            stopPlaying()
        } else {
            startPlaying()
        }
        return isPlaying
    }
    
    private func startPlayingInternal() {
        guard let avAudioUnit = self.avAudioUnit else {
            return
        }
        
        // assumptions: we are protected by stateChangeQueue. we are not playing.
        setSessionActive(true)
        engine.mainMixerNode.outputVolume = normalOutputVolume
        
        if avAudioUnit.wantsAudioInput {
            // Schedule buffers on the player.
            scheduleEffectLoop()
        }
        
        let hardwareFormat = engine.outputNode.outputFormat(forBus: 0)
        engine.connect(engine.mainMixerNode, to: engine.outputNode, format: hardwareFormat)
        
        // Start the engine.
        do {
            try engine.start()
        } catch {
            isPlaying = false
            os_log(.error, log: speLog, "Could not start engine: %@", error.localizedDescription)
        }
        
        if avAudioUnit.wantsAudioInput {
            // Start the player.
            player.play()
        }
        
        isPlaying = true
    }
    
    private func stopPlayingInternal() {
        guard let avAudioUnit = self.avAudioUnit else {
            return
        }
        
        if avAudioUnit.wantsAudioInput {
            player.stop()
        }
        engine.stop()
        isPlaying = false
        setSessionActive(false)
        engine.mainMixerNode.outputVolume = normalOutputVolume
    }

    private func cancelFadeOutLocked() {
        fadeOutGeneration += 1
        engine.mainMixerNode.outputVolume = normalOutputVolume
    }

    private func applyFadeOutStep(
        generation: Int,
        step: Int,
        steps: Int,
        initialVolume: Float
    ) {
        stateChangeQueue.sync {
            guard generation == self.fadeOutGeneration, self.isPlaying else { return }
            let remaining = max(0, Float(steps - step) / Float(steps))
            self.engine.mainMixerNode.outputVolume = initialVolume * remaining
            if step == steps {
                self.stopPlayingInternal()
            }
        }
    }
    
    private func scheduleEffectLoop() {
        guard let file = file else {
            os_log(.error, log: speLog, "`file` must not be nil in scheduleEffectLoop")
            return
        }
        
        Task {
            await player.scheduleFile(file, at: nil)
            if self.isPlaying {
                self.scheduleEffectLoop()
            }
        }
    }
    
    private func resetAudioLoop() {
        guard let avAudioUnit = self.avAudioUnit else {
            return
        }
        
        if avAudioUnit.wantsAudioInput {
            // Connect player -> mixer.
            guard let format = file?.processingFormat else {
                os_log(.error, log: speLog, "No AVAudioFile defined (processing format unavailable)")
                return
            }
            engine.connect(player, to: engine.mainMixerNode, format: format)
        }
    }
    
    public func reset() {
        connect(avAudioUnit: nil)
    }
    
    public func connect(avAudioUnit: AVAudioUnit?, completion: @escaping (() -> Void) = {}) {
        guard let avAudioUnit = self.avAudioUnit else {
            return
        }
        
        // Break the audio unit -> mixer connection
        engine.disconnectNodeInput(engine.mainMixerNode)
        
        resetAudioLoop()
        
        // We're done with the unit; release all references.
        engine.detach(avAudioUnit)
        
        // Internal function to resume playing and call the completion handler.
        func rewiringComplete() {
            scheduleMIDIEventListBlock = auAudioUnit.scheduleMIDIEventListBlock
            if isPlaying {
                player.play()
            }
            completion()
        }
        
        let hardwareFormat = engine.outputNode.outputFormat(forBus: 0)
        
        // Connect the main mixer -> output node
        engine.connect(engine.mainMixerNode, to: engine.outputNode, format: hardwareFormat)
        
        // Pause the player before re-wiring it. It is not simple to keep it playing across an insertion or deletion.
        if isPlaying {
            player.pause()
        }
        
        let auAudioUnit = avAudioUnit.auAudioUnit
        
        if !auAudioUnit.midiOutputNames.isEmpty {
            auAudioUnit.midiOutputEventBlock = midiOutBlock
        }
        
        // Attach the AVAudioUnit the graph.
        engine.attach(avAudioUnit)
        
        if avAudioUnit.wantsAudioInput {
            // Disconnect the player -> mixer.
            engine.disconnectNodeInput(engine.mainMixerNode)
            
            // Connect the player -> effect -> mixer.
            if let format = file?.processingFormat {
                engine.connect(player, to: avAudioUnit, format: format)
                engine.connect(avAudioUnit, to: engine.mainMixerNode, format: format)
            }
        } else {
            let stereoFormat = AVAudioFormat(standardFormatWithSampleRate: hardwareFormat.sampleRate, channels: 2)
            engine.connect(avAudioUnit, to: engine.mainMixerNode, format: stereoFormat)
        }
        rewiringComplete()
    }
}
