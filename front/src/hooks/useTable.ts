import { usePagination } from '@saramorillon/hooks'
import { useMemo } from 'react'
import { IColumn } from '../ui/components/Table'

export function useTable<T>(columns: IColumn<T>[], data: T[], filter: (data: T) => boolean, limit: number) {
  const filteredRows = useMemo(() => data.filter(filter), [data, filter])

  const maxPage = useMemo(() => Math.ceil(filteredRows.length / limit), [filteredRows, limit])
  const pagination = usePagination(maxPage)
  const { page } = pagination

  const rows = useMemo(() => filteredRows.slice((page - 1) * limit, page * limit), [filteredRows, page, limit])

  return useMemo(() => ({ rows, maxPage, pagination }), [rows, maxPage, pagination])
}
