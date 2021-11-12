import React, { useCallback } from 'react'
import { Alert, Spinner } from 'reactstrap'
import { useApi } from '../../../hooks/useApi'
import { useHeader } from '../../../hooks/useHeader'
import { useIdParam } from '../../../hooks/useIdParam'
import { getDraft } from '../../../services/drafts'
import { Form } from './Form/Form'

export function Draft(): JSX.Element {
  useHeader('Draft')
  const id = useIdParam()
  const call = useCallback(() => getDraft(id), [id])
  const [draft, { loading }] = useApi(call, undefined)

  if (loading) return <Spinner />

  if (!draft) return <Alert color="danger">Draft not found</Alert>

  return <Form draft={draft} />
}
