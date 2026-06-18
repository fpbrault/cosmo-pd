import Foundation

public protocol JavaScriptEvaluating: AnyObject {
	func evaluateJavaScript(_ javaScriptString: String)
}

public final class WebViewScriptDispatcher {
	public struct LifecycleState: Equatable {
		public var hostActive: Bool
		public var viewVisible: Bool
		public var navigationFinished: Bool
		public var webContentAlive: Bool
		public var resumeHoldUntil: Date?

		public init(
			hostActive: Bool = true,
			viewVisible: Bool = false,
			navigationFinished: Bool = false,
			webContentAlive: Bool = true,
			resumeHoldUntil: Date? = nil
		) {
			self.hostActive = hostActive
			self.viewVisible = viewVisible
			self.navigationFinished = navigationFinished
			self.webContentAlive = webContentAlive
			self.resumeHoldUntil = resumeHoldUntil
		}
	}

	private struct PendingParams {
		let json: String
		let selectedPresetName: String?
	}

	private weak var evaluator: JavaScriptEvaluating?
	private var lifecycle: LifecycleState
	private var pendingHostSizeScript: String?
	private var pendingParams: PendingParams?
	private let now: () -> Date

	public init(
		evaluator: JavaScriptEvaluating? = nil,
		lifecycle: LifecycleState = LifecycleState(),
		now: @escaping () -> Date = Date.init
	) {
		self.evaluator = evaluator
		self.lifecycle = lifecycle
		self.now = now
	}

	public var state: LifecycleState {
		lifecycle
	}

	public var hasPendingParams: Bool {
		pendingParams != nil
	}

	public var hasPendingHostSizeScript: Bool {
		pendingHostSizeScript != nil
	}

	public func setEvaluator(_ evaluator: JavaScriptEvaluating?) {
		self.evaluator = evaluator
		flushIfPossible()
	}

	public func setHostActive(_ active: Bool, resumeHold: TimeInterval = 0) {
		lifecycle.hostActive = active
		lifecycle.resumeHoldUntil = active && resumeHold > 0
			? now().addingTimeInterval(resumeHold)
			: nil
		flushIfPossible()
	}

	public func setViewVisible(_ visible: Bool) {
		lifecycle.viewVisible = visible
		flushIfPossible()
	}

	public func setNavigationFinished(_ finished: Bool) {
		lifecycle.navigationFinished = finished
		flushIfPossible()
	}

	public func setWebContentAlive(_ alive: Bool) {
		lifecycle.webContentAlive = alive
		if !alive {
			lifecycle.navigationFinished = false
		}
		flushIfPossible()
	}

	public func clearResumeHold() {
		lifecycle.resumeHoldUntil = nil
		flushIfPossible()
	}

	@discardableResult
	public func enqueueParams(json: String, selectedPresetName: String? = nil) -> Bool {
		pendingParams = PendingParams(json: json, selectedPresetName: selectedPresetName)
		return flushIfPossible()
	}

	@discardableResult
	public func enqueueHostSizeScript(_ script: String) -> Bool {
		guard !script.isEmpty else { return false }
		pendingHostSizeScript = script
		return flushIfPossible()
	}

	@discardableResult
	public func sendIpcResponse(payload: [String: Any]) -> Bool {
		guard canDeliverIpcResponse() else { return false }
		guard JSONSerialization.isValidJSONObject(payload),
			let data = try? JSONSerialization.data(withJSONObject: payload),
			let json = String(data: data, encoding: .utf8)
		else {
			return false
		}
		evaluator?.evaluateJavaScript("window.__czIpcResponse?.(\(json));")
		return true
	}

	@discardableResult
	public func sendTelemetry(script: String) -> Bool {
		guard !script.isEmpty, canEvaluate() else { return false }
		evaluator?.evaluateJavaScript(script)
		return true
	}

	@discardableResult
	public func sendLifecycleEvent(name: String, assignments: [String: String] = [:]) -> Bool {
		guard canEvaluate() else { return false }
		let assignmentScript = assignments
			.sorted { $0.key < $1.key }
			.map { "window.\($0.key)=\($0.value);" }
			.joined()
		evaluator?.evaluateJavaScript("\(assignmentScript)window.dispatchEvent(new Event('\(name)'));")
		return true
	}

	@discardableResult
	public func flushIfPossible() -> Bool {
		guard canEvaluate() else { return false }

		var didFlush = false
		if let pendingHostSizeScript {
			self.pendingHostSizeScript = nil
			evaluator?.evaluateJavaScript(pendingHostSizeScript)
			didFlush = true
		}

		guard let pendingParams else { return didFlush }
		guard let script = paramsScript(json: pendingParams.json, selectedPresetName: pendingParams.selectedPresetName) else {
			return false
		}
		self.pendingParams = nil
		evaluator?.evaluateJavaScript(script)
		return true
	}

	private func canEvaluate() -> Bool {
		guard evaluator != nil,
			lifecycle.hostActive,
			lifecycle.viewVisible,
			lifecycle.navigationFinished,
			lifecycle.webContentAlive
		else {
			return false
		}

		if let resumeHoldUntil = lifecycle.resumeHoldUntil, now() < resumeHoldUntil {
			return false
		}

		return true
	}

	private func canDeliverIpcResponse() -> Bool {
		guard evaluator != nil, lifecycle.webContentAlive else { return false }
		return true
	}

	private func paramsScript(json: String, selectedPresetName: String?) -> String? {
		let container: [String: String] = ["p": json]
		guard let data = try? JSONSerialization.data(withJSONObject: container),
			let containerStr = String(data: data, encoding: .utf8)
		else {
			return nil
		}

		var script = "window.__czOnParams?.(\(containerStr).p);"
		if let selectedPresetName {
			let presetContainer: [String: String] = ["n": selectedPresetName]
			if let presetData = try? JSONSerialization.data(withJSONObject: presetContainer),
				let presetContainerStr = String(data: presetData, encoding: .utf8) {
				script += "window.__czOnHostPresetSelected?.(\(presetContainerStr).n);"
			}
		}
		return script
	}
}
