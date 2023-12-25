import { usePagination } from '@saramorillon/hooks'
import { useMemo } from 'react'
import { Filter, useFilters } from './useFilters'
import { Sort, useSorts } from './useSorts'

export function useTable<T>(data: T[], limit: number) {
  const { sorts, onSort } = useSorts<T>()
  const { filters, onFilter } = useFilters<T>()

  const sorted = useMemo(() => data.slice(0).sort((a, b) => applySort(a, b, sorts)), [data, sorts])
  const filtered = useMemo(() => sorted.filter((data: T) => applyFilters(data, filters)), [sorted, filters])

  const maxPage = useMemo(() => Math.ceil(filtered.length / limit), [filtered, limit])
  const pagination = usePagination(maxPage)
  const { page } = pagination

  const rows = useMemo(() => filtered.slice((page - 1) * limit, page * limit), [filtered, page, limit])

  return useMemo(() => ({ rows, maxPage, pagination, onSort, onFilter }), [rows, maxPage, pagination, onSort, onFilter])
}

function applySort<T>(a: T, b: T, sorts: Sort<T>[]) {
  for (const sort of sorts) {
    const result = sort.fn(a, b)
    if (result !== 0) return result
  }
  return 0
}

function applyFilters<T>(data: T, filters: Filter<T>[]) {
  return filters.every((filter) => !filter || filter(data))
}
