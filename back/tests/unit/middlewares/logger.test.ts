import { Logger } from '@saramorillon/logger'
import { logger } from '../../../src/middlewares/logger'
import { getMockReq, getMockRes } from '../../mocks'

vi.mock('@saramorillon/logger')

describe('logger', () => {
  it('should create req logger', () => {
    const req = getMockReq({ url: 'url', params: { param: 'value' }, query: { query: 'value' } })
    const { res, next } = getMockRes()
    logger(req, res, next)
    expect(Logger).toHaveBeenCalledWith(
      { silent: true, colors: false },
      {
        app: { host: 'http://app_host.io', name: '@inventory/back', port: 3000, version: expect.any(String) },
        req: { url: 'url', params: { param: 'value' }, query: { query: 'value' } },
      },
    )
    expect(req.logger).toBeInstanceOf(Logger)
  })

  it('should go next', () => {
    const req = getMockReq()
    const { res, next } = getMockRes()
    logger(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
