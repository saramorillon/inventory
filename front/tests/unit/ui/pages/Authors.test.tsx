import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getAuthors } from '../../../../src/services/authors'
import { Authors } from '../../../../src/ui/pages/Authors'
import { mock, mockAuthor, wait } from '../../../mocks'

jest.mock('../../../../src/services/authors')

describe('Authors', () => {
  beforeEach(() => {
    mock(getAuthors).mockResolvedValue([mockAuthor({ updatedAt: '2022-01-01T00:00:00.000Z' })])
  })

  it('should render a loader when loading', async () => {
    render(<Authors />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    mock(getAuthors).mockRejectedValue(new Error())
    render(<Authors />)
    await wait()
    expect(screen.getByText('Error while loading data')).toBeInTheDocument()
  })

  it('should render a not found message if the author is not found', async () => {
    mock(getAuthors).mockResolvedValue([])
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
    expect(screen.getByText('Jan 1, 2022, 1:00:00 AM')).toBeInTheDocument()
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
