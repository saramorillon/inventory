import { useFetch, useForm } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash } from '@tabler/icons'
import React, { useCallback, useEffect } from 'react'
import { useHeader } from '../../hooks/useHeader'
import { useIdParam } from '../../hooks/useIdParam'
import { useNavigate } from '../../hooks/useNavigate'
import { fullName } from '../../models/Author'
import { IBook } from '../../models/Book'
import { getAuthors } from '../../services/authors'
import { deleteBook, getBook, saveBook } from '../../services/books'
import { BarCode } from '../components/BarCode'
import { Error, Loader } from '../components/Helpers'
import { TypeAhead } from '../components/Typeahead'

const empty: IBook = {
  id: 0,
  source: 'manual',
  serial: '',
  title: '',
}

export function Book(): JSX.Element {
  useHeader('Book')
  const id = useIdParam()
  const call = useCallback(() => getBook(id), [id])
  const [book, { loading, error }, refresh] = useFetch(call, null)
  const navigate = useNavigate(refresh)

  const onSave = useCallback((values: IBook) => saveBook(values).then(({ id }) => navigate(`/book/${id}`)), [navigate])
  const onDelete = useCallback((server: IBook) => deleteBook(server).then(() => navigate('/books')), [navigate])
  const { onSubmit, onReset, onChange, values } = useForm(onSave, book || empty)
  const [authors, { loading: authorsLoading }] = useFetch(getAuthors, [])

  useEffect(onReset, [onReset])

  if (loading) return <Loader />

  if (error) return <Error message="Error while loading book" />

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex items-center">
          <div className="flex-auto mr2">
            <label>
              Source
              <input id="source" value={book?.source || 'manual'} required disabled />
            </label>

            <label>
              Serial
              <input id="serial" value={values.serial} onChange={(e) => onChange('serial', e.target.value)} required />
            </label>
          </div>
          {book && <BarCode serial={book.serial} />}
        </div>

        <label>
          Title
          <input id="title" value={values.title} onChange={(e) => onChange('title', e.target.value)} required />
        </label>

        <label>
          Authors ({values.authors?.length})
          {!authorsLoading && (
            <TypeAhead
              values={values.authors || []}
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

          {book && (
            <button data-variant="outlined" className="mr1" onClick={() => onDelete(book)} type="button">
              <IconTrash size={16} /> Delete
            </button>
          )}
        </div>
      </form>

      {book && <iframe src={`https://www.google.com/search?q=${book.serial}&igu=1`} width="100%" height="400" />}
    </>
  )
}
