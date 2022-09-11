import { Book } from '@prisma/client'
import { Request, Response } from 'express'
import { z } from 'zod'
import { exportData } from '../../libs/export'
import { prisma } from '../../prisma/client'

const schema = {
  query: z.object({
    lazy: z.boolean().optional(),
    format: z.enum(['csv']).optional(),
  }),
}

export async function getBooks(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_books')
  try {
    const { lazy, format } = schema.query.parse(req.query)
    const books = await prisma.book.findMany({
      include: { authors: !lazy && format !== 'csv' },
      orderBy: { updatedAt: 'desc' },
    })
    if (format === 'csv') {
      exportData('books', books.map(toCsv), res)
    } else {
      res.json(books)
    }
    success()
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

function toCsv(book: Book): Record<string, string> {
  return {
    id: book.id.toString(),
    serial: book.serial,
    source: book.source,
    title: book.title,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  }
}
