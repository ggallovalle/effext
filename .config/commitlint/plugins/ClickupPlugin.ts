import type { Plugin } from "@commitlint/types"
import { Schema } from "effect"

const PluginOptions = Schema.Struct({
  apiKey: Schema.optional(Schema.String),
})
const decodePluginOptions = Schema.decodeUnknownSync(PluginOptions)

type PluginOptions = Schema.Schema.Type<typeof PluginOptions>

export const ClickupRules = {
  taskExists: {
    key: "clickup/task-exists",
  },
}

export const ClickupPlugin = (pluginOptions: PluginOptions): Plugin => {
  pluginOptions = decodePluginOptions(pluginOptions)
  return {
    rules: {
      [ClickupRules.taskExists.key]: async (commit, _when, _opts) => {
        const { apiKey } = pluginOptions
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
            return [
              false,
              `Failed to verify ClickUp task: ${response.statusText}`,
            ]
          }
        } catch {
          return [false, "Failed to verify ClickUp task."]
        }
      },
    },
  }
}
