import { NextFunction, Request, Response } from 'express'

export function hasSession() {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.sendStatus(401)
    }
  }
}
