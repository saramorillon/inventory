import { act } from 'react-dom/test-utils'
import { useNavigate } from 'react-router-dom'
import { IAuthor } from '../src/models/Author'
import { IBook } from '../src/models/Book'

export async function wait() {
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
}

export function mock(fn: unknown): jest.Mock {
  return fn as jest.Mock
}

export function mockNavigate(): jest.Mock {
  const navigate = jest.fn()
  mock(useNavigate).mockReturnValue(navigate)
  return navigate
}

const { location } = window

export function mockLocation(fns: Partial<Location>): void {
  Object.defineProperty(window, 'location', { value: { ...location, ...fns }, writable: false })
}

export function restoreLocation(): void {
  Object.defineProperty(window, 'location', { value: location, writable: false })
}

export function mockAuthor(author?: Partial<IAuthor>): IAuthor {
  return {
    id: 1,
    firstName: 'firstName',
    lastName: 'lastName',
    ...author,
  }
}

export function mockBook(book?: Partial<IBook>): IBook {
  return {
    id: 1,
    serial: 'serial',
    source: 'source',
    title: 'title',
    ...book,
  }
}
