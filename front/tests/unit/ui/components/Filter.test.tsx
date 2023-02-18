import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Filter } from '../../../../src/ui/components/Filter'

describe('Filter', () => {
  const column = { header: () => 'header', cell: () => 'cell' }

  it('should render nothing if column has no filter', () => {
    const { container } = render(<Filter index={0} column={column} onFilter={jest.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render filter input', () => {
    render(<Filter index={0} column={{ ...column, filter: jest.fn() }} onFilter={jest.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should change filter when input change', () => {
    const onFilter = jest.fn()
    render(<Filter index={0} column={{ ...column, filter: jest.fn() }} onFilter={onFilter} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'text' } })
    expect(onFilter).toHaveBeenCalledWith(0, expect.any(Function))
  })

  it('should apply filter with input lowercase value', () => {
    const filter = jest.fn()
    const onFilter = jest.fn().mockImplementation((index, fn) => fn('data'))
    render(<Filter index={0} column={{ ...column, filter }} onFilter={onFilter} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Text' } })
    expect(filter).toHaveBeenCalledWith('data', 'text')
  })
})
