import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express, json, static as _static, urlencoded } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import { App } from '../../src/app'
import { render } from '../../src/controllers/render'
import { logger } from '../../src/middlewares/logger'
import { routes } from '../../src/routes'
import { mockAction } from '../mocks'

vi.mock('express')
vi.mock('cookie-parser')
vi.mock('cors')
vi.mock('express-session')
vi.mock('helmet')
vi.mock('../../src/routes')

function mockExpress() {
  return {
    get: vi.fn(),
    use: vi.fn(),
    listen: vi.fn().mockImplementation((port, fn) => fn()),
  } as unknown as Express
}

describe('run', () => {
  beforeEach(() => {
    vi.mocked(express).mockReturnValue(mockExpress())
    vi.mocked(_static).mockReturnValue('_static' as never)
    vi.mocked(cookieParser).mockReturnValue('cookieParser' as never)
    vi.mocked(json).mockReturnValue('json' as never)
    vi.mocked(urlencoded).mockReturnValue('urlencoded' as never)
    vi.mocked(cors).mockReturnValue('cors' as never)
    vi.mocked(session).mockReturnValue('session' as never)
    vi.mocked(helmet).mockReturnValue('helmet' as never)
    vi.mocked(routes).mockReturnValue('routes' as never)
  })

  it('should create express instance', async () => {
    const app = new App()
    await app.run()
    expect(express).toHaveBeenCalled()
  })

  it('should use middlewares in correct order', async () => {
    const expressMock = mockExpress()
    vi.mocked(express).mockReturnValue(expressMock)
    const app = new App()
    await app.run()
    const { calls } = vi.mocked(expressMock.use).mock
    expect(calls).toEqual([
      ['_static'],
      ['cookieParser'],
      ['json'],
      ['urlencoded'],
      ['cors'],
      ['session'],
      [logger],
      ['helmet'],
      ['/api', 'routes'],
    ])
  })

  it('should default to render route', async () => {
    const expressMock = mockExpress()
    vi.mocked(express).mockReturnValue(expressMock)
    const app = new App()
    await app.run()
    expect(expressMock.get).toHaveBeenCalledWith('*', render)
  })

  it('should log when app succesfully starts', async () => {
    const app = new App()
    const { success } = mockAction(app.logger)
    await app.run()
    expect(success).toHaveBeenCalled()
  })

  it('should log when app fails to start', async () => {
    vi.mocked(express).mockImplementation(() => {
      throw 'error'
    })
    const app = new App()
    const { failure } = mockAction(app.logger)
    await app.run()
    expect(failure).toHaveBeenCalledWith('error')
  })
})
