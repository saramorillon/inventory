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
    const body = schema.body.parse(req.body)
    const author = await createOrUpdate(id, body)
    success()
    res.json(author)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

function createOrUpdate(id: number, body: z.infer<typeof schema.body>) {
  const { books, ...firstName_lastName } = body
  const unique = id ? { id } : { firstName_lastName }
  return prisma.author.upsert({
    where: unique,
    create: { ...firstName_lastName, books: { connect: books } },
    update: { ...firstName_lastName, ...(books?.length && { books: { set: books } }) },
    include: { books: true },
  })
}
