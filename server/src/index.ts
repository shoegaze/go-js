import process from "node:process"
import http from "node:http"
import fs from "node:fs"
import path from "node:path"

import TODO from "./todo"
import { log, logError, logImportant, logWarn } from "./log"
import { loadStaticFiles, queryStaticFile } from "./static"

const port = process.env.PORT || 5550
const rootUrl = `http://localhost:${port}`

logImportant(0, "Caching static files...")
const staticRoot = './static'
const staticCache = loadStaticFiles(staticRoot)

log(1, "Static files:", staticCache)

const htmlIndex = <Buffer>queryStaticFile(staticCache, 'index.html')

logImportant(0, `Attempting to start server at ${rootUrl} ...`)
const server = http.createServer((req, res) => {
  const url = req.url

  log(0, `req: ${url}`)

  if (url) {
    // index page
    if (url.match(/^\/$/)) {
      log(1, "res: index")

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(htmlIndex)
    }
    // static content
    else if (url.match(/^\/static/)) {
      const filePathRel = url.split("/").slice(2)
      const fileName = filePathRel[filePathRel.length - 1]

      log(1, `req: static file ${fileName} with static path ${filePathRel.join('/')}`)
      const content = queryStaticFile(staticCache, ...filePathRel)

      if (content) {
        const filePathFull = path.join(staticRoot, ...filePathRel)

        switch (path.extname(filePathFull)) {
          case '': {
            logError(1, "No file extension found in path", filePathFull)
            return
          }
          case '.html': {
            res.writeHead(200, { "Content-Type": "text/html" })
            break
          }
          case '.css': {
            res.writeHead(200, { "Content-Type": "text/css" })
            break
          }
          case '.js': {
            res.writeHead(200, { "Content-Type": "application/javascript" })
            break
          }
          default: { // Should we error on unknown extension type?
            res.writeHead(200, { "Content-Type": "text/plain" })
            break
          }
        }

        log(1, 'res: static file:', filePathFull)
        res.end(content)
      }
      else {
        logWarn(1, `Static file ${fileName} not found`)

        res.writeHead(404, { "Content-Type": "text/plain" })
        res.end("404 Not Found\n")
      }
    }
    // 404
    else {
      logWarn(1, `404 page not found at ${url}`)

      res.writeHead(404)
      res.end("404 Page Not Found\n")
    }
  }
})

server.listen(port)

logImportant(0, `Server started at ${rootUrl}`)
