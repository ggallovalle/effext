---
name: effect-gen
description: Effect.gen patterns for AI code. Never use runPromise/runSync - write programs only. Wrap external SDKs with Effect.promise/tryPromise. Use when writing Effect programs or integrating non-effect libraries.
---

# Effect Programs

## AI Writes Only

AI writes Effect.gen programs. Never the entry point.

```ts
// AI writes this (CORRECT)
const program = Effect.gen(function*() {
  const result = yield* decode(input)
  yield* Effect.log(result)
})
```

## Anti-Patterns

These are human-only, NOT AI:

```ts
// WRONG - AI never writes these
Effect.runPromise(program)
Effect.runSync(program)
```

## Wrap Non-Effect Code

When integrating external SDKs or non-effect packages, wrap them:

```ts
import { Effect } from "effect"
import { ExternalClient } from "some-npm-package"

const client = new ExternalClient()

// async, no error expected
const users = yield* Effect.promise(() => client.fetchUsers())

// async, might throw, map to typed error
const data = yield* Effect.tryPromise({
  try: () => client.parse(input),
  catch: (e) => new ParseError(e)
})
```

## Why

- **Entry point human-only**: AI can't know runtime context (sync/async, timeout, context). Human decides.
- **Business logic in Effect.gen**: AI focuses on pure transformation, not side effects.
- **Testable**: Effect.gen programs easy to test with mock layers.