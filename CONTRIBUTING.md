# Contributing

## Getting Started

### Prerequisites

- [bun](https://bun.sh/docs/installation) (version 1.3.11 or higher) - all-in-one JS runtime & package manager

### Setup

Run the contributor setup script:

```bash
bunx just contributor-setup
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
