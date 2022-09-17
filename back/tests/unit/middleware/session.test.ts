import { getMockReq, getMockRes } from '@jest-mock/express'
import { hasSession } from '../../../src/middleware/session'

describe('hasSession', () => {
  it('should go next if user is authenticated', () => {
    const req = getMockReq()
    req.isAuthenticated = jest.fn().mockReturnValue(true)
    const { res, next } = getMockRes()
    hasSession(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('should send 401 status if user is not authenticated', () => {
    const req = getMockReq()
    req.isAuthenticated = jest.fn().mockReturnValue(false)
    const { res, next } = getMockRes()
    hasSession(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })
})
