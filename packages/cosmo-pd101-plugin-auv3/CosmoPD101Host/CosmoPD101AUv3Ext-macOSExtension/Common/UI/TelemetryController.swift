// Mirror of Sources/CosmoPd101AUv3/TelemetryController.swift (primary source of truth)
// TODO: Remove this copy when Xcode project compiles Sources/ path directly

import Foundation

// MARK: - Timer abstraction for testability

protocol TelemetryTimer: AnyObject {
	func schedule(interval: TimeInterval, repeats: Bool, block: @escaping @Sendable () -> Void)
	func invalidate()
}

protocol TelemetryTimerFactory {
	func makeTimer() -> TelemetryTimer
}

final class DefaultTelemetryTimer: TelemetryTimer {
	private var timer: Timer?

	func schedule(interval: TimeInterval, repeats: Bool, block: @escaping @Sendable () -> Void) {
		let t = Timer(timeInterval: interval, repeats: repeats) { _ in
			block()
		}
		timer = t
		RunLoop.main.add(t, forMode: .common)
	}

	func invalidate() {
		timer?.invalidate()
		timer = nil
	}
}

struct DefaultTelemetryTimerFactory: TelemetryTimerFactory {
	func makeTimer() -> TelemetryTimer {
		DefaultTelemetryTimer()
	}
}

// MARK: - Telemetry model

enum TelemetryChannel: String, CaseIterable, Hashable {
	case runtimeVoiceStates
	case runtimeModSources
	case transport
}

// MARK: - TelemetryController

final class TelemetryController: @unchecked Sendable {
	private(set) var isTimerRunning = false
	private(set) var activeChannels: Set<TelemetryChannel> = []

	private var caches: [TelemetryChannel: String] = [:]
	private var timer: TelemetryTimer?
	private let pushInterval: TimeInterval
	private let handler: () -> Void
	private let timerFactory: TelemetryTimerFactory

	init(
		pushInterval: TimeInterval = 0.1,
		handler: @escaping () -> Void,
		timerFactory: TelemetryTimerFactory = DefaultTelemetryTimerFactory()
	) {
		self.pushInterval = pushInterval
		self.handler = handler
		self.timerFactory = timerFactory
	}

	@discardableResult
	func subscribe(_ channel: TelemetryChannel) -> Bool {
		let inserted = activeChannels.insert(channel).inserted
		if inserted {
			caches.removeValue(forKey: channel)
			updateTimer()
		}
		return inserted
	}

	@discardableResult
	func unsubscribe(_ channel: TelemetryChannel) -> Bool {
		let removed = activeChannels.remove(channel) != nil
		if removed {
			caches.removeValue(forKey: channel)
			updateTimer()
		}
		return removed
	}

	func hasChannel(_ channel: TelemetryChannel) -> Bool {
		activeChannels.contains(channel)
	}

	func cachedValue(for channel: TelemetryChannel) -> String? {
		caches[channel]
	}

	func shouldPush(channel: TelemetryChannel, value: String, force: Bool = false) -> Bool {
		if force {
			caches[channel] = value
			return true
		}
		if caches[channel] != value {
			caches[channel] = value
			return true
		}
		return false
	}

	func resetCache(for channel: TelemetryChannel) {
		caches.removeValue(forKey: channel)
	}

	func resetAllCaches() {
		caches.removeAll()
	}

	func hostDidBecomeActive() {
		resetAllCaches()
		updateTimer()
	}

	func hostWillResignActive() {
		stopTimer()
	}

	func viewWillAppear() {
		updateTimer()
	}

	func viewDidDisappear() {
		stopTimer()
	}

	func invalidate() {
		stopTimer()
		activeChannels.removeAll()
		caches.removeAll()
	}

	private func updateTimer() {
		if !activeChannels.isEmpty && !isTimerRunning {
			startTimer()
		} else if activeChannels.isEmpty && isTimerRunning {
			stopTimer()
		}
	}

	private func startTimer() {
		isTimerRunning = true
		let t = timerFactory.makeTimer()
		t.schedule(interval: pushInterval, repeats: true) { [weak self] in
			self?.handler()
		}
		timer = t
	}

	private func stopTimer() {
		isTimerRunning = false
		timer?.invalidate()
		timer = nil
	}
}
