import path from 'path'
import { types } from 'util'
import { createLogger, format, transports } from 'winston'
import { name } from '../../package.json'

const dirname = path.join(__dirname, '..', '..', 'logs')

const errorFormat = format((info) => {
  return { ...info, ...parseError(info.error) }
})

function fileFormat() {
  return format.combine(errorFormat(), format.timestamp(), format.json())
}

function consoleFormat() {
  return format.combine(errorFormat(), format.timestamp(), format.colorize(), format.simple())
}

function fileTransport() {
  return new transports.File({ format: fileFormat(), dirname, filename: name, maxsize: 5242880, maxFiles: 5 })
}

function consoleTransport() {
  return new transports.Console({ format: consoleFormat() })
}

export const logger = createLogger({
  level: 'info',
  transports: [fileTransport(), consoleTransport()],
  silent: process.env.NODE_ENV === 'test',
})

function parseError(error?: unknown): { error: unknown } {
  if (types.isNativeError(error)) {
    const result: Record<string, unknown> = {}
    result.message = error.message
    result.stack = error.stack
    return { error: result }
  }
  return { error }
}
