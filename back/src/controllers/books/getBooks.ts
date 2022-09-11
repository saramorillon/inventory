import { Request, Response } from 'express'
import { prisma } from '../../prisma/client'

export async function getBooks(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_books')
  try {
    const books = await prisma.book.findMany({
      include: { authors: true },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(books)
    success()
  } catch (error) {
    res.status(500).json(failure(error))
  }
}
