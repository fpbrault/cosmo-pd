// swift-tools-version: 6.0

// NOTE: Full AUv3 requires the Xcode project at CosmoPD101Host/CosmoPD101Host.xcodeproj
// for the Rust FFI + WKWebView extension. This SPM target provides testable pure-MIDI parsing.
import PackageDescription

let package = Package(
    name: "CosmoPd101AUv3",
    platforms: [.macOS(.v13), .iOS(.v16)],
    products: [
        .library(name: "CosmoPd101AUv3", targets: ["CosmoPd101AUv3"]),
    ],
    targets: [
        .target(name: "CosmoPd101AUv3"),
        .testTarget(
            name: "CosmoPd101AUv3Tests",
            dependencies: ["CosmoPd101AUv3"]
        ),
    ]
)