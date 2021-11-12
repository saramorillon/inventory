import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { ApiResult, useApi } from './useApi'

type State<S> = [S, Dispatch<SetStateAction<S>>]

export function useText(defaultValue = ''): State<string> {
  return useState(defaultValue)
}

export function useSelect<T>(
  call: (params?: Record<string, unknown>) => Promise<T[]>,
  defaultValue?: T
): [...State<T | undefined>, ...ApiResult<T[]>] {
  const _call = useCallback(() => call({ lazy: true }), [])
  return [...useState(defaultValue), ...useApi(_call, [])]
}

export function useMultiSelect<T>(
  call: (params?: Record<string, unknown>) => Promise<T[]>,
  defaultValue?: T[]
): [...State<T[]>, ...ApiResult<T[]>] {
  const _call = useCallback(() => call({ lazy: true }), [])
  return [...useState(defaultValue || []), ...useApi(_call, [])]
}
