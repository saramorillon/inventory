import React from 'react'
import { CellProps, Column } from 'react-table'
import { useTableContext } from '../../../../contexts/TableContext'
import { fullName } from '../../../../models/Author'
import { IBook } from '../../../../models/Book'
import { date } from '../../../components/Table/Cell/date'
import { DataTable } from '../../../components/Table/Table'

const columns: Column<IBook>[] = [
  { Header: 'Serial', accessor: (book) => book.serial },
  { Header: 'Title', accessor: (book) => book.title },
  { Header: 'Authors', accessor: (book) => book.authors?.map(fullName).join(', '), Cell: authors },
  { Header: 'Last update', accessor: (book) => book.updatedAt, Cell: date },
]

function authors(props: CellProps<IBook, string>) {
  return (
    <>
      {props.row.original.authors?.map(fullName).map((author) => (
        <div key={author}>{author}</div>
      ))}
    </>
  )
}

interface IBooksTableProps {
  books: IBook[]
  loading: boolean
}

export function Table({ books, loading }: IBooksTableProps): JSX.Element {
  const table = useTableContext('book', columns, books)
  return <DataTable loading={loading} table={table} link={(book) => `/book/${book.id}`} />
}
