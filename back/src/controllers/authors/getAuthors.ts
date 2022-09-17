import { Request, Response } from 'express'
import { prisma } from '../../prisma/client'

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
