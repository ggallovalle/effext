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

## Shell Integration

This project uses mise for shell aliases. To enable project aliases in your shell, add mise activation to your shell rc:

```bash
# bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# zsh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc

# fish
echo 'mise activate fish | source' >> ~/.config/fish/config.fish
```

Restart your shell or source your rc file, then `cd` into the project directory.

Available aliases (automatically set when in project directory):
- `goroot` - go to repo root
- `goeffext` - go to libs/effext
- `goconfig` - go to .config
- `go.config` - go to .config

## Architecture

This is a TypeScript monorepo with a directory structure for organizing applications, libraries, and shared configurations.

### Directory Structure

```
effext/
├── .config/      # Third-party tooling configuration (commitlint, knip, mise, etc.)
├── apps/         # Application projects
├── config/       # Project-specific config (varlock env schemas, etc.)
├── docs/         # Documentation
├── examples/     # Example code
├── libs/         # Shared libraries
├── patches/      # Patches
├── references/   # Reference materials
├── scripts/      # Build/run scripts
├── templates/    # Templates
└── scratchpad/   # Scratch workspace
```
