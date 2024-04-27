import { useForm, useQuery } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash, IconX } from '@tabler/icons-react'
import React, { useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { useRefresh } from '../../hooks/useRefresh'
import { useTypeahead } from '../../hooks/useTypeahead'
import { type IAuthor, fullName } from '../../models/Author'
import type { IBook } from '../../models/Book'
import { getAuthors } from '../../services/authors'
import { deleteBook, getBook, saveBook } from '../../services/books'
import { BarCode } from '../components/BarCode'
import { Error2, Loading, NotFound } from '../components/Helpers'

export function Book() {
  const { id = '' } = useParams<'id'>()
  const call = useCallback(() => getBook(id), [id])
  const { result: book, loading, error, execute } = useQuery(call, { autoRun: true, defaultValue: null })
  const refresh = useRefresh<IBook>(execute, (book) => `/book/${book.id}`)

  if (loading) return <Loading message="Loading book" />

  if (error) return <Error2 message="Error while loading book" />

  if (id && !book) return <NotFound message="Book not found" />

  return <Form book={book} refresh={refresh} />
}

const empty: IBook = {
  id: 0,
  serial: '',
  title: '',
  source: 'manual',
  authors: [],
  createdAt: '',
  updatedAt: '',
}

interface IFormProps {
  book: IBook | null
  refresh: (book: IBook) => void
}

function Form({ book, refresh }: IFormProps) {
  const navigate = useNavigate()
  useHeader('Book', book ? book.title : 'New book')

  const onSave = useCallback((values: IBook) => saveBook(values).then(refresh), [refresh])
  const onDelete = useCallback((server: IBook) => deleteBook(server).then(() => navigate('/books')), [navigate])
  const { values, onChange, submit } = useForm(onSave, book ?? empty)

  return (
    <>
      <form onSubmit={submit}>
        <div className="flex items-center">
          <div className="flex-auto mr2">
            <label>
              Source
              <input id="source" value={values.source} required disabled />
            </label>

            <label>
              Serial
              <input id="serial" value={values.serial} onChange={(e) => onChange('serial', e.target.value)} />
            </label>
          </div>

          {values.serial.match(/^97(8|9)\d{10}$/) && <BarCode serial={values.serial} />}
        </div>

        <label>
          Title
          <input id="title" value={values.title} onChange={(e) => onChange('title', e.target.value)} required />
        </label>

        <label>
          Authors ({values.authors.length})
          <Authors values={values} onChange={(authors) => onChange('authors', authors)} />
        </label>

        <div className="right mb2">
          <button type="submit" data-variant="primary" className="mr1">
            <IconDeviceFloppy size={16} /> Save
          </button>

          {book && (
            <button type="button" data-variant="outlined" className="mr1" onClick={() => onDelete(book)}>
              <IconTrash size={16} /> Delete
            </button>
          )}
        </div>
      </form>
    </>
  )
}

interface IAuthorsProps {
  values: IBook
  onChange: (authors: IAuthor[]) => void
}

function Authors({ values, onChange }: IAuthorsProps) {
  const { result: authors } = useQuery(getAuthors, { autoRun: true, defaultValue: [] })

  const { options, add, remove } = useTypeahead(authors, values.authors, onChange)

  return (
    <div role="combobox" aria-controls="#datalist" aria-expanded={false}>
      {values.authors.map((author) => (
        <span role="option" aria-selected={false} key={author.id}>
          <Link to={`/author/${author.id}`}>{fullName(author)} </Link>
          <IconX
            aria-label={`Remove ${fullName(author)}`}
            style={{ cursor: 'pointer' }}
            onClick={() => remove(author)}
          />
        </span>
      ))}
      <input list="datalist" aria-label="Add another author" onChange={add} />
      <datalist id="datalist">
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {fullName(option)}
          </option>
        ))}
      </datalist>
    </div>
  )
}
