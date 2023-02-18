import sha224 from 'crypto-js/sha224'
import { prisma } from '../prisma/client'

export function serializeUser(user: Express.User, done: (err: unknown, id?: string) => void): void {
  return done(null, user.username)
}

export function deserializeUser(username: string, done: (err: unknown, user?: Express.User) => void): Promise<void> {
  return prisma.user
    .findUnique({ where: { username }, select: { username: true } })
    .then((user) => {
      if (user) done(null, user)
      else done(new Error(`Unknown user ${username}`))
    })
    .catch(done)
}

export function localStrategy(
  username: string,
  password: string,
  done: (error: unknown, user?: Express.User) => void
): Promise<void> {
  return prisma.user
    .findFirst({ where: { username, password: sha224(password).toString() }, select: { username: true } })
    .then((user) => {
      if (!user) done(new Error('User not found'))
      else done(null, user)
    })
    .catch(done)
}
