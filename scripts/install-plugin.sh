#!/usr/bin/env bash
# Install built plugin bundles from package-local target/ to system plugin directories
# Usage: ./scripts/install-plugin.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
RUST_WORKSPACE="$ROOT"

# Use release by default, allow override via PROFILE env var
PROFILE="${PROFILE:-release}"
INSTALL_AUV2="${INSTALL_AUV2:-1}"
INSTALL_AUV3="${INSTALL_AUV3:-0}"
INSTALL_CLAP="${INSTALL_CLAP:-1}"
REMOVE_INSTALLED_AUV2="${REMOVE_INSTALLED_AUV2:-0}"
REMOVE_INSTALLED_AUV3="${REMOVE_INSTALLED_AUV3:-1}"
PLUGIN_BASENAME="${PLUGIN_BASENAME:-CosmoPd101}"
LEGACY_PLUGIN_BASENAME="CosmoPd101Plugin"

normalize_platform() {
  local uname_value="$1"
  case "$uname_value" in
    Darwin) echo "macos" ;;
    Linux) echo "linux" ;;
    MINGW*|MSYS*|CYGWIN*|Windows_NT) echo "windows" ;;
    *) echo "unknown" ;;
  esac
}

PLATFORM="${PLUGIN_PLATFORM:-$(normalize_platform "$(uname -s)")}";

# Mirror cargo's target-dir resolution used by build scripts.
# - Absolute CARGO_TARGET_DIR is used as-is
# - Relative CARGO_TARGET_DIR is resolved from workspace root
# - Default falls back to the plugin package-local target directory
if [[ -n "${CARGO_TARGET_DIR:-}" ]]; then
  if [[ "$CARGO_TARGET_DIR" = /* ]]; then
    TARGET_ROOT="$CARGO_TARGET_DIR"
  else
    TARGET_ROOT="$RUST_WORKSPACE/$CARGO_TARGET_DIR"
  fi
else
  TARGET_ROOT="$RUST_WORKSPACE/packages/cosmo-pd101-plugin/target"
fi

TARGET_DIR="$TARGET_ROOT/$PROFILE"

case "$PLATFORM" in
  macos)
    VST3_SYSTEM="$HOME/Library/Audio/Plug-Ins/VST3"
    AU_SYSTEM="$HOME/Library/Audio/Plug-Ins/Components"
    CLAP_SYSTEM="$HOME/Library/Audio/Plug-Ins/CLAP"
    ;;
  linux)
    VST3_SYSTEM="$HOME/.vst3"
    AU_SYSTEM=""
    CLAP_SYSTEM="$HOME/.clap"
    INSTALL_CLAP="0"
    INSTALL_AUV2="0"
    INSTALL_AUV3="0"
    ;;
  windows)
    echo "ERROR: plugin:install is not supported on Windows shell. Install bundles manually or use installer packaging scripts." >&2
    exit 2
    ;;
  *)
    echo "ERROR: unsupported platform '$PLATFORM'" >&2
    exit 2
    ;;
esac

VST3_SRC="$TARGET_DIR/$PLUGIN_BASENAME.vst3"
AUV2_SRC="$TARGET_DIR/$PLUGIN_BASENAME.component"
AUV3_SRC="$TARGET_DIR/$PLUGIN_BASENAME.app"
CLAP_SRC="$TARGET_DIR/$PLUGIN_BASENAME.clap"

if [[ ! -d "$VST3_SRC" ]]; then
  echo "ERROR: $VST3_SRC not found. Run 'bun run build:plugin:release' first." >&2
  exit 1
fi

if [[ "$INSTALL_AUV2" == "1" && ! -d "$AUV2_SRC" ]]; then
  echo "ERROR: $AUV2_SRC not found. Run 'bun run build:plugin:release' first." >&2
  exit 1
fi

if [[ "$INSTALL_CLAP" == "1" && ! -d "$CLAP_SRC" ]]; then
  echo "ERROR: $CLAP_SRC not found. Run 'bun run build:plugin:release' first, or set INSTALL_CLAP=0." >&2
  exit 1
fi

copy_bundle() {
  local src="$1"
  local dest="$2"
  if command -v ditto >/dev/null 2>&1; then
    ditto "$src" "$dest"
  else
    cp -R "$src" "$dest"
  fi
}

mkdir -p "$VST3_SYSTEM"
if [[ -n "$AU_SYSTEM" ]]; then
  mkdir -p "$AU_SYSTEM"
fi
if [[ "$INSTALL_CLAP" == "1" ]]; then
  mkdir -p "$CLAP_SYSTEM"
fi

echo "==> Installing VST3..."
rm -rf "$VST3_SYSTEM/$LEGACY_PLUGIN_BASENAME.vst3"
rm -rf "$VST3_SYSTEM/$PLUGIN_BASENAME.vst3"
copy_bundle "$VST3_SRC" "$VST3_SYSTEM/$PLUGIN_BASENAME.vst3"
echo "    -> $VST3_SYSTEM/$PLUGIN_BASENAME.vst3"

if [[ "$INSTALL_CLAP" != "1" ]]; then
  echo "==> Skipping CLAP install (INSTALL_CLAP=$INSTALL_CLAP)"
else
  echo "==> Installing CLAP..."
  rm -rf "$CLAP_SYSTEM/$LEGACY_PLUGIN_BASENAME.clap"
  rm -rf "$CLAP_SYSTEM/$PLUGIN_BASENAME.clap"
  copy_bundle "$CLAP_SRC" "$CLAP_SYSTEM/$PLUGIN_BASENAME.clap"
  echo "    -> $CLAP_SYSTEM/$PLUGIN_BASENAME.clap"
fi

if [[ "$INSTALL_AUV2" != "1" ]]; then
  echo "==> Skipping AUv2 component install (INSTALL_AUV2=$INSTALL_AUV2)"
  if [[ "$REMOVE_INSTALLED_AUV2" == "1" && -d "$AU_SYSTEM/$PLUGIN_BASENAME.component" ]]; then
    echo "==> Removing installed AUv2 component..."
    rm -rf "$AU_SYSTEM/$PLUGIN_BASENAME.component"
    echo "    -> removed $AU_SYSTEM/$PLUGIN_BASENAME.component"
  fi
else
  echo "==> Installing AUv2 component..."
  rm -rf "$AU_SYSTEM/$LEGACY_PLUGIN_BASENAME.component"
  rm -rf "$AU_SYSTEM/$PLUGIN_BASENAME.component"
  copy_bundle "$AUV2_SRC" "$AU_SYSTEM/$PLUGIN_BASENAME.component"
  echo "    -> $AU_SYSTEM/$PLUGIN_BASENAME.component"
fi

if [[ "$INSTALL_AUV3" != "1" ]]; then
  echo "==> Skipping AUv3 app install (INSTALL_AUV3=$INSTALL_AUV3)"
  if [[ "$REMOVE_INSTALLED_AUV3" == "1" && -d "$HOME/Applications/$PLUGIN_BASENAME.app" ]]; then
    echo "==> Removing installed AUv3 app..."
    rm -rf "$HOME/Applications/$PLUGIN_BASENAME.app"
    echo "    -> removed $HOME/Applications/$PLUGIN_BASENAME.app"
  fi
elif [[ -d "$AUV3_SRC" ]]; then
  echo "==> Installing AUv3 app..."
  rm -rf "$HOME/Applications/$PLUGIN_BASENAME.app"
  copy_bundle "$AUV3_SRC" "$HOME/Applications/$PLUGIN_BASENAME.app"
  echo "    -> $HOME/Applications/$PLUGIN_BASENAME.app"
  echo "==> Registering AUv3 app..."
  open "$HOME/Applications/$PLUGIN_BASENAME.app" || true
  sleep 1
  killall "$PLUGIN_BASENAME" 2>/dev/null || true
else
  echo "==> Skipping AUv3 app install (bundle not built)"
fi

# Invalidate AU cache so the host re-scans
if [[ "$PLATFORM" == "macos" ]]; then
  echo "==> Invalidating AU cache..."
  killall -9 AudioComponentRegistrar 2>/dev/null || true
fi

echo "==> Done."
