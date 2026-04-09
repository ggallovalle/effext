#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

import-lib() {
    local lib="$1"
    source "$ROOT_DIR/bash/$lib"
}
