import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function deleteBook(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_book')
  try {
    const { id } = schema.params.parse(req.params)
    await prisma.book.delete({ where: { id } })
    success()
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
