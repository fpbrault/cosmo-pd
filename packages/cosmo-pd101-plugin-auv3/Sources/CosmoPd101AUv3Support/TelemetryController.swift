import Foundation

public enum TelemetryChannel: String, CaseIterable, Hashable, Sendable {
	case runtimeVoiceStates
	case runtimeModSources
	case transport
}

public final class TelemetryController: @unchecked Sendable {
	public private(set) var isTimerRunning = false
	public private(set) var activeChannels: Set<TelemetryChannel> = []

	private var caches: [TelemetryChannel: String] = [:]
	private var timer: Timer?
	private let pushInterval: TimeInterval
	private let handler: @Sendable () -> Void

	public init(pushInterval: TimeInterval = 0.1, handler: @escaping @Sendable () -> Void) {
		self.pushInterval = pushInterval
		self.handler = handler
	}

	@discardableResult
	public func subscribe(_ channel: TelemetryChannel) -> Bool {
		let inserted = activeChannels.insert(channel).inserted
		if inserted {
			caches.removeValue(forKey: channel)
			updateTimer()
		}
		return inserted
	}

	@discardableResult
	public func unsubscribe(_ channel: TelemetryChannel) -> Bool {
		let removed = activeChannels.remove(channel) != nil
		if removed {
			caches.removeValue(forKey: channel)
			updateTimer()
		}
		return removed
	}

	public func hasChannel(_ channel: TelemetryChannel) -> Bool {
		activeChannels.contains(channel)
	}

	public func cachedValue(for channel: TelemetryChannel) -> String? {
		caches[channel]
	}

	public func shouldPush(channel: TelemetryChannel, value: String, force: Bool = false) -> Bool {
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

	public func resetCache(for channel: TelemetryChannel) {
		caches.removeValue(forKey: channel)
	}

	public func resetAllCaches() {
		caches.removeAll()
	}

	public func hostDidBecomeActive() {
		resetAllCaches()
		updateTimer()
	}

	public func hostWillResignActive() {
		stopTimer()
	}

	public func viewWillAppear() {
		updateTimer()
	}

	public func viewDidDisappear() {
		stopTimer()
	}

	public func invalidate() {
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
		guard !isTimerRunning else { return }
		isTimerRunning = true
		let timer = Timer(timeInterval: pushInterval, repeats: true) { [weak self] _ in
			self?.handler()
		}
		self.timer = timer
		RunLoop.main.add(timer, forMode: .common)
	}

	private func stopTimer() {
		guard isTimerRunning || timer != nil else { return }
		isTimerRunning = false
		timer?.invalidate()
		timer = nil
	}
}
