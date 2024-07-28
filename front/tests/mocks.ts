import { act } from 'react-dom/test-utils'
import { useNavigate } from 'react-router-dom'
import type { Mock } from 'vitest'
import { useRefresh } from '../src/hooks/useRefresh'
import type { IApp } from '../src/models/App'
import type { IAuthor } from '../src/models/Author'
import type { IBook } from '../src/models/Book'
import type { ISession } from '../src/models/Session'
import type { IColumn } from '../src/views/components/Table'

export async function wait() {
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
}

const { location } = window

export function mockLocation(fns: Partial<Location>): void {
  Object.defineProperty(window, 'location', { value: { ...location, ...fns }, writable: false })
}

export function restoreLocation(): void {
  Object.defineProperty(window, 'location', { value: location, writable: false })
}

export function mockNavigate(): Mock {
  const navigate = vi.fn()
  vi.mocked(useNavigate).mockReturnValue(navigate)
  return navigate
}

export function mockRefresh(): Mock {
  const refresh = vi.fn()
  vi.mocked(useRefresh).mockReturnValue(refresh)
  return refresh
}

export function mockColumn<T>(column: Partial<IColumn<T>> = {}): IColumn<T> {
  return {
    id: 'id',
    header: () => 'header',
    cell: () => 'cell',
    ...column,
  }
}

export function mockSession(session: Partial<ISession> = {}): ISession {
  return {
    username: 'username',
    ...session,
  }
}

export function mockApp(app: Partial<IApp> = {}): IApp {
  return {
    name: 'name',
    version: 'version',
    author: {
      name: 'author name',
      url: 'author url',
    },
    repository: {
      url: 'repository url',
    },
    ...app,
  }
}

function mockAuthorEmpty() {
  return {
    id: 1,
    firstName: 'firstName',
    lastName: 'lastName',
    books: [],
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  }
}

function mockBookEmpty() {
  return {
    id: 1,
    serial: 'serial',
    source: 'source',
    title: 'title',
    authors: [],
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  }
}

export function mockAuthor(author?: Partial<IAuthor>): IAuthor {
  return {
    ...mockAuthorEmpty(),
    books: [mockBookEmpty()],
    ...author,
  }
}

export function mockBook(book?: Partial<IBook>): IBook {
  return {
    ...mockBookEmpty(),
    authors: [mockAuthorEmpty()],
    ...book,
  }
}
