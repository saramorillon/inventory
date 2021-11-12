import React from 'react'
import { Column } from 'react-table'
import { useTableContext } from '../../../../contexts/TableContext'
import { IDraft } from '../../../../models/Draft'
import { DataTable } from '../../../components/Table/Table'

const columns: Column<IDraft>[] = [
  { Header: 'Serial', accessor: (draft) => draft.serial },
  { Header: 'Title', accessor: (draft) => draft.title },
  { Header: 'Authors', accessor: (draft) => draft.authors },
]

interface IDraftsTableProps {
  drafts: IDraft[]
  loading: boolean
}

export function Table({ drafts, loading }: IDraftsTableProps): JSX.Element {
  const table = useTableContext('draft', columns, drafts)
  return <DataTable loading={loading} table={table} link={(draft) => `/draft/${draft.serial}`} />
}
