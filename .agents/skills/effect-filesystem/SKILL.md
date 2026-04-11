---
name: effect-filesystem
description: Effect FileSystem and Path APIs. Never use node:fs, node:path, or Bun.file. Use when reading/writing files, creating directories, or manipulating paths.
---

# Filesystem

## Rule

ALWAYS use Effect FileSystem + Path. NEVER node:fs, node:fs/promises, node:path, Bun.file.
See references/effect/packages/effect/src/FileSystem.ts for full API.

## Why

- Testable
- Portable - same API Bun/Node/Browser
- Proper error handling - Effect types

## FileSystem

```ts
import { Effect, FileSystem } from "effect";

Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;

    // read/write
    const content = yield* fs.readFileString("./config.json");
    yield* fs.writeFileString("./output.txt", "hello");

    // exists
    const exists = yield* fs.exists("./file.txt");

    // directory
    yield* fs.makeDirectory("./logs", { recursive: true });

    // stat
    const stats = yield* fs.stat("./file.txt");
    // stats.size, stats.mtime, etc.

    // copy/remove
    yield* fs.copy("./src", "./dest");
    yield* fs.remove("./old", { recursive: true });
});
```

## Path

```ts
import { Effect, Path } from "effect";

Effect.gen(function* () {
    const path = yield* Path.Path;

    const joined = path.join("home", "user", "file.txt");
    const resolved = path.resolve("./relative", "path");
    const basename = path.basename("/path/to/file.txt");
    const dirname = path.dirname("/path/to/file.txt");
    const extname = path.extname("file.txt");
    const normalized = path.normalize("./path/../to/file.txt");
    const isAbs = path.isAbsolute("/absolute/path");
    const parsed = path.parse("/path/to/file.txt");
    // parsed.root, parsed.dir, parsed.base, etc.
});
```

## Anti-Patterns

```ts
// BAD - node fs
import { readFile } from "node:fs/promises";
const data = await readFile("config.json", "utf-8");

// BAD - Bun.file
const file = Bun.file("config.json");
const data = await file.text();

// BAD - node path
import { join, resolve } from "node:path";
const p = join("a", "b");

// GOOD
yield * FileSystem.readFileString("config.json");
const path = yield * Path.Path;
const p = path.join("a", "b");
```

## When

- FileSystem: read, write, mkdir, stat, copy, remove
- Path: join, resolve, parse, normalize paths