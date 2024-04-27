import { useQuery } from '@saramorillon/hooks'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { type IBook, authors } from '../../models/Book'
import { getBooks } from '../../services/books'
import { Scanner } from '../components/Scanner'
import { DataTable, type IColumn } from '../components/Table'

export const columns: IColumn<IBook>[] = [
  {
    id: 'serial',
    header: () => 'Serial',
    cell: (book) => book.serial,
    filter: (book, filter) => book.serial.toLowerCase().includes(filter),
    sort: (book1, book2) => book1.serial.localeCompare(book2.serial),
  },
  {
    id: 'title',
    header: () => 'Title',
    cell: (book) => <Link to={`/book/${book.id}`}>{book.title}</Link>,
    filter: (book, filter) => book.title.toLowerCase().includes(filter),
    sort: (book1, book2) => book1.title.localeCompare(book2.title),
    props: { style: { width: '100%' } },
  },
  {
    id: 'authors',
    header: () => 'Authors',
    cell: (book) => authors(book),
    filter: (book, filter) => authors(book).toLowerCase().includes(filter),
    sort: (book1, book2) => authors(book1).localeCompare(authors(book2)),
  },
  {
    id: 'lastUpdate',
    header: () => 'Last update',
    cell: (book) => format(parseISO(book.updatedAt), 'PPpp'),
    filter: (book, filter) => book.updatedAt.toLowerCase().includes(filter),
    sort: (book1, book2) => book1.updatedAt.localeCompare(book2.updatedAt),
  },
]

export function Books() {
  const navigate = useNavigate()
  const { result: books, loading, error, execute } = useQuery(getBooks, { autoRun: true, defaultValue: [] })
  useHeader(`Books (${books.length})`, 'Scan an ISBN to add a volume to your library')

  return (
    <>
      <div className="right mb2">
        <button type="button" data-variant="outlined" title="Create" className="mr1" onClick={() => navigate('/book')}>
          <IconPlus size={16} />
        </button>

        <button type="button" data-variant="outlined" title="Refresh" className="mr1" onClick={execute}>
          <IconRefresh size={16} />
        </button>
      </div>
      <Scanner refresh={execute} />
      <DataTable loading={loading} error={error} columns={columns} data={books} />
    </>
  )
}
