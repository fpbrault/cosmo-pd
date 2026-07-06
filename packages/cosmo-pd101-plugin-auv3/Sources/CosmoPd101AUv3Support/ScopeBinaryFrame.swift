import Foundation

public struct ScopeBinaryFrame: Sendable {
	public let samples: [Float]
	public let sampleRate: Float
	public let hz: Float

	public init(samples: [Float], sampleRate: Float, hz: Float) {
		self.samples = samples
		self.sampleRate = sampleRate
		self.hz = hz
	}
}

public enum ScopeBinaryFrameEncoder {
	public static func encode(_ frame: ScopeBinaryFrame?) -> Data {
		guard let frame, !frame.samples.isEmpty else {
			return Data(count: 8)
		}

		var data = Data(capacity: 8 + frame.samples.count * MemoryLayout<Float>.size)
		appendFloat(frame.sampleRate, to: &data)
		appendFloat(frame.hz, to: &data)
		for sample in frame.samples {
			appendFloat(sample, to: &data)
		}
		return data
	}

	private static func appendFloat(_ value: Float, to data: inout Data) {
		var bits = value.bitPattern.littleEndian
		withUnsafeBytes(of: &bits) { bytes in
			data.append(contentsOf: bytes)
		}
	}
}
