import { getMockRes } from '@jest-mock/express'
import { postAuthor } from '../../../../src/controllers/authors/postAuthor'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockAuthor } from '../../../mocks'

describe('postAuthor', () => {
  beforeEach(() => {
    jest.spyOn(prisma.author, 'create').mockResolvedValue(mockAuthor())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await postAuthor(req, res)
    expect(res.json).toHaveBeenCalledWith({
      message: `[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "lastName"
    ],
    "message": "Required"
  }
]`,
      stack: expect.any(String),
    })
  })

  it('should create author', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postAuthor(req, res)
    expect(prisma.author.create).toHaveBeenCalledWith({ data: { firstName: 'firstName', lastName: 'LASTNAME' } })
  })

  it('should send 201 status', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postAuthor(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(201)
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.author, 'create').mockRejectedValue(new Error('500'))
    const req = getMockReq({
      params: { id: '1' },
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postAuthor(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
