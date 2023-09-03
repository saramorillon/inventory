import { IconSearch } from '@tabler/icons-react'
import React, { FormEvent, useCallback, useState } from 'react'
import { scanBook } from '../../services/books'

interface IScannerProps {
  refresh: () => void
}

export const error = new Audio('/Buzzer1.ogg')
export const success = new Audio('/Decision2.ogg')
export const existing = new Audio('/Item1.ogg')

export function Scanner({ refresh }: IScannerProps) {
  const [value, setValue] = useState('')

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      scanBook(value)
        .then((created) => (created ? success.play().then(refresh) : existing.play()))
        .catch(() => error.play())
        .finally(() => setValue(''))
    },
    [refresh, value],
  )

  return (
    <form name="scanner" onSubmit={onSubmit}>
      <input type="text" placeholder="ISBN" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit">
        <IconSearch size={14} />
      </button>
    </form>
  )
}
