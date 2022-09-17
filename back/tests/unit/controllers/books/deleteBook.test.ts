import { getMockRes } from '@jest-mock/express'
import { deleteBook } from '../../../../src/controllers/books/deleteBook'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockBook } from '../../../mocks'

describe('deleteBook', () => {
  beforeEach(() => {
    jest.spyOn(prisma.book, 'delete').mockResolvedValue(mockBook())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await deleteBook(req, res)
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

  it('should delete book', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteBook(req, res)
    expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should send 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteBook(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.book, 'delete').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteBook(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
