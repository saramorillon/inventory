import { IPagination } from '@saramorillon/hooks'
import React from 'react'

interface IPaginationProps {
  maxPage: number
  pagination: IPagination
}

export function Pagination({ maxPage, pagination }: IPaginationProps) {
  const { page, first, previous, next, last, canPrevious, canNext } = pagination

  return (
    <div className="center">
      <button disabled={!canPrevious} onClick={first} aria-label="First">
        ⟪
      </button>
      <button disabled={!canPrevious} onClick={previous} aria-label="Previous">
        ⟨
      </button>
      <span className="mx1">
        Page {page} of {maxPage}
      </span>
      <button disabled={!canNext} onClick={next} aria-label="Next">
        ⟩
      </button>
      <button disabled={!canNext} onClick={last} aria-label="Last">
        ⟫
      </button>
    </div>
  )
}
