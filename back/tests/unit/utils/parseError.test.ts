import { z } from 'zod'
import { parseError } from '../../../src/utils/parseError'

describe('parseError', () => {
  it('should return undefined if error is undefined', () => {
    expect(parseError()).toBeUndefined()
  })

  it('should return undefined if error is null', () => {
    expect(parseError(null)).toBeUndefined()
  })

  it('should return message and stack if error is a native error', () => {
    expect(parseError(new Error('message'))).toEqual({
      message: 'message',
      stack: expect.stringContaining('Error: message'),
    })
  })

  it('should return formatted error message and stack if error is a zod error', () => {
    const schema = z.object({ id: z.string() })
    const result = schema.safeParse({ id: 1 })
    const error = result.success ? false : parseError(result.error)
    expect(error).toEqual({
      message: 'id: Expected string, received number',
      stack: expect.stringContaining('Expected string, received number'),
    })
  })

  it('should return error as message if error is not an object', () => {
    expect(parseError('message')).toEqual({ message: 'message' })
  })

  it('should return inspected error as message if error is an object', () => {
    expect(parseError({ prop: 'value' })).toEqual({ error: "{ prop: 'value' }" })
  })
})
