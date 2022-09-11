import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React, { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { fullName, IAuthor } from '../../models/Author'
import { getAuthors } from '../../services/authors'
import { Actions } from '../components/Actions'
import { DataTable, IColumn } from '../components/Table'

const columns: IColumn<IAuthor>[] = [
  {
    header: () => 'ID',
    cell: (author) => author.id,
    filter: (author, filter) => author.id.toString().toLowerCase().includes(filter),
    sort: (author1, author2) => author1.id - author2.id,
  },
  {
    header: () => 'Full name',
    cell: (author) => <Link to={`/author/${author.id}`}>{fullName(author)}</Link>,
    filter: (author, filter) => fullName(author).toLowerCase().includes(filter),
    sort: (author1, author2) => fullName(author1).localeCompare(fullName(author2)),
  },
  {
    header: () => 'First name',
    cell: (author) => author.firstName,
    filter: (author, filter) => author.firstName.toLowerCase().includes(filter),
    sort: (author1, author2) => author1.firstName.localeCompare(author2.firstName),
  },
  {
    header: () => 'Last name',
    cell: (author) => author.lastName,
    filter: (author, filter) => author.lastName.toLowerCase().includes(filter),
    sort: (author1, author2) => author1.lastName.localeCompare(author2.lastName),
  },
  {
    header: () => 'Last update',
    cell: (author) => (author.updatedAt ? format(parseISO(author.updatedAt), 'PPpp') : ''),
    filter: (author, filter) => Boolean(author.updatedAt?.toLowerCase().includes(filter)),
    sort: (author1, author2) => (author1.updatedAt ?? '').localeCompare(author2.updatedAt ?? ''),
  },
]

export function Authors(): JSX.Element {
  const navigate = useNavigate()
  useHeader('Authors')
  const call = useCallback(() => getAuthors(), [])
  const [authors, { loading }, refresh] = useFetch(call, [])

  return (
    <>
      <Actions add={() => navigate('/author')} refresh={refresh} download={refresh} />
      <DataTable loading={loading} columns={columns} data={authors} />
    </>
  )
}
