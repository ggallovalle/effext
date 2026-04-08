import type { Plugin, UserConfig } from "@commitlint/types"
import { RuleConfigSeverity } from "@commitlint/types"

const ClickRefPlugin = {
  rules: {
    "click-ref-exists": async (commit, when, opts) => {
      console.log({
        commit,
        when,
        opts,
      })
      return [true, "The click link exists"]
    },
  },
} satisfies Plugin

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  plugins: [ClickRefPlugin],
  rules: {
    // "type-enum": [RuleConfigSeverity.Error, "always", ["foo"]],
    "click-ref-exists": [
      RuleConfigSeverity.Error,
      "always",
      // "never", // ok if true
      { apiKey: "someSecret" },
    ],
  },
  // ...
}

export default Configuration
