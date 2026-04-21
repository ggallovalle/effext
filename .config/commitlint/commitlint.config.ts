import type { UserConfig } from "@commitlint/types"
import { RuleConfigSeverity } from "@commitlint/types"

import { ClickRefPlugin, Rules } from "./plugins/ClickRefPlugin.js"

const apiKey = process.env.CLICKUP_API_KEY

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  plugins: [ClickRefPlugin],
  rules: {
    [Rules.clickRefExists.key]: [
      RuleConfigSeverity.Error,
      "always",
      Rules.clickRefExists.options(apiKey),
    ],
  },
}

export default Configuration
