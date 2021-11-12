import React, { FormEvent, useCallback, useState } from 'react'
import { Search } from 'react-feather'
import { Button, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { useAudio } from '../../../hooks/useAudio'
import { putDraft } from '../../../services/drafts'

interface IScannerProps {
  refresh: () => void
}

export function Scanner({ refresh }: IScannerProps): JSX.Element {
  const [value, setValue] = useState('')
  const { error, success } = useAudio()

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      putDraft(value)
        .then(refresh)
        .then(() => success.play())
        .catch(() => error.play())
        .finally(() => setValue(''))
    },
    [refresh, success, error, value]
  )

  return (
    <Form inline onSubmit={onSubmit} className="float-left">
      <InputGroup>
        <Input type="text" placeholder="ISBN" value={value} onChange={(e) => setValue(e.target.value)} />
        <InputGroupAddon addonType="append">
          <Button size="sm">
            <Search size={14} />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  )
}
