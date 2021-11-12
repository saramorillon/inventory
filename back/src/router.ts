import express from 'express'
import { deleteAuthor } from './controllers/authors/deleteAuthor'
import { getAuthor } from './controllers/authors/getAuthor'
import { getAuthors } from './controllers/authors/getAuthors'
import { mergeAuthors } from './controllers/authors/mergeAuthors'
import { putAuthor } from './controllers/authors/putAuthor'
import { validator } from './middleware/validator'
import { getBooks } from './controllers/books/getBooks'
import { getBook } from './controllers/books/getBook'
import { putBook } from './controllers/books/putBook'
import { postLogin } from './controllers/session/postLogin'
import { hasSession } from './middleware/session'
import { getLogout } from './controllers/session/getLogout'
import { getSession } from './controllers/session/getSession'
import { deleteBook } from './controllers/books/deleteBook'
import { putDraft } from './controllers/draft/putDraft'
import { deleteDraft } from './controllers/draft/deleteDraft'
import { compareBook } from './controllers/books/compareBook'
import { getDrafts } from './controllers/draft/getDrafts'
import { getDraft } from './controllers/draft/getDraft'
import { uploadBooks } from './controllers/books/uploadBooks'

export const router = express.Router()

router.post('/login', postLogin)

router.use(hasSession())

router.get('/logout', getLogout)
router.get('/session', getSession)

router.get('/authors', validator(getAuthors.schema), getAuthors.route)
router.get('/authors/:id', validator(getAuthor.schema), getAuthor.route)
router.put('/authors/:id?', validator(putAuthor.schema), putAuthor.route)
router.delete('/authors/:id?', validator(deleteAuthor.schema), deleteAuthor.route)
router.post('/authors/merge', validator(mergeAuthors.schema), mergeAuthors.route)

router.get('/books', validator(getBooks.schema), getBooks.route)
router.get('/books/compare', validator(compareBook.schema), compareBook.route)
router.get('/books/:id', validator(getBook.schema), getBook.route)
router.post('/books', uploadBooks.route)
router.put('/books/:id?', validator(putBook.schema), putBook.route)
router.delete('/books/:id', validator(deleteBook.schema), deleteBook.route)

router.get('/drafts', getDrafts.route)
router.get('/drafts/:serial', validator(getDraft.schema), getDraft.route)
router.put('/drafts/:serial', validator(putDraft.schema), putDraft.route)
router.delete('/drafts/:serial', validator(deleteDraft.schema), deleteDraft.route)
