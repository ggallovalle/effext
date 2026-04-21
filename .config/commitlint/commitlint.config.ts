import type { UserConfig } from "@commitlint/types"
import { RuleConfigSeverity } from "@commitlint/types"

import { ClickRefPlugin } from "./plugins/ClickRefPlugin.js"

const apiKey = process.env.CLICKUP_API_KEY

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  plugins: [ClickRefPlugin],
  rules: {
    "click-ref-exists": [
      RuleConfigSeverity.Error,
      "always",
      { apiKey },
    ],
  },
}

export default Configuration
