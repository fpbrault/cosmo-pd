import Foundation

/// Minimal, testable reload scheduling for WKWebView recovery.
///
/// Invariants:
/// - Reload scheduling is idempotent and coalesces repeated reasons.
/// - Benign navigation cancellations (`NSURLErrorCancelled`) do not reload.
public final class WebViewReloadPolicy {
	public struct ReloadDecision: Equatable {
		public let reason: String
		public let delay: TimeInterval
	}

	private static let baseDelay: TimeInterval = 0.5
	private static let minDelay: TimeInterval = 0.25

	private var pendingReloadReason: String?

	private let now: () -> Date

	public init(now: @escaping () -> Date = Date.init) {
		self.now = now
	}

	// MARK: - Navigation error classification

	/// Returns `true` if a navigation error should trigger a reload.
	/// Benign cancellations (e.g. a new navigation superseding an old one)
	/// return `false`.
	public static func shouldReloadAfterNavigationError(_ error: Error) -> Bool {
		let nsError = error as NSError
		if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
			return false
		}
		return true
	}

	// MARK: - Reload scheduling

	/// Records that a reload should be scheduled. Returns a non-nil decision
	/// when a reload should actually be performed, or `nil` when coalesced
	/// (same reason already pending) or blocked (host inactive).
	public func scheduleReload(
		reason: String,
		canReloadNow: Bool,
		pendingWorkItemExists: Bool,
	) -> ReloadDecision? {
		// Coalesce: if a reload is already pending for the same reason, skip.
		if pendingWorkItemExists, pendingReloadReason == reason {
			return nil
		}

		pendingReloadReason = reason

		guard canReloadNow else {
			return nil
		}

		return ReloadDecision(
			reason: reason,
			delay: max(Self.minDelay, Self.baseDelay),
		)
	}

	/// Clears the pending reload reason. Call when a reload executes or when
	/// `webReady` is received.
	public func clearPendingReload() {
		pendingReloadReason = nil
	}

	public func pendingReason() -> String? {
		pendingReloadReason
	}
}
