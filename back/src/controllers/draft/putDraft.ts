import { Draft } from '@prisma/client'
import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import { IApiResult } from '../../libs/apis/Api'
import { parseError } from '../../libs/error'
import { isbnSearch, isIsbn } from '../../libs/isbn'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'

interface Schema extends ValidatedRequestSchema {
  params: {
    serial: string
  }
}

export const putDraft = {
  schema: {
    params: Joi.object<Schema['params']>({
      serial: Joi.string().required(),
    }),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { serial } = req.params

    try {
      if (isIsbn(serial)) {
        const result = await isbnSearch(serial)
        if (!result) throw new Error('ISBN not found in API')
        const draft = await saveDraft(result)
        logger.info('scan_success', { serial })
        res.json(draft)
      } else {
        throw new Error('serial should be an ISBN')
      }
    } catch (error) {
      logger.error('scan_error', { serial, error })
      res.status(500).json(parseError(error))
    }
  },
}

export async function saveDraft(result: IApiResult): Promise<Draft | undefined> {
  const { isbn: serial, ...body } = result
  const book = await prisma.book.findUnique({ where: { serial } })
  if (book) throw new Error('Book already in inventory')
  return prisma.draft.upsert({
    where: { serial },
    create: { serial, ...body },
    update: { serial, ...body },
  })
}
