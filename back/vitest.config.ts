import { join } from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'vitest/config'

config({ path: join(__dirname, 'tests', '.env.test') })

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
  },
})
