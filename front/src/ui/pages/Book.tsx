import { useFetch, useForm } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash } from '@tabler/icons'
import { useBarcode } from 'next-barcode'
import React, { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { fullName } from '../../models/Author'
import { IBook } from '../../models/Book'
import { getAuthors } from '../../services/authors'
import { deleteBook, getBook, saveBook } from '../../services/books'
import { Error, Loading, NotFound } from '../components/Helpers'
import { TypeAhead } from '../components/Typeahead'

export function Book(): JSX.Element {
  const { id } = useParams<'id'>()
  const call = useCallback(() => getBook(id), [id])
  const [book, { loading, error }, refresh] = useFetch(call, null)

  if (loading) return <Loading message="Loading book" />

  if (error) return <Error message="Error while loading book" />

  if (!book) return <NotFound message="Book not found" />

  return <Form book={book} refresh={refresh} />
}

interface IFormProps {
  book: IBook
  refresh: () => void
}

function Form({ book, refresh }: IFormProps) {
  const navigate = useNavigate()
  useHeader('Book', book.title)

  const { inputRef } = useBarcode({ value: book.serial, options: { format: 'EAN13' } })

  const onSave = useCallback((values: IBook) => saveBook(values).then(refresh), [refresh])
  const onDelete = useCallback((server: IBook) => deleteBook(server).then(() => navigate('/books')), [navigate])
  const { onSubmit, onChange, values } = useForm(onSave, book)
  const [authors, { loading }] = useFetch(getAuthors, [])

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex items-center">
          <div className="flex-auto mr2">
            <label>
              Source
              <input id="source" value={book.source} required disabled />
            </label>

            <label>
              Serial
              <input id="serial" value={values.serial} onChange={(e) => onChange('serial', e.target.value)} required />
            </label>
          </div>

          <canvas title={book.serial} ref={inputRef} />
        </div>

        <label>
          Title
          <input id="title" value={values.title} onChange={(e) => onChange('title', e.target.value)} required />
        </label>

        <label>
          Authors ({values.authors.length})
          {!loading && (
            <TypeAhead
              values={values.authors}
              onChange={(authors) => onChange('authors', authors)}
              options={authors}
              getLabel={fullName}
              getValue={(author) => author.id}
            />
          )}
        </label>

        <div className="right mb2">
          <button data-variant="primary" className="mr1" type="submit">
            <IconDeviceFloppy size={16} /> Save
          </button>

          <button data-variant="outlined" className="mr1" onClick={() => onDelete(book)} type="button">
            <IconTrash size={16} /> Delete
          </button>
        </div>
      </form>

      <iframe
        title={`Google page for "${book.title}"`}
        src={`https://www.google.com/search?q=${book.serial}&igu=1`}
        width="100%"
        height="400"
      />
    </>
  )
}
