import { useCallback, useMemo, useState } from 'react'

export type Filter<T> = ((data1: T) => boolean) | undefined

export function useFilters<T>() {
  const [filters, setFilters] = useState<Filter<T>[]>([])

  const onFilter = useCallback((index: number, fn?: (data1: T) => boolean) => {
    setFilters((filters) => {
      const clone = [...filters]
      clone[index] = fn
      return clone
    })
  }, [])

  return useMemo(() => ({ filters, onFilter }), [filters, onFilter])
}
