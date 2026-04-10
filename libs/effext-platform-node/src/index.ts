/**
 * Node.js platform utilities
 *
 * @since 0.0.1
 * @category functions
 */

export * from "@kbroom/effext-platform-node-shared"

/**
 * Returns information about the Node.js platform.
 *
 * @returns A string describing the Node.js platform
 *
 * @example
 * ```ts
 * import { getNodeInfo } from "@kbroom/effext-platform-node"
 * console.log(getNodeInfo()) // "Node.js platform"
 * ```
 */
export const getNodeInfo = (): string => "Node.js platform"
