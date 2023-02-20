import { Router } from 'express'
import { getApp } from './controllers/app'
import { deleteAuthor, getAuthor, getAuthors, postAuthor, putAuthor } from './controllers/authors'
import { deleteBook, getBook, getBooks, postBook, putBook } from './controllers/books'
import { getSession, login, logout } from './controllers/session'
import { session } from './middlewares/session'

export function routes() {
  const router = Router()

  router.post('/login', login)
  router.get('/app', getApp)

  router.use(session)

  router.get('/session', getSession)
  router.get('/logout', logout)

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
