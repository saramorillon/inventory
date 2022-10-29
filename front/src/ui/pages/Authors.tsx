import { useFetch } from '@saramorillon/hooks'
import { IconRefresh } from '@tabler/icons'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { fullName, IAuthor } from '../../models/Author'
import { getAuthors } from '../../services/authors'
import { DataTable, IColumn } from '../components/Table'

export const columns: IColumn<IAuthor>[] = [
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
    cell: (author) => format(parseISO(author.updatedAt), 'PPpp'),
    filter: (author, filter) => author.updatedAt.toLowerCase().includes(filter),
    sort: (author1, author2) => author1.updatedAt.localeCompare(author2.updatedAt),
  },
]

export function Authors(): JSX.Element {
  const [authors, { loading, error }, refresh] = useFetch(getAuthors, [])
  useHeader(`Authors (${authors.length})`)

  return (
    <>
      <div className="right mb2">
        <button data-variant="outlined" title="Refresh" className="mr1" onClick={refresh}>
          <IconRefresh size={16} />
        </button>
      </div>
      <DataTable loading={loading} error={error} columns={columns} data={authors} />
    </>
  )
}
