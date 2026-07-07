//
//  AudioUnitHostModel.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI
import CoreMIDI
import AudioToolbox
import AVFAudio
import Combine

private enum StandaloneHostSettings {
    static let groupId = "group.ca.purraudio.CosmoPD101Host"
    static let keepRunningInBackgroundKey = "com.cosmo.pd101.standalone.keepRunningInBackground"
    static let defaultKeepRunningInBackground = false

    private static var defaults: UserDefaults {
        UserDefaults(suiteName: groupId) ?? .standard
    }

    static var keepRunningInBackground: Bool {
        defaults.object(forKey: keepRunningInBackgroundKey) as? Bool ?? defaultKeepRunningInBackground
    }
}

@MainActor
class AudioUnitHostModel: ObservableObject {
    /// The playback engine used to play audio.
    private let playEngine = SimplePlayEngine()

    /// The model providing information about the current Audio Unit
    @Published var viewModel = AudioUnitViewModel()

    var isPlaying: Bool { playEngine.isPlaying }
    
    @Published var audioUnitCrashed = false

    /// Audio Component Description
    let type: String
    let subType: String
    let manufacturer: String

    let wantsAudio: Bool
    let wantsMIDI: Bool
    let isFreeRunning: Bool

    let auValString: String

    private var suspendedForBackground = false
    
    private let instanceInvalidationNotifcation = Notification.Name(String(kAudioComponentInstanceInvalidationNotification))

    @Published var validationResult: AudioComponentValidationResult?
    @Published var currentValidationData: String?
    
    init(type: String = "aumu", subType: String = "Cpd3", manufacturer: String = "PurA") {
        self.type = type
        self.subType = subType
        self.manufacturer = manufacturer
        let wantsAudio = type.fourCharCode == kAudioUnitType_MusicEffect || type.fourCharCode == kAudioUnitType_Effect
        self.wantsAudio = wantsAudio

        let wantsMIDI = type.fourCharCode == kAudioUnitType_MIDIProcessor ||
        type.fourCharCode == kAudioUnitType_MusicDevice ||
        type.fourCharCode == kAudioUnitType_MusicEffect
        self.wantsMIDI = wantsMIDI

        let isFreeRunning = type.fourCharCode == kAudioUnitType_MIDIProcessor ||
        type.fourCharCode == kAudioUnitType_MusicDevice ||
        type.fourCharCode == kAudioUnitType_Generator
        self.isFreeRunning = isFreeRunning

        auValString = "\(type) \(subType) \(manufacturer)"

        setupNotifications()
        loadAudioUnit()
    }

    private func loadAudioUnit() {
        Task {
            self.audioUnitCrashed = false
            self.validationResult = nil
            self.currentValidationData = nil
            let viewController = await playEngine.initComponent(type: type, subType: subType, manufacturer: manufacturer)

#if DEBUG
            // Validation can invalidate/reload AU instances in debug builds.
            // Keep this opt-in to avoid disrupting normal host startup.
            let shouldRunValidation = ProcessInfo.processInfo.environment["COSMO_RUN_AU_VALIDATION"] == "1"
            if shouldRunValidation, let audioUnit = playEngine.avAudioUnit {
                Task { @MainActor in
                    let (validationResult, validationData) = await validateAU(audioUnit: audioUnit)
                    self.validationResult = validationResult
                    self.currentValidationData = validationData
                }
            }
#endif

            let statusMessage: String
            if viewController != nil {
                statusMessage = "Loaded AU view (\(self.auValString))"
            } else {
				statusMessage = playEngine.lastInitErrorMessage
					?? "AU loaded, but no custom view controller returned (\(self.auValString))"
            }

            self.viewModel = AudioUnitViewModel(showAudioControls: self.wantsAudio,
                                                showMIDIContols: self.wantsMIDI,
                                                title: self.auValString,
                                                message: statusMessage,
                                                viewController: viewController)
                
                if self.isFreeRunning {
                    self.playEngine.startPlaying()
            }
        }
    }
    
    private func setupNotifications() {
        let notificationName = Notification.Name(instanceInvalidationNotifcation.rawValue)
        NotificationCenter.default.addObserver(forName: notificationName, object: nil, queue: nil) { [weak self] notification in
            // Extract non-Sendable data outside of the @Sendable Task closure
            let invalidatedObject = notification.object
			guard let hostModel = self else { return }

            Task { @MainActor in
                let currentAudioUnit = hostModel.playEngine.avAudioUnit?.auAudioUnit
                guard currentAudioUnit != nil else { return }

                guard let invalidatedAudioUnit = invalidatedObject as? AUAudioUnit else {
                    NSLog("[AUHostModel] AU invalidation notification with unexpected object type=%@", String(describing: Swift.type(of: invalidatedObject as Any)))
                    hostModel.handleAudioUnitInvalidation(reason: "unexpected invalidation object")
                    return
                }

                let isCurrentInstance = invalidatedAudioUnit === currentAudioUnit
                let hasMatchingDescription: Bool = {
                    guard let currentDescription = currentAudioUnit?.componentDescription else {
                        return false
                    }
                    let invalidatedDescription = invalidatedAudioUnit.componentDescription
                    return currentDescription.componentType == invalidatedDescription.componentType
                        && currentDescription.componentSubType == invalidatedDescription.componentSubType
                        && currentDescription.componentManufacturer == invalidatedDescription.componentManufacturer
                }()
                if isCurrentInstance || hasMatchingDescription {
                    NSLog("[AUHostModel] AU invalidated (instance=%@ descMatch=%@)", isCurrentInstance ? "yes" : "no", hasMatchingDescription ? "yes" : "no")
                    hostModel.handleAudioUnitInvalidation(reason: "current AU invalidated")
                }
            }
        }
    }

    private func handleAudioUnitInvalidation(reason: String) {
        NSLog("[AUHostModel] Recovering silently after AU invalidation: %@", reason)
        viewModel.viewController = nil
        viewModel.message = ""
        validationResult = nil
        currentValidationData = nil
        audioUnitCrashed = false
        loadAudioUnit()
    }
    
    private func validateAU(audioUnit: AVAudioUnit) async -> (AudioComponentValidationResult, String) {
        await withCheckedContinuation { continuation in
            let validationParameters: [String: Any] = ["ForceValidation": true]

            AudioComponentValidateWithResults(audioUnit.auAudioUnit.component, validationParameters as CFDictionary) { @Sendable result, output in
                let formattedOutput: String

                if let validationDict = output as? [String: Any],
                   let rawOutput = validationDict["Output"] as? [String] {
                    formattedOutput = rawOutput.joined(separator: "\n")
                } else {
                    formattedOutput = "Validation probably crashed"
                }
                
                continuation.resume(returning: (result, formattedOutput))
            }
        }
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self, name: instanceInvalidationNotifcation, object: nil)
    }

    func startPlaying() {
        playEngine.startPlaying()
    }

    func stopPlaying() {
        playEngine.stopPlaying()
    }

    func handleScenePhaseChange(_ phase: ScenePhase) {
#if os(iOS) || os(visionOS)
        let keepRunningInBackground = StandaloneHostSettings.keepRunningInBackground
        let backgroundModes = (Bundle.main.object(forInfoDictionaryKey: "UIBackgroundModes") as? [String])?.joined(separator: ",") ?? "<none>"
        NSLog(
            "[AUHostModel] scenePhase=%@ keepRunningInBackground=%@ isPlaying=%@ suspendedForBackground=%@ backgroundModes=%@",
            String(describing: phase),
            keepRunningInBackground ? "yes" : "no",
            playEngine.isPlaying ? "yes" : "no",
            suspendedForBackground ? "yes" : "no",
            backgroundModes
        )
        switch phase {
        case .active:
            if suspendedForBackground {
                suspendedForBackground = false
                playEngine.startPlaying()
            } else {
                playEngine.cancelPendingFadeOut()
            }
        case .inactive:
            break
        case .background:
            guard !keepRunningInBackground else {
                suspendedForBackground = false
                playEngine.cancelPendingFadeOut()
                return
            }
            if playEngine.isPlaying {
                suspendedForBackground = true
                playEngine.fadeOutAndStop()
            }
        default:
            break
        }
#endif
    }
}
