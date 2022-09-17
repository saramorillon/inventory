import { getMockRes } from '@jest-mock/express'
import { getAuthor } from '../../../../src/controllers/authors/getAuthor'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockAuthor } from '../../../mocks'

describe('getAuthor', () => {
  beforeEach(() => {
    jest.spyOn(prisma.author, 'findUnique').mockResolvedValue(mockAuthor())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getAuthor(req, res)
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

  it('should get author', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthor(req, res)
    expect(prisma.author.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { books: true } })
  })

  it('should send author', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthor(req, res)
    expect(res.json).toHaveBeenCalledWith(mockAuthor())
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.author, 'findUnique').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthor(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
