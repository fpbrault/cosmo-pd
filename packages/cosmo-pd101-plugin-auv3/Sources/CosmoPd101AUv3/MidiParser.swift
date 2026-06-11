import Foundation

public struct ParsedMidiEvent: Equatable {
	public let status: UInt8
	public let data1: UInt8
	public let data2: UInt8

	public init(status: UInt8, data1: UInt8, data2: UInt8) {
		self.status = status
		self.data1 = data1
		self.data2 = data2
	}
}

public struct MidiParser {

	public init() {}

	public func parseUniversalMidiPacket(_ word: UInt32) -> ParsedMidiEvent? {
		let messageType = (word >> 28) & 0xF
		guard messageType == 0x2 else { return nil }
		let status = UInt8((word >> 16) & 0xFF)
		let data1 = UInt8((word >> 8) & 0x7F)
		let data2 = UInt8(word & 0x7F)
		return ParsedMidiEvent(status: status, data1: data1, data2: data2)
	}

	public func parseMidiStatusByte(status: UInt8, data1: UInt8, data2: UInt8) -> MidiAction {
		let message = status & 0xF0
		switch message {
		case 0x80:
			return .noteOff(note: data1)
		case 0x90:
			let velocity = Float(data2) / 127.0
			if velocity <= 0.0001 {
				return .noteOff(note: data1)
			}
			return .noteOn(note: data1, velocity: velocity)
		case 0xB0:
			return parseControlChange(cc: data1, value: data2)
		case 0xD0:
			return .aftertouch(Float(data1) / 127.0)
		case 0xA0:
			return .polyAftertouch(note: data1, value: Float(data2) / 127.0)
		case 0xE0:
			let raw = Int(data1) | (Int(data2) << 7)
			let normalized = (Float(raw) - 8192.0) / 8192.0
			return .pitchBend(normalized)
		default:
			return .none
		}
	}

	public func parseControlChange(cc: UInt8, value: UInt8) -> MidiAction {
		let normalized = Float(value) / 127.0
		switch cc {
		case 1: return .modWheel(normalized)
		case 64: return .sustain(normalized >= 0.5)
		case 120, 123: return .allNotesOff
		default: return .none
		}
	}
}

public enum MidiAction: Equatable {
	case noteOn(note: UInt8, velocity: Float)
	case noteOff(note: UInt8)
	case sustain(Bool)
	case pitchBend(Float)
	case modWheel(Float)
	case aftertouch(Float)
	case polyAftertouch(note: UInt8, value: Float)
	case allNotesOff
	case none
}
