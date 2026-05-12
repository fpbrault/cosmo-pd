//
//  CosmoPD101AUv3Ext_macOSApp.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI

@main
struct CosmoPD101AUv3Ext_macOSApp: App {
	private static let fixedWindowWidth: CGFloat = 1368
	private static let fixedWindowHeight: CGFloat = 912

    @StateObject private var hostModel = AudioUnitHostModel()

    var body: some Scene {
        WindowGroup {
            ContentView(hostModel: hostModel)
				.frame(
					minWidth: Self.fixedWindowWidth,
					idealWidth: Self.fixedWindowWidth,
					maxWidth: Self.fixedWindowWidth,
					minHeight: Self.fixedWindowHeight,
					idealHeight: Self.fixedWindowHeight,
					maxHeight: Self.fixedWindowHeight
				)
        }
		.defaultSize(width: Self.fixedWindowWidth, height: Self.fixedWindowHeight)
		.windowResizability(.contentSize)
    }
}
