import React, { useCallback, useEffect, useState } from 'react'
import { IColumn } from './Table'

interface IFilterProps<T> {
  onFilter: (index: number, fn: (data1: T) => boolean) => void
  index: number
  column: IColumn<T>
}

export function Filter<T>({ onFilter, index, column }: IFilterProps<T>) {
  if (!column.filter) return null

  return <_Filter onFilter={onFilter} index={index} filter={column.filter} />
}

interface _IFilterProps<T> {
  onFilter: (index: number, fn: (data1: T) => boolean) => void
  index: number
  filter: (data: T, filter: string) => boolean
}

function _Filter<T>({ onFilter, index, filter }: _IFilterProps<T>) {
  const [value, setValue] = useState('')

  const fn = useCallback((data: T) => filter(data, value.toLowerCase()), [filter, value])

  useEffect(() => {
    onFilter(index, fn)
  }, [fn, index, onFilter])

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
