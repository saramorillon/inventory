import { getMockRes } from '@jest-mock/express'
import passport from 'passport'
import { postLogin } from '../../../../src/controllers/session/postLogin'
import { getMockReq, mockUser } from '../../../mocks'

describe('postLogin', () => {
  let spy: jest.SpyInstance

  beforeEach(() => {
    spy = jest.spyOn(passport, 'authenticate')
    spy.mockImplementation((_, fn) => {
      fn(null, mockUser())
      return jest.fn()
    })
  })

  it('should authenticate', () => {
    const req = getMockReq()
    req.login = jest.fn().mockImplementation((_, fn) => fn(null))
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function))
  })

  it('should send 401 status if authenticate error', () => {
    spy.mockImplementation((_, fn) => {
      fn(new Error('500'))
      return jest.fn()
    })
    const req = getMockReq()
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should send 401 status if no user', () => {
    spy.mockImplementation((_, fn) => {
      fn(null, null)
      return jest.fn()
    })
    const req = getMockReq()
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should log in', () => {
    const req = getMockReq()
    req.login = jest.fn().mockImplementation((_, fn) => fn(null))
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(req.login).toHaveBeenCalledWith(mockUser(), expect.any(Function))
  })

  it('should send 401 status if login error', () => {
    const req = getMockReq()
    req.login = jest.fn().mockImplementation((_, fn) => fn(new Error('500')))
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should send 204 status', () => {
    const req = getMockReq()
    req.login = jest.fn().mockImplementation((_, fn) => fn(null))
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })
})
