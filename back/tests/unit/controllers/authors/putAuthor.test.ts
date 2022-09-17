import { getMockRes } from '@jest-mock/express'
import { putAuthor } from '../../../../src/controllers/authors/putAuthor'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockAuthor } from '../../../mocks'

describe('putAuthor', () => {
  beforeEach(() => {
    jest.spyOn(prisma.author, 'update').mockResolvedValue(mockAuthor())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await putAuthor(req, res)
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

  it('should update author', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await putAuthor(req, res)
    expect(prisma.author.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { books: { set: [{ id: 1 }] }, firstName: 'firstName', lastName: 'LASTNAME' },
      include: { books: true },
    })
  })

  it('should send updated author', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await putAuthor(req, res)
    expect(res.json).toHaveBeenCalledWith(mockAuthor())
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.author, 'update').mockRejectedValue(new Error('500'))
    const req = getMockReq({
      params: { id: '1' },
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await putAuthor(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
