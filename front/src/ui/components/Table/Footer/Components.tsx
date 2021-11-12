import React, { ChangeEvent, useCallback, ButtonHTMLAttributes } from 'react'
import { Input } from 'reactstrap'
import styled from 'styled-components'

const Button = styled.button({
  userSelect: 'none',
  border: 'none',
  outline: 'none',
  background: 'none',
  height: 40,
  width: 40,
  padding: 8,
  cursor: 'pointer',
  transition: 'all 0.4s ease 0s',
  '&:disabled': { cursor: 'auto', opacity: '0.5' },
})

interface IArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  page: keyof typeof arrowSvg
}

const arrowSvg = {
  first: 'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
  previous: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  next: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  last: 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
}

export function ArrowButton({ page, ...props }: IArrowButtonProps): JSX.Element {
  const arrow = arrowSvg[page]
  return (
    <Button {...props}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d={arrow}></path>
      </svg>
    </Button>
  )
}

const StyledInput = styled(Input)({
  fontSize: '0.75rem',
  display: 'inline',
  width: 'unset',
  border: 'none',
  outline: 'none',
  borderBottom: '1px solid lightgrey',
  borderRadius: 0,
})

const NumberInput = styled(StyledInput)({ width: 70, textAlign: 'right' })

interface INumberInputProps {
  value: number
  onChange: (value: number) => void
}

export function RowsSelect({ value, onChange }: INumberInputProps): JSX.Element {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)), [onChange])

  return (
    <StyledInput type="select" value={value} onChange={handleChange}>
      {[5, 10, 20, 25, 50, 100].map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          {pageSize} rows
        </option>
      ))}
    </StyledInput>
  )
}

export function PageInput({ value, onChange }: INumberInputProps): JSX.Element {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)), [onChange])

  return <NumberInput type="number" value={value} onChange={handleChange} />
}
