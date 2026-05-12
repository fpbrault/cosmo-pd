//
//  ValidationView.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import SwiftUI
import AudioToolbox

struct ValidationView: View {
    var hostModel: AudioUnitHostModel
    @Binding var isSheetPresented: Bool
    
    
    var body: some View {
        VStack(spacing: 12) {
            Text("AU View Disconnected")
                .font(.headline)
                .foregroundColor(.white)

            Text(hostModel.viewModel.message)
                .foregroundColor(.white.opacity(0.85))
                .multilineTextAlignment(.center)
                .frame(maxWidth: 560)

            if let validationResult = hostModel.validationResult {
                Text(validationResult == .passed ? "Validation Passed" : "Validation Failed")
                    .padding(6)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(validationResult == .passed ? Color.green : Color.red)
                    )
                    .foregroundColor(.black)
                    .onTapGesture {
                        isSheetPresented.toggle()
                    }
            }

            if hostModel.currentValidationData != nil {
                Text("Show validation details")
                    .padding(6)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.gray.opacity(0.25))
                    )
                    .foregroundColor(.white)
                    .onTapGesture {
                        isSheetPresented.toggle()
                    }
            }
        }
        .padding(24)
        .sheet(isPresented: $isSheetPresented) {
            VStack {
                Text("Close")
                    .padding(4)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.gray.opacity(0.2))
                    )
                    .foregroundColor(.primary)
                    .onTapGesture {
                        isSheetPresented.toggle()
                    }
                ScrollView {
                    VStack(alignment: .leading, spacing: 10) {
                        if let output = hostModel.currentValidationData {
                            Text(output)
                                .foregroundColor(.primary)
                                .background(Color.gray.opacity(0.1))
                                .cornerRadius(8)
                                .lineLimit(nil)
                                .frame(maxWidth: .infinity)
                        } else {
                            Text("No validation output available.")
                        }
                    }
                    .padding()
                }
            }
            .padding()
        }
    }
}
