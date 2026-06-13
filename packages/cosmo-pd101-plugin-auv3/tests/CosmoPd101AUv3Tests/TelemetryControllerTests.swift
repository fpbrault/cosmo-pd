import Foundation
import Testing
@testable import CosmoPd101AUv3

// MARK: - Spy timer infrastructure

final class SpyTelemetryTimer: TelemetryTimer {
	private(set) var scheduleCount = 0
	private(set) var invalidateCount = 0

	func schedule(interval: TimeInterval, repeats: Bool, block: @escaping @Sendable () -> Void) {
		scheduleCount += 1
	}

	func invalidate() {
		invalidateCount += 1
	}
}

final class SpyTelemetryTimerFactory: TelemetryTimerFactory {
	let spy = SpyTelemetryTimer()

	func makeTimer() -> TelemetryTimer {
		spy
	}
}

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

// MARK: - Timer lifecycle via spy factory

@Test func timerStartsOnSubscribe() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	#expect(factory.spy.scheduleCount == 0)
	#expect(factory.spy.invalidateCount == 0)

	tc.subscribe(.runtimeVoiceStates)
	#expect(factory.spy.scheduleCount == 1)
	#expect(tc.isTimerRunning)
}

@Test func timerStopsOnUnsubscribe() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	tc.subscribe(.runtimeVoiceStates)
	#expect(factory.spy.scheduleCount == 1)

	tc.unsubscribe(.runtimeVoiceStates)
	#expect(factory.spy.invalidateCount == 1)
	#expect(!tc.isTimerRunning)
}

@Test func timerRestartsOnResubscribe() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	tc.subscribe(.runtimeVoiceStates)
	tc.unsubscribe(.runtimeVoiceStates)
	#expect(factory.spy.invalidateCount == 1)

	tc.subscribe(.runtimeModSources)
	#expect(factory.spy.scheduleCount == 2)
}

@Test func hostDidBecomeActiveRestartsTimer() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	tc.subscribe(.transport)
	#expect(factory.spy.scheduleCount == 1)

	tc.hostWillResignActive()
	#expect(factory.spy.invalidateCount == 1)

	tc.hostDidBecomeActive()
	#expect(factory.spy.scheduleCount == 2)
}

@Test func viewWillAppearRestartsTimerAfterHostInactive() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	tc.subscribe(.transport)
	#expect(factory.spy.scheduleCount == 1)

	tc.hostWillResignActive()
	#expect(factory.spy.invalidateCount == 1)

	tc.viewWillAppear()
	#expect(factory.spy.scheduleCount == 2)
}

@Test func repeatedHostDidBecomeActiveDoesNotDoubleSchedule() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	tc.subscribe(.transport)
	#expect(factory.spy.scheduleCount == 1)

	tc.hostDidBecomeActive()
	// Timer already running — should not schedule again
	#expect(factory.spy.scheduleCount == 1)
}

@Test func repeatedViewWillAppearDoesNotDoubleSchedule() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	tc.subscribe(.transport)
	#expect(factory.spy.scheduleCount == 1)

	tc.viewWillAppear()
	// Timer already running — should not schedule again
	#expect(factory.spy.scheduleCount == 1)
}

@Test func invalidateCallsTimerInvalidate() {
	let factory = SpyTelemetryTimerFactory()
	let tc = TelemetryController(handler: {}, timerFactory: factory)
	tc.subscribe(.transport)
	#expect(factory.spy.invalidateCount == 0)

	tc.invalidate()
	#expect(factory.spy.invalidateCount == 1)
}
