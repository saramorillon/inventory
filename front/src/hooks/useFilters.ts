import { useCallback, useMemo, useState } from 'react'

export function useFilters<T>(initialValue: T): [T, <K extends keyof T>(name: K, value: T[K]) => void] {
  const [filters, setFilters] = useState<T>(initialValue)

  const onChange = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setFilters((filters) => ({ ...filters, [name]: value }))
  }, [])

  return useMemo(() => [filters, onChange], [filters, onChange])
}
