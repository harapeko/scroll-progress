#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
output="$repo_root/scroll_progress.zip"

rm -f "$output"

cd "$repo_root"
zip -r -X "$output" scroll_progress -x "*/.DS_Store" -x "__MACOSX/*"
