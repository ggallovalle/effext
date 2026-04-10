import { Schema } from "effect"

/**
 * Represents a span within source text using offset and length.
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
 * Used to highlight specific regions of code with optional labels,
 * commonly used to show error locations or important annotations.
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

/**
 * Represents source content with metadata for rich code display.
 *
 * Contains the raw source data, position information, and optional
 * metadata like filename and language. Used to provide context
 * when displaying code snippets with line/column information.
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
   * @param content - The source content as a string
   * @param options - Optional name and language metadata
   * @returns A new SpanContents instance
   *
   * @example
   * ```ts
   * import { SpanContents } from "@kbroom/effext/Diagnostic"
   *
   * const contents = SpanContents.make("const x = 1", { language: "typescript" })
   * ```
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
