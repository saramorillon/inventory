import { Author } from '@prisma/client'
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

export async function getAuthors(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_authors')
  try {
    const { lazy, format } = schema.query.parse(req.query)
    const authors = await prisma.author.findMany({
      include: { books: !lazy && format !== 'csv' },
      orderBy: { lastName: 'asc' },
    })
    if (format === 'csv') {
      exportData('books', authors.map(toCsv), res)
    } else {
      res.json(authors)
    }
    success()
  } catch (error) {
    res.status(500).json(failure(error))
  }
}

function toCsv(author: Author): Record<string, string> {
  return {
    id: author.id.toString(),
    firstName: author.firstName || '',
    lastName: author.lastName,
    createdAt: author.createdAt.toISOString(),
    updatedAt: author.updatedAt.toISOString(),
  }
}
