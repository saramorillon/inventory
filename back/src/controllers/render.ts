import { join } from 'path'
import { Request, Response } from 'express'
import { settings } from '../settings'

export function render(req: Request, res: Response): void {
  res.sendFile(join(settings.publicDir, 'index.html'))
}
