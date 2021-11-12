import { Request, Response } from 'express'

export function getSession(req: Request, res: Response): void {
  res.json(req.user)
}
