import 'dotenv/config'
import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = join(__dirname, '..', 'dist')

if (!existsSync(distPath)) {
  console.log('⚠️  dist/ not found. Running vite build first...')
  const build = spawn('npx', ['vite', 'build'], { stdio: 'inherit', cwd: join(__dirname, '..') })
  build.on('close', (code) => {
    if (code !== 0) process.exit(code)
    startServer()
  })
} else {
  startServer()
}

function startServer() {
  const server = spawn('node', ['server/cluster.js'], {
    stdio: 'inherit',
    cwd: join(__dirname, '..'),
    env: { ...process.env },
  })
  server.on('close', (code) => process.exit(code))
}
