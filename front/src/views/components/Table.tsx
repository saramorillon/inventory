import React, { ReactNode, TdHTMLAttributes, useState } from 'react'
import { useTable } from '../../hooks/useTable'
import { Filter } from './Filter'
import { Error, Loading, NotFound } from './Helpers'
import { Pagination } from './Pagination'
import { Sort } from './Sort'

export interface IColumn<T> {
  header: () => ReactNode
  cell: (row: T) => ReactNode
  filter?: (data: T, filter: string) => boolean
  sort?: (data1: T, data2: T) => number
  props?: TdHTMLAttributes<HTMLTableCellElement>
}

interface ITableProps<T> {
  columns: IColumn<T>[]
  data: T[]
  loading?: boolean
  error?: unknown
}

export function DataTable<T>({ columns, data, loading, error }: ITableProps<T>) {
  const [limit, setLimit] = useState(10)
  const { rows, maxPage, pagination, onSort, onFilter } = useTable(data, limit)

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                {column.header()} {column.sort && <Sort onSort={onSort} index={index} column={column} />}
              </th>
            ))}
          </tr>
          {columns.some((column) => column.filter) && (
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.filter && <Filter onFilter={onFilter} index={index} column={column} />}</th>
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
