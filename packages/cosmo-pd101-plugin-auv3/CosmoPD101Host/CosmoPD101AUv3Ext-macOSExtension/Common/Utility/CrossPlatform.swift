//
//  CrossPlatform.swift
//  CosmoPD101AUv3Ext-macOSExtension
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import Foundation
import SwiftUI

#if os(iOS) || os(visionOS)
typealias HostingController = UIHostingController
#elseif os(macOS)
typealias HostingController = NSHostingController

extension NSView {
	
	func bringSubviewToFront(_ view: NSView) {
		// This function is a no-opp for macOS
	}
}
#endif
