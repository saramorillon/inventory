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
    firstName: string
    lastName: string
    books?: { id: number }[]
  }
}

export const putAuthor = {
  schema: {
    params: Joi.object<Schema['params']>({
      id: Joi.number().optional(),
    }),
    body: Joi.object<Schema['body']>({
      firstName: Joi.string().required().allow(''),
      lastName: Joi.string().required(),
      books: Joi.array().items(Joi.object({ id: Joi.number() }).unknown(true)),
    }).unknown(true),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { id } = req.params
    const { firstName, lastName } = req.body

    try {
      const books = (req.body.books || []).map((volume) => ({ id: volume.id }))
      const author = await createOrUpdate(id, { firstName, lastName, books })
      logger.info('put_author_success', { id, body: req.body })
      res.json(author)
    } catch (error) {
      logger.error('put_author_error', { id, body: req.body, error })
      res.status(500).json(parseError(error))
    }
  },
}

function createOrUpdate(id: number | undefined, body: Schema['body']) {
  const { books, ...data } = body
  const unique = id ? { id } : { firstName_lastName: { firstName: body.firstName, lastName: body.lastName } }
  return prisma.author.upsert({
    where: unique,
    create: { ...data, books: { connect: books } },
    update: { ...data, ...(books?.length && { books: { set: books } }) },
    include: { books: true },
  })
}
