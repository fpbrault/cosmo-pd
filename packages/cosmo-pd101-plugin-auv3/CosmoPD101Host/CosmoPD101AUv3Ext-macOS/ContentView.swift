//
//  ContentView.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import AudioToolbox
import SwiftUI

struct ContentView: View {
    @ObservedObject var hostModel: AudioUnitHostModel
    
    var body: some View {
        Group {
            if let viewController = hostModel.viewModel.viewController {
                AUViewControllerUI(viewController: viewController)
            } else {
                Color.clear
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.clear)
        #if os(iOS)
        .ignoresSafeArea()
        .statusBarHidden(true)
        #endif
    }
}

#Preview {
    ContentView(hostModel: AudioUnitHostModel())
}
