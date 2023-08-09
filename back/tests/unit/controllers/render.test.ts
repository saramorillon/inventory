import { join } from 'path'
import { describe, expect, it } from 'vitest'
import { render } from '../../../src/controllers/render'
import { getMockReq, getMockRes } from '../../mocks'

describe('render', () => {
  it('should send index file', () => {
    const req = getMockReq()
    const { res } = getMockRes()
    render(req, res)
    expect(res.sendFile).toHaveBeenCalledWith(join('public_dir', 'index.html'))
  })
})
