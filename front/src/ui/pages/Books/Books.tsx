import React, { useCallback } from 'react'
import { useApi } from '../../../hooks/useApi'
import { useHeader } from '../../../hooks/useHeader'
import { getBooks, uploadBooks } from '../../../services/books'
import { Actions } from '../../components/Table/Actions'
import { Table } from './Table/Table'

export function Books(): JSX.Element {
  useHeader('Books', 'Scan an ISBN to add a volume to your library')
  const call = useCallback(() => getBooks(), [])
  const [books, { loading, refresh }] = useApi(call, [])

  return (
    <>
      <Actions
        onRefresh={refresh}
        onUpload={uploadBooks}
        addLink="/book"
        dowloadLink={'/api/books'}
        eventName="upload_books"
        tableName="book"
      />
      <Table books={books} loading={loading} />
    </>
  )
}
