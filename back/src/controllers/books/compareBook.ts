import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { parseError } from '../../libs/error'
import { isbnCompare, isIsbn } from '../../libs/isbn'
import { logger } from '../../libs/logger'

interface Schema extends ValidatedRequestSchema {
  query: {
    serial: string
  }
}

export const compareBook = {
  schema: {
    query: Joi.object<Schema['query']>({
      serial: Joi.string().required(),
    }),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { serial } = req.query

    try {
      if (isIsbn(serial)) {
        const results = await isbnCompare(serial)
        logger.info('compare_book_success', { serial })
        res.json(results)
      } else {
        throw new Error('Identifier should be an ISBN')
      }
    } catch (error) {
      logger.error('compare_book_error', { serial, error })
      res.status(500).json(parseError(error))
    }
  },
}
