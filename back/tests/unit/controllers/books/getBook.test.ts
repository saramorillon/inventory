import { getMockRes } from '@jest-mock/express'
import { getBook } from '../../../../src/controllers/books/getBook'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockBook } from '../../../mocks'

describe('getBook', () => {
  beforeEach(() => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(mockBook())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getBook(req, res)
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

  it('should get book', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBook(req, res)
    expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { authors: true } })
  })

  it('should send book', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBook(req, res)
    expect(res.json).toHaveBeenCalledWith(mockBook())
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.book, 'findUnique').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBook(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
