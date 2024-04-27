import { useForm, useQuery } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash, IconX } from '@tabler/icons-react'
import React, { useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { useRefresh } from '../../hooks/useRefresh'
import { useTypeahead } from '../../hooks/useTypeahead'
import { type IAuthor, fullName } from '../../models/Author'
import type { IBook } from '../../models/Book'
import { deleteAuthor, getAuthor, saveAuthor } from '../../services/authors'
import { getBooks } from '../../services/books'
import { Error2, Loading, NotFound } from '../components/Helpers'

export function Author() {
  const { id = '' } = useParams<'id'>()
  const call = useCallback(() => getAuthor(id), [id])
  const { result: author, loading, error, execute } = useQuery(call, { autoRun: true, defaultValue: null })
  const refresh = useRefresh<IAuthor>(execute, (author) => `/author/${author.id}`)

  if (loading) return <Loading message="Loading author" />

  if (error) return <Error2 message="Error while loading author" />

  if (id && !author) return <NotFound message="Author not found" />

  return <Form author={author} refresh={refresh} />
}

const empty: IAuthor = {
  id: 0,
  firstName: '',
  lastName: '',
  books: [],
  createdAt: '',
  updatedAt: '',
}

interface IFormProps {
  author: IAuthor | null
  refresh: (author: IAuthor) => void
}

function Form({ author, refresh }: IFormProps) {
  const navigate = useNavigate()
  useHeader('Author', author ? fullName(author) : 'New author')

  const onSave = useCallback((values: IAuthor) => saveAuthor(values).then(refresh), [refresh])
  const onDelete = useCallback((server: IAuthor) => deleteAuthor(server).then(() => navigate('/authors')), [navigate])
  const { values, onChange, submit } = useForm(onSave, author ?? empty)

  return (
    <form onSubmit={submit}>
      <label>
        First name
        <input value={values.firstName} onChange={(e) => onChange('firstName', e.target.value)} />
      </label>

      <label>
        Last name
        <input value={values.lastName} onChange={(e) => onChange('lastName', e.target.value)} />
      </label>

      <label>
        Books ({values.books.length})
        <Books values={values} onChange={(books: IBook[]) => onChange('books', books)} />
      </label>

      <div className="right">
        <button type="submit" data-variant="primary" className="mr1">
          <IconDeviceFloppy size={16} /> Save
        </button>

        {author && (
          <button type="button" data-variant="outlined" className="mr1" onClick={() => onDelete(author)}>
            <IconTrash size={16} /> Delete
          </button>
        )}
      </div>
    </form>
  )
}

interface IBooksProps {
  values: IAuthor
  onChange: (value: IBook[]) => void
}

function Books({ values, onChange }: IBooksProps) {
  const { result: books } = useQuery(getBooks, { autoRun: true, defaultValue: [] })

  const { options, add, remove } = useTypeahead(books, values.books, onChange)

  return (
    <div role="combobox" aria-controls="#datalist" aria-expanded={false}>
      {values.books.map((book) => (
        <span role="option" aria-selected={false} key={book.id}>
          <Link to={`/book/${book.id}`}>{book.title} </Link>
          <IconX aria-label={`Remove ${book.title}`} style={{ cursor: 'pointer' }} onClick={() => remove(book)} />
        </span>
      ))}
      <input list="datalist" aria-label="Add another book" onChange={add} />
      <datalist id="datalist">
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </datalist>
    </div>
  )
}
