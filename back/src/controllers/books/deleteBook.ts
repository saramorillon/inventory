import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { parseError } from '../../libs/error'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'

interface Schema extends ValidatedRequestSchema {
  params: {
    id?: number
  }
}

export const deleteBook = {
  schema: {
    params: Joi.object<Schema['params']>({
      id: Joi.number().required(),
    }),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { id } = req.params

    try {
      await prisma.book.delete({ where: { id } })
      logger.info('delete_book_success', { id })
      res.sendStatus(204)
    } catch (error) {
      logger.error('delete_book_error', { id, error })
      res.status(500).json(parseError(error))
    }
  },
}
