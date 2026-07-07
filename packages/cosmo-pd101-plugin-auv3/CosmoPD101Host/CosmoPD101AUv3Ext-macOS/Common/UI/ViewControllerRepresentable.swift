//
//  ViewControllerRepresentable.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI

func configureStandaloneAuv3ViewController(_ viewController: NSObject) {
	let fitModeSelector = NSSelectorFromString("setCosmoAuv3FitMode:")
	if viewController.responds(to: fitModeSelector) {
		viewController.setValue("fit-bounds", forKey: "cosmoAuv3FitMode")
	}

	let runtimeModeSelector = NSSelectorFromString("setCosmoAuv3RuntimeMode:")
	if viewController.responds(to: runtimeModeSelector) {
		viewController.setValue("standalone", forKey: "cosmoAuv3RuntimeMode")
	}
}

#if os(iOS) || os(visionOS)

final class FullScreenAUContainerViewController: UIViewController {
    private let auViewController: UIViewController

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }

    init(auViewController: UIViewController) {
        self.auViewController = auViewController
        super.init(nibName: nil, bundle: nil)
		configureStandaloneAuv3ViewController(auViewController)
    }

    required init?(coder: NSCoder) {
        nil
    }

	override func viewDidLoad() {
		super.viewDidLoad()
		view.backgroundColor = .clear
		view.insetsLayoutMarginsFromSafeArea = false

		configureStandaloneAuv3ViewController(auViewController)

		addChild(auViewController)
        auViewController.view.frame = view.bounds
        auViewController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(auViewController.view)
        auViewController.didMove(toParent: self)
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        auViewController.view.frame = view.bounds
        auViewController.view.setNeedsLayout()
        auViewController.view.layoutIfNeeded()
    }
}

struct AUViewControllerUI: UIViewControllerRepresentable {
    var auViewController: UIViewController?

    init(viewController: UIViewController?) {
        self.auViewController = viewController
    }
    
    func makeUIViewController(context: Context) -> UIViewController {
        guard let auViewController = self.auViewController else {
            let viewController = UIViewController()
            viewController.view.backgroundColor = .clear
            return viewController
        }
        return FullScreenAUContainerViewController(auViewController: auViewController)
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // No op
    }
}
#elseif os(macOS)
final class FullScreenAUMacContainerViewController: NSViewController {
    private let auViewController: NSViewController?

    init(auViewController: NSViewController?) {
        self.auViewController = auViewController
        super.init(nibName: nil, bundle: nil)
		if let auViewController {
			configureStandaloneAuv3ViewController(auViewController)
		}
    }

    required init?(coder: NSCoder) {
        nil
    }

    override func loadView() {
        view = NSView()
        view.wantsLayer = true
        view.layer?.backgroundColor = NSColor.clear.cgColor
    }

	override func viewDidLoad() {
		super.viewDidLoad()

		guard let auViewController else { return }
		configureStandaloneAuv3ViewController(auViewController)

		addChild(auViewController)
        let childView = auViewController.view
        childView.frame = view.bounds
        childView.autoresizingMask = [.width, .height]
        view.addSubview(childView)
    }

    override func viewDidLayout() {
        super.viewDidLayout()
        guard let auViewController else { return }
        auViewController.view.frame = view.bounds
        auViewController.view.needsLayout = true
        auViewController.view.layoutSubtreeIfNeeded()
    }
}

struct AUViewControllerUI: NSViewControllerRepresentable {
    var auViewController: NSViewController?

    init(viewController: NSViewController?) {
        self.auViewController = viewController
    }

    func makeNSViewController(context: Context) -> NSViewController {
        FullScreenAUMacContainerViewController(auViewController: self.auViewController)
    }

    func updateNSViewController(_ nsViewController: NSViewController, context: Context) {
        // No op
    }
}
#endif
