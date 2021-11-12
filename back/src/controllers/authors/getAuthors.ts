import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { parseError } from '../../libs/error'
import { exportData } from '../../libs/export'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'
import { Author } from '.prisma/client'

interface Schema extends ValidatedRequestSchema {
  query: {
    lazy?: boolean
    format?: 'csv'
  }
}

export const getAuthors = {
  schema: {
    query: Joi.object<Schema['query']>({
      lazy: Joi.bool().optional(),
      format: Joi.string().valid('csv').optional(),
    }).unknown(true),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { lazy, format } = req.query

    try {
      const authors = await prisma.author.findMany({
        include: { books: !lazy && format !== 'csv' },
        orderBy: { lastName: 'asc' },
      })
      if (format === 'csv') {
        exportData('authors', authors.map(toCsv), res)
      } else {
        res.json(authors)
      }
      logger.info('get_authors_success', { format })
    } catch (error) {
      logger.error('get_authors_error', { format, error })
      res.status(500).json(parseError(error))
    }
  },
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
