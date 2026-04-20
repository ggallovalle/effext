export * as BunEcho from "./BunEcho.js"

/**
 * Returns information about the Bun platform.
 *
 * @returns A string describing the Bun platform
 *
 * @example
 * ```ts
 * import { getBunInfo } from "@kbroom/effext-platform-bun"
 * console.log(getBunInfo()) // "Bun platform"
 * ```
 */
export const getBunInfo = (): string => "Bun platform"
