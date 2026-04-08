import type { ViteUserConfig } from "vitest/config"

const config = {
  test: {
    include: ["test/**/*.test.{ts,tsx}"],
    benchmark: {
      include: ["benchmark/**/*.bench.{ts,tsx}"],
    },
    expect: {
      requireAssertions: true,
    },
    sequence: {
      concurrent: true,
    },
    fakeTimers: {
      toFake: undefined,
    },
    coverage: {
      provider: "v8",
      reporter: ["html"],
      reportsDirectory: "coverage",
      exclude: [
        "node_modules/",
        "dist/",
        "benchmark/",
        "bundle/",
        "typetest/",
        "build/",
        "coverage/",
        "test/utils/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/vitest.setup.*",
        "**/vitest.shared.*",
      ],
    },
  },
} satisfies ViteUserConfig

export default config
