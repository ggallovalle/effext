import { add, getBunInfo, greet } from "@kbroom/effext-platform-bun"
import { describe, expect, it } from "vitest"

describe("shared functions (via re-export)", () => {
  describe("greet", () => {
    it("should greet with name", () => {
      expect(greet("World")).toBe("Hello, World!")
    })

    it("should handle empty name", () => {
      expect(greet("")).toBe("Hello, !")
    })
  })

  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(2, 3)).toBe(5)
    })

    it("should add negative numbers", () => {
      expect(add(-1, -1)).toBe(-2)
    })

    it("should add mixed numbers", () => {
      expect(add(-5, 10)).toBe(5)
    })
  })
})

describe("platform-specific functions", () => {
  describe("getBunInfo", () => {
    it("should return Bun platform info", () => {
      expect(getBunInfo()).toBe("Bun platform")
    })
  })
})
