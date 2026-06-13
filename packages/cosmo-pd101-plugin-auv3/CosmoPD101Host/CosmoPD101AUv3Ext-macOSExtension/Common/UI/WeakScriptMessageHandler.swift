import WebKit

final class WeakScriptMessageHandler: NSObject, WKScriptMessageHandler {
	private weak var handler: WKScriptMessageHandler?

	init(_ handler: WKScriptMessageHandler) {
		self.handler = handler
	}

	func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		handler?.userContentController(userContentController, didReceive: message)
	}
}
