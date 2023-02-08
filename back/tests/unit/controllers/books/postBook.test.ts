import { getMockRes } from '@jest-mock/express'
import { postBook } from '../../../../src/controllers/books/postBook'
import { isbnSearch } from '../../../../src/libs/isbn'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mock, mockApiResult, mockAuthor, mockBook } from '../../../mocks'

jest.mock('../../../../src/libs/isbn')

describe('postBook', () => {
  beforeEach(() => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(null)
    jest.spyOn(prisma.book, 'create').mockResolvedValue(mockBook())
    jest.spyOn(prisma.author, 'findFirst').mockResolvedValue(mockAuthor())
    jest.spyOn(prisma.author, 'create').mockResolvedValue(mockAuthor())
    mock(isbnSearch).mockResolvedValue(mockApiResult())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.json).toHaveBeenCalledWith({
      message: `[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "serial"
    ],
    "message": "Required"
  }
]`,
      stack: expect.any(String),
    })
  })

  it('should get book', async () => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(mockBook())
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { serial: '9780123456789' } })
  })

  it('should send 204 status if book already exists', async () => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(mockBook())
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should search book', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(isbnSearch).toHaveBeenCalledWith('9780123456789')
  })

  it('should send 404 status if isbn is not found', async () => {
    mock(isbnSearch).mockResolvedValue(null)
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(404)
  })

  it('should find matching author', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.author.findFirst).toHaveBeenCalledWith({
      where: { AND: [{ OR: [{ firstName: { contains: 'author' } }] }, { OR: [{ lastName: { contains: 'author' } }] }] },
    })
  })

  it('should create author if no matching author is found', async () => {
    jest.spyOn(prisma.author, 'findFirst').mockResolvedValue(null)
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.author.create).toHaveBeenCalledWith({ data: { lastName: 'author' } })
  })

  it('should create book', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.book.create).toHaveBeenCalledWith({
      data: { authors: { connect: [{ id: 1 }] }, serial: '9780123456789', source: 'source', title: 'Title' },
    })
  })

  it('should send 201 status', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(201)
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.book, 'create').mockRejectedValue(new Error('500'))
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
