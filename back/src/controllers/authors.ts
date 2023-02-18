import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma/client'

const schema = {
  post: z.object({
    firstName: z.string(),
    lastName: z.string(),
    books: z.array(z.object({ id: z.number() })),
  }),
  get: z.object({
    id: z.string().transform(Number),
  }),
  put: z.object({
    firstName: z.string(),
    lastName: z.string(),
    books: z.array(z.object({ id: z.number() })),
  }),
}

export async function getAuthors(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_authors')
  try {
    const authors = await prisma.author.findMany({ include: { books: true }, orderBy: { lastName: 'asc' } })
    res.json(authors)
    success()
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

export async function postAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_author')
  try {
    const { firstName, lastName, books } = schema.post.parse(req.body)
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

export async function getAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_author')
  try {
    const { id } = schema.get.parse(req.params)
    const author = await prisma.author.findUnique({ where: { id }, include: { books: true } })
    success()
    res.json(author)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

export async function putAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_author')
  try {
    const { id } = schema.get.parse(req.params)
    const { firstName, lastName, books } = schema.put.parse(req.body)
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

export async function deleteAuthor(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_author')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.author.delete({ where: { id } })
    success()
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
