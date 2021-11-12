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
  body: {
    serial: string
    title: string
    subtitle?: string | null
    source: string
    authors?: { id: number }[]
  }
}

export const putBook = {
  schema: {
    params: Joi.object<Schema['params']>({
      id: Joi.number().optional(),
    }),
    body: Joi.object<Schema['body']>({
      serial: Joi.string().required(),
      title: Joi.string().optional(),
      subtitle: Joi.string().optional().allow('').allow(null),
      source: Joi.string().required(),
      authors: Joi.array().items(Joi.object({ id: Joi.number() }).unknown(true)),
    }).unknown(true),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { id } = req.params
    const { serial, title, subtitle, source } = req.body

    try {
      const authors = (req.body.authors || []).map((author) => ({ id: author.id }))
      const volume = await createOrUpdate(id, { serial, title, subtitle, source, authors })
      logger.info('put_book_success', { body: req.body })
      res.json(volume)
    } catch (error) {
      logger.error('put_book_error', { body: req.body, error })
      res.status(500).json(parseError(error))
    }
  },
}

async function createOrUpdate(id: number | undefined, body: Schema['body']) {
  const { authors, ...data } = body
  const unique = id ? { id } : { serial: body.serial }
  return prisma.book.upsert({
    where: unique,
    create: { ...data, authors: { connect: authors } },
    update: { ...data, ...(authors && { authors: { set: authors } }) },
    include: { authors: true },
  })
}
