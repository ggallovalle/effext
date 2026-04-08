import type { UserConfig } from "@commitlint/types"
import { RuleConfigSeverity } from "@commitlint/types"

import { ClickRefPlugin } from "./plugins/commitlint/ClickRefPlugin.js"

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  plugins: [ClickRefPlugin],
  rules: {
    "click-ref-exists": [
      RuleConfigSeverity.Error,
      "always", // ok if true
      // "never", // ok if true
      { apiKey: "better secret" },
    ],
  },
  // ...
}

export default Configuration
