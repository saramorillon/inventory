import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { Loader } from './Helpers'

interface ILoadContainerProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean
}

export function LoadContainer({ loading, children, ...props }: PropsWithChildren<ILoadContainerProps>): JSX.Element {
  if (loading) {
    return <Loader {...props} />
  }

  return <>{children}</>
}
