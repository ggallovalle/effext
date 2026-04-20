import { Context, type Effect, Schema, type Stream } from "effect"
import type { RootContent as MarkdownContent } from "mdast"
import type { Diagnostic, LabeledSpan, SpanContents } from "./Diagnostic.js"

export const ThemeTypeId = "~@kbroom/effext/Echo/Theme"

export const ColorDepth = Schema.Literals([1, 4, 8, 24])
export type ColorDepth = Schema.Schema.Type<typeof ColorDepth>

export type CodeTheme = string

export type DataFormat = "json" | "yaml" | "jsonl"

export interface Theme {
  readonly codeTheme: CodeTheme
  readonly colorDepth: ColorDepth
  readonly dataFormat: DataFormat
  readonly isTTY: boolean
  readonly useColors: boolean
}

export const ThemeSchema = Schema.Struct({
  codeTheme: Schema.String,
  colorDepth: ColorDepth,
  dataFormat: Schema.Literals(["json", "yaml", "jsonl"]),
  isTTY: Schema.Boolean,
  useColors: Schema.Boolean,
}).pipe(Schema.brand(ThemeTypeId))

export const Theme = Context.Service<Theme>("@kbroom/effext/Echo/Theme")

// ─────────────────────────────────────────────────────────────────────────────
// Echo - Simple user-facing messages
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a console for communicating with the user of the application.
 *
 * It differs from `console` or effect `Console` in the fact that there is a semantic
 * meaning - this is used to communicate with the user. Keep using console for
 * development and debugging, prefer this for user-facing output.
 *
 * @since 0.0.1
 * @category models
 */
export interface Echo {
  /**
   * Outputs an action message that prompts the user to do something.
   *
   * Use this when you need the user to take some action, like running a command
   * or making a decision.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { Echo } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const echo = yield* Echo
   *   yield* echo.action("Run `npm install` to install dependencies")
   *   yield* echo.action("Press Enter to continue")
   *   yield* echo.action("Update your config file to enable this feature")
   * })
   * ```
   */
  action(message: string): Effect.Effect<void>

  /**
   * Outputs a command line instruction.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { Echo } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const echo = yield* Echo
   *   yield* echo.command("npm install")
   *   yield* echo.command("git commit -m 'fix: resolve issue'", { prefix: ">" })
   *   yield* echo.command("npm run build", { comment: "Build the project" })
   * })
   * ```
   */
  command(cmd: string, options?: CommandOptions): Effect.Effect<void>

  /**
   * Outputs an error message to alert the user that something went wrong.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { Echo } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const echo = yield* Echo
   *   yield* echo.error("Failed to write config file")
   * })
   * ```
   */
  error(message: string): Effect.Effect<void>

  /**
   * Outputs a help message to guide the user through usage.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { Echo } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const echo = yield* Echo
   *   yield* echo.help("Use --config to specify a custom configuration file")
   * })
   * ```
   */
  help(message: string): Effect.Effect<void>

  /**
   * Outputs a clickable link for the user to interact with.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { Echo } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const echo = yield* Echo
   *   yield* echo.link("Getting Started", "https://docs.example.com/getting-started")
   *   yield* echo.link("Install Extension", "https://marketplace.visualstudio.com/")
   * })
   * ```
   */
  link(text: string, url: string): Effect.Effect<void>

  /**
   * Outputs a success message to confirm an operation completed successfully.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { Echo } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const echo = yield* Echo
   *   yield* echo.success("Project initialized successfully")
   *   yield* echo.success("Dependencies installed (12 packages)")
   * })
   * ```
   */
  success(message: string): Effect.Effect<void>

  /**
   * Outputs a warning message to alert the user about something that might need attention.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { Echo } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const echo = yield* Echo
   *   yield* echo.warning("Config file is deprecated, please migrate to the new format")
   *   yield* echo.warning("Disk space is running low")
   * })
   * ```
   */
  warning(message: string): Effect.Effect<void>
}

/**
 * @category services
 * @since 0.0.1
 */
export const Echo = Context.Service<Echo>("@kbroom/effext/Echo")

/**
 * Options for the command method.
 *
 * @since 0.0.1
 * @category models
 */
export interface CommandOptions {
  readonly comment?: string
  readonly prefix?: "$" | ">" | "#"
}

// ─────────────────────────────────────────────────────────────────────────────
// EchoVisual - Complex visual output
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents complex visual elements for terminal output.
 *
 * These are structured elements that typically span multiple lines and
 * have more complex formatting than simple text messages. Use for code,
 * markdown, trees, and other rich visual content.
 *
 * @since 0.0.1
 * @category models
 */
export interface EchoVisual {
  /**
   * Outputs a code snippet with optional syntax highlighting and metadata.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoVisual } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const visual = yield* EchoVisual
   *   yield* visual.code("npm install my-package")
   *   yield* visual.code("function hello() { return 'world'; }", { language: "typescript" })
   * })
   * ```
   */
  code(code: string, options?: CodeOptions): Effect.Effect<void>

  /**
   * Outputs a code snippet with rich metadata and labels for annotations.
   *
   * Use this when you need to display code with specific line/column information
   * and labeled spans for error annotations or highlights.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoVisual } from "@kbroom/effext/Echo"
   * import { SpanContents, LabeledSpan } from "@kbroom/effext/Diagnostic"
   *
   * const program = Effect.gen(function*() {
   *   const visual = yield* EchoVisual
   *   const contents = SpanContents.create("const x: string = 1", { language: "typescript" })
   *   yield* visual.code(contents, [
   *     new LabeledSpan({ label: "Type 'number' is not assignable to type 'string'", primary: true, offset: 12, length: 1 })
   *   ])
   * })
   * ```
   */
  code(contents: SpanContents, labels?: LabeledSpan[]): Effect.Effect<void>

  /**
   * Outputs a diagnostic with all its metadata to the user.
   *
   * Renders a complete Diagnostic including severity, code, help text,
   * labels, and related diagnostics.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoVisual } from "@kbroom/effext/Echo"
   * import { Diagnostic, LabeledSpan, StringSourceCode } from "@kbroom/effext/Diagnostic"
   *
   * const program = Effect.gen(function*() {
   *   const visual = yield* EchoVisual
   *   const diagnostic = new Diagnostic({
   *     message: "Type 'number' is not assignable to type 'string'",
   *     code: "E0600",
   *     severity: "Error",
   *     labels: [
   *       new LabeledSpan({ label: "Type mismatch", primary: true, offset: 12, length: 1 })
   *     ],
   *     sourceCode: new StringSourceCode("const x: string = 1"),
   *   })
   *   yield* visual.diagnostic(diagnostic)
   * })
   * ```
   */
  diagnostic(diag: Diagnostic): Effect.Effect<void>

  /**
   * Outputs markdown content rendered for terminal display.
   *
   * Accepts mdast (Markdown Abstract Syntax Tree) nodes. Supports headers,
   * lists (ordered, unordered, task), code blocks, and more.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoVisual } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const visual = yield* EchoVisual
   *   yield* visual.markdown([
   *     { type: "heading", depth: 1, children: [{ type: "text", value: "Getting Started" }] },
   *     { type: "paragraph", children: [{ type: "text", value: "Follow these steps:" }] },
   *     { type: "list", ordered: false, children: [
   *       { type: "listItem", children: [{ type: "paragraph", children: [{ type: "text", value: "Install Node.js" }] }] },
   *       { type: "listItem", children: [{ type: "paragraph", children: [{ type: "text", value: "Run npm install" }] }] },
   *     ]},
   *   ])
   * })
   * ```
   */
  markdown(content: MarkdownContent[]): Effect.Effect<void>

  /**
   * Outputs a tree structure (like `npm ls`) with unicode box-drawing characters.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoVisual } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const visual = yield* EchoVisual
   *   yield* visual.tree({
   *     label: "my-project",
   *     nodes: [
   *       "src/index.ts",
   *       { label: "tests", nodes: ["index.test.ts", "helpers.test.ts"] },
   *     ]
   *   })
   * })
   * ```
   */
  tree(data: TreeNode): Effect.Effect<void>
}

/**
 * @category services
 * @since 0.0.1
 */
export const EchoVisual = Context.Service<EchoVisual>(
  "@kbroom/effext/EchoVisual",
)

/**
 * Options for the code method.
 *
 * @since 0.0.1
 * @category models
 */
export interface CodeOptions {
  readonly filename?: string
  readonly language?: string
}

/**
 * A node in a tree structure (archy-style).
 *
 * @since 0.0.1
 * @category models
 */
export interface TreeNode {
  readonly label: string
  readonly nodes?: (TreeNode | string)[]
}

/**
 * Options for the tree method.
 *
 * @since 0.0.1
 * @category models
 */
export interface TreeOptions {
  readonly unicode?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// EchoData - Data serialization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents data serialization for outputting structured data.
 *
 * These methods format data for user display. The `data()` method respects
 * user preferences (from CLI flag, config, or environment variable) and
 * is the preferred method for outputting data. Use explicit format methods
 * (`json`, `yaml`) when you need a specific format.
 *
 * @since 0.0.1
 * @category models
 */
export interface EchoData {
  /**
   * Outputs data in the user's preferred format.
   *
   * This method reads from implementation-specific sources (CLI flag, config,
   * environment variable) to determine the desired format. This is the
   * preferred method for outputting data as it respects user preferences.
   *
   * Consider using this over explicit format methods (json, yaml) unless
   * you specifically need a particular format.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoData } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const data = yield* EchoData
   *   yield* data.data({ name: "my-project", version: "1.0.0" })
   * })
   * ```
   */
  data(data: Schema.Json | Stream.Stream<Schema.Json>): Effect.Effect<void>

  /**
   * Outputs data as JSON.
   *
   * Consider using `data()` instead to respect user preferences.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoData } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const data = yield* EchoData
   *   yield* data.json({ name: "my-project", version: "1.0.0" })
   * })
   * ```
   */
  json(data: Schema.Json): Effect.Effect<void>

  /**
   * Outputs data as JSON Lines (newline-delimited JSON).
   *
   * This is useful for streaming or piping to other commands.
   * Accepts either a single object or a stream of objects.
   *
   * Consider using `data()` instead to respect user preferences.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoData } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const data = yield* EchoData
   *   yield* data.jsonl({ name: "my-project", version: "1.0.0" })
   *   yield* data.jsonl(stream) // Stream.Stream<Json>
   * })
   * ```
   */
  jsonl(data: Schema.Json | Stream.Stream<Schema.Json>): Effect.Effect<void>

  /**
   * Outputs data as YAML.
   *
   * Consider using `data()` instead to respect user preferences.
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { EchoData } from "@kbroom/effext/Echo"
   *
   * const program = Effect.gen(function*() {
   *   const data = yield* EchoData
   *   yield* data.yaml({ name: "my-project", version: "1.0.0" })
   * })
   * ```
   */
  yaml(data: Schema.Json): Effect.Effect<void>
}
