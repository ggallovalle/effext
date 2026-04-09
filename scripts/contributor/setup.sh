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

effext-cs-install-hooks() {
    lib-echo-info "Installing git hooks..."
    lib-echo-command "bunx lefthook install"
    bunx lefthook install
}

effext-cs-effect-tsgo() {
    lib-echo-info "Installing effect-tsgo..."
    lib-echo-command "bunx effect-tsgo patch"
    bunx effect-tsgo patch
}

effext-cs-terminal-config-tip() {
    lib-echo-tip "Terminal config available!"
    lib-echo-info "Source your shell config for project aliases & env vars:"

    case "$SHELL" in
        */fish)
            lib-echo-command "source .config/fish/config.fish"
            ;;
        */zsh)
            lib-echo-command "source .config/zsh/zshrc.zsh"
            ;;
        */bash)
            lib-echo-command "source .config/bash/bashrc.bash"
            ;;
        *)
            lib-echo-please "Check .config/*/ for your shell config"
            ;;
    esac
}

effext-cs-main() {
    if ! effext-cs-check-bun; then
        echo ""
        lib-echo-please "install bun first, then run this script again."
        exit 1
    fi

    effext-cs-install-hooks
    effext-cs-effect-tsgo
    effext-cs-terminal-config-tip
}

effext-cs-main "$@"
