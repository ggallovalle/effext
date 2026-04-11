# Effect Schema

## Define

```ts
import { Schema } from "effect";

// primitives
Schema.String;
Schema.Number;
Schema.Boolean;

// literals
Schema.Literal("a");
Schema.Literals(["a", "b", "c"]);
```

## Struct

```ts
const Config = Schema.Struct({
    name: Schema.String,
    port: Schema.optionalKey(Schema.Number),
    tags: Schema.Array(Schema.String),
});
```

## Use

```ts
import { Effect, Schema } from "effect";

// decodeUnknownEffect returns decoder function (reuseable!)
const decode = Schema.decodeUnknownEffect(Config);

// use in Effect.gen
const program = Effect.gen(function* () {
    const result = yield* decode({ name: "app", port: 8080 });
    yield* Effect.log(result.name);
});

Effect.runPromise(program);

// or reuse decoder multiple times
const program2 = Effect.gen(function* () {
    const a = yield* decode({ name: "a", port: 1 });
    const b = yield* decode({ name: "b", port: 2 });
});

// encode - inside Effect.gen
const encode = Schema.encodeUnknownEffect(Config);

const program = Effect.gen(function* () {
    const decoded = yield* decode({ name: "app" });
    const encoded = yield* encode(decoded);
});
```

## Union

```ts
const Status = Schema.Union([Schema.Literal("ok"), Schema.Literal("err")]);

// literals shortcut
const Colors = Schema.Literals(["red", "green", "blue"]);
```

## Transform

```ts
import { Schema, SchemaTransformation } from "effect";

const trimmed = Schema.String.pipe(Schema.decode(SchemaTransformation.trim()));

// or from/to different types
const FiniteFromString = Schema.Number.pipe(
    Schema.decode(SchemaTransformation.finitize()),
);
```

## Brand

```ts
const UserId = Schema.String.pipe(Schema.brand("UserId"));
type UserId = Schema.Schema.Type<typeof UserId>;
```

## Common

- String, Number + .check(constraint), Boolean
- Struct, optionalKey, mutableKey
- Array, Tuple, Record
- Union, Literals
- brand, transform, optional

## When

Config parsing, API validation, serialization.

## Refs

- references/effect/packages/effect/SCHEMA.md
- usage: libs/effext/src/
