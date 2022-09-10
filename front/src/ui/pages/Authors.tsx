import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFilters } from '../../hooks/useFilters'
import { useHeader } from '../../hooks/useHeader'
import { useTable } from '../../hooks/useTable'
import { AuthorFilter, filterAuthor, fullName, IAuthor } from '../../models/Author'
import { getAuthors } from '../../services/authors'
import { Actions } from '../components/Actions'
import { Pagination } from '../components/Pagination'
import { DataTable, IColumn } from '../components/Table'

export function Authors(): JSX.Element {
  const navigate = useNavigate()
  useHeader('Authors')
  const call = useCallback(() => getAuthors(), [])
  const [authors, { loading }, refresh] = useFetch(call, [])

  const [filters, onChange] = useFilters<AuthorFilter>({
    id: '',
    fullName: '',
    firstName: '',
    lastName: '',
    updatedAt: '',
  })
  const filter = useCallback((author: IAuthor) => filterAuthor(author, filters), [filters])

  const columns: IColumn<IAuthor>[] = useMemo(
    () => [
      {
        header: 'ID',
        cell: (author) => author.id,
        filter: <input value={filters.id} onChange={(e) => onChange('id', e.target.value)} />,
      },
      {
        header: 'Full name',
        cell: (author) => <Link to={`/author/${author.id}`}>{fullName(author)}</Link>,
        filter: <input value={filters.fullName} onChange={(e) => onChange('fullName', e.target.value)} />,
      },
      {
        header: 'First name',
        cell: (author) => author.firstName,
        filter: <input value={filters.firstName} onChange={(e) => onChange('firstName', e.target.value)} />,
      },
      {
        header: 'Last name',
        cell: (author) => author.lastName,
        filter: <input value={filters.lastName} onChange={(e) => onChange('lastName', e.target.value)} />,
      },
      {
        header: 'Last update',
        cell: (book) => (book.updatedAt ? format(parseISO(book.updatedAt), 'PPpp') : ''),
        filter: <input value={filters.updatedAt} onChange={(e) => onChange('updatedAt', e.target.value)} />,
      },
    ],
    [filters.firstName, filters.fullName, filters.id, filters.lastName, filters.updatedAt, onChange]
  )

  const { rows, maxPage, pagination } = useTable(columns, authors, filter, 10)

  return (
    <>
      <Actions add={() => navigate('/author')} refresh={refresh} download={refresh} />
      <DataTable loading={loading} columns={columns} rows={rows} />
      <Pagination maxPage={maxPage} pagination={pagination} />
    </>
  )
}
