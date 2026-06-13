// swift-tools-version: 6.0

// NOTE: The full AUv3 app/extension is built by the Xcode project at
// CosmoPD101Host/CosmoPD101Host.xcodeproj. This Swift package contains
// reusable support code that can be unit-tested independently.
import PackageDescription

let package = Package(
    name: "CosmoPd101AUv3Support",
    platforms: [.macOS(.v13), .iOS(.v16)],
    products: [
        .library(name: "CosmoPd101AUv3Support", targets: ["CosmoPd101AUv3Support"]),
    ],
    targets: [
        .target(name: "CosmoPd101AUv3Support"),
        .testTarget(
            name: "CosmoPd101AUv3SupportTests",
            dependencies: ["CosmoPd101AUv3Support"]
        ),
    ]
)
