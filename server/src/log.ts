const getTimestamp = () => {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  const hh = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  const ms = date.getMilliseconds()

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}.${ms}`
}

const levelIndent = (level: number) => {
  let indent = ''

  for (let i = 0; i < level; i++) {
    indent += '  '
  }

  return indent
}

export const log = (level: number = 0, ...msg: any) => {
  console.log(levelIndent(level), `[${getTimestamp()}]:`, ...msg)
}

export const logWarn = (level: number = 0, ...msg: any) => {
  console.warn(levelIndent(level), `[${getTimestamp()}]:`, ...msg)
}

export const logError = (level: number = 0, ...msg: any) => {
  console.error(levelIndent(level), `[${getTimestamp()}]:`, ...msg)
}