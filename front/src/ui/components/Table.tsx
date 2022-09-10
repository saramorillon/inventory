import { usePagination } from '@saramorillon/hooks'
import React, { ReactNode, TdHTMLAttributes, useMemo, useState } from 'react'
import { Error, Loading, NotFound } from './Helpers'
import { Pagination } from './Pagination'

export interface IColumn<T> {
  header: ReactNode
  filter?: ReactNode
  cell: (row: T) => ReactNode
  props?: TdHTMLAttributes<HTMLTableCellElement>
}

interface ITableProps<T> {
  columns: IColumn<T>[]
  data: T[]
  loading: boolean
  error?: unknown
  filter: (data: T) => boolean
}

export function DataTable<T>({ columns, data, loading, error, filter }: ITableProps<T>): JSX.Element {
  const [limit, setLimit] = useState(10)
  const filteredRows = useMemo(() => data.filter(filter), [data, filter])

  const maxPage = useMemo(() => Math.ceil(filteredRows.length / limit), [filteredRows, limit])
  const pagination = usePagination(maxPage)
  const { page } = pagination

  const rows = useMemo(() => filteredRows.slice((page - 1) * limit, page * limit), [filteredRows, page, limit])

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((column, key) => (
              <th key={key}>{column.header}</th>
            ))}
          </tr>
          {columns.some((column) => column.filter) && (
            <tr>
              {columns.map((column, key) => (
                <th key={key}>{column.filter}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <Loading message="Loading data" />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columns.length}>
                <Error message="Error while loading data" />
              </td>
            </tr>
          ) : !rows.length ? (
            <tr>
              <td colSpan={columns.length}>
                <NotFound message="No data for now" />
              </td>
            </tr>
          ) : (
            rows.map((row, key1) => (
              <tr key={key1}>
                {columns.map((column, key2) => (
                  <td key={key2} {...column.props}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination maxPage={maxPage} pagination={pagination} limit={limit} setLimit={setLimit} />
    </>
  )
}
