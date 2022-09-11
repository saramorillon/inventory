import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma/client'

const schema = {
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string(),
  }),
}

export async function postAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_author')
  try {
    const { firstName, lastName } = schema.body.parse(req.body)
    const author = await prisma.author.findFirst({ where: { firstName, lastName } })
    if (author) {
      throw new Error(`Author ${firstName} ${lastName} already exists`)
    }
    await prisma.author.create({ data: { firstName, lastName } })
    success()
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
