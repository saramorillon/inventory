import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    serial: z.string(),
    title: z.string(),
    source: z.string(),
    authors: z.array(z.object({ id: z.number() })),
  }),
}

export async function putBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('put_book')
  try {
    const { id } = schema.params.parse(req.params)
    const { authors, ...data } = schema.body.parse(req.body)
    const book = await prisma.book.update({
      where: { id },
      data: { ...data, authors: { set: authors } },
      include: { authors: true },
    })
    success()
    res.json(book)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
