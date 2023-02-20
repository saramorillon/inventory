import { getMockReq as _getMockReq } from '@jest-mock/express'
import { Author, Book, User } from '@prisma/client'
import { Logger } from '@saramorillon/logger'
import { Session } from 'express-session'
import { IApiResult } from '../src/libs/apis/Api'
import { ISession } from '../src/models/Session'

export function getMockReq(...params: Parameters<typeof _getMockReq>): ReturnType<typeof _getMockReq> {
  const req = _getMockReq(...params)
  req.session = {} as Session
  req.logger = new Logger({ silent: true })
  return req
}

export function mockAction(logger: Logger) {
  const action = { success: jest.fn(), failure: jest.fn() }
  logger.start = jest.fn().mockReturnValue(action)
  return action
}

export function mockSession(session: Partial<ISession> = {}): ISession {
  return {
    username: 'username',
    isbndbToken: 'token',
    ...session,
  }
}

export function mockUser(): User {
  return {
    id: 1,
    username: 'username',
    password: 'password',
    isbndbToken: 'token',
    createdAt: new Date('2022-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  }
}

export function mockAuthor(): Author {
  return {
    id: 1,
    firstName: 'firstName',
    lastName: 'lastName',
    createdAt: new Date('2022-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  }
}

export function mockBook(): Book {
  return {
    id: 1,
    serial: 'serial',
    source: 'source',
    title: 'title',
    createdAt: new Date('2022-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  }
}

export function mockApiResult(result?: Partial<IApiResult>): IApiResult {
  return {
    isbn: 'isbn',
    title: 'title',
    authors: ['author'],
    source: 'source',
    ...result,
  }
}
