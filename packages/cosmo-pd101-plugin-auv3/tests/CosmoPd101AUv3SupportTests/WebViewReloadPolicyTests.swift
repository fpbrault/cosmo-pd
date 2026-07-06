import Foundation
import Testing
@testable import CosmoPd101AUv3Support

@Test func navigationCancellationDoesNotTriggerReload() {
	let cancelled = URLError(.cancelled)
	#expect(!WebViewReloadPolicy.shouldReloadAfterNavigationError(cancelled))

	let other = NSError(domain: NSURLErrorDomain, code: NSURLErrorCannotConnectToHost)
	#expect(WebViewReloadPolicy.shouldReloadAfterNavigationError(other))

	let generic = NSError(domain: "Cocoa", code: 1)
	#expect(WebViewReloadPolicy.shouldReloadAfterNavigationError(generic))
}

@Test func scheduleReloadReturnsDecisionWhenEligible() {
	let now = Date(timeIntervalSince1970: 100)
	let policy = WebViewReloadPolicy(now: { now })

	let decision = policy.scheduleReload(reason: "webContentProcessDidTerminate", canReloadNow: true, pendingWorkItemExists: false)
	#expect(decision != nil)
	#expect(decision?.reason == "webContentProcessDidTerminate")
	if let delay = decision?.delay {
		#expect(delay >= 0.25)
	}
}

@Test func scheduleReloadCoalescesWhenPendingWorkItemExists() {
	let now = Date(timeIntervalSince1970: 100)
	let policy = WebViewReloadPolicy(now: { now })

	let first = policy.scheduleReload(reason: "didFailNavigation", canReloadNow: true, pendingWorkItemExists: false)
	#expect(first != nil)

	let second = policy.scheduleReload(reason: "didFailNavigation", canReloadNow: true, pendingWorkItemExists: true)
	#expect(second == nil)
}

@Test func scheduleReloadDeferredWhenHostInactive() {
	let now = Date(timeIntervalSince1970: 100)
	let policy = WebViewReloadPolicy(now: { now })

	let decision = policy.scheduleReload(reason: "webContentProcessDidTerminate", canReloadNow: false, pendingWorkItemExists: false)
	#expect(decision == nil)
	#expect(policy.pendingReason() == "webContentProcessDidTerminate")
}

@Test func clearPendingReloadWipesReason() {
	let now = Date(timeIntervalSince1970: 100)
	let policy = WebViewReloadPolicy(now: { now })

	_ = policy.scheduleReload(reason: "webContentProcessDidTerminate", canReloadNow: false, pendingWorkItemExists: false)
	#expect(policy.pendingReason() != nil)

	policy.clearPendingReload()
	#expect(policy.pendingReason() == nil)
}

@Test func differentReasonsAreNotCoalesced() {
	let now = Date(timeIntervalSince1970: 100)
	let policy = WebViewReloadPolicy(now: { now })

	let first = policy.scheduleReload(reason: "didFailNavigation", canReloadNow: true, pendingWorkItemExists: false)
	#expect(first != nil)

	// Different reason with no pendingWorkItem — should proceed.
	let second = policy.scheduleReload(reason: "webContentProcessDidTerminate", canReloadNow: true, pendingWorkItemExists: false)
	#expect(second != nil)
}
