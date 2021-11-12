/* eslint-disable @typescript-eslint/ban-types */
import 'react-table'

declare module 'react-table' {
  export interface TableOptions<D extends object>
    extends UseTableOptions<D>,
      UseSortByOptions<D>,
      UsePaginationOptions<D>,
      UseFiltersOptions<D> {}

  export interface UseTableInstanceProps<D extends object>
    extends UsePaginationInstanceProps<D>,
      UseSortByInstanceProps<D>,
      UseFiltersInstanceProps<D> {}

  export interface ColumnInstance<D extends object = {}>
    extends Omit<ColumnInterface<D>, 'id'>,
      ColumnInterfaceBasedOnValue<D>,
      UseTableColumnProps<D>,
      UseSortByColumnProps<D>,
      UseFiltersColumnProps<D> {}

  export interface ColumnInterface<D extends object = {}>
    extends UseTableColumnOptions<D>,
      UseSortByColumnOptions<D>,
      UseFiltersColumnOptions<D> {}

  export interface TableState<D extends object = {}>
    extends UseSortByState<D>,
      UsePaginationState<D>,
      UseFiltersState<D> {
    hiddenColumns?: Array<IdType<D>>
  }
}
