import styled from 'styled-components'
import React from 'react'
import { TableInstance } from 'react-table'
import { TableBody } from './Body/TableBody'
import { TableFoot } from './Footer/TableFoot'
import { TableHeader } from './Header/TableHeader'
import { NoData, Progress } from './Body/Components'

const StyledTable = styled.div({
  display: 'table',
  color: 'rgba(0,0,0,0.87)',
  width: '100%',
  fontSize: '0.75rem',
  '.thead': {
    display: 'table-header-group',
    fontWeight: 500,
    '.th': { padding: '1rem 1rem 0.25rem 1rem' },
    '.td': { padding: '0.25rem 1rem 1rem 1rem' },
  },
  '.tbody': { display: 'table-row-group' },
  '.tr': { display: 'table-row' },
  '.td, .th': { display: 'table-cell', verticalAlign: 'middle' },
  '.thead, .tbody .tr': { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' },
  '.tbody .tr': {
    height: 48,
    '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
    '&:last-child': { backgroundColor: 'unset' },
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
  },
  '.tbody .td': { padding: '0 1rem' },
  a: { color: 'inherit', '&:hover': { textDecoration: 'none' } },
})

interface ITableProps<T extends Record<string, unknown>> {
  loading?: boolean
  total?: number
  table: TableInstance<T>
  link: (row: T) => string
}

export function DataTable<T extends Record<string, unknown>>({
  loading = false,
  total,
  table,
  link,
}: ITableProps<T>): JSX.Element {
  const { getTableProps, headerGroups } = table

  return (
    <>
      <StyledTable {...getTableProps()}>
        <TableHeader groups={headerGroups} />
        <TableBody table={table} loading={loading} link={link} />
      </StyledTable>
      <TableLoader table={table} loading={loading} />
      <TableFoot table={table} total={total} />
    </>
  )
}

interface ITableLoaderProps<T extends Record<string, unknown>> {
  table: TableInstance<T>
  loading?: boolean
}

function TableLoader<T extends Record<string, unknown>>({ table, loading }: ITableLoaderProps<T>) {
  const { page } = table

  if (loading)
    return (
      <div>
        <Progress />
      </div>
    )

  if (!page.length)
    return (
      <div>
        <NoData />
      </div>
    )

  return null
}
