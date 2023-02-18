import mockdate from 'mockdate'
import { z } from 'zod'
import { Logger } from '../../../src/libs/logger'

mockdate.set('2022-01-01T00:00:00.000Z')

describe('log', () => {
  it('should log meta, level, timestamp and message', () => {
    new Logger({ prop1: 'value1' }).log('info', 'message', { prop2: 'value2' })
    expect(console.info).toHaveBeenCalledWith(
      '{"prop1":"value1","prop2":"value2","level":"info","timestamp":"2022-01-01T00:00:00.000Z","message":"message"}'
    )
  })
})

describe('info', () => {
  it('should log as info', () => {
    const logger = new Logger({ prop1: 'value1' })
    logger.log = jest.fn()
    logger.info('message', { prop2: 'value2' })
    expect(logger.log).toHaveBeenCalledWith('info', 'message', { prop2: 'value2' })
  })
})

describe('error', () => {
  it('should log as error', () => {
    const logger = new Logger({ prop1: 'value1' })
    logger.log = jest.fn()
    logger.parseError = jest.fn().mockReturnValue('error')
    logger.error('message', new Error('500'), { prop2: 'value2' })
    expect(logger.log).toHaveBeenCalledWith('error', 'message', { error: 'error', prop2: 'value2' })
  })
})

describe('start', () => {
  it('should start action', () => {
    const logger = new Logger({ prop1: 'value1' })
    logger.info = jest.fn()
    logger.error = jest.fn()
    logger.start('message', { prop2: 'value2' })
    expect(logger.info).toHaveBeenCalledWith('message', { prop2: 'value2' })
  })

  it('should log succcess', () => {
    const logger = new Logger({ prop1: 'value1' })
    logger.info = jest.fn()
    logger.error = jest.fn()
    const { success } = logger.start('message', { prop2: 'value2' })
    success()
    expect(logger.info).toHaveBeenCalledWith('message_success', { prop2: 'value2' })
  })

  it('should log failure', () => {
    const logger = new Logger({ prop1: 'value1' })
    logger.info = jest.fn()
    logger.error = jest.fn()
    logger.parseError = jest.fn().mockReturnValue('error')
    const { failure } = logger.start('message', { prop2: 'value2' })
    failure(new Error('500'))
    expect(logger.error).toHaveBeenCalledWith('message_failure', { error: 'error', prop2: 'value2' })
  })
})

describe('parseError', () => {
  it('should return formatted error if error is a zod validation error', () => {
    const schema = z.object({ id: z.string() })
    const result = schema.safeParse({ id: 1 })
    const error = result.success ? false : new Logger().parseError(result.error)
    expect(error).toEqual({
      message: 'id: Expected string, received number',
      stack: expect.stringContaining('Expected string, received number'),
    })
  })

  it('should return message and stack if error is native', () => {
    const error = new Logger().parseError(new Error('500'))
    expect(error).toEqual({ message: '500', stack: expect.stringContaining('Error: 500') })
  })

  it('should return message if error is not native', () => {
    const error = new Logger().parseError('Toto')
    expect(error).toEqual({ message: 'Toto' })
  })
})
