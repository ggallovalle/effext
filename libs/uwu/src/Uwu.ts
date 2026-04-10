import { Schema } from "effect"

export const Color = Schema.Union([
  Schema.Struct({ format: Schema.tag("css"), value: Schema.String }),
  Schema.Struct({ format: Schema.tag("ansi"), value: Schema.String }),
  Schema.Struct({ format: Schema.tag("hex"), value: Schema.String }),
]).pipe(Schema.toTaggedUnion("format"))

export type Color = Schema.Schema.Type<typeof Color>
