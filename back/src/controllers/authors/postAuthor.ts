import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { parseError } from '../../libs/error'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'

interface Schema extends ValidatedRequestSchema {
  body: {
    firstName?: string
    lastName: string
  }
}

export const postAuthor = {
  schema: {
    body: Joi.object<Schema['body']>({
      firstName: Joi.string().required().allow('').optional(),
      lastName: Joi.string().required(),
    }).unknown(true),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { firstName, lastName } = req.body

    try {
      const author = await prisma.author.findFirst({ where: { firstName, lastName } })
      if (author) {
        throw new Error(`Author ${firstName} ${lastName} already exists`)
      }
      await prisma.author.create({ data: { firstName, lastName } })
      logger.info('post_author_success', { body: req.body })
    } catch (error) {
      logger.error('post_author_error', { body: req.body, error })
      res.status(500).json(parseError(error))
    }
  },
}
