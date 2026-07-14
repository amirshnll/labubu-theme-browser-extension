#\!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$ROOT_DIR/build"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/chrome" "$BUILD_DIR/firefox"

cp -R "$ROOT_DIR/icons" "$ROOT_DIR/images" "$ROOT_DIR/newtab.html" "$ROOT_DIR/newtab.js" "$ROOT_DIR/options.html" "$ROOT_DIR/options.js" "$ROOT_DIR/service_worker.js" "$BUILD_DIR/chrome/"
cp "$ROOT_DIR/chrome/manifest.json" "$BUILD_DIR/chrome/"

cp -R "$ROOT_DIR/icons" "$ROOT_DIR/images" "$ROOT_DIR/newtab.html" "$ROOT_DIR/newtab.js" "$ROOT_DIR/options.html" "$ROOT_DIR/options.js" "$ROOT_DIR/service_worker.js" "$BUILD_DIR/firefox/"
cp "$ROOT_DIR/firefox/manifest.json" "$BUILD_DIR/firefox/"

cd "$BUILD_DIR/chrome"
zip -r "$ROOT_DIR/labubu-chrome.zip" . --exclude ".git/*" --exclude "release.sh" --exclude .DS_Store

cd "$BUILD_DIR/firefox"
zip -r "$ROOT_DIR/labubu-firefox.zip" . --exclude ".git/*" --exclude "release.sh" --exclude .DS_Store

echo "Build complete: $ROOT_DIR/labubu-chrome.zip and $ROOT_DIR/labubu-firefox.zip"
