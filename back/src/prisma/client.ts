import { Prisma, PrismaClient } from '@prisma/client'
// import capitalize from 'capitalize'

export const prisma = new PrismaClient()

const changeActions: Prisma.PrismaAction[] = [
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
]

prisma.$use(async (params, next) => {
  if (changeActions.includes(params.action)) {
    if (params.model === 'Author') recurse(params.args, authorHook)
    else if (params.model === 'Book') recurse(params.args, bookHook)
  }
  return next(params)
})

function recurse(args: unknown, transform: (key: string, value: unknown) => unknown) {
  if (!isRecord(args)) return
  for (const key of Object.keys(args)) {
    args[key] = transform(key, args[key])
    recurse(args[key], transform)
  }
}

function isRecord(args: unknown): args is Record<string, unknown> {
  return typeof args === 'object' && args !== null
}

function authorHook(key: string, value: unknown) {
  if (key === 'lastName') return String(value).toUpperCase()
  return value
}

function bookHook(key: string, value: unknown) {
  if (key === 'title' || key === 'subtitle') return sanitize(String(value || ''))
  return value
}

function sanitize(value?: string) {
  if (!value) return
  const result: string[] = []
  for (let i = 0; i < value.length; i++) {
    const isFirstChar = i === 0 || (value[i - 1] === ' ' && [':', '.'].includes(value[i - 2]))
    const isAfterSingleQuote = value[i - 1] === "'" && value[i + 1] !== ' '
    const isAfterSpace = value[i - 1] === ' ' && value[i + 1] !== "'"
    if (isFirstChar || isAfterSingleQuote || isAfterSpace) result[i] = value[i].toUpperCase()
    else result[i] = value[i].toLowerCase()
  }
  return result
    .join('')
    .replace(/^Tome 0(\d+)/i, 'Tome $1')
    .replace(/\s*:\s*/, ' : ')
}
