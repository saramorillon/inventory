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
import { validator } from './middleware/validator'

export const router = express.Router()

router.post('/login', postLogin)
router.get('/app', getApp)

router.use(hasSession())

router.get('/logout', getLogout)
router.get('/session', getSession)

router.get('/authors', validator(getAuthors.schema), getAuthors.route)
router.get('/authors/:id', validator(getAuthor.schema), getAuthor.route)
router.post('/authors', validator(postAuthor.schema), postAuthor.route)
router.put('/authors/:id', validator(putAuthor.schema), putAuthor.route)
router.delete('/authors/:id', validator(deleteAuthor.schema), deleteAuthor.route)

router.get('/books', validator(getBooks.schema), getBooks.route)
router.get('/books/:id', validator(getBook.schema), getBook.route)
router.post('/books', validator(postBook.schema), postBook.route)
router.put('/books/:id', validator(putBook.schema), putBook.route)
router.delete('/books/:id', validator(deleteBook.schema), deleteBook.route)
