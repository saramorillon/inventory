import type { Request, Response } from 'express'
import { z } from 'zod'
import { isbnSearch } from '../libs/isbn'
import { prisma } from '../prisma'
import { capitalize } from '../utils/capitalize'
import { parseError } from '../utils/parseError'

const schema = {
  post: z.union([
    z.object({
      serial: z.string(),
      title: z.string(),
      source: z.string(),
      authors: z.array(z.object({ id: z.number() })),
    }),
    z.object({
      serial: z.string().regex(/^97(8|9)\d{10}$/),
    }),
  ]),
  get: z.object({
    id: z.string().transform(Number),
  }),
  put: z.object({
    serial: z.string(),
    title: z.string(),
    source: z.string(),
    authors: z.array(z.object({ id: z.number() })),
  }),
}

export async function getBooks(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_books')
  try {
    if (!req.session.user) {
      res.json([])
      success()
      return
    }

    const books = await prisma.book.findMany({
      where: { users: { some: { username: req.session.user.username } } },
      include: { authors: true },
      orderBy: { updatedAt: 'desc' },
    })

    res.json(books)
    success()
  } catch (e) {
    const error = parseError(e)
    failure(error)
    res.status(500).json(error)
  }
}

export async function postBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_book')
  try {
    const { user } = req.session
    const body = schema.post.parse(req.body)
    if ('title' in body) {
      const { serial, title, source, authors } = body
      const book = await prisma.book.create({
        data: { serial, title: capitalize(title), source, authors: { connect: authors } },
      })

      if (user) {
        await prisma.user.update({ where: { username: user.username }, data: { books: { connect: [book] } } })
      }

      res.status(201).json(book)
    } else {
      const { serial } = body

      let book = await prisma.book.findUnique({ where: { serial } })
      if (book) {
        if (user) {
          await prisma.user.update({ where: { username: user.username }, data: { books: { connect: [book] } } })
        }
        res.sendStatus(204)
        success()
        return
      }

      const result = await isbnSearch(serial, user)
      if (!result) {
        res.sendStatus(404)
        success()
        return
      }

      const authors = []
      if (result.authors.length) {
        const firstNames = result.authors.map((author) => ({ firstName: author }))
        const lastNames = result.authors.map((author) => ({ lastName: author }))
        const author = await prisma.author.findFirst({ where: { AND: [{ OR: firstNames }, { OR: lastNames }] } })
        if (author) {
          authors.push(author)
        } else {
          authors.push(await prisma.author.create({ data: { lastName: result.authors.join(' ') } }))
        }
      }

      const { title, source } = result
      book = await prisma.book.create({
        data: { serial, title: capitalize(title), source, authors: { connect: authors } },
      })

      if (user) {
        await prisma.user.update({ where: { username: user.username }, data: { books: { connect: [book] } } })
      }

      res.status(201).json(book)
    }
    success()
  } catch (e) {
    const error = parseError(e)
    failure(error)
    res.status(500).json(error)
  }
}

export async function getBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_book')
  try {
    const { id } = schema.get.parse(req.params)
    const book = await prisma.book.findUnique({ where: { id }, include: { authors: true } })
    success()
    res.json(book)
  } catch (e) {
    const error = parseError(e)
    failure(error)
    res.status(500).json(error)
  }
}

export async function putBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('put_book')
  try {
    const { id } = schema.get.parse(req.params)
    const { authors, title, ...data } = schema.put.parse(req.body)
    const book = await prisma.book.update({
      where: { id },
      data: { ...data, title: capitalize(title), authors: { set: authors } },
      include: { authors: true },
    })
    success()
    res.json(book)
  } catch (e) {
    const error = parseError(e)
    failure(error)
    res.status(500).json(error)
  }
}

export async function deleteBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_book')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.book.delete({ where: { id } })
    success()
    res.sendStatus(204)
  } catch (e) {
    const error = parseError(e)
    failure(error)
    res.status(500).json(error)
  }
}
