import { rmSync } from 'node:fs'
import { join } from 'node:path'

const nextCachePath = join(process.cwd(), '.next')

rmSync(nextCachePath, { force: true, recursive: true })
