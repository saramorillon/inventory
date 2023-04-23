import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useTypeahead } from '../../../src/hooks/useTypeahead'

describe('useTypeahead', () => {
  const options = [{ id: 1 }, { id: 2 }]
  const values = [{ id: 1 }]

  it('should return filtered options', () => {
    const { result } = renderHook(() => useTypeahead(options, values, jest.fn()))
    expect(result.current[0]).toEqual([{ id: 2 }])
  })

  it('should not add an option if native event is input event', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => useTypeahead(options, values, onChange))
    act(() => {
      result.current[1]({ nativeEvent: new InputEvent('type') } as never)
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should add an option', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => useTypeahead(options, values, onChange))
    act(() => {
      result.current[1]({ target: { value: '2' } } as never)
    })
    expect(onChange).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }])
  })

  it('should remove an option', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => useTypeahead(options, values, onChange))
    act(() => {
      result.current[2]({ id: 1 })
    })
    expect(onChange).toHaveBeenCalledWith([])
  })
})
