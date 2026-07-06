import Foundation
import Testing
@testable import CosmoPd101AUv3Support

@Test func emptyScopeFrameEncodesAsEightZeroBytes() {
	let data = ScopeBinaryFrameEncoder.encode(nil)

	#expect(data.count == 8)
	#expect(Array(data) == Array(repeating: 0, count: 8))
}

@Test func scopeFrameEncodesLittleEndianHeaderAndSamples() {
	let frame = ScopeBinaryFrame(samples: [0.25, -0.5], sampleRate: 48_000, hz: 220)
	let data = ScopeBinaryFrameEncoder.encode(frame)

	#expect(data.count == 16)
	let decoded = data.withUnsafeBytes { rawBuffer -> [Float] in
		let bytes = rawBuffer.bindMemory(to: UInt8.self)
		return stride(from: 0, to: data.count, by: 4).map { offset in
			let bits = UInt32(bytes[offset])
				| UInt32(bytes[offset + 1]) << 8
				| UInt32(bytes[offset + 2]) << 16
				| UInt32(bytes[offset + 3]) << 24
			return Float(bitPattern: bits)
		}
	}

	#expect(decoded == [48_000, 220, 0.25, -0.5])
}
