import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useRefresh<T>(refresh: () => void, getPath: (data: T) => string) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (data: T) => {
      if (pathname === getPath(data)) {
        refresh()
      } else {
        navigate(getPath(data))
      }
    },
    [pathname, refresh, getPath, navigate],
  )
}
