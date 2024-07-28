import { deleteBook, getBook, getBooks, postBook, putBook } from '../../../src/controllers/books'
import { isbnSearch } from '../../../src/libs/isbn'
import { prisma } from '../../../src/prisma'
import { getMockReq, getMockRes, mockApiResult, mockAuthor, mockBook, mockSession, mockUser } from '../../mocks'

vi.mock('../../../src/libs/isbn')

describe('getBooks', () => {
  beforeEach(() => {
    vi.spyOn(prisma.book, 'findMany').mockResolvedValue([mockBook()])
  })

  it('should return empty array if no session', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBooks(req, res)
    expect(res.json).toHaveBeenCalledWith([])
  })

  it('should get books', async () => {
    const req = getMockReq({ params: { id: '1' } })
    req.session.user = mockUser()
    const { res } = getMockRes()
    await getBooks(req, res)
    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: { users: { some: { username: 'username' } } },
      include: { authors: true },
      orderBy: { updatedAt: 'desc' },
    })
  })

  it('should send books', async () => {
    const req = getMockReq({ params: { id: '1' } })
    req.session.user = mockUser()
    const { res } = getMockRes()
    await getBooks(req, res)
    expect(res.json).toHaveBeenCalledWith([mockBook()])
  })

  it('should send 500 status on error', async () => {
    vi.spyOn(prisma.book, 'findMany').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    req.session.user = mockUser()
    const { res } = getMockRes()
    await getBooks(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})

describe('postBook', () => {
  beforeEach(() => {
    vi.spyOn(prisma.book, 'findUnique').mockResolvedValue(null)
    vi.spyOn(prisma.book, 'create').mockResolvedValue(mockBook())
    vi.spyOn(prisma.book, 'update').mockResolvedValue(mockBook())
    vi.spyOn(prisma.author, 'findFirst').mockResolvedValue(mockAuthor())
    vi.spyOn(prisma.author, 'create').mockResolvedValue(mockAuthor())
    vi.spyOn(prisma.user, 'update').mockResolvedValue(mockUser())
    vi.mocked(isbnSearch).mockResolvedValue(mockApiResult())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.json).toHaveBeenCalledWith({
      message: 'serial: Required, title: Required, source: Required, authors: Required OR serial: Required',
      stack: expect.any(String),
    })
  })

  it('should create book if body is full', async () => {
    const req = getMockReq({
      body: { serial: '9780123456789', title: 'Title', source: 'manual', authors: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.book.create).toHaveBeenCalledWith({
      data: { authors: { connect: [{ id: 1 }] }, serial: '9780123456789', source: 'manual', title: 'Title' },
    })
  })

  it('should link created book to current user', async () => {
    const req = getMockReq({
      body: { serial: '9780123456789', title: 'Title', source: 'manual', authors: [{ id: 1 }] },
    })
    req.session.user = mockSession()
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { username: 'username' },
      data: { books: { connect: [mockBook()] } },
    })
  })

  it('should send created book', async () => {
    const req = getMockReq({
      body: { serial: '9780123456789', title: 'Title', source: 'manual', authors: [{ id: 1 }] },
    })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.json).toHaveBeenCalledWith(mockBook())
  })

  it('should get book if body contains serial only', async () => {
    vi.spyOn(prisma.book, 'findUnique').mockResolvedValue(mockBook())
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { serial: '9780123456789' } })
  })

  it('should link existing book to current user', async () => {
    vi.spyOn(prisma.book, 'findUnique').mockResolvedValue(mockBook())
    const req = getMockReq({ body: { serial: '9780123456789' } })
    req.session.user = mockSession()
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { username: 'username' },
      data: { books: { connect: [mockBook()] } },
    })
  })

  it('should send 204 status if book already exists', async () => {
    vi.spyOn(prisma.book, 'findUnique').mockResolvedValue(mockBook())
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should search book', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    req.session.user = mockSession()
    const { res } = getMockRes()
    await postBook(req, res)
    expect(isbnSearch).toHaveBeenCalledWith('9780123456789')
  })

  it('should send 404 status if isbn is not found', async () => {
    vi.mocked(isbnSearch).mockResolvedValue(undefined)
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(404)
  })

  it('should not find matching author if author is empty', async () => {
    vi.mocked(isbnSearch).mockResolvedValue(mockApiResult({ authors: [] }))
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.author.findFirst).not.toHaveBeenCalled()
  })

  it('should create book without author if author is empty', async () => {
    vi.mocked(isbnSearch).mockResolvedValue(mockApiResult({ authors: [] }))
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.book.create).toHaveBeenCalledWith({
      data: { source: 'source', serial: '9780123456789', title: 'Title', authors: { connect: [] } },
    })
  })

  it('should find matching author', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.author.findFirst).toHaveBeenCalledWith({
      where: { AND: [{ OR: [{ firstName: 'author' }] }, { OR: [{ lastName: 'author' }] }] },
    })
  })

  it('should create author if no matching author is found', async () => {
    vi.spyOn(prisma.author, 'findFirst').mockResolvedValue(null)
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.author.create).toHaveBeenCalledWith({ data: { lastName: 'author' } })
  })

  it('should create book with matching author', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.book.create).toHaveBeenCalledWith({
      data: { source: 'source', serial: '9780123456789', title: 'Title', authors: { connect: [mockAuthor()] } },
    })
  })

  it('should link scanned book to current user', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    req.session.user = mockSession()
    const { res } = getMockRes()
    await postBook(req, res)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { username: 'username' },
      data: { books: { connect: [mockBook()] } },
    })
  })

  it('should send scanned book', async () => {
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(mockBook())
  })

  it('should send 500 status on error', async () => {
    vi.spyOn(prisma.book, 'create').mockRejectedValue(new Error('500'))
    const req = getMockReq({ body: { serial: '9780123456789' } })
    const { res } = getMockRes()
    await postBook(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})

describe('getBook', () => {
  beforeEach(() => {
    vi.spyOn(prisma.book, 'findUnique').mockResolvedValue(mockBook())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getBook(req, res)
    expect(res.json).toHaveBeenCalledWith({
      message: 'id: Required',
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
    vi.spyOn(prisma.book, 'findUnique').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBook(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})

describe('putBook', () => {
  beforeEach(() => {
    vi.spyOn(prisma.book, 'update').mockResolvedValue(mockBook())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await putBook(req, res)
    expect(res.json).toHaveBeenCalledWith({
      message: 'id: Required',
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
    vi.spyOn(prisma.book, 'update').mockRejectedValue(new Error('500'))
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

describe('deleteBook', () => {
  beforeEach(() => {
    vi.spyOn(prisma.book, 'delete').mockResolvedValue(mockBook())
  })

  it('should fail if parameters are invalid', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await deleteBook(req, res)
    expect(res.json).toHaveBeenCalledWith({
      message: 'id: Required',
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
    vi.spyOn(prisma.book, 'delete').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteBook(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
