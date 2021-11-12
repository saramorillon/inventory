import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { parseError } from '../../libs/error'
import { exportData } from '../../libs/export'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'
import { Book } from '.prisma/client'

interface Schema extends ValidatedRequestSchema {
  query: {
    lazy?: boolean
    format?: 'csv'
  }
}

export const getBooks = {
  schema: {
    query: Joi.object<Schema['query']>({
      lazy: Joi.bool().optional(),
      format: Joi.string().valid('csv').optional(),
    }).unknown(true),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { lazy, format } = req.query

    try {
      const books = await prisma.book.findMany({
        include: { authors: !lazy && format !== 'csv' },
        orderBy: { updatedAt: 'desc' },
      })
      if (format === 'csv') {
        exportData('books', books.map(toCsv), res)
      } else {
        res.json(books)
      }
      logger.info('get_books_success', { format })
    } catch (error) {
      logger.error('get_books_error', { format, error })
      res.status(500).json(parseError(error))
    }
  },
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
