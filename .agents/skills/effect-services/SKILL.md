---
name: effect-services
description: Context.Service, Layer for dependency injection. Use when defining services, logging, configuration, or providing implementations to Effect programs.
---

# Effect Services

## Define

```ts
import { Context, type Effect } from "effect";

export interface Logger {
    log: (msg: string) => Effect.Effect<void>;
}

export const Logger = Context.Service<Logger>("Logger");
```

## Use

```ts
import { Effect } from "effect";
import { Logger } from "./Logger";

const program = Effect.gen(function* () {
    const logger = yield* Logger;
    yield* logger.log("hello world");
});
```

## Provide

```ts
import { Layer } from "effect";

const liveLogger = Layer.succeed(Logger, {
    log: (msg) => Effect.sync(() => console.log(msg)),
});

Effect.runPromise(program.pipe(Layer.provide(liveLogger)));
```

## Example (Echo)

```ts
export const Echo = Context.Service<Echo>("@kbroom/effext/Echo");

const program = Effect.gen(function* () {
    const echo = yield* Echo;
    yield* echo.action("Run npm install");
});
```

## Anti-Pattern

```ts
// WRONG - v3
const Logger = Context.GenericTag<Logger>("Logger");
yield * Effect.service(Logger);
```

## When

Services: config, loggers, DB, HTTP. yield* in Effect.gen.

## Refs

- libs/effext/src/Echo.ts
- libs/effext/src/Diagnostic.ts
- references/effect/packages/effect/src/Context.ts
- references/effect/packages/effect/src/Layer.ts