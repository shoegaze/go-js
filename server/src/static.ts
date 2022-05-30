import fs, { PathLike as string } from 'node:fs'
import path from 'node:path'

import TODO from './todo'
import { logError } from './log'
import { assert } from 'node:console'


type StaticFilesMap = Map<string, StaticFilesMap | Buffer>

function recursiveLoad(parent: StaticFilesMap, entries: fs.Dirent[], pathTraversed: string) {
  TODO('Detect circular dependencies', 'recursiveLoad', false)

  entries.forEach(entry => {
    if (entry.isFile()) {
      const filePath = path.join(pathTraversed, entry.name)
      const fileBuffer = fs.readFileSync(filePath)

      parent.set(entry.name, fileBuffer)
    }
    else { // is directory
      const child: StaticFilesMap = new Map()
      parent.set(entry.name, child)

      const dirPath = path.join(pathTraversed, entry.name)
      const childEntries = fs.readdirSync(dirPath, { withFileTypes: true })

      recursiveLoad(child, childEntries, dirPath)
    }
  })
}

export function loadStaticFiles(staticRoot: string): StaticFilesMap {
  const result: StaticFilesMap = new Map()
  const staticEntries = fs.readdirSync(staticRoot, { withFileTypes: true })

  recursiveLoad(result, staticEntries, staticRoot)

  return result
}

export function queryStaticFile(staticFiles: StaticFilesMap, ...filePath: string[]): Buffer | null {
  let map: StaticFilesMap = staticFiles

  for (let i = 0; i < filePath.length; i++) {
    const pathPart = filePath[i]

    if (map.has(pathPart)) {
      const entry = map.get(pathPart)

      assert(entry !== undefined, "entry !== undefined")

      if (entry instanceof Map) {
        map = entry
      }
      else if (entry instanceof Buffer) {
        // Only the last entry should be a Buffer
        if (i === filePath.length-1) {
          return entry // Success
        }
        else {
          logError(1, "Query ended prematurely. ")
          return null
        }
      }
      else { // entry === undefined
        const brokenPath = filePath.slice(0, i).join('/')
        logError(1, `Invalid entry value at '${pathPart}': ${typeof(entry)}`, brokenPath)

        return null
      }
    }
    else {
      const brokenPath = filePath.slice(0, i).join('/')
      logError(1, `Static dir/file: '${pathPart}' not found in given map`, brokenPath)

      return null
    }
  }

  logError(1, "Query could not find the file at the end of the path", filePath.join('/'))
  return null
}