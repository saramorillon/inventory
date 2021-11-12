import { Request, Response } from 'express'

export function getLogout(req: Request, res: Response): void {
  req.logout()
  res.redirect('/')
}
