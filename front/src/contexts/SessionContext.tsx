import { useFetch } from '@saramorillon/hooks'
import React, { createContext, PropsWithChildren, useContext } from 'react'
import { ISession } from '../models/Session'
import { getSession } from '../services/session'
import { LoadContainer } from '../ui/components/LoadContainer'

export const SessionContext = createContext<ISession | null>(null)

export function SessionProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [session, { loading }] = useFetch(getSession, null)

  return (
    <SessionContext.Provider value={session}>
      <LoadContainer loading={loading}>{children}</LoadContainer>
    </SessionContext.Provider>
  )
}

export function useSession(): ISession {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error('No session found')
  }
  return session
}
