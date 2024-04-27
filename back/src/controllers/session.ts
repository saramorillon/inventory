import { createHash } from 'node:crypto'
import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { settings } from '../settings'
import { parseError } from '../utils/parseError'

const schema = {
  login: z.object({
    username: z.string(),
    password: z.string(),
  }),
}

export async function login(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('login')
  try {
    const { username, password } = schema.login.parse(req.body)
    const user = await prisma.user.findFirstOrThrow({
      where: { username, password: createHash('sha224').update(password).digest('hex') },
    })
    req.session.user = { username: user.username, isbndbToken: user.isbndbToken }
    success()
    res.sendStatus(204)
  } catch (e) {
    const error = parseError(e)
    failure(error)
    res.sendStatus(401)
  }
}

export function getSession(req: Request, res: Response): void {
  const { success } = req.logger.start('get_session')
  res.json(req.session.user)
  success()
}

export function logout(req: Request, res: Response): void {
  const { success, failure } = req.logger.start('logout')
  req.session.destroy((err) => {
    if (err) failure(err)
    else success()
    res.clearCookie(settings.session.name).redirect(settings.app.host)
  })
}
