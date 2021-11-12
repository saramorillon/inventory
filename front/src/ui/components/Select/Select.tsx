import React, { useEffect, useMemo, useState } from 'react'
import { OptionsType } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { useApi } from '../../../hooks/useApi'

export type Option = { label: string; value: string | number; __isNew__?: boolean }

interface ISelectProps<T, U> {
  call: (params?: Record<string, unknown>) => Promise<T[]>
  mapOption: (option: T) => Option
  value?: U
  onChange: (value: U) => void
  onCreate?: (selected: Option) => void
}

export function Select<T>({ call, mapOption, value, onChange, onCreate }: ISelectProps<T, T>): JSX.Element {
  const defaultValue = useMemo(() => (value ? mapOption(value) : null), [value, mapOption])
  const [selected, setSelected] = useState<Option | null>(defaultValue)
  const [items, { loading }] = useApi(call, [])
  const options = useMemo(() => items.map(mapOption), [items, mapOption])

  useEffect(() => {
    if (onCreate && selected && selected.__isNew__) {
      onCreate(selected)
    } else {
      const value = items.find((item) => mapOption(item).value === selected?.value)
      if (value) onChange(value)
    }
  }, [onChange, selected, items, mapOption, onCreate])

  return <CreatableSelect options={options} isLoading={loading} value={selected} onChange={setSelected} />
}

export function MultiSelect<T>({ call, mapOption, value, onChange, onCreate }: ISelectProps<T, T[]>): JSX.Element {
  const defaultValue = useMemo(() => (value || []).map(mapOption), [value, mapOption])
  const [selected, setSelected] = useState<OptionsType<Option>>(defaultValue)
  const [items, { loading }] = useApi(call, [])
  const options = useMemo(() => items.map(mapOption), [items, mapOption])

  useEffect(() => {
    const lastCreated = selected.find((s) => s.__isNew__)
    if (onCreate && lastCreated) {
      onCreate(lastCreated)
    } else {
      const value = items.filter((item) => selected.map((s) => s.value).includes(mapOption(item).value))
      if (value) onChange(value)
    }
  }, [onChange, selected, items, mapOption, onCreate])

  return <CreatableSelect options={options} isLoading={loading} isMulti value={selected} onChange={setSelected} />
}
