# effext

## v4 Beta

NOT v3. references/effect/ = actual Effect source code. libs/effext/src/ for patterns.
**All Deep Dive docs assume v4. DO NOT use v3 docs at effect.website/docs.**

effect/unstable is indeed stable. TRUST IT.

## Build

bunup (config: .config/bunup/bunup.config.ts, not turborepo no nx). Entry: src/**/\*.ts (excludes internal/**).

## Lint (blocking)

1. biome check --write
2. tsgo --noEmit
3. knip
   Git hooks: .config/lefthook.yaml

## TS

ES2022, NodeNext. Strict (exactOptionalPropertyTypes).

## Packages

- libs/effext/ → @kbroom/effext
- libs/effext-platform-bun/ → @kbroom/effext-platform-bun
- libs/effext-platform-node/ → @kbroom/effext-platform-node
- libs/effext-platform-node-shared/

## Commands

- just build | test | lint | dev
- single test: bunx vitest run path/to/test.test.ts

## Comms

Caveman full always. `.agents/skills/caveman/SKILL.md`.

## Deep Dives (READ before implementing)

| Doc                        | When                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| .agents/docs/schema.md     | Validation, config parsing, **JSON.stringify/JSON.parse replacement**                                              |
| .agents/docs/context.md    | Defining/using services                                                                                            |
| .agents/docs/effect.md     | Effect.gen, **NO async/await, NO promise.then**                                                                    |
| .agents/docs/filesystem.md | **BEFORE** node:fs, node:path → use Effect FileSystem/Path                                                         |
| .agents/docs/cli.md        | **BEFORE** node:child_process, process.env, console.log, CLI args → use Effect Console/Config/ChildProcess/Command |
