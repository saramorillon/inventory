import { Logger } from '@saramorillon/logger'
import type { NextFunction, Request, Response } from 'express'
import { settings } from '../settings'

export function logger(req: Request, res: Response, next: NextFunction): void {
  const { url, params, query } = req
  req.logger = new Logger(settings.logs, { app: settings.app, req: { url, params, query } })
  next()
}
