import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useFilters } from '../../../src/hooks/useFilters'

describe('useFilters', () => {
  it('should return default filters', () => {
    const { result } = renderHook(() => useFilters())
    expect(result.current[0]).toEqual([])
  })

  it('should set filter at index', () => {
    const { result } = renderHook(() => useFilters())
    const fn = vi.fn()
    act(() => result.current[1](2, fn))
    expect(result.current[0]).toEqual([undefined, undefined, fn])
  })
})
