import { IPagination } from '@saramorillon/hooks'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Pagination } from '../../../../src/views/components/Pagination'

function mockPagination(mock?: Partial<IPagination>): IPagination {
  return {
    page: 1,
    first: vi.fn(),
    previous: vi.fn(),
    next: vi.fn(),
    last: vi.fn(),
    canPrevious: false,
    canNext: false,
    goTo: vi.fn(),
    ...mock,
  }
}

describe('Pagination', () => {
  it('should render current and max page', () => {
    const pagination = mockPagination()
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByText('Page 1 of 10')).toBeInTheDocument()
  })

  it('should disable first button if cannot go previous', () => {
    const pagination = mockPagination()
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('First')).toBeDisabled()
  })

  it('should not disable first button if can go previous', () => {
    const pagination = mockPagination({ canPrevious: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('First')).toBeEnabled()
  })

  it('should disable previous button if cannot go previous', () => {
    const pagination = mockPagination()
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('Previous')).toBeDisabled()
  })

  it('should not disable previous button if can go previous', () => {
    const pagination = mockPagination({ canPrevious: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('Previous')).toBeEnabled()
  })

  it('should disable next button if cannot go next', () => {
    const pagination = mockPagination()
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('Next')).toBeDisabled()
  })

  it('should not disable next button if can go next', () => {
    const pagination = mockPagination({ canNext: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('Next')).toBeEnabled()
  })

  it('should disable last button if cannot go next', () => {
    const pagination = mockPagination()
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('Last')).toBeDisabled()
  })

  it('should not disable last button if can go next', () => {
    const pagination = mockPagination({ canNext: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    expect(screen.getByLabelText('Last')).toBeEnabled()
  })

  it('should go to first page when clicking on first', () => {
    const pagination = mockPagination({ canPrevious: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('First'))
    expect(pagination.first).toHaveBeenCalled()
  })

  it('should go to previous page when clicking on previous', () => {
    const pagination = mockPagination({ canPrevious: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Previous'))
    expect(pagination.previous).toHaveBeenCalled()
  })

  it('should go to next page when clicking on next', () => {
    const pagination = mockPagination({ canNext: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Next'))
    expect(pagination.next).toHaveBeenCalled()
  })

  it('should go to last page when clicking on last', () => {
    const pagination = mockPagination({ canNext: true })
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Last'))
    expect(pagination.last).toHaveBeenCalled()
  })

  it('should go to first page when limit change', () => {
    const pagination = mockPagination({ canPrevious: true })
    const { rerender } = render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={vi.fn()} />)
    rerender(<Pagination maxPage={10} pagination={pagination} limit={20} setLimit={vi.fn()} />)
    expect(pagination.first).toHaveBeenCalled()
  })

  it('should change limit', () => {
    const pagination = mockPagination()
    const setLimit = vi.fn()
    render(<Pagination maxPage={10} pagination={pagination} limit={10} setLimit={setLimit} />)
    fireEvent.change(screen.getByDisplayValue('10 rows'), { target: { value: 20 } })
    expect(setLimit).toHaveBeenCalledWith(20)
  })
})
