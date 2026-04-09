#!/bin/bash

source "$(dirname "$0")/../bash/import.sh"

import-lib "lib-echo.sh"

# === Functions ===

effext-cs-check-bun() {
    lib-echo-info "Checking bun version..."
    if ! command -v bun &> /dev/null; then
        lib-echo-error "bun is not installed"
        lib-echo-please "Install: https://bun.sh/docs/installation"
        return 1
    fi

    BUN_VERSION=$(bun --version | sed 's/bun //')
    if [[ "$(printf '%s\n' "$EXPECTED_BUN" "$BUN_VERSION" | sort -V | head -n1)" != "$EXPECTED_BUN" ]]; then
        lib-echo-warn "bun version $BUN_VERSION (expected $EXPECTED_BUN or higher)"
        lib-echo-please "Install: https://bun.sh/docs/installation"
    else
        lib-echo-ok "bun version $BUN_VERSION"
    fi
}

# Reference: https://github.com/jacobdeichert/mask/issues/147
# when that is implemented mask can be a simple dev dependency inn package.json
effext-cs-check-mask() {
    lib-echo-info "Checking mask installation..."
    if ! command -v mask &> /dev/null; then
        lib-echo-warn "mask is not installed"
        lib-echo-please "Install: cargo install mask"
    else
        lib-echo-ok "mask is installed"
    fi
}

effext-cs-install-hooks() {
    lib-echo-info "Installing git hooks..."
    lib-echo-command "bunx lefthook install"
    bunx lefthook install
}

effext-cs-main() {
    if ! effext-cs-check-bun; then
        echo ""
        lib-echo-please "install bun first, then run this script again."
        exit 1
    fi

    effext-cs-check-mask

    effext-cs-install-hooks
}

effext-cs-main "$@"
