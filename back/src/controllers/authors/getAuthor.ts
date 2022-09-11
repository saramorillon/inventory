import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function getAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_author')
  try {
    const { id } = schema.params.parse(req.params)
    const author = await prisma.author.findUnique({ where: { id }, include: { books: true } })
    success()
    res.json(author)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
