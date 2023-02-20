import { User } from '.prisma/client'

export type ISession = Pick<User, 'username' | 'isbndbToken'>
