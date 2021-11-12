import styled from "styled-components"
import React, { useCallback, useMemo } from "react"
import { TableInstance } from "react-table"
import { ArrowButton, PageInput, RowsSelect } from "./Components"

const color = "rgba(0, 0, 0, 0.54)"

const Nav = styled.nav({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  color: color,
  fill: color,
  fontSize: "0.8125rem",
})

const Margin = styled.span({ margin: "0 1.5rem" })

interface ITableFootProps<T extends Record<string, unknown>> {
  table: TableInstance<T>
  total?: number
}

export function TableFoot<T extends Record<string, unknown>>({ table, total }: ITableFootProps<T>): JSX.Element {
  const { canNextPage, canPreviousPage, nextPage, previousPage, gotoPage, state, pageCount, rows, setPageSize } = table

  const canFirstPage = useMemo(() => state.pageIndex > 0, [state.pageIndex])
  const firstPage = useCallback(() => gotoPage(0), [gotoPage])
  const canLastPage = useMemo(() => state.pageIndex < pageCount - 1, [state.pageIndex, pageCount])
  const lastPage = useCallback(() => gotoPage(pageCount - 1), [gotoPage, pageCount])
  const toPage = useCallback((page: number) => gotoPage(page - 1), [gotoPage])

  const count = useMemo(() => total || rows.length, [total, rows])
  const from = useMemo(() => state.pageIndex * state.pageSize + 1, [state])
  const to = useMemo(() => Math.min(count, from - 1 + state.pageSize), [from, state, count])
  const page = useMemo(() => state.pageIndex + 1, [state.pageIndex])

  return (
    <Nav>
      <span>Rows per page:</span>
      <RowsSelect value={state.pageSize} onChange={setPageSize} />
      <Margin className="items">
        {from}-{to} of {count}
      </Margin>
      <Margin className="page">
        Page <PageInput value={page} onChange={toPage} /> of {pageCount}
      </Margin>
      <ArrowButton page="first" disabled={!canFirstPage} onClick={firstPage} />
      <ArrowButton page="previous" disabled={!canPreviousPage} onClick={previousPage} />
      <ArrowButton page="next" disabled={!canNextPage} onClick={nextPage} />
      <ArrowButton page="last" disabled={!canLastPage} onClick={lastPage} />
    </Nav>
  )
}
