import WebKit

public final class WeakScriptMessageHandler: NSObject, WKScriptMessageHandler {
	public weak var target: WKScriptMessageHandler?

	public init(_ target: WKScriptMessageHandler) {
		self.target = target
		super.init()
	}

	public func userContentController(
		_ userContentController: WKUserContentController,
		didReceive message: WKScriptMessage
	) {
		target?.userContentController(userContentController, didReceive: message)
	}
}
