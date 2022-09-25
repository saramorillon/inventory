import { Router } from 'express'
import { getApp } from '../../src/controllers/app/getApp'
import { deleteAuthor } from '../../src/controllers/authors/deleteAuthor'
import { getAuthor } from '../../src/controllers/authors/getAuthor'
import { getAuthors } from '../../src/controllers/authors/getAuthors'
import { putAuthor } from '../../src/controllers/authors/putAuthor'
import { deleteBook } from '../../src/controllers/books/deleteBook'
import { getBook } from '../../src/controllers/books/getBook'
import { getBooks } from '../../src/controllers/books/getBooks'
import { postBook } from '../../src/controllers/books/postBook'
import { putBook } from '../../src/controllers/books/putBook'
import { getLogout } from '../../src/controllers/session/getLogout'
import { getSession } from '../../src/controllers/session/getSession'
import { postLogin } from '../../src/controllers/session/postLogin'
import { hasSession } from '../../src/middleware/session'
import { router } from '../../src/router'
import { mock } from '../mocks'

jest.mock('express')

describe('router', () => {
  it('should create all routes', () => {
    const routerMock = {
      use: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }
    mock(Router).mockReturnValue(routerMock)
    router()
    expect(routerMock.post).toHaveBeenCalledWith('/login', postLogin)
    expect(routerMock.get).toHaveBeenCalledWith('/app', getApp)
    expect(routerMock.use).toHaveBeenCalledWith(hasSession)
    expect(routerMock.get).toHaveBeenCalledWith('/logout', getLogout)
    expect(routerMock.get).toHaveBeenCalledWith('/session', getSession)
    expect(routerMock.get).toHaveBeenCalledWith('/authors', getAuthors)
    expect(routerMock.get).toHaveBeenCalledWith('/authors/:id', getAuthor)
    expect(routerMock.put).toHaveBeenCalledWith('/authors/:id', putAuthor)
    expect(routerMock.delete).toHaveBeenCalledWith('/authors/:id', deleteAuthor)
    expect(routerMock.get).toHaveBeenCalledWith('/books', getBooks)
    expect(routerMock.get).toHaveBeenCalledWith('/books/:id', getBook)
    expect(routerMock.post).toHaveBeenCalledWith('/books', postBook)
    expect(routerMock.put).toHaveBeenCalledWith('/books/:id', putBook)
    expect(routerMock.delete).toHaveBeenCalledWith('/books/:id', deleteBook)
  })

  it('should return router', () => {
    const routerMock = {
      use: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }
    mock(Router).mockReturnValue(routerMock)
    expect(router()).toBe(routerMock)
  })
})
