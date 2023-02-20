import { Router } from 'express'
import { getApp } from '../../src/controllers/app'
import { deleteAuthor, getAuthor, getAuthors, postAuthor, putAuthor } from '../../src/controllers/authors'
import { deleteBook, getBook, getBooks, postBook, putBook } from '../../src/controllers/books'
import { getSession, login, logout } from '../../src/controllers/session'
import { session } from '../../src/middlewares/session'
import { routes } from '../../src/routes'

jest.mock('express')
jest.mock('../../src/controllers/app')
jest.mock('../../src/controllers/session')
jest.mock('../../src/middlewares/session')

function mockRouter() {
  return {
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  } as unknown as Router
}

describe('routes', () => {
  beforeEach(() => {
    jest.mocked(Router).mockReturnValue(mockRouter())
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
    jest.mocked(Router).mockReturnValue(routerMock)
    const router = routes()
    expect(router).toBe(routerMock)
  })
})
