import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Sort } from '../../../../src/ui/components/Sort'

describe('Sort', () => {
  const column = { header: () => 'header', cell: () => 'cell' }

  it('should render nothing if column has no sort', () => {
    const { container } = render(<Sort index={0} column={column} onSort={jest.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render sort input', () => {
    render(<Sort index={0} column={{ ...column, sort: jest.fn() }} onSort={jest.fn()} />)
    expect(screen.getByLabelText('Sort asc')).toBeInTheDocument()
  })

  it('should change sort when input change', () => {
    const onSort = jest.fn()
    render(<Sort index={0} column={{ ...column, sort: jest.fn() }} onSort={onSort} />)
    fireEvent.click(screen.getByLabelText('Sort asc'))
    expect(onSort).toHaveBeenCalledWith(0, expect.any(Function))
  })

  it('should apply sort with input value and dir', () => {
    let result
    const sort = jest.fn().mockReturnValue(2)
    const onSort = jest.fn().mockImplementation((index, fn) => {
      result = fn('data1', 'data2')
    })
    render(<Sort index={0} column={{ ...column, sort }} onSort={onSort} />)
    fireEvent.click(screen.getByLabelText('Sort asc'))
    expect(result).toBe(2)
    expect(sort).toHaveBeenCalledWith('data1', 'data2')
    fireEvent.click(screen.getByLabelText('Sort desc'))
    expect(result).toBe(-2)
    fireEvent.click(screen.getByLabelText('Unsort'))
    expect(result).toBe(0)
  })
})
