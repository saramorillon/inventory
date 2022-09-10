import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFilters } from '../../hooks/useFilters'
import { useHeader } from '../../hooks/useHeader'
import { fullName } from '../../models/Author'
import { BookFilter, filterBook, IBook } from '../../models/Book'
import { getBooks } from '../../services/books'
import { Actions } from '../components/Actions'
import { Scanner } from '../components/Scanner'
import { DataTable, IColumn } from '../components/Table'

function authors(book: IBook) {
  return (
    <>
      {book.authors?.map(fullName).map((author) => (
        <div key={author}>{author}</div>
      ))}
    </>
  )
}

export function Books(): JSX.Element {
  const navigate = useNavigate()
  useHeader('Books', 'Scan an ISBN to add a volume to your library')
  const call = useCallback(() => getBooks(), [])
  const [books, { loading }, refresh] = useFetch(call, [])

  const [filters, onChange] = useFilters<BookFilter>({ serial: '', title: '', authors: '', updatedAt: '' })
  const filter = useCallback((book: IBook) => filterBook(book, filters), [filters])

  const columns: IColumn<IBook>[] = useMemo(
    () => [
      {
        header: 'Serial',
        cell: (book) => book.serial,
        filter: <input value={filters.serial} onChange={(e) => onChange('serial', e.target.value)} />,
      },
      {
        header: 'Title',
        cell: (book) => <Link to={`/book/${book.id}`}>{book.title}</Link>,
        filter: <input value={filters.title} onChange={(e) => onChange('title', e.target.value)} />,
      },
      {
        header: 'Authors',
        cell: (book) => authors(book),
        filter: <input value={filters.authors} onChange={(e) => onChange('authors', e.target.value)} />,
      },
      {
        header: 'Last update',
        cell: (book) => (book.updatedAt ? format(parseISO(book.updatedAt), 'PPpp') : ''),
        filter: <input value={filters.updatedAt} onChange={(e) => onChange('updatedAt', e.target.value)} />,
      },
    ],
    [filters.authors, filters.serial, filters.title, filters.updatedAt, onChange]
  )

  return (
    <>
      <Actions add={() => navigate('/book')} refresh={refresh} download={refresh} />
      <Scanner refresh={refresh} />
      <DataTable loading={loading} columns={columns} data={books} filter={filter} />
    </>
  )
}
