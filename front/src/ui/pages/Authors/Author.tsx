import React, { useCallback } from 'react'
import { Spinner } from 'reactstrap'
import { useApi } from '../../../hooks/useApi'
import { useHeader } from '../../../hooks/useHeader'
import { useIdParam } from '../../../hooks/useIdParam'
import { getAuthor } from '../../../services/authors'
import { Form } from './Form/Form'

export function Author(): JSX.Element {
  useHeader('Author')
  const id = useIdParam()
  const call = useCallback(() => getAuthor(id), [id])
  const [author, { loading, refresh }] = useApi(call, undefined)

  if (loading) return <Spinner />

  return <Form author={author} refresh={refresh} />
}
