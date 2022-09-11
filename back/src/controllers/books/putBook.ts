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
    const body = schema.body.parse(req.body)
    const volume = await createOrUpdate(id, body)
    success()
    res.json(volume)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

async function createOrUpdate(id: number, body: z.infer<typeof schema.body>) {
  const { authors, ...data } = body
  const unique = id ? { id } : { serial: body.serial }
  return prisma.book.upsert({
    where: unique,
    create: { ...data, authors: { connect: authors } },
    update: { ...data, ...(authors && { authors: { set: authors } }) },
    include: { authors: true },
  })
}
