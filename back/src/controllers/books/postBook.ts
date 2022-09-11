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
    id?: number
  }
  body: {
    serial: string
    title: string
    source: string
    authors?: { id: number }[]
  }
}

export const postBook = {
  schema: {
    body: Joi.object<Schema['body']>({
      serial: Joi.string().required(),
    }).unknown(true),
  },

  route: async function (req: ValidatedRequest<Schema>, res: Response): Promise<void> {
    const { serial } = req.body

    try {
      if (isIsbn(serial)) {
        const book = await prisma.book.findUnique({ where: { serial } })
        if (!book) {
          const result = await isbnSearch(serial)
          if (!result) throw new Error('ISBN not found in API')
          await saveBook(result)
          logger.info('scan_success', { serial })
          res.send(true)
        } else {
          res.send(false)
        }
      } else {
        throw new Error('serial should be an ISBN')
      }
    } catch (error) {
      logger.error('scan_error', { serial, error })
      res.status(500).json(parseError(error))
    }
  },
}

export async function saveBook(result: IApiResult): Promise<void> {
  const { isbn: serial, title, authors, source } = result
  let author = await prisma.author.findFirst({
    where: {
      AND: [
        { OR: authors.map((author) => ({ firstName: { contains: author } })) },
        { OR: authors.map((author) => ({ lastName: { contains: author } })) },
      ],
    },
  })
  if (!author) {
    author = await prisma.author.create({ data: { lastName: authors.join(' ') } })
  }
  await prisma.book.create({ data: { serial, title, source, authors: { connect: [{ id: author.id }] } } })
}
