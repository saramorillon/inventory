import { IconSearch, IconX } from '@tabler/icons'
import React from 'react'

export function Loading({ message }: { message: string }): JSX.Element {
  return (
    <div className="center">
      <span aria-label="Loading..." aria-busy /> {message}
    </div>
  )
}

export function NotFound({ message }: { message: string }): JSX.Element {
  return (
    <div className="center">
      <IconSearch /> {message}
    </div>
  )
}

export function Error({ message }: { message: string }): JSX.Element {
  return (
    <div className="center">
      <IconX color="red" /> {message}
    </div>
  )
}
