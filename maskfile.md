# Tasks

Development tasks

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
