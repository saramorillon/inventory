import type { Request, Response } from 'express'
import { author, name, repository, version } from '../../package.json'

export function getApp(req: Request, res: Response): void {
  res.json({ name, version, repository, author })
}
