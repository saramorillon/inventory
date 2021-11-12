import { format, parseISO } from 'date-fns'
import { CellProps } from 'react-table'

export function date<T extends Record<string, unknown>>(props: CellProps<T, string>): string {
  if (!props.value) return ''
  return format(parseISO(props.value), 'PPpp')
}
