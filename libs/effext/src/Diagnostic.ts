import {
  Effect,
  FileSystem,
  Path,
  PlatformError,
  Predicate,
  Schema,
} from "effect"

// ─────────────────────────────────────────────────────────────────────────────
// Span - Represents a location in source text
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a span within source text using offset and length.
 *
 * A span identifies a region in a source document by its byte offset
 * and length. This is the fundamental building block for source code
 * location tracking, similar to Rust miette's SourceSpan.
 *
 * @example
 * ```ts
 * import { SourceSpan } from "@kbroom/effext/Diagnostic"
 *
 * // A span covering bytes 5-10 (5 bytes starting at offset 5)
 * const span = new SourceSpan({ offset: 5, length: 5 })
 * ```
 *
 * @since 2.0.0
 * @category models
 */
export class SourceSpan extends Schema.Class<SourceSpan>(
  "diagnostic/SourceSpan",
)({
  offset: Schema.Number,
  length: Schema.Number,
}) {}

/**
 * Represents a labeled span within source text for error annotations.
 *
 * Used to highlight specific regions of code with optional labels.
 * The primary flag indicates which label is the main focus when
 * displaying the diagnostic.
 *
 * @example
 * ```ts
 * import { LabeledSpan } from "@kbroom/effext/Diagnostic"
 *
 * // A primary label highlighting a type error
 * const label = new LabeledSpan({
 *   label: "Type 'number' is not assignable to type 'string'",
 *   primary: true,
 *   offset: 12,
 *   length: 1
 * })
 * ```
 *
 * @since 2.0.0
 * @category models
 */
export class LabeledSpan extends Schema.Class<LabeledSpan>(
  "diagnostic/LabeledSpan",
)({
  label: Schema.optional(Schema.String),
  primary: Schema.Boolean,
  offset: Schema.Number,
  length: Schema.Number,
}) {}

// ─────────────────────────────────────────────────────────────────────────────
// SpanContents - Source content with metadata
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents source content with metadata for rich code display.
 *
 * Contains the raw source data as Uint8Array for performance (avoids
 * string copying), along with position information (line, column),
 * and optional metadata like filename and language. Used to provide
 * context when displaying code snippets with line/column information.
 *
 * @example
 * ```ts
 * import { SpanContents } from "@kbroom/effext/Diagnostic"
 *
 * // Create from a string with language metadata
 * const contents = SpanContents.create("const x = 1", { language: "typescript" })
 *
 * // Decode back to string if needed
 * const text = contents.decode()
 * ```
 *
 * @since 2.0.0
 * @category models
 */
export class SpanContents extends Schema.Class<SpanContents>(
  "diagnostic/SpanContents",
)({
  data: Schema.Uint8Array,
  offset: Schema.Number,
  length: Schema.Number,
  line: Schema.Number,
  column: Schema.Number,
  lineCount: Schema.Number,
  name: Schema.optional(Schema.String),
  language: Schema.optional(Schema.String),
}) {
  /**
   * Creates a SpanContents from a string with computed line/column info.
   *
   * This is a convenience factory that encodes the string to Uint8Array
   * and computes line/column information automatically.
   *
   * @param content - The source content as a string
   * @param options - Optional name and language metadata
   * @returns A new SpanContents instance
   *
   * @example
   * ```ts
   * import { SpanContents } from "@kbroom/effext/Diagnostic"
   *
   * const contents = SpanContents.create("const x = 1", { language: "typescript" })
   * ```
   *
   * @since 2.0.0
   */
  static create(content: string, options?: CreateOptions): SpanContents {
    const lines = content.split("\n")
    const lineCount = lines.length

    return new SpanContents({
      data: new TextEncoder().encode(content),
      offset: 0,
      length: content.length,
      line: 1,
      column: 1,
      lineCount,
      name: options?.name,
      language: options?.language,
    })
  }

  /**
   * Decodes the raw Uint8Array back to a string.
   *
   * @returns The source content as a string
   *
   * @example
   * ```ts
   * const text = contents.decode()
   * ```
   *
   * @since 2.0.0
   */
  public decode(): string {
    return new TextDecoder().decode(this.data)
  }
}

/**
 * Options for SpanContents.create()
 *
 * @since 2.0.0
 * @category models
 */
export interface CreateOptions {
  readonly language?: string
  readonly name?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// SourceCode - Interface for reading spans from source
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Type identifier for SourceCode interface.
 *
 * @since 2.0.0
 * @category constants
 */
export const SourceCodeTypeId = "~/@kbroom/effext/Diagnostic/SourceCode"

/**
 * Represents a source of code that can provide span contents.
 *
 * This interface mirrors Rust miette's SourceCode trait. Implementations
 * can read specific spans from source text, optionally with context lines
 * before and after the span.
 *
 * @example
 * ```ts
 * import { Effect } from "effect"
 * import { SourceCode, SourceSpan } from "@kbroom/effext/Diagnostic"
 *
 * // Get a span with 2 lines of context before and after
 * const contents = yield* sourceCode.readSpan(
 *   new SourceSpan({ offset: 10, length: 5 }),
 *   2,  // context lines before
 *   2   // context lines after
 * )
 * ```
 *
 * @since 2.0.0
 * @category models
 */
export interface SourceCode {
  /**
   * Reads a span from the source, optionally with context lines.
   *
   * @param span - The span to read
   * @param contextLinesBefore - Number of lines to include before the span
   * @param contextLinesAfter - Number of lines to include after the span
   * @returns SpanContents with the relevant source portion
   */
  readSpan(
    span: SourceSpan,
    contextLinesBefore: number,
    contextLinesAfter: number,
  ): Effect.Effect<SpanContents, PlatformError.PlatformError>

  readonly [SourceCodeTypeId]: typeof SourceCodeTypeId
}

/**
 * Type guard to check if a value implements SourceCode.
 *
 * @param u - The value to check
 * @returns True if the value implements SourceCode
 *
 * @since 2.0.0
 */
export const isSourceCode = (u: unknown): u is SourceCode =>
  Predicate.hasProperty(u, SourceCodeTypeId)

/**
 * Schema declaration for SourceCode.
 *
 * @since 2.0.0
 */
export const SourceCode = Schema.declare(isSourceCode)

// ─────────────────────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────────────────────

function computeLineStarts(data: Uint8Array): number[] {
  const starts = [0]

  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0x0a /* \n */) {
      starts.push(i + 1)
    }
  }

  return starts
}

function findLineAndColumn(
  offset: number,
  lineStarts: number[],
): { line: number; column: number } {
  let line = 0

  for (let i = 0; i < lineStarts.length; i++) {
    const current = lineStarts[i]
    if (current === undefined) break
    if (current > offset) break
    line = i
  }

  const lineStart = lineStarts[line] ?? 0
  const column = offset - lineStart
  return { line, column }
}

function sliceWithContext(
  data: Uint8Array,
  span: SourceSpan,
  lineStarts: number[],
  before: number,
  after: number,
) {
  const startOffset = span.offset
  const endOffset = startOffset + span.length
  const lastOffset = span.length === 0 ? startOffset : endOffset - 1

  const { line: startLine } = findLineAndColumn(startOffset, lineStarts)
  const { line: endLine } = findLineAndColumn(lastOffset, lineStarts)

  const contextStartLine = Math.max(0, startLine - before)
  const contextEndLine = Math.min(lineStarts.length - 1, endLine + after)

  const startByte = lineStarts[contextStartLine] ?? 0
  const endByte =
    contextEndLine + 1 < lineStarts.length
      ? (lineStarts[contextEndLine + 1] ?? data.length)
      : data.length

  return {
    slice: data.slice(startByte, endByte),
    startByte,
    startLine,
    lineCount: contextEndLine - contextStartLine + 1,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// StringSourceCode - In-memory source implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * An in-memory implementation of SourceCode.
 *
 * Stores the source as Uint8Array for performance and provides
 * span reading capabilities with optional context lines.
 * Mirrors Rust miette's StringSourceHandle.
 *
 * @example
 * ```ts
 * import { StringSourceCode, SourceSpan } from "@kbroom/effext/Diagnostic"
 *
 * const source = new StringSourceCode("function main() {\n  return 1;\n}")
 * const contents = source.readSpan(new SourceSpan({ offset: 9, length: 6 }), 0, 0)
 * ```
 *
 * @since 2.0.0
 * @category models
 */
export class StringSourceCode implements SourceCode {
  private readonly data: Uint8Array
  private readonly lineStarts: number[]

  /**
   * Creates a StringSourceCode from a string.
   *
   * @param source - The source content as a string
   */
  constructor(source: string) {
    this.data = new TextEncoder().encode(source)
    this.lineStarts = computeLineStarts(this.data)
  }
  [SourceCodeTypeId]: "~/@kbroom/effext/Diagnostic/SourceCode" =
    SourceCodeTypeId

  /**
   * Return the bytes contained in span, optionally padded with context lines.
   *
   * Mirrors Rust miette semantics:
   * - With zero context lines, returns exactly the span bytes
   * - With context, expands to include surrounding lines
   * - Line is always the line number in the original source
   * - Column is the real column when no context requested, otherwise reset to 0
   *
   * @param span - The span to read
   * @param contextBefore - Lines before the span to include
   * @param contextAfter - Lines after the span to include
   */
  readSpan(
    span: SourceSpan,
    contextBefore: number,
    contextAfter: number,
  ): Effect.Effect<SpanContents, PlatformError.PlatformError> {
    return Effect.try({
      try: () => {
        const start = span.offset
        const end = start + span.length

        if (end > this.data.length) {
          throw PlatformError.systemError({
            _tag: "BadResource",
            module: "@kbroom/effext/Diagnostic",
            method: "readSpan",
          })
        }

        let { slice, startByte, lineCount } = sliceWithContext(
          this.data,
          span,
          this.lineStarts,
          contextBefore,
          contextAfter,
        )

        const { line: lineInSource } = findLineAndColumn(start, this.lineStarts)

        if (contextBefore === 0 && contextAfter === 0) {
          slice = this.data.slice(start, end)
          startByte = start

          const lastOffset = span.length === 0 ? start : end - 1
          const { line: endLine } = findLineAndColumn(
            lastOffset,
            this.lineStarts,
          )
          lineCount = endLine - lineInSource + 1
        }

        const { line: lineAtSliceStart } = findLineAndColumn(
          startByte,
          this.lineStarts,
        )

        const column =
          contextBefore === 0 && contextAfter === 0
            ? start - (this.lineStarts[lineInSource] ?? 0)
            : 0

        const line =
          contextBefore === 0 && contextAfter === 0
            ? lineInSource
            : lineAtSliceStart

        return new SpanContents({
          data: slice,
          line,
          column,
          lineCount,
          offset: startByte,
          length: slice.length,
        })
      },
      catch() {
        throw PlatformError.systemError({
          _tag: "BadResource",
          module: "@kbroom/effext/Diagnostic",
          method: "readSpan",
        })
      },
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FromFileSourceCode - File-based source implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A SourceCode implementation that reads from a file.
 *
 * Provides file-based source reading with automatic language detection
 * via file extension. Uses FileSystem and Path from Effect.
 *
 * @example
 * ```ts
 * import { Effect } from "effect"
 * import { FromFileSourceCode } from "@kbroom/effext/Diagnostic"
 *
 * const program = Effect.gen(function*() {
 *   const source = yield* FromFileSourceCode.fromFile("./src/index.ts", "typescript")
 *   // Use source...
 * })
 * ```
 *
 * @since 2.0.0
 * @category models
 */
export class FromFileSourceCode implements SourceCode {
  #inner: SourceCode
  public fs: string
  public path: string
  public name: string
  public language: string;
  [SourceCodeTypeId]: "~/@kbroom/effext/Diagnostic/SourceCode" =
    SourceCodeTypeId

  /**
   * Creates a FromFileSourceCode from a path and language.
   *
   * @param fs - File system identifier
   * @param path - File path
   * @param name - Display name
   * @param language - Language identifier
   * @param content - Inner SourceCode
   */
  constructor(
    fs: string,
    path: string,
    name: string,
    language: string,
    content: SourceCode,
  ) {
    this.fs = fs
    this.path = path
    this.name = name
    this.language = language
    this.#inner = content
  }

  readSpan(
    span: SourceSpan,
    contextLinesBefore: number,
    contextLinesAfter: number,
  ): Effect.Effect<SpanContents, PlatformError.PlatformError> {
    return Effect.map(
      this.#inner.readSpan(span, contextLinesBefore, contextLinesAfter),
      (content) => {
        return new SpanContents({
          ...content,
          name: this.name,
          language: this.language,
        })
      },
    )
  }

  /**
   * Creates a FromFileSourceCode from a file path.
   *
   * Reads the file from the filesystem and creates a source code
   * instance with the file's contents.
   *
   * @param path - Path to the file
   * @param language - Language identifier for syntax highlighting
   * @returns Effect that provides the SourceCode
   *
   * @example
   * ```ts
   * import { Effect } from "effect"
   * import { FromFileSourceCode } from "@kbroom/effext/Diagnostic"
   *
   * const source = yield* FromFileSourceCode.fromFile("./src/main.ts", "typescript")
   * ```
   */
  static readonly fromFile = Effect.fn("FromFileSourceCode.fromFile")(
    function* (path: string, language: string) {
      const fs = yield* FileSystem.FileSystem
      const pathModule = yield* Path.Path
      const content = yield* fs.readFileString(path)
      const name = pathModule.basename(path)
      const source = new StringSourceCode(content)
      return new FromFileSourceCode("fs", path, name, language, source)
    },
  )

  /**
   * Creates a FromFileSourceCode from a file path, returning both
   * the SourceCode and the file content.
   *
   * @param path - Path to the file
   * @param language - Language identifier
   * @returns Effect that provides [SourceCode, content]
   *
   * @example
   * ```ts
   * const [source, content] = yield* FromFileSourceCode.fromFileContent("./src/main.ts", "typescript")
   * ```
   */
  static readonly fromFileContent = Effect.fn("FromFileSourceCode.fromFile")(
    function* (path: string, language: string) {
      const fs = yield* FileSystem.FileSystem
      const pathModule = yield* Path.Path
      const content = yield* fs.readFileString(path)
      const name = pathModule.basename(path)
      const source = new StringSourceCode(content)
      return [
        new FromFileSourceCode("fs", path, name, language, source),
        content,
      ] as const
    },
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Diagnostic - Error class with rich metadata
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A rich diagnostic error with metadata for user-friendly reporting.
 *
 * Inspired by Rust miette, this class provides comprehensive error
 * information including severity, error codes, help text, source code
 * locations, labels, and related diagnostics.
 *
 * @example
 * ```ts
 * import { Diagnostic, SourceSpan, LabeledSpan, StringSourceCode } from "@kbroom/effext/Diagnostic"
 *
 * const diag = new Diagnostic({
 *   message: "Type 'number' is not assignable to type 'string'",
 *   code: "E0600",
 *   severity: "Error",
 *   help: "Consider using type conversion: String(value)",
 *   sourceCode: new StringSourceCode("const x: string = 1"),
 *   labels: [
 *     new LabeledSpan({
 *       label: "Type mismatch",
 *       primary: true,
 *       offset: 12,
 *       length: 1
 *     })
 *   ]
 * })
 * ```
 *
 * @since 2.0.0
 * @category models
 */
export class Diagnostic extends Schema.TaggedErrorClass<Diagnostic>()(
  "Diagnostic",
  {
    cause: Schema.optional(Schema.Unknown).annotate({
      description: "The cause of the error.",
    }),
    code: Schema.optional(Schema.String).annotate({
      description:
        "Unique diagnostic code for looking up more information. Use Rust path format (foo::bar::baz) for global uniqueness.",
    }),
    severity: Schema.Literals([
      "Debug",
      "Error",
      "Fatal",
      "Info",
      "Trace",
      "Warn",
    ])
      .annotate({
        description:
          "Diagnostic severity. Used by report handlers to change display format.",
      })
      .pipe(Schema.withConstructorDefault(Effect.succeed("Error"))),
    help: Schema.optional(Schema.String).annotate({
      description: "Additional help text for the user to resolve the issue.",
    }),
    url: Schema.optional(Schema.String).annotate({
      description:
        "URL to visit for more detailed explanation about this diagnostic.",
    }),
    sourceCode: Schema.optional(
      SourceCode.annotate({
        description: "Source code to apply this diagnostic's labels to.",
      }),
    ),
    labels: Schema.Array(LabeledSpan)
      .annotate({
        description: "Labels to apply to the source code for highlighting.",
      })
      .pipe(Schema.withConstructorDefault(Effect.sync(() => []))),
    related: Schema.Array(
      // biome-ignore lint/suspicious/noExplicitAny: because of schema suspend quirk
      Schema.suspend((): Schema.Codec<Diagnostic> => Diagnostic as any),
    )
      .annotate({
        description: "Additional related diagnostics.",
      })
      .pipe(Schema.withConstructorDefault(Effect.sync(() => []))),
  },
) {}
