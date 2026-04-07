import { defineWorkspace } from "bunup"

// https://bunup.dev/docs/guide/workspaces

export default defineWorkspace(
  [
    {
      name: "uwu",
      root: "libs/uwu",
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
