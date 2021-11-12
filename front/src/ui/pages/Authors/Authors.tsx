import React, { useCallback } from 'react'
import { useApi } from '../../../hooks/useApi'
import { useHeader } from '../../../hooks/useHeader'
import { getAuthors } from '../../../services/authors'
import { Actions } from '../../components/Table/Actions'
import { Table } from './Table/Table'

export function Authors(): JSX.Element {
  useHeader('Authors')
  const call = useCallback(() => getAuthors(), [])
  const [authors, { loading, refresh }] = useApi(call, [])

  return (
    <>
      <Actions
        onRefresh={refresh}
        onUpload={() => undefined}
        addLink="/author"
        dowloadLink={'/api/authors'}
        eventName="upload_authors"
        tableName="author"
      />
      <Table authors={authors} loading={loading} />
    </>
  )
}
