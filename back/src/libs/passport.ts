import { User } from '@prisma/client'
import sha224 from 'crypto-js/sha224'
import { prisma } from '../prisma/client'

export function serializeUser(user: User, done: (err: unknown, id?: string) => void): void {
  return done(null, user.username)
}

export function deserializeUser(username: string, done: (err: unknown, user?: User) => void): Promise<void> {
  return prisma.user
    .findUnique({ where: { username } })
    .then((user) => {
      if (user) done(null, user)
      else done(new Error(`Unknown user ${username}`))
    })
    .catch(done)
}

export function localStrategy(
  username: string,
  password: string,
  done: (error: unknown, user?: User) => void
): Promise<void> {
  return prisma.user
    .findUnique({ where: { username } })
    .then((user) => {
      if (!user) done(new Error(`Unknown user ${username}`))
      else if (user.password !== sha224(password).toString()) done(new Error(`Invalid password for ${username}`))
      else done(null, user)
    })
    .catch(done)
}
