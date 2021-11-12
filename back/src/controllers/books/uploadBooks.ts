import Busboy from 'busboy'
import { parseISO } from 'date-fns'
import { Request, Response } from 'express'
import { parseString } from 'fast-csv'
import { EOL } from 'os'
import { createInterface } from 'readline'
import { logger } from '../../libs/logger'
import { prisma } from '../../prisma/client'
import { SocketService } from '../../socket/socket'
import { Book } from '.prisma/client'

export const uploadBooks = {
  route: async function (req: Request, res: Response): Promise<void> {
    const busboy = new Busboy({ headers: req.headers })
    busboy.on('file', async (_, file) => {
      const total = Number(req.get('content-length'))
      let current = 0
      let header: string | null = null
      const rl = createInterface(file)
      for await (const line of rl) {
        current += Buffer.from(line).byteLength
        if (!header) header = line
        else await parseLine(header, line, current / total)
      }
      SocketService.send('upload_books', 1)
      logger.info('upload_books_end')
    })
    req.pipe(busboy)
    res.sendStatus(202)
  },
}

async function parseLine(header: string, line: string, progress: number) {
  const records = parseString([header, line].join(EOL), { headers: true, trim: true, delimiter: ';' })
  for await (const record of records) {
    await saveRecord(record)
    logger.info('upload_book', { record })
    SocketService.send('upload_books', progress)
  }
}

interface BookRecord {
  id?: string
  serial: string
  title: string
  source: string
  createdAt: string
  updatedAt: string
}

async function saveRecord(record: BookRecord) {
  const id = Number(record.id) || undefined
  const book: Omit<Book, 'id'> = {
    serial: record.serial,
    title: record.title,
    source: record.source,
    createdAt: parseISO(record.createdAt),
    updatedAt: parseISO(record.updatedAt),
  }
  await prisma.book.upsert({ where: { id }, create: book, update: book })
}
