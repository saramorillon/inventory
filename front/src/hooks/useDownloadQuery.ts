// import { TableContext } from '../contexts/TableContext'

export function useDownloadQuery(name: string): URLSearchParams {
  const query = new URLSearchParams()
  query.append('format', 'csv')
  // const { state } = useContext(TableContext)
  // const tableState = state[name]
  // if (!tableState) return query
  // const { filters } = tableState
  // if (filters?.length) {
  //   for (const filter of filters) {
  //     query.append(filter.id, String(filter.value))
  //   }
  // }
  return query
}
