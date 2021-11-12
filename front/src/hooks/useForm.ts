import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useIdParam } from './useIdParam'

export interface IFormProps<T> {
  refresh: () => void
  saveData: (data: Partial<T>) => Promise<T>
  deleteData: (data: T) => Promise<void>
  path: { list: string; entity: (data: T) => string }
}

interface IFormActions<T> {
  onSave: (data: Partial<T>) => Promise<void>
  onDelete: (data: T) => Promise<void>
}

export function useForm<T>(props: IFormProps<T>): IFormActions<T> {
  const id = useIdParam()
  const { refresh, saveData, deleteData, path } = props

  const history = useHistory()

  const onRefresh = useCallback(
    (data) => {
      if (data.id === id) refresh()
      else history.push(path.entity(data))
    },
    [refresh, history, id]
  )

  const onSave = useCallback(
    (data) =>
      saveData(data)
        .then(onRefresh)
        .then(() => {
          toast.success('Saved!')
        }),
    [onRefresh]
  )

  const onDelete = useCallback((data) => deleteData(data).then(() => history.push(path.list)), [history])

  return { onSave, onDelete }
}
