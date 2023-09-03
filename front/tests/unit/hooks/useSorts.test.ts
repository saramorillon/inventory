import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useSorts } from '../../../src/hooks/useSorts'

describe('useSorts', () => {
  it('should return default sorts', () => {
    const { result } = renderHook(() => useSorts())
    expect(result.current.sorts).toEqual([])
  })

  it('should set sort at index', () => {
    const { result } = renderHook(() => useSorts())
    const fn = vi.fn()
    act(() => result.current.onSort(2, fn))
    expect(result.current.sorts).toEqual([{ index: 2, fn }])
  })
})
