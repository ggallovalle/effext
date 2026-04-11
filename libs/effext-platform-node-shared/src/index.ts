/**
 * Shared platform utilities - work on both Node.js and Bun
 *
 * @since 0.0.1
 * @category functions
 */

export * from "./NodeEcho.js"

/**
 * Greets a user with a friendly message.
 *
 * @param name - The name to greet
 * @returns A greeting string
 *
 * @example
 * ```ts
 * import { greet } from "@kbroom/effext-platform-node-shared"
 * console.log(greet("World")) // "Hello, World!"
 * ```
 */
export const greet = (name: string): string => `Hello, ${name}!`

/**
 * Adds two numbers together.
 *
 * @param a - First number
 * @param b - Second number
 * @returns The sum of the two numbers
 *
 * @example
 * ```ts
 * import { add } from "@kbroom/effext-platform-node-shared"
 * console.log(add(2, 3)) // 5
 * ```
 */
export const add = (a: number, b: number): number => a + b
