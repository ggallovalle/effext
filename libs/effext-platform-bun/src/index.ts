/**
 * Bun platform utilities
 *
 * @since 0.0.1
 * @category functions
 */

export {
  add,
  type ColorOptions,
  greet,
  layerBoxed,
  layerColored,
  layerColoredPrefixed,
  layerEmoji,
  layerNoop,
  layerPrefixed,
  makeColored,
  makeColoredPrefixed,
  makeNoop,
  makePrefixed,
  NodeEchoLayer as BunEchoLayer,
  NodeThemeLayer as BunThemeLayer,
  type PrefixOptions,
} from "@kbroom/effext-platform-node-shared"

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
