import React, { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Cell, Row, TableInstance } from 'react-table'

function mapCell<T extends Record<string, unknown>>() {
  return function Cell(cell: Cell<T>) {
    const { key, ...props } = cell.getCellProps()

    return (
      <span className="td" key={key} {...props}>
        {cell.render('Cell')}
      </span>
    )
  }
}

interface ITableBodyProps<T extends Record<string, unknown>> {
  table: TableInstance<T>
  loading?: boolean
  link: (row: T) => string
}

export function TableBody<T extends Record<string, unknown>>({
  table,
  loading,
  link,
}: ITableBodyProps<T>): JSX.Element | null {
  const { page, prepareRow, getTableBodyProps } = table

  const mapRow = useCallback(
    (row: Row<T>) => {
      prepareRow(row)
      const { key, ...props } = row.getRowProps()
      return (
        <NavLink className="tr" key={key} {...props} to={link(row.original)}>
          {row.cells.map(mapCell())}
        </NavLink>
      )
    },
    [prepareRow, link]
  )

  if (!loading && page.length) {
    return (
      <div className="tbody" {...getTableBodyProps()}>
        {page.map(mapRow)}
      </div>
    )
  }

  return null
}
