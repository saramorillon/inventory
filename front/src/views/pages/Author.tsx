import { useFetch, useForm } from '@saramorillon/hooks'
import { IconDeviceFloppy, IconTrash } from '@tabler/icons'
import React, { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHeader } from '../../hooks/useHeader'
import { fullName, IAuthor } from '../../models/Author'
import { deleteAuthor, getAuthor, saveAuthor } from '../../services/authors'
import { getBooks } from '../../services/books'
import { Error, Loading, NotFound } from '../components/Helpers'
import { TypeAhead } from '../components/Typeahead'

export function Author(): JSX.Element {
  const { id = '' } = useParams<'id'>()
  const call = useCallback(() => getAuthor(id), [id])
  const [author, { loading, error }, refresh] = useFetch(call, null)

  if (loading) return <Loading message="Loading author" />

  if (error) return <Error message="Error while loading author" />

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
  refresh: () => void
}

function Form({ author, refresh }: IFormProps) {
  const navigate = useNavigate()
  useHeader('Author', author ? fullName(author) : 'New author')

  const onSave = useCallback(
    (values: IAuthor) =>
      saveAuthor(values).then((data) => {
        if (author) {
          refresh()
        } else {
          navigate(`/author/${data.id}`)
        }
      }),
    [navigate, refresh, author]
  )
  const onDelete = useCallback((server: IAuthor) => deleteAuthor(server).then(() => navigate('/authors')), [navigate])
  const { values, onChange, submit } = useForm(onSave, author ?? empty)
  const [books, { loading }] = useFetch(getBooks, [])

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
        {!loading && (
          <TypeAhead
            values={values.books}
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
