import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useFilters } from '../../../src/hooks/useFilters'

describe('useFilters', () => {
  it('should return default filters', () => {
    const { result } = renderHook(() => useFilters())
    expect(result.current.filters).toEqual([])
  })

  it('should set filter at index', () => {
    const { result } = renderHook(() => useFilters())
    const fn = vi.fn()
    act(() => result.current.onFilter(2, fn))
    expect(result.current.filters).toEqual([undefined, undefined, fn])
  })
})
