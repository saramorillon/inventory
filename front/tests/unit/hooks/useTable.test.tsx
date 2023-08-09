import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { describe, expect, it } from 'vitest'
import { useTable } from '../../../src/hooks/useTable'

describe('useTable', () => {
  it('should return paginated rows', () => {
    const { result } = renderHook(() => useTable(['b', 'a', 'c'], 2))
    expect(result.current.rows).toEqual(['b', 'a'])
  })

  it('should return max page', () => {
    const { result } = renderHook(() => useTable(['b', 'a', 'c'], 2))
    expect(result.current.maxPage).toBe(2)
  })

  it('should return pagination', () => {
    const { result } = renderHook(() => useTable(['b', 'a', 'c'], 2))
    expect(result.current.pagination).toEqual({
      page: 1,
      canPrevious: false,
      canNext: true,
      first: expect.any(Function),
      previous: expect.any(Function),
      goTo: expect.any(Function),
      next: expect.any(Function),
      last: expect.any(Function),
    })
  })

  it('should change sort', () => {
    const { result } = renderHook(() => useTable(['b', 'a', 'c'], 3))
    act(() => result.current.onSort(0, (a, b) => a.localeCompare(b)))
    expect(result.current.rows).toEqual(['a', 'b', 'c'])
  })

  it('should change filter', () => {
    const { result } = renderHook(() => useTable(['b', 'a', 'c'], 3))
    act(() => result.current.onFilter(0, (a) => a < 'c'))
    expect(result.current.rows).toEqual(['b', 'a'])
  })
})
