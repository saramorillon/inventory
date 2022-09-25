import { useFetch, useForm } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash } from '@tabler/icons'
import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { fullName, IAuthor } from '../../models/Author'
import { deleteAuthor, getAuthor, saveAuthor } from '../../services/authors'
import { getBooks } from '../../services/books'
import { Error, Loader, NotFound } from '../components/Helpers'
import { TypeAhead } from '../components/Typeahead'

export function Author(): JSX.Element {
  const { id } = useParams<'id'>()
  const call = useCallback(() => getAuthor(id), [id])
  const [author, { loading, error }, refresh] = useFetch(call, null)

  if (loading) return <Loader />

  if (error) return <Error message="Error while loading author" />

  if (!id || !author) return <NotFound message="Author not found" />

  return <Form author={author} refresh={refresh} />
}

interface IFormProps {
  author: IAuthor
  refresh: () => void
}

function Form({ author, refresh }: IFormProps) {
  const navigate = useNavigate()
  useHeader('Author', fullName(author))

  const onSave = useCallback((values: IAuthor) => saveAuthor(values).then(refresh), [navigate])
  const onDelete = useCallback((server: IAuthor) => deleteAuthor(server).then(() => navigate('/authors')), [navigate])
  const { onSubmit, onReset, onChange, values } = useForm(onSave, author)
  const [books, { loading: booksLoading }] = useFetch(getBooks, [])

  useEffect(onReset, [onReset])

  return (
    <form onSubmit={onSubmit}>
      <label>
        First name
        <input value={values.firstName} onChange={(e) => onChange('firstName', e.target.value)} />
      </label>

      <label>
        Last name
        <input value={values.lastName} onChange={(e) => onChange('lastName', e.target.value)} />
      </label>

      <label>
        Books ({values.books?.length})
        {!booksLoading && (
          <TypeAhead
            values={values.books || []}
            onChange={(books) => onChange('books', books)}
            options={books}
            getLabel={(book) => book.title}
            getValue={(book) => book.id}
          />
        )}
      </label>

      <div className="right">
        <button data-variant="primary" className="mr1" type="submit">
          <IconDeviceFloppy size={16} /> Save
        </button>

        <button data-variant="outlined" className="mr1" onClick={() => onDelete(author)} type="button">
          <IconTrash size={16} /> Delete
        </button>
      </div>
    </form>
  )
}
