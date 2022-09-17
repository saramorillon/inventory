import cors from 'cors'
import express, { json } from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { start } from '../../src/app'
import { appLogger } from '../../src/libs/logger'
import { deserializeUser, localStrategy, serializeUser } from '../../src/libs/passport'
import { logger } from '../../src/middleware/logger'
import { router } from '../../src/router'
import { mock } from '../mocks'

jest.mock('express')
jest.mock('cors')
jest.mock('passport')
jest.mock('express-session')
jest.mock('../../src/libs/logger')
jest.mock('../../src/router')

function mockExpress() {
  const expressMock = { use: jest.fn(), listen: jest.fn() }
  mock(express).mockReturnValue(expressMock)
  return expressMock
}

describe('start', () => {
  beforeEach(() => {
    mockExpress()
    mock(json).mockReturnValue('json')
    mock(cors).mockReturnValue('cors')
    mock(session).mockReturnValue('session')
    mock(passport.initialize).mockReturnValue('passport.initialize')
    mock(passport.session).mockReturnValue('passport.session')
    mock(router).mockReturnValue('router')
  })

  it('should configure passport', () => {
    start()
    expect(passport.serializeUser).toHaveBeenCalledWith(serializeUser)
    expect(passport.deserializeUser).toHaveBeenCalledWith(deserializeUser)
    expect(passport.use).toHaveBeenCalledWith(new Strategy(localStrategy))
  })

  it('should create express app', () => {
    start()
    expect(express).toHaveBeenCalled()
  })

  it('should add json middleware', () => {
    const expressMock = mockExpress()
    start()
    expect(expressMock.use).toHaveBeenCalledWith('json')
  })

  it('should add cors middleware', () => {
    const expressMock = mockExpress()
    start()
    expect(expressMock.use).toHaveBeenCalledWith('cors')
  })

  it('should add session middleware', () => {
    const expressMock = mockExpress()
    start()
    expect(expressMock.use).toHaveBeenCalledWith('session')
  })

  it('should add passport middlewares', () => {
    const expressMock = mockExpress()
    start()
    expect(expressMock.use).toHaveBeenCalledWith('passport.initialize')
    expect(expressMock.use).toHaveBeenCalledWith('passport.session')
  })

  it('should add logger middleware', () => {
    const expressMock = mockExpress()
    start()
    expect(expressMock.use).toHaveBeenCalledWith(logger)
  })

  it('should use router', () => {
    const expressMock = mockExpress()
    start()
    expect(expressMock.use).toHaveBeenCalledWith('/api', 'router')
  })

  it('should run app', () => {
    const expressMock = mockExpress()
    start()
    expect(expressMock.listen).toHaveBeenCalledWith(3000, expect.any(Function))
  })

  it('should log on start', () => {
    const expressMock = mockExpress()
    expressMock.listen.mockImplementation((_, fn) => fn())
    start()
    expect(appLogger.info).toHaveBeenCalledWith('app_start', { port: 3000 })
  })
})
