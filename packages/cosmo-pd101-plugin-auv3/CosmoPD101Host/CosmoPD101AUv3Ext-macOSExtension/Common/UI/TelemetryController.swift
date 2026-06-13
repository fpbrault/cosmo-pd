import Foundation

enum TelemetryChannel: String, CaseIterable, Hashable {
	case runtimeVoiceStates
	case runtimeModSources
	case transport
}

final class TelemetryController: @unchecked Sendable {
	private(set) var isTimerRunning = false
	private(set) var activeChannels: Set<TelemetryChannel> = []

	private var caches: [TelemetryChannel: String] = [:]
	private weak var timer: Timer?
	private let pushInterval: TimeInterval
	private let handler: () -> Void

	init(pushInterval: TimeInterval = 0.1, handler: @escaping () -> Void) {
		self.pushInterval = pushInterval
		self.handler = handler
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
		let timer = Timer.scheduledTimer(withTimeInterval: pushInterval, repeats: true) { [weak self] _ in
			self?.handler()
		}
		self.timer = timer
		RunLoop.main.add(timer, forMode: .common)
	}

	private func stopTimer() {
		isTimerRunning = false
		timer?.invalidate()
		timer = nil
	}
}
