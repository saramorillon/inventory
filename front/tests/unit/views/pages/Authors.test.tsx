import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getAuthors } from '../../../../src/services/authors'
import { Authors, columns } from '../../../../src/views/pages/Authors'
import { mockAuthor, mockNavigate, wait } from '../../../mocks'

vi.mock('../../../../src/services/authors')

describe('Authors', () => {
  beforeEach(() => {
    vi.mocked(getAuthors).mockResolvedValue([mockAuthor()])
  })

  it('should render a loader when loading', async () => {
    render(<Authors />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    vi.mocked(getAuthors).mockRejectedValue(new Error())
    render(<Authors />)
    await wait()
    expect(screen.getByText('Error while loading data')).toBeInTheDocument()
  })

  it('should render a not found message if the author is not found', async () => {
    vi.mocked(getAuthors).mockResolvedValue([])
    render(<Authors />)
    await wait()
    expect(screen.getByText('No data for now')).toBeInTheDocument()
  })

  it('should render author id', async () => {
    render(<Authors />)
    await wait()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should render author first name', async () => {
    render(<Authors />)
    await wait()
    expect(screen.getByText('firstName')).toBeInTheDocument()
  })

  it('should render author last name', async () => {
    render(<Authors />)
    await wait()
    expect(screen.getByText('lastName')).toBeInTheDocument()
  })

  it('should render author full name', async () => {
    render(<Authors />)
    await wait()
    expect(screen.getByText('firstName lastName')).toBeInTheDocument()
  })

  it('should render author last update date', async () => {
    render(<Authors />)
    await wait()
    expect(screen.getByText('Jan 1, 2022')).toBeInTheDocument()
  })

  it('should navigate to author page when clicking on create button', async () => {
    const navigate = mockNavigate()
    render(<Authors />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    await wait()
    expect(navigate).toHaveBeenCalledWith('/author')
  })

  it('should refresh table when clicking on refresh button', async () => {
    render(<Authors />)
    await wait()
    expect(getAuthors).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    await wait()
    expect(getAuthors).toHaveBeenCalledTimes(2)
  })
})

describe('ID', () => {
  it('should filter lower case id', () => {
    expect(columns[0].filter?.(mockAuthor(), '1')).toBe(true)
    expect(columns[0].filter?.(mockAuthor(), '2')).toBe(false)
  })

  it('should sort by numeric id', () => {
    expect(columns[0].sort?.(mockAuthor({ id: 2 }), mockAuthor())).toBe(1)
    expect(columns[0].sort?.(mockAuthor(), mockAuthor())).toBe(0)
    expect(columns[0].sort?.(mockAuthor(), mockAuthor({ id: 2 }))).toBe(-1)
  })
})

describe('Full name', () => {
  it('should filter lower case full name', () => {
    expect(columns[1].filter?.(mockAuthor(), 'firstname lastname')).toBe(true)
    expect(columns[1].filter?.(mockAuthor(), 'titi tutu')).toBe(false)
  })

  it('should sort by lower case full name', () => {
    expect(columns[1].sort?.(mockAuthor({ firstName: 'firstName2' }), mockAuthor())).toBe(1)
    expect(columns[1].sort?.(mockAuthor(), mockAuthor())).toBe(0)
    expect(columns[1].sort?.(mockAuthor(), mockAuthor({ firstName: 'firstName2' }))).toBe(-1)
  })
})

describe('First name', () => {
  it('should filter lower case first name', () => {
    expect(columns[2].filter?.(mockAuthor(), 'firstname')).toBe(true)
    expect(columns[2].filter?.(mockAuthor(), 'titi')).toBe(false)
  })

  it('should sort by lower case first name', () => {
    expect(columns[2].sort?.(mockAuthor({ firstName: 'firstName2' }), mockAuthor())).toBe(1)
    expect(columns[2].sort?.(mockAuthor(), mockAuthor())).toBe(0)
    expect(columns[2].sort?.(mockAuthor(), mockAuthor({ firstName: 'firstName2' }))).toBe(-1)
  })
})

describe('Last name', () => {
  it('should filter lower case last name', () => {
    expect(columns[3].filter?.(mockAuthor(), 'lastname')).toBe(true)
    expect(columns[3].filter?.(mockAuthor(), 'titi')).toBe(false)
  })

  it('should sort by lower case last name', () => {
    expect(columns[3].sort?.(mockAuthor({ lastName: 'lastName2' }), mockAuthor())).toBe(1)
    expect(columns[3].sort?.(mockAuthor(), mockAuthor())).toBe(0)
    expect(columns[3].sort?.(mockAuthor(), mockAuthor({ lastName: 'lastName2' }))).toBe(-1)
  })
})

describe('Last update date', () => {
  it('should filter lower case last update date', () => {
    expect(columns[4].filter?.(mockAuthor(), '2022-01-01')).toBe(true)
    expect(columns[4].filter?.(mockAuthor(), '2020-01-01')).toBe(false)
  })

  it('should sort by lower case last update date', () => {
    expect(columns[4].sort?.(mockAuthor({ updatedAt: '2023-01-01' }), mockAuthor())).toBe(1)
    expect(columns[4].sort?.(mockAuthor(), mockAuthor())).toBe(0)
    expect(columns[4].sort?.(mockAuthor(), mockAuthor({ updatedAt: '2023-01-01' }))).toBe(-1)
  })
})
