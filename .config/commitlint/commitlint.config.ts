import type { UserConfig } from "@commitlint/types"
import { RuleConfigSeverity } from "@commitlint/types"

import { ClickupPlugin, ClickupRules } from "./plugins/ClickupPlugin.js"

const clickupApiKey = process.env.CLICKUP_API_KEY

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  plugins: [ClickupPlugin({ apiKey: clickupApiKey })],
  rules: {
    [ClickupRules.taskExists.key]: [RuleConfigSeverity.Error, "always"],
  },
}

export default Configuration
