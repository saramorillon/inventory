import { Request, Response } from 'express'
import { z } from 'zod'
import { IApiResult } from '../../libs/apis/Api'
import { isbnSearch, isIsbn } from '../../libs/isbn'
import { prisma } from '../../prisma/client'

const schema = {
  body: z.object({
    serial: z.string(),
  }),
}

export async function postBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('scan_book')
  try {
    const { serial } = schema.body.parse(req.body)
    if (isIsbn(serial)) {
      const book = await prisma.book.findUnique({ where: { serial } })
      if (!book) {
        const result = await isbnSearch(serial)
        if (!result) throw new Error('ISBN not found in API')
        await saveBook(result)
        res.send(true)
      } else {
        res.send(false)
      }
      success()
    } else {
      res.status(500).json(failure(new Error('serial should be an ISBN')))
    }
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

export async function saveBook(result: IApiResult): Promise<void> {
  const { isbn: serial, title, authors, source } = result
  let author = await prisma.author.findFirst({
    where: {
      AND: [
        { OR: authors.map((author) => ({ firstName: { contains: author } })) },
        { OR: authors.map((author) => ({ lastName: { contains: author } })) },
      ],
    },
  })
  if (!author) {
    author = await prisma.author.create({ data: { lastName: authors.join(' ') } })
  }
  await prisma.book.create({ data: { serial, title, source, authors: { connect: [{ id: author.id }] } } })
}
