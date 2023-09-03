import { IconSearch, IconX } from '@tabler/icons-react'
import React from 'react'

export function Loading({ message }: { message: string }) {
  return (
    <>
      <span aria-label="Loading..." aria-busy /> {message}
    </>
  )
}

export function NotFound({ message }: { message: string }) {
  return (
    <>
      <IconSearch /> {message}
    </>
  )
}

export function Error({ message }: { message: string }) {
  return (
    <>
      <IconX color="crimson" /> {message}
    </>
  )
}
