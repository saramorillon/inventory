import { getMockRes } from '@jest-mock/express'
import { getLogout } from '../../../../src/controllers/session/getLogout'
import { getMockReq } from '../../../mocks'

describe('getLogout', () => {
  it('should log out', () => {
    const req = getMockReq()
    req.logout = jest.fn()
    const { res } = getMockRes()
    getLogout(req, res)
    expect(req.logout).toHaveBeenCalled()
  })

  it('should redirect to home', () => {
    const req = getMockReq()
    req.logout = jest.fn()
    const { res } = getMockRes()
    getLogout(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/')
  })
})
