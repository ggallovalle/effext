import { getBunInfo } from "@kbroom/effext-platform-bun"
import { describe, expect, it } from "vitest"

describe("platform-specific functions", () => {
  describe("getBunInfo", () => {
    it("should return Bun platform info", () => {
      expect(getBunInfo()).toBe("Bun platform")
    })
  })
})
