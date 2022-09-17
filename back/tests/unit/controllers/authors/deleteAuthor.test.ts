import { getMockRes } from '@jest-mock/express'
import { deleteAuthor } from '../../../../src/controllers/authors/deleteAuthor'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockAuthor } from '../../../mocks'

describe('deleteAuthor', () => {
  beforeEach(() => {
    jest.spyOn(prisma.author, 'delete').mockResolvedValue(mockAuthor())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await deleteAuthor(req, res)
    expect(res.json).toHaveBeenCalledWith({
      message: `[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "id"
    ],
    "message": "Required"
  }
]`,
      stack: expect.any(String),
    })
  })

  it('should delete author', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAuthor(req, res)
    expect(prisma.author.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should send 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAuthor(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.author, 'delete').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAuthor(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
