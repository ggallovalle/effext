import type { Plugin } from "@commitlint/types"

export const ClickRefPlugin = {
  rules: {
    "click-ref-exists": async (commit, _when, opts) => {
      const apiKey = (opts as unknown as { apiKey?: string })?.apiKey
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
} satisfies Plugin
