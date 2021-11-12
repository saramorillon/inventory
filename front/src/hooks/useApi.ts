import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'

export type ApiResult<T> = [
  T,
  {
    loading: boolean
    setData: Dispatch<SetStateAction<T>>
    refresh: () => void
  }
]

export function useApi<T>(call: () => Promise<T>, defaultValue: T): ApiResult<T> {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>(defaultValue)

  const refresh = useCallback(() => {
    let mounted = true
    if (mounted) setLoading(true)
    call()
      .then((volume) => mounted && setData(volume))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [call])

  useEffect(() => refresh(), [refresh])

  return [data, { loading, setData, refresh }]
}
