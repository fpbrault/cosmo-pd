//
//  CosmoPD101AUv3Ext_macOSExtensionAudioUnit.swift
//  CosmoPD101AUv3Ext-macOSExtension
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import AVFoundation

public class CosmoPD101AUv3Ext_macOSExtensionAudioUnit: AUAudioUnit, @unchecked Sendable
{
	// C++ Objects
	var kernel = CosmoPD101AUv3Ext_macOSExtensionDSPKernel()
    var processHelper: AUProcessHelper?

	private var outputBus: AUAudioUnitBus?
	private var _outputBusses: AUAudioUnitBusArray!

	private var format:AVAudioFormat

	@objc override init(componentDescription: AudioComponentDescription, options: AudioComponentInstantiationOptions) throws {
		self.format = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 2)!
		try super.init(componentDescription: componentDescription, options: options)
		outputBus = try AUAudioUnitBus(format: self.format)
        outputBus?.maximumChannelCount = 2
		_outputBusses = AUAudioUnitBusArray(audioUnit: self, busType: AUAudioUnitBusType.output, busses: [outputBus!])
        processHelper = AUProcessHelper(&kernel)
	}

	public override var outputBusses: AUAudioUnitBusArray {
		return _outputBusses
	}
    
    public override var  maximumFramesToRender: AUAudioFrameCount {
        get {
            return kernel.maximumFramesToRender()
        }

        set {
            kernel.setMaximumFramesToRender(newValue)
        }
    }

    public override var  shouldBypassEffect: Bool {
        get {
            return kernel.isBypassed()
        }

        set {
            kernel.setBypass(newValue)
        }
    }

    // MARK: - MIDI
    public override var audioUnitMIDIProtocol: MIDIProtocolID {
        return kernel.AudioUnitMIDIProtocol()
    }

    // MARK: - Rendering
    public override var internalRenderBlock: AUInternalRenderBlock {
        return processHelper!.internalRenderBlock()
    }

    // Allocate resources required to render.
    // Subclassers should call the superclass implementation.
    public override func allocateRenderResources() throws {
		let outputChannelCount = self.outputBusses[0].format.channelCount
		
		kernel.setMusicalContextBlock(self.musicalContextBlock)
		kernel.initialize(Int32(outputChannelCount), outputBus!.format.sampleRate)

        processHelper?.setChannelCount(0, self.outputBusses[0].format.channelCount)

		try super.allocateRenderResources()
	}

    // Deallocate resources allocated in allocateRenderResourcesAndReturnError:
    // Subclassers should call the superclass implementation.
    public override func deallocateRenderResources() {
        
        // Deallocate your resources.
        kernel.deInitialize()
        
        super.deallocateRenderResources()
    }

	public func setupParameterTree(_ parameterTree: AUParameterTree) {
		self.parameterTree = parameterTree

		// Set the Parameter default values before setting up the parameter callbacks
		for param in parameterTree.allParameters {
            kernel.setParameter(param.address, param.value)
		}

		setupParameterCallbacks()
	}

	private func setupParameterCallbacks() {
		// implementorValueObserver is called when a parameter changes value.
		parameterTree?.implementorValueObserver = { [weak self] param, value -> Void in
            self?.kernel.setParameter(param.address, value)
		}

		// implementorValueProvider is called when the value needs to be refreshed.
		parameterTree?.implementorValueProvider = { [weak self] param in
            return self!.kernel.getParameter(param.address)
		}

		// A function to provide string representations of parameter values.
		parameterTree?.implementorStringFromValueCallback = { param, valuePtr in
			guard let value = valuePtr?.pointee else {
				return "-"
			}
			return NSString.localizedStringWithFormat("%.f", value) as String
		}
	}

	// MARK: - Bridge Event Handling
	public func handleBridgeEvent(type: String, payload: [String: Any]) {
		switch type {
		case "noteOn":
			let note = Self.intValue(payload["note"], default: 60)
			let frequency = Self.doubleValue(payload["frequency"], default: kernel.MIDINoteToFrequency(Int32(note)))
			let velocity = Self.doubleValue(payload["velocity"], default: 0.8)
			kernel.noteOn(Int32(note), frequency, velocity)
		case "noteOff":
			let note = Self.intValue(payload["note"], default: 60)
			kernel.noteOff(Int32(note))
		case "sustain":
			let on = Self.boolValue(payload["on"], default: false)
			kernel.setSustain(on)
		case "panic":
			kernel.panic()
		default:
			break
		}
	}

	private static func intValue(_ raw: Any?, default defaultValue: Int) -> Int {
		if let value = raw as? Int { return value }
		if let value = raw as? Double { return Int(value) }
		if let value = raw as? NSNumber { return value.intValue }
		return defaultValue
	}

	private static func doubleValue(_ raw: Any?, default defaultValue: Double) -> Double {
		if let value = raw as? Double { return value }
		if let value = raw as? Float { return Double(value) }
		if let value = raw as? Int { return Double(value) }
		if let value = raw as? NSNumber { return value.doubleValue }
		return defaultValue
	}

	private static func boolValue(_ raw: Any?, default defaultValue: Bool) -> Bool {
		if let value = raw as? Bool { return value }
		if let value = raw as? NSNumber { return value.boolValue }
		return defaultValue
	}
}
