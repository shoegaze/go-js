import { logError } from "./log"

export default function TODO(msg: string = 'Implement this', caller: string = '', shouldPanic: boolean = true) {
  logError(0, "TODO: ", msg, caller? ` [${caller}]`: '')

  if (shouldPanic) {
    throw new Error("Code not implemented.")
  }
}