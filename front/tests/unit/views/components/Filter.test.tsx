import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Filter } from '../../../../src/views/components/Filter'
import { mockColumn } from '../../../mocks'

describe('Filter', () => {
  it('should render nothing if column has no filter', () => {
    const { container } = render(<Filter index={0} column={mockColumn()} onFilter={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render filter input', () => {
    render(<Filter index={0} column={mockColumn({ filter: vi.fn() })} onFilter={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should change filter when input change', () => {
    const onFilter = vi.fn()
    render(<Filter index={0} column={mockColumn({ filter: vi.fn() })} onFilter={onFilter} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'text' } })
    expect(onFilter).toHaveBeenCalledWith(0, expect.any(Function))
  })

  it('should apply filter with input lowercase value', () => {
    const column = mockColumn({ filter: vi.fn() })
    const onFilter = vi.fn().mockImplementation((index, fn) => fn('data'))
    render(<Filter index={0} column={column} onFilter={onFilter} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Text' } })
    expect(column.filter).toHaveBeenCalledWith('data', 'text')
  })
})
