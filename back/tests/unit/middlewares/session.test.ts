import { describe, expect, it } from 'vitest'
import { session } from '../../../src/middlewares/session'
import { getMockReq, getMockRes, mockSession } from '../../mocks'

describe('session', () => {
  it('should go next if user is authenticated', () => {
    const req = getMockReq()
    req.session.user = mockSession()
    const { res, next } = getMockRes()
    session(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('should send 401 status if user is not authenticated', () => {
    const req = getMockReq()
    const { res, next } = getMockRes()
    session(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })
})
