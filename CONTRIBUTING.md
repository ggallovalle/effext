# Contributing

## Getting Started

### Prerequisites

- [bun](https://bun.sh/docs/installation) (version 1.3.11 or higher) - all-in-one JS runtime & package manager
- [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) (optional, for installing mask) - Rust package manager
- [mask](https://github.com/jacobdeichert/mask) - CLI task runner defined in maskfile.md

### Setup

Run the contributor setup script:

```bash
bash scripts/contributor/setup.sh
```

This script will:

1. Check that bun is installed and at the expected version
2. Check that mask is installed (optional)
3. Install git hooks via lefthook

## Architecture

This is a TypeScript monorepo template providing a flexible directory structure for organizing applications, libraries, and shared configurations.

### Directory Structure

```
effext/
├── apps/         # Application projects
├── .config/      # Third-party tooling configuration (commitlint, knip, shell configs, etc.)
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
