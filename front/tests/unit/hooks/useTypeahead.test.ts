import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useTypeahead } from '../../../src/hooks/useTypeahead'

describe('useTypeahead', () => {
  const options = [{ id: 1 }, { id: 2 }]
  const values = [{ id: 1 }]

  it('should return filtered options', () => {
    const { result } = renderHook(() => useTypeahead(options, values, vi.fn()))
    expect(result.current.options).toEqual([{ id: 2 }])
  })

  it('should add an option', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useTypeahead(options, values, onChange))
    act(() => {
      result.current.add({ target: { value: '2' } } as never)
    })
    expect(onChange).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }])
  })

  it('should remove an option', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useTypeahead(options, values, onChange))
    act(() => {
      result.current.remove({ id: 1 })
    })
    expect(onChange).toHaveBeenCalledWith([])
  })
})
