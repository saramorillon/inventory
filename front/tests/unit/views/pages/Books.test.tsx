import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getBooks } from '../../../../src/services/books'
import { Books, columns } from '../../../../src/views/pages/Books'
import { mockAuthor, mockBook, wait } from '../../../mocks'

vi.mock('../../../../src/services/books')

describe('Books', () => {
  beforeEach(() => {
    vi.mocked(getBooks).mockResolvedValue([mockBook()])
  })

  it('should render a loader when loading', async () => {
    render(<Books />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    vi.mocked(getBooks).mockRejectedValue(new Error())
    render(<Books />)
    await wait()
    expect(screen.getByText('Error while loading data')).toBeInTheDocument()
  })

  it('should render a not found message if the book is not found', async () => {
    vi.mocked(getBooks).mockResolvedValue([])
    render(<Books />)
    await wait()
    expect(screen.getByText('No data for now')).toBeInTheDocument()
  })

  it('should render book serial', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('serial')).toBeInTheDocument()
  })

  it('should render book title', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render book authors', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('firstName lastName')).toBeInTheDocument()
  })

  it('should render book last update date', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('Jan 1, 2022, 1:00:00 AM')).toBeInTheDocument()
  })

  it('should refresh table when clicking on refresh button', async () => {
    render(<Books />)
    await wait()
    expect(getBooks).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    await wait()
    expect(getBooks).toHaveBeenCalledTimes(2)
  })
})

describe('Serial', () => {
  it('should filter lower case serial', () => {
    expect(columns[0].filter?.(mockBook(), 'serial')).toBe(true)
    expect(columns[0].filter?.(mockBook(), 'toto')).toBe(false)
  })

  it('should sort by numeric serial', () => {
    expect(columns[0].sort?.(mockBook({ serial: 'serial2' }), mockBook())).toBe(1)
    expect(columns[0].sort?.(mockBook(), mockBook())).toBe(0)
    expect(columns[0].sort?.(mockBook(), mockBook({ serial: 'serial2' }))).toBe(-1)
  })
})

describe('Title', () => {
  it('should filter lower case title', () => {
    expect(columns[1].filter?.(mockBook(), 'title')).toBe(true)
    expect(columns[1].filter?.(mockBook(), 'toto')).toBe(false)
  })

  it('should sort by lower case title', () => {
    expect(columns[1].sort?.(mockBook({ title: 'title2' }), mockBook())).toBe(1)
    expect(columns[1].sort?.(mockBook(), mockBook())).toBe(0)
    expect(columns[1].sort?.(mockBook(), mockBook({ title: 'title2' }))).toBe(-1)
  })
})

describe('Authors', () => {
  it('should filter lower case authors full name', () => {
    expect(columns[2].filter?.(mockBook(), 'firstname lastname')).toBe(true)
    expect(columns[2].filter?.(mockBook(), 'titi')).toBe(false)
  })

  it('should sort by lower case authors full name', () => {
    expect(columns[2].sort?.(mockBook({ authors: [mockAuthor({ firstName: 'firstName2' })] }), mockBook())).toBe(1)
    expect(columns[2].sort?.(mockBook(), mockBook())).toBe(0)
    expect(columns[2].sort?.(mockBook(), mockBook({ authors: [mockAuthor({ firstName: 'firstName2' })] }))).toBe(-1)
  })
})

describe('Last update date', () => {
  it('should filter lower case last update date', () => {
    expect(columns[3].filter?.(mockBook(), '2022-01-01')).toBe(true)
    expect(columns[3].filter?.(mockBook(), '2020-01-01')).toBe(false)
  })

  it('should sort by lower case last update date', () => {
    expect(columns[3].sort?.(mockBook({ updatedAt: '2023-01-01' }), mockBook())).toBe(1)
    expect(columns[3].sort?.(mockBook(), mockBook())).toBe(0)
    expect(columns[3].sort?.(mockBook(), mockBook({ updatedAt: '2023-01-01' }))).toBe(-1)
  })
})
