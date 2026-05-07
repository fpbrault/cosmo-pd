//
//  ViewControllerRepresentable.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI

#if os(iOS) || os(visionOS)

final class FullScreenAUContainerViewController: UIViewController {
    private let auViewController: UIViewController

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }

    init(auViewController: UIViewController) {
        self.auViewController = auViewController
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        view.insetsLayoutMarginsFromSafeArea = false
        addChild(auViewController)
        auViewController.view.frame = view.bounds
        auViewController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(auViewController.view)
        auViewController.didMove(toParent: self)
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        auViewController.view.frame = view.bounds
    }
}

struct AUViewControllerUI: UIViewControllerRepresentable {
    var auViewController: UIViewController?

    init(viewController: UIViewController?) {
        self.auViewController = viewController
    }
    
    func makeUIViewController(context: Context) -> UIViewController {
        guard let auViewController = self.auViewController else {
            return UIViewController()
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
    }

    required init?(coder: NSCoder) {
        nil
    }

    override func loadView() {
        view = NSView()
        view.wantsLayer = true
        view.layer?.backgroundColor = NSColor.black.cgColor
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let auViewController else { return }

        addChild(auViewController)
        let childView = auViewController.view
        childView.frame = view.bounds
        childView.autoresizingMask = [.width, .height]
        view.addSubview(childView)
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
