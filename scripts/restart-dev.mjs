import { execSync, spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import { join } from 'node:path'

const ports = [3000, 3010]

function run(command) {
  try {
    execSync(command, { stdio: 'ignore' })
  } catch {
    // Ignore cleanup misses. The dev server can still start if no process owns the port.
  }
}

if (process.platform === 'win32') {
  for (const port of ports) {
    run(`powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"`)
  }
} else {
  for (const port of ports) {
    run(`fuser -k ${port}/tcp`)
  }
}

rmSync(join(process.cwd(), '.next'), { force: true, recursive: true })

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const child = spawn(npmCommand, ['run', 'dev'], { stdio: 'inherit' })

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
