// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "CosmoPd101AUv3",
    platforms: [.macOS(.v13), .iOS(.v16)],
    products: [
        .library(name: "CosmoPd101AUv3", targets: ["CosmoPd101AUv3"]),
    ],
    targets: [
        .target(
            name: "CosmoPd101AUv3",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .interoperabilityMode(.Cxx),
            ]
        ),
    ]
)