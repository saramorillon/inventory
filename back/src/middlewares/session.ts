import { NextFunction, Request, Response } from 'express'

export function session(req: Request, res: Response, next: NextFunction): void {
  if (req.session.user) {
    next()
  } else {
    res.sendStatus(401)
  }
}
