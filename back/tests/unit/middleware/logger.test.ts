import { getMockReq, getMockRes } from '@jest-mock/express'
import { Logger } from '../../../src/libs/logger'
import { logger } from '../../../src/middleware/logger'

describe('logger', () => {
  it('should create req logger', () => {
    const req = getMockReq()
    const { res, next } = getMockRes()
    logger(req, res, next)
    expect(req.logger).toBeInstanceOf(Logger)
  })

  it('should go next', () => {
    const req = getMockReq()
    const { res, next } = getMockRes()
    logger(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
