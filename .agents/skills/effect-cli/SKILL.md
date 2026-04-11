---
name: effect-cli
description: Console.log, Config.env, Stdio streams, ChildProcess, Command parsing. Use when working with CLI output, environment variables, shell commands, or flag/argument parsing.
---

# Effect CLI

## Console

```ts
import { Console, Effect } from "effect";

Effect.gen(function* () {
    yield* Console.log("hello");
});
```

## Config (env vars)

```ts
import { Config, Effect } from "effect";

Effect.gen(function* () {
    const port = yield* Config.number("PORT");
});
```

## Stdio

```ts
import { Effect, Stdio, Stream } from "effect";

Effect.gen(function* () {
    const input = yield* Stdio.stdin;
    yield* Stream.run(Stream.make("hi"), Stdio.stdout());
});
```

## Child Process

```ts
import { Effect, ChildProcessSpawner, ChildProcess } from "effect/unstable";

Effect.gen(function* () {
    const exec = yield* ChildProcessSpawner.ChildProcessSpawner;
    const version = yield* exec.string(ChildProcess.make("git", ["--version"]));
    const lines = yield* exec.lines(ChildProcess.make("ls"));
});
```

## CLI App

```ts
import { Command, Flag } from "effect/unstable/cli";
import { Effect, Console } from "effect";

const doctorFlag = Flag.boolean("doctor").pipe(
    Flag.withDescription("show info"),
);
const outputFlag = Flag.choice("output", ["tree", "json"]).pipe(
    Flag.withDefault("tree"),
);
const portFlag = Flag.integer("port");
const configFlag = Flag.file("config", { mustExist: true }).pipe(Flag.optional);
const shellFlag = Flag.choice("shell", [
    "fish",
    "bash",
    "zsh",
    "powershell",
] as const).pipe(
    Flag.withDescription("limit output to specific shell; repeatable"),
    // variadic
    Flag.between(0, 4),
);

const root = Command.make("myapp", {
    doctor: doctorFlag,
    output: outputFlag,
    port: portFlag,
    config: configFlag,
}).pipe(Command.withDescription("my cli"));

const cli = root.pipe(
    Command.withHandler(function (config) {
        return Effect.gen(function* () {
            const stdio = yield* Stdio.Stdio;
            if (config.doctor) yield* Console.log("doctor mode");
            yield* Console.log("output");
        });
    }),
);

const sub = Command.make("subcmd", {}).pipe(
    Command.withHandler(function () {
        return Effect.gen(function* () {
            yield* Console.log("sub command");
        });
    }),
);

const cliWithSub = root.pipe(Command.withSubcommands([sub]));
```

## When

- Console: user output
- Config: env vars
- Stdio: read/write streams
- ChildProcess: shell commands
- CLI: flags, subcommands, arguments
