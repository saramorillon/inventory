import { useFetch, useForm } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash, IconX } from '@tabler/icons-react'
import { useBarcode } from 'next-barcode'
import React, { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { useParam } from '../../hooks/useParam'
import { useTypeahead } from '../../hooks/useTypeahead'
import { IAuthor, fullName } from '../../models/Author'
import { IBook } from '../../models/Book'
import { getAuthors } from '../../services/authors'
import { deleteBook, getBook, saveBook } from '../../services/books'
import { Error, Loading, NotFound } from '../components/Helpers'

export function Book(): JSX.Element {
  const id = useParam('id')
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
  const { values, onChange, submit } = useForm(onSave, book)
  const [authors] = useFetch(getAuthors, [])

  const changeAuthors = useCallback((authors: IAuthor[]) => onChange('authors', authors), [onChange])

  const [authorOptions, addAuthor, removeAuthor] = useTypeahead(authors, values.authors, changeAuthors)

  return (
    <>
      <form onSubmit={submit}>
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
          <div role="combobox">
            {values.authors.map((author) => (
              <span role="option" key={author.id}>
                <Link to={`/author/${author.id}`}>{fullName(author)} </Link>
                <IconX
                  aria-label={`Remove ${fullName(author)}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeAuthor(author)}
                />
              </span>
            ))}
            <input list="datalist" aria-label="Add another author" onChange={addAuthor} />
            <datalist id="datalist" role="listbox">
              {authorOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {fullName(option)}
                </option>
              ))}
            </datalist>
          </div>
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
