import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { IColumn } from './Table'

interface ISortIconsProps<T> {
  onSort: (index: number, fn: (data1: T, data2: T) => number) => void
  index: number
  column: IColumn<T>
}

export function Sort<T>({ onSort, index, column }: ISortIconsProps<T>) {
  if (!column.sort) return null

  return <_Sort onSort={onSort} index={index} sort={column.sort} />
}

interface _ISortIconsProps<T> {
  onSort: (index: number, fn: (data1: T, data2: T) => number) => void
  index: number
  sort: (data1: T, data2: T) => number
}

function _Sort<T>({ onSort, index, sort }: _ISortIconsProps<T>) {
  const [dir, setDir] = useState<0 | 1 | -1>(0)

  const f = useCallback((data1: T, data2: T) => sort(data1, data2) * dir, [dir, sort])

  useEffect(() => {
    onSort(index, f)
  }, [sort, index, onSort, dir, f])

  return (
    <small style={{ cursor: 'pointer' }}>
      {!dir ? (
        <IconArrowsSort onClick={() => setDir(1)} />
      ) : dir === 1 ? (
        <IconSortAscending onClick={() => setDir(-1)} />
      ) : (
        <IconSortDescending onClick={() => setDir(0)} />
      )}
    </small>
  )
}
