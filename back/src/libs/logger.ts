import { types } from 'util'
import { ZodError } from 'zod'

interface IAction {
  success: () => void
  failure: (error: unknown) => { message: string; stack?: string }
}

export class Logger {
  constructor(private meta?: Record<string, unknown>) {}

  log(level: 'info' | 'error', message: string, meta?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString()
    console[level](JSON.stringify({ ...this.meta, ...meta, level, timestamp, message }))
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta)
  }

  error(message: string, error: unknown, meta?: Record<string, unknown>): { message: string; stack?: string } {
    const e = this.parseError(error)
    this.log('error', message, { ...meta, error: e })
    return e
  }

  start(message: string, meta?: Record<string, unknown>): IAction {
    this.info(message, meta)

    return {
      success: () => this.info(message + '_success', meta),
      failure: (error) => this.error(message + '_failure', error, meta),
    }
  }

  parseError(error: unknown): { message: string; stack?: string } {
    if (error instanceof ZodError) {
      return {
        message: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'),
        stack: error.stack,
      }
    }
    if (types.isNativeError(error)) {
      return { message: error.message, stack: error.stack }
    }
    return { message: String(error) }
  }
}

export const appLogger = new Logger()
