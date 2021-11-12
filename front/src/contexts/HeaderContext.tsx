import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'

type HeaderContext = {
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  subtitle: string | undefined
  setSubtitle: Dispatch<SetStateAction<string | undefined>>
}

export const HeaderContext = createContext<HeaderContext>({
  title: '',
  setTitle: () => undefined,
  subtitle: '',
  setSubtitle: () => undefined,
})

export function HeaderProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [title, setTitle] = useState<string>('')
  const [subtitle, setSubtitle] = useState<string>()

  return <HeaderContext.Provider value={{ title, setTitle, subtitle, setSubtitle }}>{children}</HeaderContext.Provider>
}
