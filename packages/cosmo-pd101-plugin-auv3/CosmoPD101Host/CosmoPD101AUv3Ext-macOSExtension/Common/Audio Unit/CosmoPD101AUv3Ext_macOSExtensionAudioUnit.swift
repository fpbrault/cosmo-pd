import AudioToolbox
import AVFoundation
import CoreAudioKit
import Foundation
import os

private let czAULog = OSLog(subsystem: "com.cosmo.pd101.auv3", category: "CzAU")

public final class CosmoPD101AUv3Ext_macOSExtensionAudioUnit: AUAudioUnit, @unchecked Sendable {
	static let maxSupportedFrameCount = 1024
	static let standaloneHostPresentationStateKey = "CosmoStandaloneHostPresentation"

	private let outputBus: AUAudioUnitBus
	private var outputBusArrayStorage: AUAudioUnitBusArray!
	private var inputBusArrayStorage: AUAudioUnitBusArray!
	private let engineLock = NSLock()
	private var engine: CosmoPd101FfiEngineRef?
	private var maxFrames: Int = 1024
	private var voiceLimit: Int = 8
	private var midiChannel: Int = 0
	private var parameterObserverToken: AUParameterObserverToken?
	/// Full-state JSON buffered when `fullStateForDocument` is set before `allocateRenderResources`.
	private var pendingParamsJson: String?
	private var pendingFactoryPresetIndex: Int?
	private var selectedFactoryPreset: AUAudioUnitPreset?
	private var savedStateJson: String?
	private(set) var isStandaloneHostPresentation = false
	private lazy var availableFactoryPresets: [AUAudioUnitPreset] = buildFactoryPresets()
	/// Called on the main thread when engine state changes from the native side (preset load, state restore).
	/// The ViewController sets this to push params and optional preset metadata to the WebView.
	var paramsChangedHandler: ((String, String?) -> Void)?

	public override var parameterTree: AUParameterTree? {
		get { internalParameterTree }
		set { internalParameterTree = newValue }
	}

	private var internalParameterTree: AUParameterTree?

	public override var outputBusses: AUAudioUnitBusArray { outputBusArrayStorage }
	public override var inputBusses: AUAudioUnitBusArray { inputBusArrayStorage }

	public override var supportsUserPresets: Bool { true }
	public override var factoryPresets: [AUAudioUnitPreset]? { availableFactoryPresets }

	public override func supportedViewConfigurations(_ availableViewConfigurations: [AUAudioUnitViewConfiguration]) -> IndexSet {
		if availableViewConfigurations.isEmpty {
			os_log(.error, log: czAULog, "[CzAU] supportedViewConfigurations: no host configurations provided")
			return IndexSet()
		}

		for config in availableViewConfigurations {
		os_log(.default, log: czAULog, "[CzAU] host view config: %.0fx%.0f hostHasController=%@", config.width, config.height, config.hostHasController ? "yes" : "no")
		}

		// Accept all host-proposed configurations; the view controller handles responsive layout.
		return IndexSet(integersIn: availableViewConfigurations.indices)
	}

	public override func select(_ viewConfiguration: AUAudioUnitViewConfiguration) {
		super.select(viewConfiguration)
		os_log(.default, log: czAULog, "[CzAU] selected view config: %.0fx%.0f hostHasController=%@", viewConfiguration.width, viewConfiguration.height, viewConfiguration.hostHasController ? "yes" : "no")
	}

	public override var currentPreset: AUAudioUnitPreset? {
		get { selectedFactoryPreset ?? super.currentPreset }
		set {
			guard let preset = newValue else {
				selectedFactoryPreset = nil
				super.currentPreset = nil
				return
			}

			if preset.number >= 0 {
				let index = Int(preset.number)
				let normalized = availableFactoryPresets.first(where: { $0.number == preset.number }) ?? preset
				selectedFactoryPreset = normalized
				super.currentPreset = normalized
				if hasAllocatedEngine {
					if !applyFactoryPreset(index: index) {
						os_log(.error, log: czAULog, "[CzAU] currentPreset set failed: index=%d", index)
					}
				} else {
					pendingFactoryPresetIndex = index
					os_log(.default, log: czAULog, "[CzAU] currentPreset deferred: engine nil index=%d", index)
				}
				return
			}

			selectedFactoryPreset = nil
			super.currentPreset = preset
		}
	}

	public override var fullStateForDocument: [String: Any]? {
		get {
			var state = super.fullStateForDocument ?? [:]
			if isStandaloneHostPresentation {
				state[Self.standaloneHostPresentationStateKey] = true
			}
			if let json = paramsJson() ?? savedStateJson {
				state["CzParamsJson"] = json
			}
			return state
		}
		set {
			super.fullStateForDocument = newValue
			isStandaloneHostPresentation =
				newValue?[Self.standaloneHostPresentationStateKey] as? Bool ?? false
			if let json = newValue?["CzParamsJson"] as? String {
				if hasAllocatedEngine {
					os_log(.default, log: czAULog, "[CzAU] fullStateForDocument set: applying json len=%d", json.count)
					_ = setParamsJson(json, notifyWebView: true, isRaw: true)
				} else {
					os_log(.default, log: czAULog, "[CzAU] fullStateForDocument set: engine nil, buffering len=%d", json.count)
					pendingParamsJson = json
					savedStateJson = json
				}
			}
		}
	}

	public override init(componentDescription: AudioComponentDescription, options: AudioComponentInstantiationOptions = []) throws {
		let groupId = "group.ca.purraudio.CosmoPD101Host"
		let containerLookupStart = CFAbsoluteTimeGetCurrent()
		os_log(.default, log: czAULog, "[CzAU] resolving app group container: %@", groupId)
		if let containerURL = FileManager.default.containerURL(
			forSecurityApplicationGroupIdentifier: groupId
		) {
			let elapsedMs = (CFAbsoluteTimeGetCurrent() - containerLookupStart) * 1000
			os_log(.default, log: czAULog, "[CzAU] app group container resolved in %.1f ms: %@", elapsedMs, containerURL.path)
			setenv("COSMO_PD101_DATA_DIR", containerURL.path, 1)
		} else {
			let elapsedMs = (CFAbsoluteTimeGetCurrent() - containerLookupStart) * 1000
			os_log(.error, log: czAULog, "[CzAU] app group container unavailable after %.1f ms: %@", elapsedMs, groupId)
		}

		let defaultSampleRate: Double = 48_000
		let format = AVAudioFormat(standardFormatWithSampleRate: defaultSampleRate, channels: 2)!
		outputBus = try AUAudioUnitBus(format: format)
		try super.init(componentDescription: componentDescription, options: options)
		maximumFramesToRender = AUAudioFrameCount(Self.maxSupportedFrameCount)
		outputBusArrayStorage = AUAudioUnitBusArray(audioUnit: self, busType: .output, busses: [outputBus])
		inputBusArrayStorage = AUAudioUnitBusArray(audioUnit: self, busType: .input, busses: [])

		internalParameterTree = makeCosmoParameterTree()
		parameterObserverToken = internalParameterTree?.token(byAddingParameterObserver: { [weak self] address, value in
			self?.setParameter(address: address, value: value)
		})
	}

	deinit {
		if let token = parameterObserverToken {
			internalParameterTree?.removeParameterObserver(token)
		}
		let engineToDestroy = withEngineLock {
			let engineToDestroy = engine
			engine = nil
			return engineToDestroy
		}
		cosmo_pd101_ffi_engine_destroy(engineToDestroy)
	}

	public override func allocateRenderResources() throws {
		try super.allocateRenderResources()
		maxFrames = max(Int(maximumFramesToRender), Self.maxSupportedFrameCount)
		let sampleRate = Float(outputBus.format.sampleRate)
		let createdEngine = cosmo_pd101_ffi_engine_create(sampleRate, maxFrames)
		guard createdEngine != nil else {
			throw NSError(domain: NSOSStatusErrorDomain, code: Int(kAudioUnitErr_FailedInitialization))
		}
		let oldEngine = withEngineLock {
			let oldEngine = engine
			engine = createdEngine
			return oldEngine
		}
		cosmo_pd101_ffi_engine_destroy(oldEngine)
		os_log(.default, log: czAULog, "[CzAU] allocateRenderResources: engine created sr=%.0f frames=%d pending=%@", sampleRate, maxFrames, pendingParamsJson != nil ? "yes" : "no")
		_ = applyVoiceLimit(reason: "allocateRenderResources")
		if let pending = pendingParamsJson {
			pendingParamsJson = nil
			_ = setParamsJson(pending, notifyWebView: true, isRaw: true)
		} else if let pendingIndex = pendingFactoryPresetIndex {
			pendingFactoryPresetIndex = nil
			_ = applyFactoryPreset(index: pendingIndex)
		} else if let saved = savedStateJson {
			savedStateJson = nil
			_ = setParamsJson(saved, notifyWebView: true, isRaw: true)
		} else if applyDefaultFactoryPresetIfNeeded() {
			// Applied fresh-start default factory preset.
		} else {
			syncParametersToEngine()
		}
	}

	public func setMidiChannel(_ channel: Int) {
		let nextChannel = max(0, min(channel, 16))
		guard nextChannel != withEngineLock({ midiChannel }) else { return }
		withRetainedEngine { engine in
			_ = cosmo_pd101_ffi_all_notes_off(engine)
		}
		withEngineLock {
			midiChannel = nextChannel
		}
	}

	public override func deallocateRenderResources() {
		let engineToDestroy = withEngineLock {
			let engineToDestroy = engine
			engine = nil
			return engineToDestroy
		}
		if let engineToDestroy {
			savedStateJson = paramsJsonLocked(engineToDestroy)
		}
		cosmo_pd101_ffi_engine_destroy(engineToDestroy)
		super.deallocateRenderResources()
	}

	public override func reset() {
		withRetainedEngine { engine in
			_ = cosmo_pd101_ffi_reset_audio_state(engine)
		}
	}

	@discardableResult
	public func setVoiceLimit(_ limit: Int) -> Bool {
		withEngineLock {
			voiceLimit = limit
		}
		guard hasAllocatedEngine else {
			os_log(
				.default,
				log: czAULog,
				"[CzAU] voice limit deferred requested=%d engine=NIL",
				voiceLimit
			)
			return true
		}
		return applyVoiceLimit(reason: "setVoiceLimit")
	}

	private func applyVoiceLimit(reason: String) -> Bool {
		let requestedLimit = withEngineLock { voiceLimit }
		let status = withRetainedEngine { engine in
			cosmo_pd101_ffi_set_voice_limit(engine, requestedLimit)
		} ?? CosmoPd101FfiStatus.nullPointer.rawValue
		let didApply = status == CosmoPd101FfiStatus.ok.rawValue
		os_log(
			.default,
			log: czAULog,
			"[CzAU] voice limit apply reason=%{public}@ requested=%d engine=%{public}@ status=%d",
			reason,
			requestedLimit,
			hasAllocatedEngine ? "ok" : "NIL",
			status
		)
		return didApply
	}

	public override var internalRenderBlock: AUInternalRenderBlock {
		{ [weak self] _, _, frameCount, _, outputData, realtimeEventListHead, _ in
			guard let self else {
				return kAudioUnitErr_Uninitialized
			}
			let buffers = UnsafeMutableAudioBufferListPointer(outputData)
			guard buffers.count >= 2,
				let leftData = buffers[0].mData,
				let rightData = buffers[1].mData else {
				return kAudioUnitErr_InvalidPropertyValue
			}

			let frames = Int(frameCount)
			let left = leftData.bindMemory(to: Float.self, capacity: frames)
			let right = rightData.bindMemory(to: Float.self, capacity: frames)
			guard self.engineLock.try() else {
				self.clearOutput(left: left, right: right, frames: frames)
				return noErr
			}
			guard let engine = self.engine else {
				self.engineLock.unlock()
				self.clearOutput(left: left, right: right, frames: frames)
				return noErr
			}
			cosmo_pd101_ffi_engine_retain(engine)
			self.engineLock.unlock()
			defer { cosmo_pd101_ffi_engine_destroy(engine) }

			self.consumeEvents(realtimeEventListHead, engine: engine)

			let status = cosmo_pd101_ffi_render_stereo(engine, left, right, frames)
			return status == CosmoPd101FfiStatus.ok.rawValue ? noErr : kAudioUnitErr_FailedInitialization
		}
	}

	public func setParamsJson(_ json: String, notifyWebView: Bool = false, selectedPresetName: String? = nil, isRaw: Bool = false) -> Bool {
		os_log(.default, log: czAULog, "[CzAU] setParamsJson: engine=%@ len=%d notify=%@ isRaw=%@", hasAllocatedEngine ? "ok" : "NIL", json.count, notifyWebView ? "yes" : "no", isRaw ? "yes" : "no")
		let didSet = withRetainedEngine { engine in
			let didSet = json.withCString { pointer in
				let status: Int32
				if isRaw {
					status = cosmo_pd101_ffi_set_params_json_raw(engine, pointer)
				} else {
					status = cosmo_pd101_ffi_set_params_json(engine, pointer)
				}
				return status == CosmoPd101FfiStatus.ok.rawValue
			}
			if didSet {
				syncParameterTreeFromEngineLocked(engine)
			}
			return didSet
		} ?? false
		os_log(.default, log: czAULog, "[CzAU] setParamsJson: didSet=%@", didSet ? "true" : "false")
		guard didSet else { return false }
		if notifyWebView {
			paramsChangedHandler?(json, selectedPresetName)
		}
		return true
	}

	private var hasAllocatedEngine: Bool {
		withEngineLock { engine != nil }
	}

	private func withEngineLock<T>(_ body: () -> T) -> T {
		engineLock.lock()
		defer { engineLock.unlock() }
		return body()
	}

	@discardableResult
	private func withRetainedEngine<T>(_ body: (CosmoPd101FfiEngineRef) -> T) -> T? {
		guard let retainedEngine = withEngineLock({ () -> CosmoPd101FfiEngineRef? in
			guard let engine else { return nil }
			cosmo_pd101_ffi_engine_retain(engine)
			return engine
		}) else {
			return nil
		}
		defer { cosmo_pd101_ffi_engine_destroy(retainedEngine) }
		return body(retainedEngine)
	}

	private func clearOutput(left: UnsafeMutablePointer<Float>, right: UnsafeMutablePointer<Float>, frames: Int) {
		for index in 0..<frames {
			left[index] = 0
			right[index] = 0
		}
	}

	private func ffiString(engine: CosmoPd101FfiEngineRef, call: (CosmoPd101FfiEngineRef, UnsafeMutablePointer<UInt8>?, Int) -> Int) -> String? {
		let required = call(engine, nil, 0)
		guard required > 0 else { return nil }
		var bytes = [UInt8](repeating: 0, count: required)
		let written = bytes.withUnsafeMutableBufferPointer { buffer in
			call(engine, buffer.baseAddress, buffer.count)
		}
		guard written == required else { return nil }
		return String(bytes: bytes, encoding: .utf8)
	}

	private func paramsJsonLocked(_ engine: CosmoPd101FfiEngineRef) -> String? {
		ffiString(engine: engine, call: cosmo_pd101_ffi_get_params_json)
	}

	public func paramsJson() -> String? {
		withRetainedEngine { engine in
			paramsJsonLocked(engine)
		} ?? nil
	}

	public func runtimeVoiceStatesJson() -> String? {
		withRetainedEngine { engine in
			ffiString(engine: engine, call: cosmo_pd101_ffi_get_runtime_voice_states_json)
		} ?? nil
	}

	public func runtimeModSourcesJson() -> String? {
		withRetainedEngine { engine in
			ffiString(engine: engine, call: cosmo_pd101_ffi_get_runtime_mod_sources_json)
		} ?? nil
	}

	public func setPerformanceMonitorEnabled(_ enabled: Bool) {
		_ = withRetainedEngine { engine in
			cosmo_pd101_ffi_set_performance_monitor_enabled(engine, enabled)
		}
	}

	public func performanceMetricsJson() -> String? {
		withRetainedEngine { engine in
			ffiString(engine: engine, call: cosmo_pd101_ffi_get_performance_metrics_json)
		} ?? nil
	}

	public func scopeData() -> (samples: [Float], sampleRate: Float, hz: Float) {
		withRetainedEngine { engine in
			var sampleRate: Float = 0
			var hz: Float = 0
			let required = cosmo_pd101_ffi_copy_scope_f32(engine, nil, 0, &sampleRate, &hz)
			guard required > 0 else { return ([], Float(outputBus.format.sampleRate), 0) }
			// Keep a bounded window for normal notes, but grow it when the true
			// period needs more history for phase locking. This retains the old
			// AUv3 fast path while avoiding the low-note cutoff caused by fixed
			// 512/1024-sample truncation.
			let period = sampleRate / max(hz, 1)
			let lockHistory = Int(ceil(period * 2.5))
			let maxScopeSamples = min(required, max(512, min(4096, lockHistory)))
			var samples = [Float](repeating: 0, count: maxScopeSamples)
			let copied = samples.withUnsafeMutableBufferPointer { buffer in
				cosmo_pd101_ffi_copy_scope_f32_tail(engine, buffer.baseAddress, buffer.count, &sampleRate, &hz)
			}
			if copied < samples.count {
				samples.removeSubrange(copied..<samples.count)
			}
			for index in samples.indices {
				let sample = samples[index]
				samples[index] = sample.isFinite ? min(1, max(-1, sample)) : 0
			}
			return (samples, sampleRate, hz)
		} ?? ([], Float(outputBus.format.sampleRate), 0)
	}

	public func handleEngineEvent(type: String, payload: [String: Any]) {
		withRetainedEngine { engine in
			handleEngineEvent(type: type, payload: payload, engine: engine)
		}
	}

	private func handleEngineEvent(type: String, payload: [String: Any], engine: CosmoPd101FfiEngineRef) {
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
		case "polyAftertouch":
			let note = UInt8(clamping: payload["note"] as? Int ?? 60)
			_ = cosmo_pd101_ffi_set_poly_aftertouch(
				engine,
				note,
				Float(payload["value"] as? Double ?? 0)
			)
		case "panic":
			_ = cosmo_pd101_ffi_all_notes_off(engine)
		default:
			break
		}
	}

	private func buildFactoryPresets() -> [AUAudioUnitPreset] {
		let count = max(0, cosmo_pd101_ffi_get_factory_preset_count())
		guard count > 0 else { return [] }

		var presets: [AUAudioUnitPreset] = []
		presets.reserveCapacity(count)
		for index in 0..<count {
			let preset = AUAudioUnitPreset()
			preset.number = index
			preset.name = factoryPresetName(index: index) ?? "Preset \(index + 1)"
			presets.append(preset)
		}
		return presets
	}

	private func factoryPresetName(index: Int) -> String? {
		let required = cosmo_pd101_ffi_get_factory_preset_name(index, nil, 0)
		guard required > 0 else { return nil }
		var bytes = [UInt8](repeating: 0, count: required)
		let written = bytes.withUnsafeMutableBufferPointer { buffer in
			cosmo_pd101_ffi_get_factory_preset_name(index, buffer.baseAddress, buffer.count)
		}
		guard written == required else { return nil }
		return String(bytes: bytes, encoding: .utf8)
	}

	private func factoryPresetParamsJson(index: Int) -> String? {
		let required = cosmo_pd101_ffi_get_factory_preset_params_json(index, nil, 0)
		guard required > 0 else { return nil }
		var bytes = [UInt8](repeating: 0, count: required)
		let written = bytes.withUnsafeMutableBufferPointer { buffer in
			cosmo_pd101_ffi_get_factory_preset_params_json(index, buffer.baseAddress, buffer.count)
		}
		guard written == required else { return nil }
		return String(bytes: bytes, encoding: .utf8)
	}

	private func applyFactoryPreset(index: Int) -> Bool {
		guard let json = factoryPresetParamsJson(index: index) else {
			os_log(.error, log: czAULog, "[CzAU] applyFactoryPreset missing JSON: index=%d", index)
			return false
		}
		NSLog("[CzAU] applyFactoryPreset index=%d", index)
		let presetName = availableFactoryPresets.first(where: { Int($0.number) == index })?.name
		return setParamsJson(json, notifyWebView: true, selectedPresetName: presetName)
	}

	/// Selects and applies the first factory preset on fresh startup when no
	/// document state or host-selected preset is pending. Returns `true` if a
	/// preset was applied, `false` if none was available or already selected.
	private func applyDefaultFactoryPresetIfNeeded() -> Bool {
		guard selectedFactoryPreset == nil, !availableFactoryPresets.isEmpty else {
			return false
		}
		let firstPreset = availableFactoryPresets[0]
		selectedFactoryPreset = firstPreset
		super.currentPreset = firstPreset
		return applyFactoryPreset(index: Int(firstPreset.number))
	}

	private func syncParametersToEngine() {
		for parameter in internalParameterTree?.allParameters ?? [] {
			setParameter(address: parameter.address, value: parameter.value)
		}
	}

	private func setParameter(address: AUParameterAddress, value: AUValue) {
		withRetainedEngine { engine in
			_ = cosmo_pd101_ffi_set_parameter_value(engine, UInt32(address), Float(value))
		}
	}

	private func syncParameterTreeFromEngineLocked(_ engine: CosmoPd101FfiEngineRef) {
		for parameter in internalParameterTree?.allParameters ?? [] {
			var value: Float = parameter.value
			let status = cosmo_pd101_ffi_get_parameter_value(engine, UInt32(parameter.address), &value)
			if status == CosmoPd101FfiStatus.ok.rawValue {
				// Use our own observer token as originator to suppress re-entrant setParameter callbacks
				parameter.setValue(value, originator: parameterObserverToken)
			}
		}
	}

	private func consumeEvents(_ eventList: UnsafePointer<AURenderEvent>?, engine: CosmoPd101FfiEngineRef) {
		var current = eventList
		while let event = current {
			switch renderEventType(event) {
			case 8:
				consumeLegacyMidiEvent(event, engine: engine)
			case 10:
				consumeMidiEventList(event, engine: engine)
			default:
				break
			}
			current = event.pointee.head.next.map { UnsafePointer($0) }
		}
	}

	private func renderEventType(_ event: UnsafePointer<AURenderEvent>) -> UInt8 {
		event.pointee.head.eventType.rawValue
	}

	private func consumeLegacyMidiEvent(_ event: UnsafePointer<AURenderEvent>, engine: CosmoPd101FfiEngineRef) {
		let midiEvent = event.pointee.MIDI
		let length = min(Int(midiEvent.length), 3)
		guard length >= 1 else { return }
		handleMidi(
			status: midiEvent.data.0,
			data1: length >= 2 ? midiEvent.data.1 : 0,
			data2: length >= 3 ? midiEvent.data.2 : 0,
			engine: engine
		)
	}

	private func consumeMidiEventList(_ event: UnsafePointer<AURenderEvent>, engine: CosmoPd101FfiEngineRef) {
		let eventListOffset = MemoryLayout<AUMIDIEventList>.offset(of: \AUMIDIEventList.eventList) ?? 20
		let packetOffset = MemoryLayout<MIDIEventList>.offset(of: \MIDIEventList.packet) ?? 8
		let eventListPointer = UnsafeRawPointer(event)
			.advanced(by: eventListOffset)
			.assumingMemoryBound(to: MIDIEventList.self)
		let eventList = eventListPointer.pointee
		let packetCount = min(Int(eventList.numPackets), 128)
		var packetPointer = UnsafeMutableRawPointer(
			mutating: UnsafeRawPointer(eventListPointer).advanced(by: packetOffset)
		).assumingMemoryBound(to: MIDIEventPacket.self)

		for _ in 0..<packetCount {
			let packet = packetPointer.pointee
			let wordCount = min(Int(packet.wordCount), 64)
			withUnsafePointer(to: packet.words) { wordsPointer in
				let words = UnsafeRawPointer(wordsPointer).assumingMemoryBound(to: UInt32.self)
				for wordIndex in 0..<wordCount {
					handleUniversalMidiPacket(words[wordIndex], engine: engine)
				}
			}
			packetPointer = MIDIEventPacketNext(packetPointer)
		}
	}

	private func handleUniversalMidiPacket(_ word: UInt32, engine: CosmoPd101FfiEngineRef) {
		let messageType = (word >> 28) & 0xF
		guard messageType == 0x2 else {
			return
		}

		let status = UInt8((word >> 16) & 0xFF)
		let data1 = UInt8((word >> 8) & 0x7F)
		let data2 = UInt8(word & 0x7F)
		handleMidi(status: status, data1: data1, data2: data2, engine: engine)
	}

	private func handleMidi(status: UInt8, data1: UInt8, data2: UInt8, engine: CosmoPd101FfiEngineRef) {
		let message = status & 0xF0
		let channel = Int(status & 0x0F) + 1
		if midiChannel != 0 && channel != midiChannel {
			return
		}
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
			handleControlChange(cc: data1, value: data2, engine: engine)
		case 0xD0:
			_ = cosmo_pd101_ffi_set_aftertouch(engine, Float(data1) / 127.0)
		case 0xA0:
			_ = cosmo_pd101_ffi_set_poly_aftertouch(engine, data1, Float(data2) / 127.0)
		case 0xE0:
			let raw = Int(data1) | (Int(data2) << 7)
			let normalized = (Float(raw) - 8192.0) / 8192.0
			_ = cosmo_pd101_ffi_set_pitch_bend(engine, normalized)
		default:
			break
		}
	}

	private func handleControlChange(cc: UInt8, value: UInt8, engine: CosmoPd101FfiEngineRef) {
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
