import React, { Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react'
import { Column, TableInstance, TableState, useFilters, usePagination, useSortBy, useTable } from 'react-table'
import { Input } from 'reactstrap'

type R = Record<string, unknown>
type P<T extends R> = Partial<TableState<T>>

type Context<T extends R> = {
  state: Record<string, P<T>>
  setState: Dispatch<SetStateAction<Record<string, P<T>>>>
}

export const TableContext = React.createContext<Context<R>>({ state: {}, setState: () => undefined })

export function TableProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [state, setState] = useState<Record<string, P<R>>>({})
  return <TableContext.Provider value={{ state, setState }}>{children}</TableContext.Provider>
}

export const defaultOptions = {
  defaultColumn: {
    Filter: TextFilter,
    defaultCanFilter: true,
  },
}
export const plugins = [useFilters, useSortBy, usePagination]

export function useTableContext<T extends R>(name: string, _columns: Column<T>[], data: T[]): TableInstance<T> {
  const { state, setState } = useContext(TableContext)
  const columns = _columns as Column<R>[]
  const table = useTable(
    { columns, data, initialState: state[name], ...defaultOptions },
    ...plugins
  ) as TableInstance<T>

  useEffect(() => {
    setState?.((state) => ({ ...state, [name]: table.state }))
  }, [table.state, name, setState])

  return table
}

interface IFilterProps<T> {
  column: { filterValue: T; setFilter: (value?: T) => void }
}

function TextFilter({ column }: IFilterProps<string>): JSX.Element {
  return <Input value={column.filterValue || ''} onChange={(e) => column.setFilter(e.target.value)} />
}
