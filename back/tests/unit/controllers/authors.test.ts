import { getMockRes } from '@jest-mock/express'
import { deleteAuthor, getAuthor, getAuthors, postAuthor, putAuthor } from '../../../src/controllers/authors'
import { prisma } from '../../../src/prisma/client'
import { getMockReq, mockAuthor } from '../../mocks'

describe('getAuthors', () => {
  beforeEach(() => {
    jest.spyOn(prisma.author, 'findMany').mockResolvedValue([mockAuthor()])
  })

  it('should get authors', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthors(req, res)
    expect(prisma.author.findMany).toHaveBeenCalledWith({ include: { books: true }, orderBy: { lastName: 'asc' } })
  })

  it('should send authors', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthors(req, res)
    expect(res.json).toHaveBeenCalledWith([mockAuthor()])
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.author, 'findMany').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthors(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})

describe('postAuthor', () => {
  beforeEach(() => {
    jest.spyOn(prisma.author, 'create').mockResolvedValue(mockAuthor())
  })

  it('should fail if body is invalid', async () => {
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
        "firstName"
      ],
      "message": "Required"
    },
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "lastName"
      ],
      "message": "Required"
    },
    {
      "code": "invalid_type",
      "expected": "array",
      "received": "undefined",
      "path": [
        "books"
      ],
      "message": "Required"
    }
  ]`,
      stack: expect.any(String),
    })
  })

  it('should create author', async () => {
    const req = getMockReq({
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postAuthor(req, res)
    expect(prisma.author.create).toHaveBeenCalledWith({
      data: { books: { connect: [{ id: 1 }] }, firstName: 'firstName', lastName: 'LASTNAME' },
      include: { books: true },
    })
  })

  it('should send created author', async () => {
    const req = getMockReq({
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postAuthor(req, res)
    expect(res.json).toHaveBeenCalledWith(mockAuthor())
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.author, 'create').mockRejectedValue(new Error('500'))
    const req = getMockReq({
      body: { firstName: 'firstName', lastName: 'lastName', books: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postAuthor(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})

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
