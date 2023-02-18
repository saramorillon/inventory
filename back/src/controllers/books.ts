import { Request, Response } from 'express'
import { z } from 'zod'
import { isbnSearch } from '../libs/isbn'
import { prisma } from '../prisma/client'
import { capitalize } from '../utils/capitalize'

const schema = {
  post: z.object({
    serial: z.string().regex(/^97(8|9)\d{10}$/),
  }),
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
    const books = await prisma.book.findMany({
      include: { authors: true },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(books)
    success()
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

export async function postBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('scan_book')
  try {
    const { serial } = schema.post.parse(req.body)
    const book = await prisma.book.findUnique({ where: { serial } })
    if (book) {
      res.sendStatus(204)
      success()
      return
    }
    const result = await isbnSearch(serial)
    if (!result) {
      res.sendStatus(404)
      success()
      return
    }
    const { title, authors, source } = result
    const author = await getAuthor(authors)
    await prisma.book.create({
      data: { serial, title: capitalize(title), source, authors: { connect: [{ id: author.id }] } },
    })
    res.sendStatus(201)
    success()
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

async function getAuthor(authors: string[]) {
  const firstNames = authors.map((author) => ({ firstName: { contains: author } }))
  const lastNames = authors.map((author) => ({ lastName: { contains: author } }))
  return (
    (await prisma.author.findFirst({ where: { AND: [{ OR: firstNames }, { OR: lastNames }] } })) ??
    (await prisma.author.create({ data: { lastName: authors.join(' ') } }))
  )
}

export async function getBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_book')
  try {
    const { id } = schema.get.parse(req.params)
    const book = await prisma.book.findUnique({ where: { id }, include: { authors: true } })
    success()
    res.json(book)
  } catch (error) {
    res.status(500).json(failure(error))
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
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

export async function deleteBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_book')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.book.delete({ where: { id } })
    success()
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
