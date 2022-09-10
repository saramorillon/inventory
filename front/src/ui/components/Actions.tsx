import { IconDownload, IconPlus, IconRefresh } from '@tabler/icons'
import React from 'react'

interface IActionsProps {
  add?: () => void
  refresh: () => void
  download?: () => void
}

export function Actions({ add, refresh, download }: IActionsProps) {
  return (
    <div className="right mb2">
      {add && (
        <button data-variant="outlined" className="mr1" onClick={add}>
          <IconPlus size={16} />
        </button>
      )}
      <button data-variant="outlined" className="mr1" onClick={refresh}>
        <IconRefresh size={16} />
      </button>
      {download && (
        <button data-variant="outlined" onClick={download}>
          <IconDownload size={16} />
        </button>
      )}
    </div>
  )
}
