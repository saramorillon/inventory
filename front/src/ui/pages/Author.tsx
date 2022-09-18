import { useFetch, useForm } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash } from '@tabler/icons'
import React, { useCallback, useEffect } from 'react'
import { useHeader } from '../../hooks/useHeader'
import { useIdParam } from '../../hooks/useIdParam'
import { useNavigate } from '../../hooks/useNavigate'
import { fullName, IAuthor } from '../../models/Author'
import { deleteAuthor, getAuthor, saveAuthor } from '../../services/authors'
import { getBooks } from '../../services/books'
import { Error, Loader } from '../components/Helpers'
import { TypeAhead } from '../components/Typeahead'

const empty: IAuthor = {
  id: 0,
  firstName: '',
  lastName: '',
}

export function Author(): JSX.Element {
  const id = useIdParam()
  const call = useCallback(() => getAuthor(id), [id])
  const [author, { loading, error }, refresh] = useFetch(call, null)
  useHeader('Author', fullName(author))
  const navigate = useNavigate(refresh)

  const onSave = useCallback(
    (values: IAuthor) => saveAuthor(values).then(({ id }) => navigate(`/author/${id}`)),
    [navigate]
  )
  const onDelete = useCallback((server: IAuthor) => deleteAuthor(server).then(() => navigate('/authors')), [navigate])
  const { onSubmit, onReset, onChange, values } = useForm(onSave, author || empty)
  const [books, { loading: booksLoading }] = useFetch(getBooks, [])

  useEffect(onReset, [onReset])

  if (loading) return <Loader />

  if (error) return <Error message="Error while loading author" />

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

        {author && (
          <button data-variant="outlined" className="mr1" onClick={() => onDelete(author)} type="button">
            <IconTrash size={16} /> Delete
          </button>
        )}
      </div>
    </form>
  )
}
