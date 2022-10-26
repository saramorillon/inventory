import { useCallback, useMemo, useState } from 'react'

export type Sort<T> = {
  index: number
  fn: (data1: T, data2: T) => number
}

export function useSorts<T>(): [Sort<T>[], (index: number, fn: (data1: T, data2: T) => number) => void] {
  const [sorts, setSorts] = useState<Sort<T>[]>([])

  const onSort = useCallback((index: number, fn: (data1: T, data2: T) => number) => {
    setSorts((sorts) => {
      const i = sorts.findIndex((sort) => sort.index === index)
      return [...sorts.slice(0, i), { index, fn }, ...sorts.slice(i + 1)]
    })
  }, [])

  return useMemo(() => [sorts, onSort], [sorts, onSort])
}
