import type { Plugin } from "@commitlint/types"
import { Schema } from "effect"

const ClickRefExistsRule = {
  key: "click-ref-exists" as const,
  options: (apiKey: string | undefined) =>
    Schema.decodeSync(
      Schema.Struct({
        apiKey:
          apiKey === undefined
            ? Schema.optional(Schema.String)
            : Schema.String,
      }),
    ),
}

async function fn(
  commit: { references: Array<{ issue?: string }> },
  _when: "always" | "never" | undefined,
  opts: { apiKey?: string } | undefined,
): Promise<readonly [boolean, string?]> {
  const apiKey = opts?.apiKey
  if (!apiKey) {
    return [true]
  }

  const taskId = commit.references[0]?.issue
  if (!taskId) {
    return [false, "The ClickUp task ID is missing."]
  }

  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      {
        headers: { Authorization: apiKey },
      },
    )

    if (response.status === 200) {
      return [true]
    } else if (response.status === 404) {
      return [false, `ClickUp task #${taskId} not found.`]
    } else {
      return [false, `Failed to verify ClickUp task: ${response.statusText}`]
    }
  } catch {
    return [false, "Failed to verify ClickUp task."]
  }
}

export const Rules = { clickRefExists: ClickRefExistsRule }

export const ClickRefPlugin = {
  rules: {
    [ClickRefExistsRule.key]: fn,
  },
} satisfies Plugin