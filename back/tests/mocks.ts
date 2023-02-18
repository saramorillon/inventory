import { getMockReq as _getMockReq } from '@jest-mock/express'
import { Author, Book, User } from '@prisma/client'
import { IApiResult } from '../src/libs/apis/Api'
import { Logger } from '../src/libs/logger'

export function mock(fn: unknown): jest.Mock {
  return fn as jest.Mock
}

export function getMockReq(...params: Parameters<typeof _getMockReq>): ReturnType<typeof _getMockReq> {
  const req = _getMockReq(...params)
  req.logger = new Logger()
  return req
}

export function mockSession(session: Partial<Express.User> = {}): Express.User {
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
