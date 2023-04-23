import { IconSearch, IconX } from '@tabler/icons-react'
import React from 'react'

export function Loading({ message }: { message: string }): JSX.Element {
  return (
    <>
      <span aria-label="Loading..." aria-busy /> {message}
    </>
  )
}

export function NotFound({ message }: { message: string }): JSX.Element {
  return (
    <>
      <IconSearch /> {message}
    </>
  )
}

export function Error({ message }: { message: string }): JSX.Element {
  return (
    <>
      <IconX color="crimson" /> {message}
    </>
  )
}
