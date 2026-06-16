import Foundation
import Testing
@testable import CosmoPd101AUv3Support

private final class ScriptRecorder: JavaScriptEvaluating {
	var scripts: [String] = []

	func evaluateJavaScript(_ javaScriptString: String) {
		scripts.append(javaScriptString)
	}
}

@Test func paramsAreQueuedUntilLifecycleIsEvaluable() {
	let recorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder)

	#expect(!dispatcher.enqueueParams(json: #"{"volume":0.2}"#))
	#expect(recorder.scripts.isEmpty)
	#expect(dispatcher.hasPendingParams)

	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)

	#expect(recorder.scripts.count == 1)
	#expect(recorder.scripts[0].contains("__czOnParams"))
	#expect(recorder.scripts[0].contains(#"\"volume\":0.2"#))
	#expect(!dispatcher.hasPendingParams)
}

@Test func queuedParamsCoalesceToLatestValue() {
	let recorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder)

	_ = dispatcher.enqueueParams(json: #"{"volume":0.2}"#, selectedPresetName: "Old")
	_ = dispatcher.enqueueParams(json: #"{"volume":0.9}"#, selectedPresetName: "New")
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)

	#expect(recorder.scripts.count == 1)
	#expect(!recorder.scripts[0].contains(#"\"volume\":0.2"#))
	#expect(recorder.scripts[0].contains(#"\"volume\":0.9"#))
	#expect(recorder.scripts[0].contains("__czOnHostPresetSelected"))
	#expect(recorder.scripts[0].contains("New"))
}

@Test func telemetryIsDroppedWhileLifecycleIsNotEvaluable() {
	let recorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder)

	#expect(!dispatcher.sendTelemetry(script: "window.__czOnTransport?.('{}');"))
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)
	#expect(dispatcher.sendTelemetry(script: "window.__czOnTransport?.('{}');"))

	#expect(recorder.scripts == ["window.__czOnTransport?.('{}');"])
}

@Test func ipcResponseDoesNotEvaluateDuringResumeHold() {
	let recorder = ScriptRecorder()
	var now = Date(timeIntervalSince1970: 100)
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder, now: { now })
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)

	dispatcher.setHostActive(true, resumeHold: 0.25)
	#expect(!dispatcher.sendIpcResponse(payload: ["id": 1, "result": NSNull()]))
	#expect(recorder.scripts.isEmpty)

	now = Date(timeIntervalSince1970: 100.3)
	#expect(dispatcher.sendIpcResponse(payload: ["id": 2, "result": NSNull()]))
	#expect(recorder.scripts.count == 1)
	#expect(recorder.scripts[0].contains("__czIpcResponse"))
}

@Test func paramsFlushAfterResumeHoldClears() {
	let recorder = ScriptRecorder()
	var now = Date(timeIntervalSince1970: 100)
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder, now: { now })
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)
	dispatcher.setHostActive(true, resumeHold: 0.25)

	#expect(!dispatcher.enqueueParams(json: #"{"volume":0.7}"#))
	#expect(dispatcher.hasPendingParams)

	now = Date(timeIntervalSince1970: 100.3)
	dispatcher.clearResumeHold()

	#expect(recorder.scripts.count == 1)
	#expect(recorder.scripts[0].contains(#"\"volume\":0.7"#))
	#expect(!dispatcher.hasPendingParams)
}
