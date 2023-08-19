import { Router } from 'express'
import { getApp } from '../../src/controllers/app'
import { deleteAuthor, getAuthor, getAuthors, postAuthor, putAuthor } from '../../src/controllers/authors'
import { deleteBook, getBook, getBooks, postBook, putBook } from '../../src/controllers/books'
import { getSession, login, logout } from '../../src/controllers/session'
import { session } from '../../src/middlewares/session'
import { routes } from '../../src/routes'

vi.mock('express')
vi.mock('../../src/controllers/app')
vi.mock('../../src/controllers/session')
vi.mock('../../src/middlewares/session')

function mockRouter() {
  return {
    use: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as Router
}

describe('routes', () => {
  beforeEach(() => {
    vi.mocked(Router).mockReturnValue(mockRouter())
  })

  it('should create routes', () => {
    const router = routes()
    expect(router.post).toHaveBeenCalledWith('/login', login)
    expect(router.get).toHaveBeenCalledWith('/app', getApp)
    expect(router.use).toHaveBeenCalledWith(session)
    expect(router.get).toHaveBeenCalledWith('/session', getSession)
    expect(router.get).toHaveBeenCalledWith('/logout', logout)
    expect(router.get).toHaveBeenCalledWith('/authors', getAuthors)
    expect(router.get).toHaveBeenCalledWith('/authors/:id', getAuthor)
    expect(router.post).toHaveBeenCalledWith('/authors', postAuthor)
    expect(router.put).toHaveBeenCalledWith('/authors/:id', putAuthor)
    expect(router.delete).toHaveBeenCalledWith('/authors/:id', deleteAuthor)
    expect(router.get).toHaveBeenCalledWith('/books', getBooks)
    expect(router.get).toHaveBeenCalledWith('/books/:id', getBook)
    expect(router.post).toHaveBeenCalledWith('/books', postBook)
    expect(router.put).toHaveBeenCalledWith('/books/:id', putBook)
    expect(router.delete).toHaveBeenCalledWith('/books/:id', deleteBook)
  })

  it('should return router', () => {
    const routerMock = mockRouter()
    vi.mocked(Router).mockReturnValue(routerMock)
    const router = routes()
    expect(router).toBe(routerMock)
  })
})
