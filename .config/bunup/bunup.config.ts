import { defineWorkspace } from "bunup"

// https://bunup.dev/docs/guide/workspaces
// bunup handles multiple entry points at build time, generating subpath exports automatically
// e.g., @kbroom/effext/UwuLayer, @kbroom/effext/UwuServices, etc.

export default defineWorkspace(
  [
    {
      name: "effext",
      root: "libs/effext",
    },
    {
      name: "effext-platform-node-shared",
      root: "libs/effext-platform-node-shared",
    },
    {
      name: "effext-platform-node",
      root: "libs/effext-platform-node",
    },
    {
      name: "effext-platform-bun",
      root: "libs/effext-platform-bun",
    },
  ],
  {
    entry: ["src/*.ts", "!src/internal/**/*.ts"],
    exports: true,
    unused: {
      level: "error",
    },
    dts: {
      inferTypes: true,
      tsgo: true,
    },
  },
)
