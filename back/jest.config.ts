import dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({ path: join(__dirname, 'tests', '.env.test') })

export default {
  preset: 'ts-jest',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  modulePathIgnorePatterns: ['dist'],
  coveragePathIgnorePatterns: ['mocks'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
}
