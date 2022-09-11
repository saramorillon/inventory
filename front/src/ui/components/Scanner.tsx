import { IconSearch } from '@tabler/icons'
import React, { FormEvent, useCallback, useState } from 'react'
import { scanBook } from '../../services/books'

interface IScannerProps {
  refresh: () => void
}

const error = new Audio('/Buzzer1.ogg')
const success = new Audio('/Decision2.ogg')
const existing = new Audio('/Item1.ogg')

export function Scanner({ refresh }: IScannerProps): JSX.Element {
  const [value, setValue] = useState('')

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      scanBook(value)
        .then((created) => (created ? success.play().then(refresh) : existing.play()))
        .catch(() => error.play())
        .finally(() => setValue(''))
    },
    [refresh, value]
  )

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="ISBN" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit">
        <IconSearch size={14} />
      </button>
    </form>
  )
}
