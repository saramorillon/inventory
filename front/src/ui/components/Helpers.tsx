import { IconSearch, IconX } from '@tabler/icons'
import React, { HTMLAttributes } from 'react'

export function Loader(props: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div aria-label="Loading..." aria-busy {...props} />
}

export function Loading({ message }: { message: string }): JSX.Element {
  return (
    <div className="center">
      <span aria-label="Loading..." aria-busy /> {message}
    </div>
  )
}

export function NotFound({ message }: { message?: string }): JSX.Element {
  return (
    <div className="center">
      <IconSearch /> {message || 'Not Found'}
    </div>
  )
}

export function Error({ message }: { message: string }): JSX.Element {
  return (
    <div className="center">
      <IconX /> {message}
    </div>
  )
}
