import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { parseError } from '../../libs/error'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'

interface Schema extends ValidatedRequestSchema {
  params: {
    serial: string
  }
}

export const deleteDraft = {
  schema: {
    params: Joi.object<Schema['params']>({
      serial: Joi.string().required(),
    }),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { serial } = req.params

    try {
      await prisma.draft.delete({ where: { serial } })
      logger.info('delete_draft_success', { serial })
      res.sendStatus(204)
    } catch (error) {
      logger.error('delete_draft_error', { serial, error })
      res.status(500).json(parseError(error))
    }
  },
}
