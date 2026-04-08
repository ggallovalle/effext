# Tasks

Development tasks

## build

> Build the project

```bash
bunx bunup --config "${MASKFILE_DIR}/.config/bunup/bunup.config.ts"
```

## dev

> Run dev server

```bash
bunx bunup --watch --config "${MASKFILE_DIR}/.config/bunup/bunup.config.ts"
```

## lint

> Run tsgo, biome and knip

```bash
bunx --bun @biomejs/biome check --write --unsafe \
  && tsgo --noEmit \
  && bunx knip --max-show-issues 5 --config "${MASKFILE_DIR}/.config/knip/knip.jsonc"
```

### lint commit (file)

> Lint a commit message file

```bash
bunx commitlint --edit $file --config "${MASKFILE_DIR}/.config/commitlint/commitlint.config.ts"
```

## test

> Test all

```bash
bunx vitest run
```

## test bench

> Run benchmarks

```bash
bunx vitest bench --run
```

### test coverage

> Run test coverage

```bash
bunx vitest --coverage --run
```

## contributor

> Tasks meant for contributors and aid to getting started

### contributor setup

> bun install, setup githooks and more thing meant to happen to work on the repo

```bash
bun install
```
