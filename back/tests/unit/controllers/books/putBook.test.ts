import { getMockRes } from '@jest-mock/express'
import { putBook } from '../../../../src/controllers/books/putBook'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockBook } from '../../../mocks'

describe('putBook', () => {
  beforeEach(() => {
    jest.spyOn(prisma.book, 'update').mockResolvedValue(mockBook())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await putBook(req, res)
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

  it('should update book', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { serial: 'serial', title: 'title', source: 'source', authors: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await putBook(req, res)
    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { serial: 'serial', title: 'Title', source: 'source', authors: { set: [{ id: 1 }] } },
      include: { authors: true },
    })
  })

  it('should send updated book', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { serial: 'serial', title: 'title', source: 'source', authors: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await putBook(req, res)
    expect(res.json).toHaveBeenCalledWith(mockBook())
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.book, 'update').mockRejectedValue(new Error('500'))
    const req = getMockReq({
      params: { id: '1' },
      body: { serial: 'serial', title: 'title', source: 'source', authors: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await putBook(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
