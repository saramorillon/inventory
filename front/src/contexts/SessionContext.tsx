import { useFetch } from '@saramorillon/hooks'
import React, { createContext, PropsWithChildren } from 'react'
import { ISession } from '../models/Session'
import { getSession } from '../services/session'
import { Loading } from '../ui/components/Helpers'

export const SessionContext = createContext<ISession | null>(null)

export function SessionProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [session, { loading }] = useFetch(getSession, null)

  if (loading) {
    return <Loading message="Loading session" />
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
