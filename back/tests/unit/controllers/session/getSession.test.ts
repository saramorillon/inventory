import { getMockRes } from '@jest-mock/express'
import { getSession } from '../../../../src/controllers/session/getSession'
import { getMockReq, mockUser } from '../../../mocks'

describe('getSession', () => {
  it('should return session user', () => {
    const req = getMockReq()
    req.user = mockUser()
    const { res } = getMockRes()
    getSession(req, res)
    expect(res.json).toHaveBeenCalledWith(mockUser())
  })
})
