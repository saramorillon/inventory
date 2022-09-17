import { NextFunction, Request, Response } from 'express'

export function hasSession(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.sendStatus(401)
  }
}
