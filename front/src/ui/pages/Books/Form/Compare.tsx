import React, { useCallback } from 'react'
import { Badge, ListGroup, ListGroupItem } from 'reactstrap'
import { useApi } from '../../../../hooks/useApi'
import { IBook } from '../../../../models/Book'
import { compareBooks } from '../../../../services/books'
import { LoadContainer } from '../../../components/Loader/Loader'

interface ICompareProps {
  book: IBook
}

export function Compare({ book }: ICompareProps): JSX.Element {
  const call = useCallback(() => compareBooks(book.serial), [book.serial])
  const [results, { loading }] = useApi(call, [])

  return (
    <LoadContainer loading={loading}>
      <ListGroup>
        {results.map(({ title, authors, source }) => (
          <ListGroupItem key={source}>
            <Badge color="primary">{source}</Badge> {title} - {authors}
          </ListGroupItem>
        ))}
      </ListGroup>
    </LoadContainer>
  )
}
