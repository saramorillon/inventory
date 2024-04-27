import { inspect } from 'node:util'
import { isNativeError } from 'node:util/types'
import { ZodError, type ZodIssue } from 'zod'

function parseZodIssue(issue: ZodIssue): string {
  if (issue.code === 'invalid_union') {
    return issue.unionErrors.flatMap((error) => error.issues.map(parseZodIssue).join(', ')).join(' OR ')
  }
  return `${issue.path.join('.')}: ${issue.message}`
}

export function parseError(error?: unknown): Record<string, unknown> | undefined {
  if (!error) {
    return
  }

  if (error instanceof ZodError) {
    return {
      message: error.issues.map(parseZodIssue).join(', '),
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
