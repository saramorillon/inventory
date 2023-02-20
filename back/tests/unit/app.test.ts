import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express, json, static as _static, urlencoded } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import { App } from '../../src/app'
import { render } from '../../src/controllers/render'
import { logger } from '../../src/middlewares/logger'
import { routes } from '../../src/routes'
import { mockAction } from '../mocks'

jest.mock('express')
jest.mock('cookie-parser')
jest.mock('cors')
jest.mock('express-session')
jest.mock('helmet')
jest.mock('../../src/routes')

function mockExpress() {
  return {
    get: jest.fn(),
    use: jest.fn(),
    listen: jest.fn().mockImplementation((port, fn) => fn()),
  } as unknown as Express
}

describe('run', () => {
  beforeEach(() => {
    jest.mocked(express).mockReturnValue(mockExpress())
    jest.mocked(_static).mockReturnValue('_static' as never)
    jest.mocked(cookieParser).mockReturnValue('cookieParser' as never)
    jest.mocked(json).mockReturnValue('json' as never)
    jest.mocked(urlencoded).mockReturnValue('urlencoded' as never)
    jest.mocked(cors).mockReturnValue('cors' as never)
    jest.mocked(session).mockReturnValue('session' as never)
    jest.mocked(helmet).mockReturnValue('helmet' as never)
    jest.mocked(routes).mockReturnValue('routes' as never)
  })

  it('should create express instance', async () => {
    const app = new App()
    await app.run()
    expect(express).toHaveBeenCalled()
  })

  it('should use middlewares in correct order', async () => {
    const expressMock = mockExpress()
    jest.mocked(express).mockReturnValue(expressMock)
    const app = new App()
    await app.run()
    const { calls } = jest.mocked(expressMock.use).mock
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
    jest.mocked(express).mockReturnValue(expressMock)
    const app = new App()
    await app.run()
    expect(expressMock.get).toHaveBeenCalledWith('*', render)
  })

  it('should log when app succesfully starts', async () => {
    const app = new App()
    const { success } = mockAction(app['logger'])
    await app.run()
    expect(success).toHaveBeenCalled()
  })

  it('should log when app fails to start', async () => {
    jest.mocked(express).mockImplementation(() => {
      throw 'error'
    })
    const app = new App()
    const { failure } = mockAction(app['logger'])
    await app.run()
    expect(failure).toHaveBeenCalledWith('error')
  })
})
