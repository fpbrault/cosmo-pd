import Testing
@testable import CosmoPd101AUv3

@Test func noteOnParse() {
	let parser = MidiParser()
	let result = parser.parseMidiStatusByte(status: 0x90, data1: 60, data2: 100)
	if case let .noteOn(note, velocity) = result {
		#expect(note == 60)
		#expect(abs(velocity - 100.0 / 127.0) < 0.001)
	} else {
		Issue.record("Expected noteOn, got \(result)")
	}
}

@Test func noteOnZeroVelocityIsNoteOff() {
	let parser = MidiParser()
	let result = parser.parseMidiStatusByte(status: 0x90, data1: 60, data2: 0)
	#expect(result == .noteOff(note: 60))
}

@Test func noteOff() {
	let parser = MidiParser()
	let result = parser.parseMidiStatusByte(status: 0x80, data1: 60, data2: 127)
	#expect(result == .noteOff(note: 60))
}

@Test func pitchBend() {
	let parser = MidiParser()
	let center = parser.parseMidiStatusByte(status: 0xE0, data1: 0, data2: 64)
	#expect(center == .pitchBend(0))
	// Full up: data1=127, data2=127 → raw=16383 → (16383-8192)/8192 ≈ 0.9999
	let fullUp = parser.parseMidiStatusByte(status: 0xE0, data1: 127, data2: 127)
	if case let .pitchBend(v) = fullUp {
		#expect(abs(v - 1.0) < 0.001)
	} else {
		Issue.record("Expected pitchBend, got \(fullUp)")
	}
	// Full down: data1=0, data2=0 → raw=0 → (0-8192)/8192 = -1.0
	let fullDown = parser.parseMidiStatusByte(status: 0xE0, data1: 0, data2: 0)
	#expect(fullDown == .pitchBend(-1))
}

@Test func controlChange() {
	let parser = MidiParser()
	// 64/127 = ~0.504, not 0.5 — use approximate check
	let mod = parser.parseControlChange(cc: 1, value: 64)
	if case let .modWheel(v) = mod {
		#expect(abs(v - 0.504) < 0.001)
	} else {
		Issue.record("Expected modWheel, got \(mod)")
	}
	let sustainOn = parser.parseControlChange(cc: 64, value: 64)
	#expect(sustainOn == .sustain(true))
	let sustainOff = parser.parseControlChange(cc: 64, value: 0)
	#expect(sustainOff == .sustain(false))
	let allSoundOff = parser.parseControlChange(cc: 120, value: 0)
	#expect(allSoundOff == .allNotesOff)
	let allNotesOff = parser.parseControlChange(cc: 123, value: 0)
	#expect(allNotesOff == .allNotesOff)
	let unknown = parser.parseControlChange(cc: 7, value: 100)
	#expect(unknown == .none)
}

@Test func universalMidiPacket() {
	let parser = MidiParser()
	// UMP word: messageType=0x2, group=0, status=0x90, channel=0, note=60, velocity=100
	let word: UInt32 = (0x2 << 28) | (0x90 << 16) | (60 << 8) | 100
	let result = parser.parseUniversalMidiPacket(word)
	#expect(result?.status == 0x90)
	#expect(result?.data1 == 60)
	#expect(result?.data2 == 100)
}

@Test func universalMidiPacketWrongType() {
	let parser = MidiParser()
	let word: UInt32 = (0x1 << 28) // utility message type
	let result = parser.parseUniversalMidiPacket(word)
	#expect(result == nil)
}

@Test func aftertouch() {
	let parser = MidiParser()
	let result = parser.parseMidiStatusByte(status: 0xD0, data1: 64, data2: 0)
	if case let .aftertouch(v) = result {
		#expect(abs(v - 64.0 / 127.0) < 0.001)
	} else {
		Issue.record("Expected aftertouch, got \(result)")
	}
}

@Test func polyAftertouch() {
	let parser = MidiParser()
	let result = parser.parseMidiStatusByte(status: 0xA0, data1: 60, data2: 64)
	if case let .polyAftertouch(note, value) = result {
		#expect(note == 60)
		#expect(abs(value - 64.0 / 127.0) < 0.001)
	} else {
		Issue.record("Expected polyAftertouch, got \(result)")
	}
}
