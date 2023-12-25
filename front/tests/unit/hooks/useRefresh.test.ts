import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useLocation } from 'react-router-dom'
import { useRefresh } from '../../../src/hooks/useRefresh'
import { mockNavigate } from '../../mocks'

describe('useRefresh', () => {
  it('should call refresh function when path is identical to current path', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: 'path' } as never)
    const refresh = vi.fn()
    const { result } = renderHook(() => useRefresh(refresh, vi.fn().mockReturnValue('path')))
    act(() => result.current({}))
    expect(refresh).toHaveBeenCalled()
  })

  it('should navigate to path when path is different from current path', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: '' } as never)
    const navigate = mockNavigate()
    const { result } = renderHook(() => useRefresh(vi.fn(), vi.fn().mockReturnValue('path')))
    act(() => result.current({}))
    expect(navigate).toHaveBeenCalledWith('path')
  })
})
