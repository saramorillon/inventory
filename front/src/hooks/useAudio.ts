import { useMemo } from 'react'

export function useAudio(): { error: HTMLAudioElement; success: HTMLAudioElement } {
  const error = useMemo(() => new Audio('/Buzzer1.ogg'), [])
  const success = useMemo(() => new Audio('/Decision2.ogg'), [])

  return { error, success }
}
