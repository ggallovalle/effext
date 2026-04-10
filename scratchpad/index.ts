import { Uwu } from "@kbroom/effext"
import { Console, Effect } from "effect"

const program = Effect.gen(function* () {
  yield* Console.log("hello")

  const red = Uwu.Color.make({ format: "css", value: "red" })
  yield* Console.log("red")
  yield* Console.log(red)
})

const main = program

await Effect.runPromise(main)
