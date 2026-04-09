#!/bin/bash
# Reference: https://github.com/jacobdeichert/mask/issues/147

# === Constants ===
DIM=$'\033[2m'
RESET=$'\033[0m'
EXPECTED_BUN="1.3.11"

# === Icons (ASCII only) ===
ICON_INFO="[i]"
ICON_OK="[+]"
ICON_ERROR="[x]"
ICON_WARNING="[!]"
ICON_PLEASE="[>]"

# === Styled Echo Functions ===

effext-cs-echo-info() { echo "$ICON_INFO $*"; }
effext-cs-echo-ok() { echo "$ICON_OK $*"; }
effext-cs-echo-error() { echo "$ICON_ERROR $*"; }
effext-cs-echo-warn() { echo "$ICON_WARNING $*"; }
effext-cs-echo-please() { echo "$ICON_PLEASE $*"; }
effext-cs-echo-command() { echo "${DIM}$ $*${RESET}"; }

# === Functions ===

effext-cs-check-bun() {
    effext-cs-echo-info "Checking bun version..."
    if ! command -v bun &> /dev/null; then
        effext-cs-echo-error "bun is not installed"
        effext-cs-echo-please "Install: https://bun.sh/docs/installation"
        return 1
    fi

    BUN_VERSION=$(bun --version | sed 's/bun //')
    if [[ "$(printf '%s\n' "$EXPECTED_BUN" "$BUN_VERSION" | sort -V | head -n1)" != "$EXPECTED_BUN" ]]; then
        effext-cs-echo-warn "bun version $BUN_VERSION (expected $EXPECTED_BUN or higher)"
        effext-cs-echo-please "Install: https://bun.sh/docs/installation"
    else
        effext-cs-echo-ok "bun version $BUN_VERSION"
    fi
}

effext-cs-check-mask() {
    effext-cs-echo-info "Checking mask installation..."
    if ! command -v mask &> /dev/null; then
        effext-cs-echo-warn "mask is not installed"
        effext-cs-echo-please "Install: cargo install mask"
    else
        effext-cs-echo-ok "mask is installed"
    fi
}

effext-cs-install-hooks() {
    effext-cs-echo-info "Installing git hooks..."
    effext-cs-echo-command "bunx lefthook install"
    bunx lefthook install
}

effext-cs-main() {
    if ! effext-cs-check-bun; then
        echo ""
        echo "Please install bun first, then run this script again."
        exit 1
    fi

    effext-cs-check-mask

    effext-cs-install-hooks
}

effext-cs-main "$@"
