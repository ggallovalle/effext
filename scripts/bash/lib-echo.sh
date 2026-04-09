#!/bin/bash

# === Constants ===
DIM=$'\033[2m'
RESET=$'\033[0m'

# === Icons (ASCII only) ===
ICON_INFO="[i]"
ICON_OK="[+]"
ICON_ERROR="[x]"
ICON_WARNING="[!]"
ICON_PLEASE="[>]"

# === Styled Echo Functions ===

lib-echo-info() { echo "$ICON_INFO $*"; }
lib-echo-ok() { echo "$ICON_OK $*"; }
lib-echo-error() { echo "$ICON_ERROR $*"; }
lib-echo-warn() { echo "$ICON_WARNING $*"; }
lib-echo-please() { echo "$ICON_PLEASE $*"; }
lib-echo-command() { echo "${DIM}$ $*${RESET}"; }
