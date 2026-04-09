#!/bin/bash

# === Constants ===
DIM=$'\033[2m'
RESET=$'\033[0m'

# Unicode characters only
ICON_INFO="[INFO]"
ICON_OK="[OK]"
ICON_ERROR="[ERR]"
ICON_WARNING="[WARN]"
ICON_PLEASE="[PLS]"
ICON_TIP="[TIP]"

# === Styled Echo Functions ===

lib-echo-info() { echo "$ICON_INFO $*"; }
lib-echo-ok() { echo "$ICON_OK $*"; }
lib-echo-error() { echo "$ICON_ERROR $*"; }
lib-echo-warn() { echo "$ICON_WARNING $*"; }
lib-echo-please() { echo "$ICON_PLEASE $*"; }
lib-echo-command() { echo "${DIM}$ $*${RESET}"; }
lib-echo-tip() { echo "$ICON_TIP $*"; }
