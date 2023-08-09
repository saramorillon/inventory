import { config } from 'dotenv'
import { join } from 'path'
import { defineConfig } from 'vitest/config'

config({ path: join(__dirname, 'tests', '.env.test') })

export default defineConfig({
  test: {
    environment: 'jsdom',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    include: ['tests/**/*.test.ts*'],
    setupFiles: ['tests/setup.tsx'],
  },
})
