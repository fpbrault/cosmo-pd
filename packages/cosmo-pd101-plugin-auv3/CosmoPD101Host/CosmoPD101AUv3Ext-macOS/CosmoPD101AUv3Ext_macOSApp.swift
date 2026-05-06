//
//  CosmoPD101AUv3Ext_macOSApp.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI

@main
struct CosmoPD101AUv3Ext_macOSApp: App {
    @StateObject private var hostModel = AudioUnitHostModel()

    var body: some Scene {
        WindowGroup {
            ContentView(hostModel: hostModel)
        }
    }
}
