import React, { useCallback } from 'react'
import { useApi } from '../../../hooks/useApi'
import { useHeader } from '../../../hooks/useHeader'
import { getDrafts } from '../../../services/drafts'
import { Actions } from '../../components/Table/Actions'
import { Scanner } from './Scanner'
import { Table } from './Table/Table'

export function Drafts(): JSX.Element {
  useHeader('Drafts', 'Scan an ISBN to add a volume to your library')
  const call = useCallback(() => getDrafts(), [])
  const [drafts, { loading, refresh }] = useApi(call, [])

  return (
    <>
      <Scanner refresh={refresh} />
      <Actions
        onRefresh={refresh}
        onUpload={() => undefined}
        addLink="/draft"
        dowloadLink={'/api/drafts'}
        eventName="upload_drafts"
        tableName="draft"
      />
      <Table drafts={drafts} loading={loading} />
    </>
  )
}
