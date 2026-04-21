import {
  makeColored,
  makeColoredPrefixed,
  makeNoop,
  makePrefixed,
} from "@kbroom/effext-platform-node-shared/NodeEcho"
import { Effect } from "effect"
import { describe, expect, it, vi } from "vitest"

vi.mock("node:util", async (importOriginal) => {
  // biome-ignore lint/suspicious/noExplicitAny: I know
  const mod = await importOriginal<any>()
  return {
    ...mod,
    styleText: vi.fn((style: string | string[], text: string) => {
      const s = Array.isArray(style) ? style.join(",") : style
      return `<${s}>${text}</${s}>`
    }),
  }
})

describe("NodeEcho", () => {
  const setup = () => {
    const logs: string[] = []
    const stdout = (s: string) => Effect.sync(() => logs.push(s))
    const stderr = (s: string) => Effect.sync(() => logs.push(`err: ${s}`))
    return { logs, stdout, stderr }
  }

  describe("noop", () => {
    it("action: should write to stdout", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeNoop(stdout, stderr)
      await Effect.runPromise(echo.action("hello"))
      expect(logs).toEqual(["hello"])
    })

    it("error: should write to stderr", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeNoop(stdout, stderr)
      await Effect.runPromise(echo.error("fail"))
      expect(logs).toEqual(["err: fail"])
    })

    it("command: should format with comment on separate line", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeNoop(stdout, stderr)
      await Effect.runPromise(echo.command("ls", { comment: "list files" }))
      expect(logs).toEqual(["# list files", "$ ls"])
    })

    it("command: should skip comment line if not provided", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeNoop(stdout, stderr)
      await Effect.runPromise(echo.command("ls"))
      expect(logs).toEqual(["$ ls"])
    })

    it("link: should format as text: url", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeNoop(stdout, stderr)
      await Effect.runPromise(echo.link("google", "https://google.com"))
      expect(logs).toEqual(["google: https://google.com"])
    })
  })

  describe("prefixed", () => {
    const prefixes = {
      action: "?",
      error: "!",
      success: "v",
      warning: "w",
      help: "i",
      link: "L",
    }

    it("action: should prepend prefix", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makePrefixed(stdout, stderr, prefixes)
      await Effect.runPromise(echo.action("run"))
      expect(logs).toEqual(["? run"])
    })

    it("error: should prepend prefix to stderr", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makePrefixed(stdout, stderr, prefixes)
      await Effect.runPromise(echo.error("boom"))
      expect(logs).toEqual(["err: ! boom"])
    })

    it("command: should use command prefix and options with two lines", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makePrefixed(stdout, stderr, prefixes)
      await Effect.runPromise(
        echo.command("npm install", { prefix: ">", comment: "install deps" }),
      )
      expect(logs).toEqual(["# install deps", "> npm install"])
    })
  })

  describe("colored", () => {
    const colors = {
      action: "bold",
      command: "cyan",
      error: "red",
      success: "green",
      warning: "yellow",
    } as const

    it("command: should format with dimmed comment and command", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeColored(stdout, stderr, colors)
      await Effect.runPromise(echo.command("ls", { comment: "list" }))
      // comment: dimmed # list
      // command: dimmed $ ls (but $ is cyan)
      expect(logs).toEqual([
        "<dim># list</dim>",
        "<dim><cyan>$</cyan> ls</dim>",
      ])
    })

    it("action: should wrap in style", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeColored(stdout, stderr, colors)
      await Effect.runPromise(echo.action("run"))
      expect(logs).toEqual(["<bold>run</bold>"])
    })

    it("error: should wrap in style for stderr", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeColored(stdout, stderr, colors)
      await Effect.runPromise(echo.error("fail"))
      expect(logs).toEqual(["err: <red>fail</red>"])
    })

    it("link: should wrap in underline by default", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeColored(stdout, stderr, {})
      await Effect.runPromise(echo.link("google", "https://google.com"))
      expect(logs).toEqual([
        "\u001b]8;;https://google.com\u001b\\<underline>google</underline>\u001b]8;;\u001b\\",
      ])
    })
  })

  describe("coloredPrefixed", () => {
    const colors = {
      action: "bold",
      command: "cyan",
      error: "red",
      success: "green",
      warning: "yellow",
      help: "dim",
      link: "underline",
    } as const
    const prefixes = {
      action: "?",
      error: "!",
      success: "v",
      warning: "w",
      help: "i",
      link: "L",
    }

    it("action: prefix then color wrap", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeColoredPrefixed(stdout, stderr, colors, prefixes)
      await Effect.runPromise(echo.action("run"))
      expect(logs).toEqual(["<bold>? run</bold>"])
    })

    it("command: dim + cyan default prefix like colored", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeColoredPrefixed(stdout, stderr, colors, prefixes)
      await Effect.runPromise(echo.command("ls", { comment: "list" }))
      expect(logs).toEqual([
        "<dim># list</dim>",
        "<dim><cyan>$</cyan> ls</dim>",
      ])
    })

    it("link: prefix full label inside OSC hyperlink", async () => {
      const { logs, stdout, stderr } = setup()
      const echo = makeColoredPrefixed(stdout, stderr, colors, prefixes)
      await Effect.runPromise(echo.link("google", "https://google.com"))
      expect(logs).toEqual([
        "\u001b]8;;https://google.com\u001b\\<underline>L google: https://google.com</underline>\u001b]8;;\u001b\\",
      ])
    })
  })
})
