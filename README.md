# effext

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                     effext                                    ║
║           Extensions for Effect — stdlib explored             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

> Extensions for Effect — exploring what belongs in the standard library.

[![License: MIT](https://img.shields.io/badge/License-MIT-darkgreen.svg)](./LICENSE)
[![Bun version](https://img.shields.io/badge/Bun-%E2%89%A5+1.3.0-yellow.svg)](https://bun.sh)
[![Node version](https://img.shields.io/badge/Node-%E2%89%A522+-green.svg)](https://nodejs.org)

**[English](./README.md)** | **[Español](./README.es.md)**

---

## Table of Contents

- [About](#about)
- [Status](#status)
- [Modules](#modules)
- [Design Principles](#design-principles)

---

## About

**effext** is a collection of modules built on top of [Effect](https://effect.website/), focused on capabilities that are commonly needed in real-world applications but are not part of the core library.

The goal is simple:

- Build useful, production-oriented modules using idiomatic Effect patterns
- Validate them through real usage
- And, where it makes sense, contribute them upstream

> Not a replacement for Effect — a proving ground for what could become part of it.

---

## Status

This project is currently in the **planning phase**.
The following modules are planned, but not yet implemented:

```ts
import {
    ConfigLayered,
    ConfigYaml,
    ConfigJsonc,
    I18n,
    // and more
} from "@kbroom/effext";
// or
import * as I18n from "@kbroom/effext/I18n";
import * as ConfigLayered from "@kbroom/effext/ConfigLayered";
// and more
```

---

## Modules

### Internationalization

| Module         | Description                     |
| -------------- | ------------------------------- |
| **I18n**       | Base abstractions               |
| **I18nFluent** | Integration with Mozilla Fluent |

### Diagnostics & Developer Experience

| Module     | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| **Miette** | Rich, structured error diagnostics (inspired by Rust miette) |

### System

| Module  | Description                     |
| ------- | ------------------------------- |
| **Xdg** | Access XDG base directory paths |

### Configuration

| Module            | Description                                      |
| ----------------- | ------------------------------------------------ |
| **ConfigLayered** | Layered configuration system (cosmiconfig-style) |
| **ConfigYaml**    | YAML config loader with rich diagnostics         |
| **ConfigJsonc**   | JSONC config loader with rich diagnostics        |
| **ConfigKdl**     | KDL config loader with rich diagnostics          |

### Terminal Output

| Module   | Description                          |
| -------- | ------------------------------------ |
| **Echo** | Expressive terminal output utilities |

---

## Design Principles

- **Effect-first** — Built using the same patterns and abstractions as Effect
- **Composable** — Small pieces that work well together
- **Pragmatic** — Focused on real-world needs, not just theoretical purity
- **Upstream-friendly** — Designed with potential inclusion in Effect in mind
