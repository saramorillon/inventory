import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    books: z.array(z.object({ id: z.number() })),
  }),
}

export async function putAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_author')
  try {
    const { id } = schema.params.parse(req.params)
    const { firstName, lastName, books } = schema.body.parse(req.body)
    const author = await prisma.author.update({
      where: { id },
      data: { firstName, lastName: lastName.toUpperCase(), books: { set: books } },
      include: { books: true },
    })
    success()
    res.json(author)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
