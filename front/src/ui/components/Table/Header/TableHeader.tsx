import React from "react"
import { HeaderGroup } from "react-table"
import { InputGroup, InputGroupAddon } from "reactstrap"
import { FilterButton, Header, SortIcon } from "./Components"

export function mapColumn<T extends Record<string, unknown>>(column: HeaderGroup<T>): JSX.Element {
  const { key, ...props } = column.getHeaderProps(column.getSortByToggleProps())
  const colorName = column.filterValue !== undefined ? "text-primary" : ""
  return (
    <div className="th" key={key} {...props}>
      <Header className={colorName}>
        {column.render("Header")}
        {column.canSort && <SortIcon isSorted={column.isSorted} isSortedDesc={column.isSortedDesc} />}
      </Header>
    </div>
  )
}

export function mapFilter<T extends Record<string, unknown>>(column: HeaderGroup<T>): JSX.Element {
  const { key, ...props } = column.getHeaderProps()
  return (
    <div className="td" key={key} {...props}>
      {column.defaultCanFilter && column.canFilter && (
        <InputGroup size="sm">
          {column.render("Filter")}
          <InputGroupAddon addonType="append">
            <FilterButton value={column.filterValue} onClear={() => column.setFilter(undefined)} />
          </InputGroupAddon>
        </InputGroup>
      )}
    </div>
  )
}

export function mapHeaderGroup(type: "header" | "filter") {
  return function map<T extends Record<string, unknown>>(headerGroup: HeaderGroup<T>): JSX.Element {
    const { key, ...props } = headerGroup.getHeaderGroupProps()
    return (
      <div className="tr" key={key} {...props}>
        {headerGroup.headers.map(type === "header" ? mapColumn : mapFilter)}
      </div>
    )
  }
}

interface ITableHeaderProps<T extends Record<string, unknown>> {
  groups: HeaderGroup<T>[]
}

export function TableHeader<T extends Record<string, unknown>>({ groups }: ITableHeaderProps<T>): JSX.Element {
  return (
    <div className="thead">
      {groups.map(mapHeaderGroup("header"))}
      {groups.map(mapHeaderGroup("filter"))}
    </div>
  )
}
