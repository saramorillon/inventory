import { useFetch } from '@saramorillon/hooks'
import { IconRefresh } from '@tabler/icons'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { authors, IBook } from '../../models/Book'
import { getBooks } from '../../services/books'
import { Scanner } from '../components/Scanner'
import { DataTable, IColumn } from '../components/Table'

const columns: IColumn<IBook>[] = [
  {
    header: () => 'Serial',
    cell: (book) => book.serial,
    filter: (book, filter) => book.serial.toLowerCase().includes(filter),
    sort: (book1, book2) => book1.serial.localeCompare(book2.serial),
  },
  {
    header: () => 'Title',
    cell: (book) => <Link to={`/book/${book.id}`}>{book.title}</Link>,
    filter: (book, filter) => book.title.toLowerCase().includes(filter),
    sort: (book1, book2) => book1.title.localeCompare(book2.title),
    props: { style: { width: '100%' } },
  },
  {
    header: () => 'Authors',
    cell: (book) => authors(book),
    filter: (book, filter) => authors(book).toLowerCase().includes(filter),
    sort: (book1, book2) => authors(book1).localeCompare(authors(book2)),
  },
  {
    header: () => 'Last update',
    cell: (book) => (book.updatedAt ? format(parseISO(book.updatedAt), 'PPpp') : ''),
    filter: (book, filter) => Boolean(book.updatedAt?.toLowerCase().includes(filter)),
    sort: (book1, book2) => (book1.updatedAt ?? '').localeCompare(book2.updatedAt ?? ''),
  },
]

export function Books(): JSX.Element {
  const [books, { loading, error }, refresh] = useFetch(getBooks, [])
  useHeader(`Books (${books.length})`, 'Scan an ISBN to add a volume to your library')

  return (
    <>
      <div className="right mb2">
        <button data-variant="outlined" title="Refresh" className="mr1" onClick={refresh}>
          <IconRefresh size={16} />
        </button>
      </div>
      <Scanner refresh={refresh} />
      <DataTable loading={loading} error={error} columns={columns} data={books} />
    </>
  )
}
