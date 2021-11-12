import { IDraft } from '../models/Draft'
import { Axios } from './Axios'

export async function getDrafts(params?: Record<string, unknown>): Promise<IDraft[]> {
  return Axios.get('/api/drafts', { params })
}

export async function getDraft(id?: number): Promise<IDraft | undefined> {
  if (!id) return
  return Axios.get(`/api/drafts/${id}`)
}

export async function putDraft(serial: string): Promise<IDraft> {
  return Axios.put(`/api/drafts/${serial}`)
}

export async function deleteDraft(draft: IDraft): Promise<void> {
  return Axios.delete(`/api/drafts/${draft.serial}`)
}
