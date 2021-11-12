import { Response } from 'express'
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'
import Joi from 'joi'
import uniq from 'lodash.uniq'
import { parseError } from '../../libs/error'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'

interface Schema extends ValidatedRequestSchema {
  body: {
    authors: { id: number }[]
  }
}

export const mergeAuthors = {
  schema: {
    body: Joi.object<Schema['body']>({
      authors: Joi.array().items(Joi.object({ id: Joi.number() }).unknown(true)),
    }).unknown(true),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { authors } = req.body

    try {
      const id = await merge(...authors.map((author) => author.id))
      logger.info('merge_authors_success', { authors })
      res.json(id)
    } catch (error) {
      logger.error('merge_authors_error', { authors, error })
      res.status(500).json(parseError(error))
    }
  },
}

export async function merge(...ids: number[]): Promise<number> {
  ids.sort((a, b) => a - b)
  const [id, ...toRemove] = uniq(ids)
  if (toRemove.length === 0) return id
  await prisma.$queryRaw(
    `INSERT IGNORE INTO _author_to_book SELECT ${id}, B FROM _author_to_book WHERE A IN (${toRemove.join(', ')});`
  )
  await prisma.author.deleteMany({ where: { id: { in: toRemove } } })
  return id
}
