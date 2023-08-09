import { describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app'

vi.mock('../../src/app')

describe('index', () => {
  it('should run app', async () => {
    await import('../../src')
    expect(App.prototype.run).toHaveBeenCalled()
  })
})
