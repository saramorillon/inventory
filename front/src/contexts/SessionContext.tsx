import React, { createContext, PropsWithChildren, useContext } from 'react'
import { useApi } from '../hooks/useApi'
import { ISession } from '../models/Session'
import { getSession } from '../services/session'
import { LoadContainer } from '../ui/components/Loader/Loader'

export const SessionContext = createContext<ISession | null>(null)

export function SessionProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [session, { loading }] = useApi<ISession | null>(getSession, null)

  return (
    <SessionContext.Provider value={session}>
      <LoadContainer loading={loading} absolute>
        {children}
      </LoadContainer>
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
