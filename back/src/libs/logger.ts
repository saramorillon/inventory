import { types } from 'util'

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

  error(message: string, error: unknown, meta?: Record<string, unknown>): void {
    this.log('error', message, { ...meta, error: this.parseError(error) })
  }

  start(message: string, meta?: Record<string, unknown>): IAction {
    this.log('info', message, meta)

    return {
      success: () => this.log('info', message + '_success', meta),
      failure: (e) => {
        const error = this.parseError(e)
        this.log('error', message + '_failure', { ...meta, error })
        return error
      },
    }
  }

  parseError(error: unknown): { message: string; stack?: string } {
    if (types.isNativeError(error)) {
      return { message: error.message, stack: error.stack }
    }
    return { message: String(error) }
  }
}

export const appLogger = new Logger()
