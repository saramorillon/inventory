import { useQuery } from '@saramorillon/hooks'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { type IAuthor, fullName } from '../../models/Author'
import { getAuthors } from '../../services/authors'
import { DataTable, type IColumn } from '../components/Table'

export const columns: IColumn<IAuthor>[] = [
  {
    id: 'id',
    header: () => 'ID',
    cell: (author) => author.id,
    filter: (author, filter) => author.id.toString().toLowerCase().includes(filter),
    sort: (author1, author2) => author1.id - author2.id,
  },
  {
    id: 'fullName',
    header: () => 'Full name',
    cell: (author) => <Link to={`/author/${author.id}`}>{fullName(author)}</Link>,
    filter: (author, filter) => fullName(author).toLowerCase().includes(filter),
    sort: (author1, author2) => fullName(author1).localeCompare(fullName(author2)),
  },
  {
    id: 'firstName',
    header: () => 'First name',
    cell: (author) => author.firstName,
    filter: (author, filter) => author.firstName.toLowerCase().includes(filter),
    sort: (author1, author2) => author1.firstName.localeCompare(author2.firstName),
  },
  {
    id: 'lastName',
    header: () => 'Last name',
    cell: (author) => author.lastName,
    filter: (author, filter) => author.lastName.toLowerCase().includes(filter),
    sort: (author1, author2) => author1.lastName.localeCompare(author2.lastName),
  },
  {
    id: 'lastUpdate',
    header: () => 'Last update',
    cell: (author) => format(parseISO(author.updatedAt), 'PP'),
    filter: (author, filter) => author.updatedAt.toLowerCase().includes(filter),
    sort: (author1, author2) => author1.updatedAt.localeCompare(author2.updatedAt),
    props: { className: 'nowrap' },
  },
]

export function Authors() {
  const navigate = useNavigate()
  const { result: authors, loading, error, execute } = useQuery(getAuthors, { autoRun: true, defaultValue: [] })
  useHeader(`Authors (${authors.length})`)

  return (
    <>
      <div className="right mb2">
        <button
          type="button"
          data-variant="outlined"
          title="Create"
          className="mr1"
          onClick={() => navigate('/author')}
        >
          <IconPlus size={16} />
        </button>
        <button type="button" data-variant="outlined" title="Refresh" className="mr1" onClick={execute}>
          <IconRefresh size={16} />
        </button>
      </div>
      <DataTable loading={loading} error={error} columns={columns} data={authors} />
    </>
  )
}
