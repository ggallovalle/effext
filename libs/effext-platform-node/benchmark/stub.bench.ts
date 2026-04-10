import { bench, describe } from "vitest"

describe("shared functions", () => {
  bench("greet", () => {
    return undefined
  })

  bench("add", () => {
    return undefined
  })
})

describe("platform-specific", () => {
  bench("getNodeInfo", () => {
    return undefined
  })
})
