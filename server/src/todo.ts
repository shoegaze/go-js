import { magenta, red } from 'ansi-colors'

import { logError } from "./log"

const styleTodo = (str: string) => magenta.italic(str)
export default function TODO(msg: string = 'Implement this', caller: string = '', shouldPanic: boolean = true) {
  logError(0, styleTodo('TODO'), styleTodo(msg), styleTodo(caller? `[${caller}]`: ''))

  if (shouldPanic) {
    throw new Error(red.bold("Code not implemented."))
  }
}