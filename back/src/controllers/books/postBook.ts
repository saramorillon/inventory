import { Request, Response } from 'express'
import { z } from 'zod'
import { isbnSearch } from '../../libs/isbn'
import { prisma } from '../../prisma/client'

const schema = {
  body: z.object({
    serial: z.string().regex(/^97(8|9)\d{10}$/),
  }),
}

export async function postBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('scan_book')
  try {
    const { serial } = schema.body.parse(req.body)
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
    await prisma.book.create({ data: { serial, title, source, authors: { connect: [{ id: author.id }] } } })
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
