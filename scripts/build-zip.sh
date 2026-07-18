#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
output="$repo_root/extension.zip"

rm -f "$output"

cd "$repo_root/extension"
zip -r -X "$output" manifest.json background.js badge.js core.js indicator.js content.js icons screenshot.png
