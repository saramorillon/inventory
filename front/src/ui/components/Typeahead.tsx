import { IconX } from '@tabler/icons'
import React, { ChangeEvent, ReactNode, useCallback, useMemo } from 'react'

interface ITypeAheadProps<T> {
  values: T[]
  onChange: (values: T[]) => void
  options: T[]
  getValue: (value: T) => string | number
  getLabel: (value: T) => ReactNode
}

export function TypeAhead<T>({ values, onChange, options, getValue, getLabel }: ITypeAheadProps<T>) {
  const filteredOptions = useMemo(
    () => options.filter((option) => !values.find((value) => getValue(value) === getValue(option))),
    [getValue, options, values]
  )

  const onAdd = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!(e.nativeEvent instanceof InputEvent)) {
        const value = options.find((option) => getValue(option).toString() === e.target.value)
        if (value) onChange([...values, value])
        e.target.value = ''
      }
    },
    [options, onChange, values, getValue]
  )

  const onRemove = useCallback(
    (option: T) => onChange(values.filter((value) => getValue(value) !== getValue(option))),
    [onChange, values, getValue]
  )

  return (
    <>
      <input list="datalist" onChange={onAdd} />
      <datalist id="datalist">
        {filteredOptions.map((option) => (
          <option key={getValue(option)} value={getValue(option)}>
            {getLabel(option)}
          </option>
        ))}
      </datalist>
      {values.map((value) => (
        <button
          data-variant="outlined"
          key={getValue(value)}
          onClick={() => onRemove(value)}
          className="mr1 mt1 inline-block"
        >
          {getLabel(value)} <IconX />
        </button>
      ))}
    </>
  )
}
