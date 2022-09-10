import { Request, Response } from 'express'
import { author, name, repository, version } from '../../../package.json'

export function getApp(req: Request, res: Response): void {
  try {
    res.json({ name, version, repository, author })
  } catch (error) {
    res.sendStatus(500)
  }
}
