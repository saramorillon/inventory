import { Response } from 'express'
import moment from 'moment'
import { format } from 'fast-csv'

export function exportData(name: string, items: Record<string, string>[], res: Response): void {
  res.set('Content-Type', 'text/csv')
  res.attachment(`${name}_${moment.utc().format('YYYY-MM-DD_hh:mm:ss')}.csv`)
  const stream = format({ headers: true, writeBOM: true, delimiter: ';' })
  stream.pipe(res)
  for (const item of items) {
    stream.write(item)
  }
  stream.end()
}
