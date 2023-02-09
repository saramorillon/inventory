import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client'

const schema = {
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    books: z.array(z.object({ id: z.number() })),
  }),
}

export async function postAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_author')
  try {
    const { firstName, lastName, books } = schema.body.parse(req.body)
    const author = await prisma.author.create({
      data: { firstName, lastName: lastName.toUpperCase(), books: { connect: books } },
      include: { books: true },
    })
    success()
    res.json(author)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
