//
//  CosmoPD101AUv3Ext_macOSApp.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI

@main
struct CosmoPD101AUv3Ext_macOSApp: App {
	private static let minimumWindowWidth: CGFloat = 1024
	private static let minimumWindowHeight: CGFloat = 768
	private static let defaultWindowWidth: CGFloat = 1368
	private static let defaultWindowHeight: CGFloat = 912

    @StateObject private var hostModel = AudioUnitHostModel()

    var body: some Scene {
        WindowGroup {
            ContentView(hostModel: hostModel)
				.frame(minWidth: Self.minimumWindowWidth, minHeight: Self.minimumWindowHeight)
        }
		.defaultSize(width: Self.defaultWindowWidth, height: Self.defaultWindowHeight)
    }
}
