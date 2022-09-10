import { IPagination } from '@saramorillon/hooks'
import React, { Dispatch, SetStateAction, useEffect } from 'react'

interface IPaginationProps {
  maxPage: number
  pagination: IPagination
  limit: number
  setLimit: Dispatch<SetStateAction<number>>
}

export function Pagination({ maxPage, pagination, limit, setLimit }: IPaginationProps) {
  const { page, first, previous, next, last, canPrevious, canNext, goTo } = pagination

  useEffect(() => {
    goTo(1)
  }, [limit, goTo])

  return (
    <div className="right-align mt1">
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
      <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
        <option value={10}>10 rows</option>
        <option value={20}>20 rows</option>
        <option value={50}>50 rows</option>
        <option value={100}>100 rows</option>
      </select>
    </div>
  )
}
