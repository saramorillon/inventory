import type { Author, Book, User } from '@prisma/client'
import { Logger } from '@saramorillon/logger'
import type { NextFunction, Request, Response } from 'express'
import type { Session } from 'express-session'
import type { IApiResult } from '../src/libs/apis/Api'
import type { ISession } from '../src/models/Session'

export function getMockReq(request: Partial<Request> = {}): Request {
  return {
    params: {},
    query: {},
    body: {},
    session: {} as Session,
    logger: new Logger({ silent: true }),
    ...request,
  } as never
}

export function getMockRes(response: Partial<Response> = {}): { res: Response; next: NextFunction } {
  return {
    res: {
      send: vi.fn().mockReturnThis(),
      sendStatus: vi.fn().mockReturnThis(),
      sendFile: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis(),
      ...response,
    } as never,
    next: vi.fn() as never,
  }
}

export function mockAction(logger: Logger) {
  const action = { success: vi.fn(), failure: vi.fn() }
  logger.start = vi.fn().mockReturnValue(action)
  return action
}

export function mockSession(session: Partial<ISession> = {}): ISession {
  return {
    username: 'username',
    ...session,
  }
}

export function mockUser(): User {
  return {
    id: 1,
    username: 'username',
    password: 'password',
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
