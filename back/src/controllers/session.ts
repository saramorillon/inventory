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

export function getSession(req: Request, res: Response): void {
  res.json(req.user)
}

export function getLogout(req: Request, res: Response): void {
  req.logout()
  res.redirect('/login')
}
