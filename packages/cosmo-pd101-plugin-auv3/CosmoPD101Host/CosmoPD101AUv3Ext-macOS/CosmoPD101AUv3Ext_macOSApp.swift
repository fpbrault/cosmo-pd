//
//  CosmoPD101AUv3Ext_macOSApp.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI

@main
struct CosmoPD101AUv3Ext_macOSApp: App {
	private static let minimumWindowWidth: CGFloat = 640
	private static let minimumWindowHeight: CGFloat = 480

    @StateObject private var hostModel = AudioUnitHostModel()
	@Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView(hostModel: hostModel)
				.frame(
					minWidth: Self.minimumWindowWidth,
					minHeight: Self.minimumWindowHeight
				)
				.onChange(of: scenePhase) { phase in
					hostModel.handleScenePhaseChange(phase)
				}
        }
		.defaultSize(width: Self.minimumWindowWidth, height: Self.minimumWindowHeight)
		.windowResizability(.contentSize)
    }
}
