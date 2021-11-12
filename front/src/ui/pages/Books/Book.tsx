import React, { useCallback } from 'react'
import { Alert, Spinner } from 'reactstrap'
import { useApi } from '../../../hooks/useApi'
import { useHeader } from '../../../hooks/useHeader'
import { useIdParam } from '../../../hooks/useIdParam'
import { getBook } from '../../../services/books'
import { Form } from './Form/Form'

export function Book(): JSX.Element {
  useHeader('Book')
  const id = useIdParam()
  const call = useCallback(() => getBook(id), [id])
  const [book, { loading, refresh }] = useApi(call, undefined)

  if (loading) return <Spinner />

  if (!book) return <Alert color="danger">Book not found</Alert>

  return <Form book={book} refresh={refresh} />
}
