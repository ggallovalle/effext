import { styleText } from "node:util"
import { Echo } from "@kbroom/effext/Echo"
import { Console, Effect, Layer } from "effect"

// ─────────────────────────────────────────────────────────────────────────────
// Models
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @category models
 */
export interface PrefixOptions {
  readonly action?: string
  readonly command?: string
  readonly error?: string
  readonly help?: string
  readonly link?: string
  readonly success?: string
  readonly warning?: string
}

/**
 * @category models
 */
export interface ColorOptions {
  readonly action?: Parameters<typeof styleText>[0]
  readonly command?: Parameters<typeof styleText>[0]
  readonly error?: Parameters<typeof styleText>[0]
  readonly help?: Parameters<typeof styleText>[0]
  readonly link?: Parameters<typeof styleText>[0]
  readonly success?: Parameters<typeof styleText>[0]
  readonly warning?: Parameters<typeof styleText>[0]
}

// ─────────────────────────────────────────────────────────────────────────────
// Implementations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @category constructors
 */
export const makeNoop = (
  stdout: (s: string) => Effect.Effect<void>,
  stderr: (s: string) => Effect.Effect<void>,
): Echo => ({
  action: (msg) => stdout(msg),
  command: Effect.fnUntraced(function* (cmd, options) {
    const p = options?.prefix ?? "$"
    if (options?.comment) {
      yield* stdout(`# ${options.comment}`)
    }
    yield* stdout(`${p} ${cmd}`)
  }),
  error: (msg) => stderr(msg),
  help: (msg) => stdout(msg),
  link: (text, url) => stdout(`${text}: ${url}`),
  success: (msg) => stdout(msg),
  warning: (msg) => stderr(msg),
})

/**
 * @category constructors
 */
export const makePrefixed = (
  stdout: (s: string) => Effect.Effect<void>,
  stderr: (s: string) => Effect.Effect<void>,
  options: PrefixOptions,
): Echo => {
  const prefix = (msg: string, p?: string) => (p ? `${p} ${msg}` : msg)

  return {
    action: (msg) => stdout(prefix(msg, options.action)),
    command: Effect.fnUntraced(function* (cmd, opt) {
      const p = opt?.prefix ?? options.command ?? "$"
      if (opt?.comment) {
        yield* stdout(`# ${opt.comment}`)
      }
      yield* stdout(`${p} ${cmd}`)
    }),
    error: (msg) => stderr(prefix(msg, options.error)),
    help: (msg) => stdout(prefix(msg, options.help)),
    link: (text, url) => stdout(prefix(`${text}: ${url}`, options.link)),
    success: (msg) => stdout(prefix(msg, options.success)),
    warning: (msg) => stderr(prefix(msg, options.warning)),
  }
}

/**
 * @category constructors
 */
export const makeColored = (
  stdout: (s: string) => Effect.Effect<void>,
  stderr: (s: string) => Effect.Effect<void>,
  options: ColorOptions,
): Echo => {
  const style = (text: string, s?: Parameters<typeof styleText>[0]) =>
    s ? styleText(s, text) : text

  return {
    action: (msg) => stdout(style(msg, options.action)),
    command: Effect.fnUntraced(function* (cmd, opt) {
      const p = opt?.prefix ?? "$"
      if (opt?.comment) {
        yield* stdout(style(`# ${opt.comment}`, "dim"))
      }
      yield* stdout(
        style(`${style(p, options.command ?? "cyan")} ${cmd}`, "dim"),
      )
    }),
    error: (msg) => stderr(style(msg, options.error)),
    help: (msg) => stdout(style(msg, options.help)),
    link: (text, url) => {
      const s = options.link ?? "underline"
      return stdout(
        `\u001b]8;;${url}\u001b\\${style(text, s)}\u001b]8;;\u001b\\`,
      )
    },
    success: (msg) => stdout(style(msg, options.success)),
    warning: (msg) => stderr(style(msg, options.warning)),
  }
}

/**
 * @category constructors
 */
export const makeColoredPrefixed = (
  stdout: (s: string) => Effect.Effect<void>,
  stderr: (s: string) => Effect.Effect<void>,
  colorOptions: ColorOptions,
  prefixOptions: PrefixOptions,
): Echo => {
  const style = (text: string, s?: Parameters<typeof styleText>[0]) =>
    s ? styleText(s, text) : text
  const prefix = (msg: string, p?: string) => (p ? `${p} ${msg}` : msg)

  return {
    action: (msg) =>
      stdout(style(prefix(msg, prefixOptions.action), colorOptions.action)),
    command: Effect.fnUntraced(function* (cmd, opt) {
      const p = opt?.prefix ?? prefixOptions.command ?? "$"
      if (opt?.comment) {
        yield* stdout(style(`# ${opt.comment}`, "dim"))
      }
      yield* stdout(
        style(`${style(p, colorOptions.command ?? "cyan")} ${cmd}`, "dim"),
      )
    }),
    error: (msg) =>
      stderr(style(prefix(msg, prefixOptions.error), colorOptions.error)),
    help: (msg) =>
      stdout(style(prefix(msg, prefixOptions.help), colorOptions.help)),
    link: (text, url) => {
      const s = colorOptions.link ?? "underline"
      const label = prefix(`${text}: ${url}`, prefixOptions.link)
      return stdout(
        `\u001b]8;;${url}\u001b\\${style(label, s)}\u001b]8;;\u001b\\`,
      )
    },
    success: (msg) =>
      stdout(style(prefix(msg, prefixOptions.success), colorOptions.success)),
    warning: (msg) =>
      stderr(style(prefix(msg, prefixOptions.warning), colorOptions.warning)),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Layers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @category layers
 */
export const layerNoop = (
  stdout: (s: string) => Effect.Effect<void> = Console.log,
  stderr: (s: string) => Effect.Effect<void> = Console.error,
): Layer.Layer<Echo> => Layer.succeed(Echo, makeNoop(stdout, stderr))

/**
 * @category layers
 */
export const layerColored = (
  stdout: (s: string) => Effect.Effect<void> = Console.log,
  stderr: (s: string) => Effect.Effect<void> = Console.error,
  options: ColorOptions = {
    action: "bold",
    command: "cyan",
    error: "red",
    success: "green",
    warning: "yellow",
    help: "dim",
    link: "underline",
  },
): Layer.Layer<Echo> =>
  Layer.succeed(Echo, makeColored(stdout, stderr, options))

/**
 * @category layers
 */
export const layerPrefixed = (
  stdout: (s: string) => Effect.Effect<void> = Console.log,
  stderr: (s: string) => Effect.Effect<void> = Console.error,
  options: PrefixOptions = {
    action: "?",
    error: "!",
    success: "v",
    warning: "w",
    help: "i",
    link: "L",
  },
): Layer.Layer<Echo> =>
  Layer.succeed(Echo, makePrefixed(stdout, stderr, options))

/**
 * @category layers
 */
export const layerColoredPrefixed = (
  stdout: (s: string) => Effect.Effect<void> = Console.log,
  stderr: (s: string) => Effect.Effect<void> = Console.error,
  colorOptions: ColorOptions = {
    action: "bold",
    command: "cyan",
    error: "red",
    success: "green",
    warning: "yellow",
    help: "dim",
    link: "underline",
  },
  prefixOptions: PrefixOptions = {
    action: "?",
    error: "!",
    success: "v",
    warning: "w",
    help: "i",
    link: "L",
  },
): Layer.Layer<Echo> =>
  Layer.succeed(
    Echo,
    makeColoredPrefixed(stdout, stderr, colorOptions, prefixOptions),
  )

/**
 * @category layers
 */
export const layerBoxed = (
  stdout: (s: string) => Effect.Effect<void> = Console.log,
  stderr: (s: string) => Effect.Effect<void> = Console.error,
): Layer.Layer<Echo> =>
  Layer.succeed(
    Echo,
    makePrefixed(stdout, stderr, {
      action: "[info]",
      command: "[cmd]",
      error: "[error]",
      success: "[success]",
      warning: "[warning]",
      help: "[info]",
      link: "[link]",
    }),
  )

/**
 * @category layers
 */
export const layerEmoji = (
  stdout: (s: string) => Effect.Effect<void> = Console.log,
  stderr: (s: string) => Effect.Effect<void> = Console.error,
): Layer.Layer<Echo> =>
  Layer.succeed(
    Echo,
    makePrefixed(stdout, stderr, {
      action: "ℹ️",
      command: "💻",
      error: "❗",
      success: "✅",
      warning: "⚠️",
      help: "❓",
      link: "🔗",
    }),
  )
