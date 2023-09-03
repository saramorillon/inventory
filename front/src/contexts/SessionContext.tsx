import { useQuery } from '@saramorillon/hooks'
import React, { PropsWithChildren, createContext } from 'react'
import { ISession } from '../models/Session'
import { getSession } from '../services/session'

export const SessionContext = createContext<ISession | undefined>(undefined)

export function SessionProvider({ children }: PropsWithChildren<unknown>) {
  const { result: session, loading } = useQuery(getSession, { autoRun: true })

  if (loading) {
    return <div aria-busy aria-label="Loading..." />
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
