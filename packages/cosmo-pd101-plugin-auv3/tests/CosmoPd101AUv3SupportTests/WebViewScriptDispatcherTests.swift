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

@Test func hostSizeScriptIsQueuedUntilLifecycleIsEvaluable() {
	let recorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder)

	#expect(!dispatcher.enqueueHostSizeScript("window.__czHostSize = { width: 640 };"))
	#expect(recorder.scripts.isEmpty)
	#expect(dispatcher.hasPendingHostSizeScript)

	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)

	#expect(recorder.scripts == ["window.__czHostSize = { width: 640 };"])
	#expect(!dispatcher.hasPendingHostSizeScript)
}

@Test func queuedHostSizeScriptCoalescesToLatestValue() {
	let recorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder)

	_ = dispatcher.enqueueHostSizeScript("window.__czHostSize = { width: 640 };")
	_ = dispatcher.enqueueHostSizeScript("window.__czHostSize = { width: 900 };")
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)

	#expect(recorder.scripts == ["window.__czHostSize = { width: 900 };"])
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

@Test func ipcResponseQueuedDuringResumeHold() {
	let recorder = ScriptRecorder()
	var now = Date(timeIntervalSince1970: 100)
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder, now: { now })
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)

	dispatcher.setHostActive(true, resumeHold: 0.25)
	#expect(dispatcher.sendIpcResponse(payload: ["id": 1, "result": NSNull()]))
	#expect(recorder.scripts.isEmpty)

	now = Date(timeIntervalSince1970: 100.3)
	dispatcher.clearResumeHold()
	#expect(recorder.scripts.count == 1)
	#expect(recorder.scripts[0].contains("__czIpcResponse"))
}

@Test func ipcResponseBlockedWhenWebContentDead() {
	let recorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder)
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)
	dispatcher.setWebContentAlive(false)

	#expect(!dispatcher.sendIpcResponse(payload: ["id": 1, "result": NSNull()]))
	#expect(recorder.scripts.isEmpty)
}

@Test func ipcResponseBlockedWithoutEvaluator() {
	let dispatcher = WebViewScriptDispatcher()
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)
	dispatcher.setWebContentAlive(true)

	#expect(!dispatcher.sendIpcResponse(payload: ["id": 1, "result": NSNull()]))
}

@Test func ipcResponseQueuedWhenLifecycleNotEvaluable() {
	let recorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder)
	dispatcher.setWebContentAlive(true)

	#expect(dispatcher.sendIpcResponse(payload: ["id": 1, "result": NSNull()]))
	#expect(recorder.scripts.isEmpty)

	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)
	#expect(recorder.scripts.count == 1)
	#expect(recorder.scripts[0].contains("__czIpcResponse"))
}

@Test func paramsBlockedDuringResumeHold() {
	let recorder = ScriptRecorder()
	let now = Date(timeIntervalSince1970: 100)
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder, now: { now })
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)

	dispatcher.setHostActive(true, resumeHold: 0.25)
	#expect(!dispatcher.enqueueParams(json: #"{"volume":0.7}"#))
	#expect(dispatcher.hasPendingParams)
	#expect(recorder.scripts.isEmpty)
}

@Test func canEvaluateNowReflectsLifecycleGates() {
	let recorder = ScriptRecorder()
	var now = Date(timeIntervalSince1970: 100)
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder, now: { now })

	#expect(!dispatcher.canEvaluateNow)
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)
	#expect(dispatcher.canEvaluateNow)

	dispatcher.setHostActive(false)
	#expect(!dispatcher.canEvaluateNow)

	dispatcher.setHostActive(true, resumeHold: 0.25)
	#expect(!dispatcher.canEvaluateNow)

	now = Date(timeIntervalSince1970: 100.3)
	dispatcher.clearResumeHold()
	#expect(dispatcher.canEvaluateNow)

	dispatcher.setWebContentAlive(false)
	#expect(!dispatcher.canEvaluateNow)
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

@Test func hostInactiveInvalidatesPendingResumeWork() {
	let recorder = ScriptRecorder()
	var now = Date(timeIntervalSince1970: 100)
	let dispatcher = WebViewScriptDispatcher(evaluator: recorder, now: { now })
	dispatcher.setViewVisible(true)
	dispatcher.setNavigationFinished(true)
	dispatcher.setHostActive(true, resumeHold: 0.25)

	#expect(!dispatcher.enqueueHostSizeScript("window.__czHostSize = { width: 640 };"))
	#expect(dispatcher.sendIpcResponse(payload: ["id": 1, "result": NSNull()]))

	dispatcher.setHostActive(false)
	now = Date(timeIntervalSince1970: 100.3)
	dispatcher.clearResumeHold()

	#expect(!dispatcher.canEvaluateNow)
	#expect(recorder.scripts.isEmpty)
}

@Test func destroyedWebContentDropsQueuedMessages() {
	let oldRecorder = ScriptRecorder()
	let newRecorder = ScriptRecorder()
	let dispatcher = WebViewScriptDispatcher(evaluator: oldRecorder)
	dispatcher.setWebContentAlive(true)
	dispatcher.setHostActive(true, resumeHold: 1)

	#expect(!dispatcher.enqueueParams(json: #"{"volume":0.7}"#))
	#expect(!dispatcher.enqueueHostSizeScript("window.__czHostSize = { width: 640 };"))
	#expect(dispatcher.sendIpcResponse(payload: ["id": 1, "result": NSNull()]))
	#expect(dispatcher.hasPendingParams)
	#expect(dispatcher.hasPendingHostSizeScript)

	dispatcher.setWebContentAlive(false)
	dispatcher.setEvaluator(nil)
	dispatcher.clearPendingMessagesForDestroyedWebContent()
	dispatcher.setEvaluator(newRecorder)
	dispatcher.setViewVisible(true)
	dispatcher.setWebContentAlive(true)
	dispatcher.setNavigationFinished(true)
	dispatcher.clearResumeHold()

	#expect(oldRecorder.scripts.isEmpty)
	#expect(newRecorder.scripts.isEmpty)
	#expect(!dispatcher.hasPendingParams)
	#expect(!dispatcher.hasPendingHostSizeScript)
}
