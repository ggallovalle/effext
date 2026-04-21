import { getNodeInfo } from "@kbroom/effext-platform-node"
import { describe, expect, it } from "vitest"

describe("platform-specific functions", () => {
  describe("getNodeInfo", () => {
    it("should return Node.js platform info", () => {
      expect(getNodeInfo()).toBe("Node.js platform")
    })
  })
})
