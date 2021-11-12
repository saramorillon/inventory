import React from 'react'
import { Column } from 'react-table'
import { useTableContext } from '../../../../contexts/TableContext'
import { fullName, IAuthor } from '../../../../models/Author'
import { date } from '../../../components/Table/Cell/date'
import { DataTable } from '../../../components/Table/Table'

const columns: Column<IAuthor>[] = [
  { Header: 'ID', accessor: (author) => author.id },
  { Header: 'Full name', accessor: (author) => fullName(author) },
  { Header: 'First name', accessor: (author) => author.firstName },
  { Header: 'Last name', accessor: (author) => author.lastName },
  { Header: 'Last update', accessor: (author) => author.updatedAt, Cell: date },
]

interface IAuthorsTableProps {
  authors: IAuthor[]
  loading: boolean
}

export function Table({ authors, loading }: IAuthorsTableProps): JSX.Element {
  const table = useTableContext('author', columns, authors)
  return <DataTable loading={loading} table={table} link={(author) => `/author/${author.id}`} />
}
