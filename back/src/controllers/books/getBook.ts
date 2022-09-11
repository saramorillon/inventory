import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function getBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_book')
  try {
    const { id } = schema.params.parse(req.params)
    const book = await prisma.book.findUnique({ where: { id }, include: { authors: true } })
    success()
    res.json(book)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
