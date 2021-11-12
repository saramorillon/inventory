import { NextFunction, Request, Response } from 'express'
import passport from 'passport'

export function postLogin(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('local', function (err, user) {
    if (err || !user) {
      res.sendStatus(401)
    } else {
      req.login(user, function (err) {
        if (err) {
          res.sendStatus(401)
        } else {
          res.sendStatus(204)
        }
      })
    }
  })(req, res, next)
}
