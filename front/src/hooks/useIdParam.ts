import { useParams } from 'react-router-dom'

export function useIdParam(): number | undefined {
  const { id } = useParams<{ id?: string }>()
  if (id) return Number(id)
}
