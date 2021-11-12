import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { parseError } from '../../libs/error'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'

interface Schema extends ValidatedRequestSchema {
  params: {
    serial?: string
  }
}

export const getDraft = {
  schema: {
    params: Joi.object<Schema['params']>({
      serial: Joi.string().required(),
    }),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { serial } = req.params

    try {
      const draft = await prisma.draft.findUnique({ where: { serial } })
      logger.info('get_draft_success', { serial })
      res.json(draft)
    } catch (error) {
      logger.error('get_draft_error', { serial, error })
      res.status(500).json(parseError(error))
    }
  },
}
