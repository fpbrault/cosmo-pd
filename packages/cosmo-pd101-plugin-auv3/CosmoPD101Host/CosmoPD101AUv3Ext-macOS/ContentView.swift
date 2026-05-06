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
    @State private var isSheetPresented = false
    
    var body: some View {
        Group {
            if hostModel.audioUnitCrashed {
                ValidationView(hostModel: hostModel, isSheetPresented: $isSheetPresented)
            } else if let viewController = hostModel.viewModel.viewController {
                AUViewControllerUI(viewController: viewController)
            } else {
                VStack(spacing: 12) {
                    ProgressView()
                    Text("Loading Cosmo PD-101 web UI...")
                    Text(hostModel.viewModel.message)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
        .ignoresSafeArea()
        .statusBarHidden(true)
    }
}

#Preview {
    ContentView(hostModel: AudioUnitHostModel())
}
