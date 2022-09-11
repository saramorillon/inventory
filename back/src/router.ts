import express from 'express'
import { getApp } from './controllers/app/getApp'
import { deleteAuthor } from './controllers/authors/deleteAuthor'
import { getAuthor } from './controllers/authors/getAuthor'
import { getAuthors } from './controllers/authors/getAuthors'
import { postAuthor } from './controllers/authors/postAuthor'
import { putAuthor } from './controllers/authors/putAuthor'
import { deleteBook } from './controllers/books/deleteBook'
import { getBook } from './controllers/books/getBook'
import { getBooks } from './controllers/books/getBooks'
import { postBook } from './controllers/books/postBook'
import { putBook } from './controllers/books/putBook'
import { getLogout } from './controllers/session/getLogout'
import { getSession } from './controllers/session/getSession'
import { postLogin } from './controllers/session/postLogin'
import { hasSession } from './middleware/session'

export const router = express.Router()

router.post('/login', postLogin)
router.get('/app', getApp)

router.use(hasSession())

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
