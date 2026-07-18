#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
output="$repo_root/scroll_progress.zip"

rm -f "$output"

cd "$repo_root/scroll_progress"
zip -r -X "$output" manifest.json background.js core.js scroll_progress.js icons screenshot.png
