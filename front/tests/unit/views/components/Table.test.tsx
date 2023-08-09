import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { DataTable } from '../../../../src/views/components/Table'

describe('DataTable', () => {
  it('should render column headers', () => {
    render(<DataTable columns={[{ header: () => 'header', cell: (row) => row }]} data={[]} />)
    expect(screen.getByText('header')).toBeInTheDocument()
  })

  it('should render sort icon if sort function is provided', () => {
    render(<DataTable columns={[{ header: () => 'header', cell: (row) => row, sort: () => 0 }]} data={['data']} />)
    expect(screen.getByLabelText('Sort asc')).toBeInTheDocument()
  })

  it('should render filter if filter function is provided', () => {
    render(<DataTable columns={[{ header: () => 'header', cell: (row) => row, filter: () => true }]} data={['data']} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render loader', () => {
    render(<DataTable columns={[]} data={[]} loading />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
  })

  it('should render error', () => {
    render(<DataTable columns={[]} data={[]} error />)
    expect(screen.getByText('Error while loading data')).toBeInTheDocument()
  })

  it('should render no data', () => {
    render(<DataTable columns={[]} data={[]} />)
    expect(screen.getByText('No data for now')).toBeInTheDocument()
  })

  it('should render data', () => {
    render(<DataTable columns={[{ header: () => 'header', cell: (row) => row }]} data={['data']} />)
    expect(screen.getByText('data')).toBeInTheDocument()
  })
})
