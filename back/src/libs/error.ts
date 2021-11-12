import { types } from 'util'
import axios from 'axios'

export function parseError(error: unknown): { error: string } {
  if (types.isNativeError(error) || axios.isAxiosError(error)) return { error: error.message }
  return { error: 'Unknown error' }
}
