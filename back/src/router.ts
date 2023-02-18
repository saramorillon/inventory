import { Router } from 'express'
import { getApp } from './controllers/app'
import { deleteAuthor, getAuthor, getAuthors, postAuthor, putAuthor } from './controllers/authors'
import { deleteBook, getBook, getBooks, postBook, putBook } from './controllers/books'
import { getLogout, getSession, postLogin } from './controllers/session'

import { hasSession } from './middleware/session'

export function router(): Router {
  const router = Router()

  router.post('/login', postLogin)
  router.get('/app', getApp)

  router.use(hasSession)

  router.get('/logout', getLogout)
  router.get('/session', getSession)

  router.get('/authors', getAuthors)
  router.get('/authors/:id', getAuthor)
  router.post('/authors', postAuthor)
  router.put('/authors/:id', putAuthor)
  router.delete('/authors/:id', deleteAuthor)

  router.get('/books', getBooks)
  router.get('/books/:id', getBook)
  router.post('/books', postBook)
  router.put('/books/:id', putBook)
  router.delete('/books/:id', deleteBook)

  return router
}
