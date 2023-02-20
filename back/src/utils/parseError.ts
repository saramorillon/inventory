import { inspect } from 'util'
import { isNativeError } from 'util/types'
import { ZodError } from 'zod'

export function parseError(error?: unknown): Record<string, unknown> | undefined {
  if (!error) {
    return
  }

  if (error instanceof ZodError) {
    return {
      message: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'),
      stack: error.stack,
    }
  }

  if (isNativeError(error)) {
    return {
      message: error.message,
      stack: error.stack,
    }
  }

  if (typeof error !== 'object') {
    return {
      message: error,
    }
  }

  return {
    error: inspect(error),
  }
}
