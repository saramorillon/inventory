import { useParams } from 'react-router-dom'

export function useParam(name: string) {
  const { [name]: param } = useParams()
  if (!param) throw new Error(`Mandatory param ${name} was not found`)
  return param
}
