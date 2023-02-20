import { Request, Response } from 'express'
import { join } from 'path'
import { settings } from '../settings'

export function render(req: Request, res: Response): void {
  res.sendFile(join(settings.publicDir, 'index.html'))
}
