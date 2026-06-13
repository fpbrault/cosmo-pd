import Foundation
import Testing
@testable import CosmoPd101AUv3Support

// MARK: - State management tests

@Test func subscribeAddsChannel() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	#expect(tc.hasChannel(.runtimeVoiceStates))
	#expect(!tc.hasChannel(.runtimeModSources))
	#expect(!tc.hasChannel(.transport))
}

@Test func subscribeStartsTimer() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	#expect(tc.isTimerRunning)
}

@Test func unsubscribeRemovesChannel() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	tc.unsubscribe(.runtimeVoiceStates)
	#expect(!tc.hasChannel(.runtimeVoiceStates))
	#expect(!tc.isTimerRunning)
}

@Test func unsubscribeDoesNotStopTimerIfOtherChannelsRemain() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	tc.subscribe(.transport)
	tc.unsubscribe(.runtimeVoiceStates)
	#expect(tc.hasChannel(.transport))
	#expect(tc.isTimerRunning)
}

@Test func subscribeReturnsInsertedFlag() {
	let tc = TelemetryController { }
	#expect(tc.subscribe(.runtimeVoiceStates) == true)
	#expect(tc.subscribe(.runtimeVoiceStates) == false)
}

@Test func unsubscribeReturnsRemovedFlag() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	#expect(tc.unsubscribe(.runtimeVoiceStates) == true)
	#expect(tc.unsubscribe(.runtimeVoiceStates) == false)
}

// MARK: - Cache tests

@Test func shouldPushReturnsTrueForFirstValue() {
	let tc = TelemetryController { }
	#expect(tc.shouldPush(channel: .transport, value: "a"))
}

@Test func shouldPushReturnsFalseForSameValue() {
	let tc = TelemetryController { }
	_ = tc.shouldPush(channel: .transport, value: "a")
	#expect(!tc.shouldPush(channel: .transport, value: "a"))
}

@Test func shouldPushReturnsTrueForDifferentValue() {
	let tc = TelemetryController { }
	_ = tc.shouldPush(channel: .transport, value: "a")
	#expect(tc.shouldPush(channel: .transport, value: "b"))
}

@Test func shouldPushForceAlwaysReturnsTrue() {
	let tc = TelemetryController { }
	_ = tc.shouldPush(channel: .transport, value: "a")
	#expect(tc.shouldPush(channel: .transport, value: "a", force: true))
}

@Test func shouldPushUpdatesCacheOnFirstCall() {
	let tc = TelemetryController { }
	_ = tc.shouldPush(channel: .transport, value: "hello")
	#expect(tc.cachedValue(for: .transport) == "hello")
}

@Test func shouldPushUpdatesCacheOnDifferentValue() {
	let tc = TelemetryController { }
	_ = tc.shouldPush(channel: .transport, value: "a")
	_ = tc.shouldPush(channel: .transport, value: "b")
	#expect(tc.cachedValue(for: .transport) == "b")
}

@Test func resetCacheClearsSingleChannel() {
	let tc = TelemetryController { }
	_ = tc.shouldPush(channel: .transport, value: "a")
	tc.resetCache(for: .transport)
	#expect(tc.cachedValue(for: .transport) == nil)
	#expect(tc.shouldPush(channel: .transport, value: "a"))
}

@Test func resetAllCachesClearsAll() {
	let tc = TelemetryController { }
	_ = tc.shouldPush(channel: .runtimeVoiceStates, value: "v")
	_ = tc.shouldPush(channel: .runtimeModSources, value: "m")
	tc.resetAllCaches()
	#expect(tc.cachedValue(for: .runtimeVoiceStates) == nil)
	#expect(tc.cachedValue(for: .runtimeModSources) == nil)
}

// MARK: - Lifecycle tests

@Test func hostDidBecomeActiveResetsCachesAndStartsTimer() {
	let tc = TelemetryController { }
	tc.subscribe(.transport)
	_ = tc.shouldPush(channel: .transport, value: "old")
	tc.hostWillResignActive()
	#expect(!tc.isTimerRunning)
	tc.hostDidBecomeActive()
	#expect(tc.cachedValue(for: .transport) == nil)
	#expect(tc.isTimerRunning)
}

@Test func hostWillResignActiveStopsTimer() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeModSources)
	tc.hostWillResignActive()
	#expect(!tc.isTimerRunning)
	#expect(tc.hasChannel(.runtimeModSources))
}

@Test func hostDidBecomeActiveDoesNotStartTimerWhenNoActiveChannels() {
	let tc = TelemetryController { }
	tc.hostDidBecomeActive()
	#expect(!tc.isTimerRunning)
}

@Test func viewWillAppearStartsTimerWhenChannelsActive() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	tc.hostWillResignActive()
	tc.viewWillAppear()
	#expect(tc.isTimerRunning)
}

@Test func viewWillAppearDoesNotStartTimerWhenNoChannels() {
	let tc = TelemetryController { }
	tc.viewWillAppear()
	#expect(!tc.isTimerRunning)
}

@Test func viewDidDisappearStopsTimer() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	tc.viewDidDisappear()
	#expect(!tc.isTimerRunning)
}

@Test func invalidateClearsEverything() {
	let tc = TelemetryController { }
	tc.subscribe(.runtimeVoiceStates)
	tc.subscribe(.transport)
	_ = tc.shouldPush(channel: .transport, value: "x")
	tc.invalidate()
	#expect(!tc.isTimerRunning)
	#expect(tc.activeChannels.isEmpty)
	#expect(tc.cachedValue(for: .transport) == nil)
}

// MARK: - Repeated lifecycle idempotency

@Test func repeatedLifecycleCallsDoNotCreateMultipleTimers() {
	let tc = TelemetryController { }

	tc.subscribe(.transport)
	#expect(tc.isTimerRunning)

	tc.viewWillAppear()
	tc.hostDidBecomeActive()
	tc.viewWillAppear()
	tc.hostDidBecomeActive()

	#expect(tc.isTimerRunning)
	#expect(tc.activeChannels == [.transport])
}

@Test func subscribeUnsubscribeResubscribeStartsTimerCleanly() {
	let tc = TelemetryController { }

	tc.subscribe(.transport)
	#expect(tc.isTimerRunning)

	tc.unsubscribe(.transport)
	#expect(!tc.isTimerRunning)

	tc.subscribe(.transport)
	#expect(tc.isTimerRunning)
}

@Test func repeatedHostDidBecomeActiveDoesNotCrash() {
	let tc = TelemetryController { }
	tc.subscribe(.transport)
	tc.hostDidBecomeActive()
	tc.hostDidBecomeActive()
	tc.hostDidBecomeActive()
	#expect(tc.isTimerRunning)
	#expect(tc.activeChannels == [.transport])
}

@Test func repeatedViewDidDisappearDoesNotCrash() {
	let tc = TelemetryController { }
	tc.subscribe(.transport)
	tc.viewDidDisappear()
	tc.viewDidDisappear()
	tc.viewDidDisappear()
	#expect(!tc.isTimerRunning)
}

@Test func repeatedInvalideDoesNotCrash() {
	let tc = TelemetryController { }
	tc.subscribe(.transport)
	tc.invalidate()
	tc.invalidate()
	tc.invalidate()
	#expect(!tc.isTimerRunning)
	#expect(tc.activeChannels.isEmpty)
}
