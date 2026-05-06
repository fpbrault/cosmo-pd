import SwiftUI
import UIKit

private enum WindowSizing {
    static let preferredSize = CGSize(width: 2048, height: 1536)
    static let minimumSize = CGSize(width: 1024, height: 768)
}

struct ContentView: View {
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 20) {
                Text("Cosmo PD-101")
                    .font(.largeTitle)
                    .fontWeight(.bold)

                Text("AUv3 Synthesizer")
                    .font(.body)
                    .foregroundColor(.secondary)

                Spacer()

                VStack(alignment: .leading, spacing: 12) {
                    Label("Open in GarageBand", systemImage: "music.note")
                    Label("Open in AUM", systemImage: "waveform.circle")
                    Label("Open in Cubasis", systemImage: "waveform.path.ecg")
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)

                Spacer()

                Text("This app registers the Cosmo PD-101 AUv3 extension.")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.systemBackground))
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .background(WindowSceneSizeConfigurator())
        .statusBarHidden(true)
    }
}

private struct WindowSceneSizeConfigurator: UIViewRepresentable {
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        DispatchQueue.main.async {
            configureScene(from: view)
        }
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        DispatchQueue.main.async {
            configureScene(from: uiView)
        }
    }

    private func configureScene(from view: UIView) {
        guard let scene = view.window?.windowScene else { return }
        scene.sizeRestrictions?.minimumSize = WindowSizing.minimumSize
    }
}

#Preview {
    ContentView()
}
