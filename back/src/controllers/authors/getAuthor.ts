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

export const getAuthor = {
  schema: {
    params: Joi.object<Schema['params']>({
      id: Joi.number().required(),
    }),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { id } = req.params

    try {
      const author = await prisma.author.findUnique({ where: { id }, include: { books: true } })
      logger.info('get_author_success', { id })
      res.json(author)
    } catch (error) {
      logger.error('get_author_error', { id, error })
      res.status(500).json(parseError(error))
    }
  },
}
