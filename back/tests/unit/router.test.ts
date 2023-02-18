import { Router } from 'express'
import { getApp } from '../../src/controllers/app'
import { deleteAuthor, getAuthor, getAuthors, postAuthor, putAuthor } from '../../src/controllers/authors'
import { deleteBook, getBook, getBooks, postBook, putBook } from '../../src/controllers/books'
import { getLogout, getSession, postLogin } from '../../src/controllers/session'
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
    expect(routerMock.post).toHaveBeenCalledWith('/authors', postAuthor)
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
