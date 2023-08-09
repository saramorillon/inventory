import { renderHook } from '@testing-library/react'
import { useParams } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useParam } from '../../../src/hooks/useParam'

describe('useParam', () => {
  it('should throw if param if not found', () => {
    vi.mocked(useParams).mockReturnValue({})
    expect(() => renderHook(() => useParam('id'))).toThrow()
  })

  it('should return param', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' })
    const { result } = renderHook(() => useParam('id'))
    expect(result.current).toBe('1')
  })
})
