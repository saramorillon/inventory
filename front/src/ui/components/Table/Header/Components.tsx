import React from 'react'
import { ChevronDown, ChevronUp, Search, X } from 'react-feather'
import { Button } from 'reactstrap'
import styled from 'styled-components'

export const Header = styled.div({ display: 'flex', justifyContent: 'space-between', userSelect: 'none' })

const LightButton = styled(Button)({ borderColor: '#ced4da' })

const Flex = styled.span({ display: 'inline-flex', flexDirection: 'column' })

interface ISortIconProps {
  isSorted?: boolean
  isSortedDesc?: boolean
}

export function SortIcon({ isSorted, isSortedDesc }: ISortIconProps): JSX.Element {
  const isDesc = isSorted && isSortedDesc ? 1 : 0.2
  const isAsc = isSorted && !isSortedDesc ? 1 : 0.2

  return (
    <Flex>
      <ChevronUp size={10} opacity={isDesc} data-testid="sort-desc" />
      <ChevronDown size={10} opacity={isAsc} data-testid="sort-asc" />
    </Flex>
  )
}

interface IFilterButtonProps {
  value?: unknown
  onClear: () => void
}

export function FilterButton({ value, onClear }: IFilterButtonProps): JSX.Element {
  if (value === undefined) {
    return (
      <LightButton outline>
        <Search size={12} />
      </LightButton>
    )
  }
  return (
    <LightButton outline onClick={onClear}>
      <X size={12} />
    </LightButton>
  )
}
