---
name: effect-program
description: Effect program patterns for AI code. Never use runPromise/runSync - write programs only. Use when writing Effect programs or integrating non-effect libraries.
---

# Effect Programs

## AI Writes Only

AI writes Effect.gen or Effect.fn programs. Never the entry point. This is where you stop, you will let
the user wire up the services and layers on their own. The same goes for any "effect" ts program, including
cli and others.

AI does not throw errors, does not use try catch, promise.then or promise.catch, just writes programs
and if it needs to fail it fails with an effect native type by `return yield* effectNativeErrorType`

```ts
// AI writes this (CORRECT)
export const program = Effect.gen(function* () {
    const result = yield* decode(input);
    yield* Effect.log(result);
});

export const programWithParameters = Effect.fn("name")(
    function* (param1, param2) {
        const result = yield* decode(input);
        yield* Effect.log(result);
    },
);
```

## Anti-Patterns

These are human-only, NOT AI:

```ts
// WRONG - AI never writes these
Effect.runPromise(program);
Effect.runSync(program);
const main = program.pipe(Effect.provide(SomeLayer));
const result = programWithParameters(one, two).pipe(Effect.provide(SomeLayer));
Effect.runPromise(main);
Effect.runPromise(result);
```

## Wrap Non-Effect Code

When integrating external SDKs or non-effect packages/modules/functions, wrap them:
Ask confirmation to the user before implementing a wrapper with the reasoning
behind why and what is your plan on how to implement it, there might be the case
that the user knows of an existing wrapper

```ts
import { Effect, Schema } from "effect";
import {
    ExternalClient,
    ExternalClientError,
} from "some-npm-package-with-promise-api";
import {
    parser,
    ParserError,
    DownloadError,
} from "some-npm-package-with-sync-api";

// define Effect tagged error
const ReasonTypeId = "~package/ExternalClientError" as const;

export class ConnectionError extends Schema.TaggedErrorClass<ConnectionError>(
    "package/ExternalClientError",
)("ConnectionError", {
    // if the wrapped api do not expose a custom error class
    cause: Schema.Defect,
    // if the wrapped api does provide an error class
    cause: Schema.instanceOf(ExternalClientError),
    cause: Schema.instanceOf(ParserError),
    // if the wrapped api does provide a known set of error classes
    cause: Schema.Union([
        Schema.instanceOf(ParserError),
        Schema.instanceOf(DownloadError),
    ]),
}) {
    /**
     * @since 4.0.0
     */
    readonly [ReasonTypeId] = ReasonTypeId;
}

// sync, no error expected
const parserEffect = (parameters) => Effect.sync(() => parser(parameters));

// sync, might throw, map to typed error
const parserEffect = (parameters) =>
    Effect.try({
        try: () => parser(parameters),
        catch: (cause) => new ConnectionError({ cause }),
    });

// async, no error expected
const clientFetchUsers = (client) => Effect.promise(() => client.fetchUsers());

// async, might throw, map to typed error
const clientParse = (client, input1, input2) =>
    Effect.tryPromise({
        try: () => client.parse(input1, input2),
        catch: (cause) => new ConnectionError({ cause }),
    });

// and then you can use them like so
export const program = Effect.gen(function* () {
    const client = new ExternalClient();
    const users = yield* clientFetchUsers(input);
    const clientParse = yield* clientParse(client, input);
    const result = yield* parserEffect(parameters);
    if (someReason) {
        // fails with an effect native type
        return yield* new ConnectionError();
    }
    yield* Effect.log(result);
});
```

## Why

- **Entry point human-only**: AI can't know runtime context (sync/async, timeout, context). Human decides.
- **Business logic in Effect.gen**: AI focuses on pure transformation, not side effects.
- **Testable**: Effect.gen programs easy to test with mock layers.
