# Contributing

## Getting Started

### Prerequisites

- [bun](https://bun.sh/docs/installation) (version 1.3.11 or higher) - all-in-one JS runtime & package manager
- [mise](https://mise.jdx.dev/getting-started.html) - task runner

### Before you start

Trust the repository mise config (one-time only):

```bash
mise trust
```

### Setup

Run the contributor setup script:

```bash
mise run contributor-setup
```

This script will:

1. Check that bun is installed and at the expected version
2. Install git hooks via lefthook
3. Setup effect-tsgo for typescript with effect diagnostic

## Architecture

This is a TypeScript monorepo with a directory structure for organizing applications, libraries, and shared configurations.

### Directory Structure

```
effext/
├── .config/      # Third-party tooling configuration (commitlint, knip, shell configs, etc.)
├── apps/         # Application projects
├── config/       # Configuration for our own libraries
├── docs/         # Documentation
├── examples/     # Example code
├── libs/         # Shared libraries
├── patches/      # Patches
├── references/   # Reference materials
├── scripts/      # Build/run scripts
├── templates/    # Templates
└── scratchpad/   # Scratch workspace
```

## Terminal Configuration

This project uses a unified YAML specification to generate shell configs for all 4 supported shells (fish, bash, zsh, PowerShell).

### Adding aliases or environment variables

1. Edit `.config/terminal.yaml`:

```yaml
alias:
    lint: mise run lint
    test: mise run test
env:
    ROOT_DIR:
        command: git rev-parse --show-toplevel
```

2. Run the generator:

```bash
bun run scripts/terminal-gen.ts
```

### Sourcing the generated config

Run the appropriate command for your shell:

#### fish

```fish
# from the root of the repo do
source .config/fish/config.fish
```

#### bash

```bash
# from the root of the repo do
source .config/bash/bashrc.bash
```

#### zsh

```zsh
# from the root of the repo do
source .config/zsh/zshrc.zsh
```

#### PowerShell

```powershell
# from the root of the repo do
Import-Module .config/powershell/profile.ps1
```

### File structure

| File                         | Purpose                                            |
| ---------------------------- | -------------------------------------------------- |
| `.config/terminal.yaml`      | Source of truth - define aliases and env vars here |
| `scripts/terminal-gen.ts`    | Generator script                                   |
| `.config/*/config.fish` etc. | Shell config that sources the gen file             |
| `.config/*/gen-*`            | Generated files (do not edit)                      |
