import { IconSearch } from '@tabler/icons'
import React, { FormEvent, useCallback, useState } from 'react'
import { useAudio } from '../../hooks/useAudio'
import { scanBook } from '../../services/books'

interface IScannerProps {
  refresh: () => void
}

export function Scanner({ refresh }: IScannerProps): JSX.Element {
  const [value, setValue] = useState('')
  const { error, success } = useAudio()

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      scanBook(value)
        .then(() => success.play())
        .then(refresh)
        .catch(() => error.play())
        .finally(() => setValue(''))
    },
    [refresh, success, error, value]
  )

  return (
    <form onSubmit={onSubmit} className="float-left">
      <input type="text" placeholder="ISBN" value={value} onChange={(e) => setValue(e.target.value)} />
      <button>
        <IconSearch size={14} />
      </button>
    </form>
  )
}
