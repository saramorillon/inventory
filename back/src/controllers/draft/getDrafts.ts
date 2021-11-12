import { Request, Response } from 'express'
import { parseError } from '../../libs/error'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'

export const getDrafts = {
  route: async function (req: Request, res: Response): Promise<void> {
    try {
      const drafts = await prisma.draft.findMany()
      res.json(drafts)
      logger.info('get_drafts_success')
    } catch (error) {
      logger.error('get_drafts_error', { error })
      res.status(500).json(parseError(error))
    }
  },
}
