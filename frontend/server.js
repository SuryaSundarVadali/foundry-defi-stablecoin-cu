import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = http.createServer((req, res) => {
  let filePath = ''
  if (req.url === '/') {
    filePath = path.join(__dirname, 'index.html')
  } else {
    filePath = path.join(__dirname, req.url)
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404)
      return res.end('Page not found')
    }

    let ext = path.extname(filePath).toLowerCase()
    let contentType = 'text/plain'
    if (ext === '.html') contentType = 'text/html'
    else if (ext === '.css') contentType = 'text/css'
    else if (ext === '.js') contentType = 'application/javascript'
    else if (ext === '.json') contentType = 'application/json'

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500)
        return res.end('Error loading file')
      }
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    })
  })
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})