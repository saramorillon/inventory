import { NextFunction, Request, Response } from 'express'
import { Logger } from '../libs/logger'

export function logger(req: Request, res: Response, next: NextFunction): void {
  const { url, params, query } = req
  req.logger = new Logger({ url, params, query })
  next()
}
