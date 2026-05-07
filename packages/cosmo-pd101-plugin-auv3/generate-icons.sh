#!/usr/bin/env bash
# Usage: Run from anywhere — paths are relative to this script's location.
# Requires: sips (built into macOS)
#
# Source image: appicon_v1.png (must be square, at least 1024×1024, no transparency)
# To use separate dark/tinted variants, replace the copies at the bottom with your own files.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/appicon_v1.png"

MACOS_DIR="$SCRIPT_DIR/CosmoPD101Host/CosmoPD101AUv3Ext-macOS/Assets.xcassets/AppIcon.appiconset"
IOS_DIR="$SCRIPT_DIR/CosmoPD101Host/CosmoPD101Host/Assets.xcassets/AppIcon.appiconset"

if [[ ! -f "$SRC" ]]; then
  echo "❌ Source image not found: $SRC"
  exit 1
fi

resize() {
  local size="$1"
  local dest="$2"
  sips -z "$size" "$size" "$SRC" --out "$dest" --setProperty format png > /dev/null
  echo "  ✓ ${size}×${size} → $dest"
}

echo "Generating macOS AppIcon set..."
resize 16   "$MACOS_DIR/icon_16.png"
resize 32   "$MACOS_DIR/icon_16@2x.png"
resize 32   "$MACOS_DIR/icon_32.png"
resize 64   "$MACOS_DIR/icon_32@2x.png"
resize 128  "$MACOS_DIR/icon_128.png"
resize 256  "$MACOS_DIR/icon_128@2x.png"
resize 256  "$MACOS_DIR/icon_256.png"
resize 512  "$MACOS_DIR/icon_256@2x.png"
resize 512  "$MACOS_DIR/icon_512.png"
resize 1024 "$MACOS_DIR/icon_512@2x.png"
resize 1024 "$MACOS_DIR/icon_ios_1024.png"
cp "$MACOS_DIR/icon_ios_1024.png" "$MACOS_DIR/icon_ios_1024_dark.png"
cp "$MACOS_DIR/icon_ios_1024.png" "$MACOS_DIR/icon_ios_1024_tinted.png"

echo "Generating iOS AppIcon set..."
resize 1024 "$IOS_DIR/icon_ios_1024.png"
cp "$IOS_DIR/icon_ios_1024.png" "$IOS_DIR/icon_ios_1024_dark.png"
cp "$IOS_DIR/icon_ios_1024.png" "$IOS_DIR/icon_ios_1024_tinted.png"

echo "✅ All icons generated. Rebuild in Xcode to pick up changes."
