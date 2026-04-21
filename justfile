# Development tasks

# Build the project
build:
    bunx bunup --config ".config/bunup/bunup.config.ts"

# Run dev server
dev:
    bunx bunup --watch --config ".config/bunup/bunup.config.ts"

# Lint tasks

# Run tsgo, biome and knip
lint:
    bunx --bun @biomejs/biome check --write
    bunx knip --max-show-issues 5 --config ".config/knip/knip.jsonc"

# TypeScript type check only
check:
    bun run --workspaces --parallel check

# Lint a commit message file
lint-commit file:
    bunx commitlint --edit {{ file }} --config ".config/commitlint/commitlint.config.ts"

# Test tasks

# Test all
test:
    bunx vitest run

# Run benchmarks
test-bench:
    bunx vitest bench --run

# Run test coverage
test-coverage:
    bunx vitest --coverage --run

# Contributor tasks

# Setup githooks and more things meant to happen to work on the repo
contributor-setup:
    bash scripts/contributor/setup.sh
