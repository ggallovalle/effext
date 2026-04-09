#!/bin/bash
# Reference: https://github.com/jacobdeichert/mask/issues/147

# === Constants ===
DIM=$'\033[2m'
RESET=$'\033[0m'
EXPECTED_BUN="1.3.11"

# === Icons ===
ICON_ERROR="❌"
ICON_WARNING="⚠️"

# === Functions ===

effext-cs-check-bun() {
    if ! command -v bun &> /dev/null; then
        echo "$ICON_ERROR bun is not installed"
        echo "   Install: https://bun.sh/docs/installation"
        return 1
    fi

    BUN_VERSION=$(bun --version | sed 's/bun //')
    if [[ "$(printf '%s\n' "$EXPECTED_BUN" "$BUN_VERSION" | sort -V | head -n1)" != "$EXPECTED_BUN" ]]; then
        echo "$ICON_WARNING bun version $BUN_VERSION (expected $EXPECTED_BUN or higher)"
        echo "   Install: https://bun.sh/docs/installation"
    fi
}

effext-cs-check-mask() {
    if ! command -v mask &> /dev/null; then
        echo "$ICON_ERROR mask is not installed"
        echo "   Install: cargo install mask"
        return 1
    fi
}

effext-cs-install-hooks() {
    echo ""
    echo "${DIM}# Install git hooks${RESET}"
    echo "${DIM}$ bunx lefthook install${RESET}"
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
