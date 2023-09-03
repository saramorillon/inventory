import { ChangeEvent, useCallback, useMemo } from 'react'

export function useTypeahead<T extends { id: number }>(options: T[], values: T[], onChange: (values: T[]) => void) {
  const filteredOptions = useMemo(
    () => options.filter((option) => !values.find((value) => value.id === option.id)),
    [options, values],
  )

  const add = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!(e.nativeEvent instanceof InputEvent)) {
        const value = options.find((option) => option.id.toString() === e.target.value)
        if (value) onChange([...values, value])
        e.target.value = ''
      }
    },
    [options, onChange, values],
  )

  const remove = useCallback(
    (option: T) => onChange(values.filter((value) => value.id !== option.id)),
    [onChange, values],
  )

  return useMemo(() => ({ options: filteredOptions, add, remove }), [filteredOptions, add, remove])
}
