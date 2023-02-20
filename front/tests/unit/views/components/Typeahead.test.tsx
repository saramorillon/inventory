import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TypeAhead } from '../../../../src/views/components/Typeahead'

function getValue(option: string) {
  return option
}

function getLabel(option: string) {
  return option.toUpperCase()
}

describe('TypeAhead', () => {
  it('should render filtered options', () => {
    render(
      <TypeAhead values={['a']} onChange={jest.fn()} options={['a', 'b']} getValue={getValue} getLabel={getLabel} />
    )
    expect(screen.queryByRole('option', { name: 'A', hidden: true })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'B', hidden: true })).toBeInTheDocument()
  })

  it('should render values', () => {
    render(
      <TypeAhead values={['a']} onChange={jest.fn()} options={['a', 'b']} getValue={getValue} getLabel={getLabel} />
    )
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'B' })).not.toBeInTheDocument()
  })

  it('should dispatch change event when clicking on option', () => {
    const onChange = jest.fn()
    render(<TypeAhead values={[]} onChange={onChange} options={['a', 'b']} getValue={getValue} getLabel={getLabel} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'a' } })
    expect(onChange).toHaveBeenCalledWith(['a'])
  })

  it('should dispatch change event when clicking on button', () => {
    const onChange = jest.fn()
    render(<TypeAhead values={['a', 'b']} onChange={onChange} options={[]} getValue={getValue} getLabel={getLabel} />)
    fireEvent.click(screen.getByRole('button', { name: 'A' }))
    expect(onChange).toHaveBeenCalledWith(['b'])
  })
})
