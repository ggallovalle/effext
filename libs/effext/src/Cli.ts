import { Context, Schema } from "effect"
import { Flag, GlobalFlag } from "effect/unstable/cli"

export const ThemeTypeId = "~@kbroom/effext/Cli/Theme"

/**
 * @category models
 * @since 0.0.1
 */
export const ColorDepth = Schema.Literals([1, 4, 8, 24])
export type ColorDepth = Schema.Schema.Type<typeof ColorDepth>

/**
 * The preferred theme for code syntax highlighting.
 *
 * @since 0.0.1
 * @category models
 */
export type CodeTheme = "dark" | "light" | "auto"

/**
 * The preferred format for data output.
 *
 * @since 0.0.1
 * @category models
 */
export type DataFormat = "json" | "yaml" | "jsonl"

/**
 * Represents user theme preferences for terminal output.
 *
 * Contains display preferences for colors, code rendering, and data output format.
 * Implementation-specific defaults - users can override via CLI flags, config,
 * or environment variables.
 *
 * @since 0.0.1
 * @category models
 */
export interface Theme {
  /** The preferred theme for code syntax highlighting. */
  readonly codeTheme: CodeTheme

  /** The color depth supported by the terminal. */
  readonly colorDepth: ColorDepth

  /** The preferred format for data output. */
  readonly dataFormat: DataFormat

  /** Whether the output is connected to a TTY. */
  readonly isTTY: boolean

  /** Whether colors should be used in output. */
  readonly useColors: boolean
}

/**
 * @category schemas
 * @since 0.0.1
 */
export const ThemeSchema = Schema.Struct({
  codeTheme: Schema.Literals(["dark", "light", "auto"]),
  colorDepth: ColorDepth,
  dataFormat: Schema.Literals(["json", "yaml", "jsonl"]),
  isTTY: Schema.Boolean,
  useColors: Schema.Boolean,
}).pipe(Schema.brand(ThemeTypeId))

/**
 * @category services
 * @since 0.0.1
 */
export const Theme = Context.Service<Theme>("@kbroom/effext/Cli/Theme")

/**
 * @category global flags
 * @since 0.0.1
 */
export const ThemeFlag = GlobalFlag.setting("theme")({
  flag: Flag.choice("theme", ["dark", "light", "auto"] as const).pipe(
    Flag.optional,
  ),
})

/**
 * @category global flags
 * @since 0.0.1
 */
export const ColorFlag = GlobalFlag.setting("color")({
  flag: Flag.string("color").pipe(Flag.optional),
})

/**
 * @category global flags
 * @since 0.0.1
 */
export const OutputFlag = GlobalFlag.setting("output")({
  flag: Flag.choice("output", ["json", "yaml", "jsonl"] as const).pipe(
    Flag.optional,
  ),
})

/**
 * @category global flags
 * @since 0.0.1
 */
export const ThemeFlags = {
  theme: ThemeFlag,
  color: ColorFlag,
  output: OutputFlag,
} as const
