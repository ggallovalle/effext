import type { Plugin } from "@commitlint/types"
// import { Effect } from "effect"

// const program = Effect.gen(function* () {
//   yield* Effect.sleep("1 seconds")
//   yield* Effect.sleep("2 seconds")
// })

export const ClickRefPlugin = {
  rules: {
    "click-ref-exists": async (commit, when, opts) => {
      // console.log("somewhere")
      // await Effect.runPromise(program)

      console.log(
        JSON.stringify(
          {
            commit,
            when,
            opts,
          },
          null,
          2,
        ),
      )
      const success = true
      return [success, "The click task does not exists"]
    },
  },
} satisfies Plugin
