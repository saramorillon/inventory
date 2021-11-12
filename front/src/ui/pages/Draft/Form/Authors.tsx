import React, { useMemo } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import { fullName, IAuthor } from '../../../../models/Author'

interface IAuthorProps {
  author: string
  authors: IAuthor[]
  onAdd: (author: Partial<IAuthor>) => void
  onRemove: (author: IAuthor) => void
}

export function Author({ author, authors, onAdd, onRemove }: IAuthorProps): JSX.Element {
  const possibilities: [string, string][] = []

  if (author.includes(',')) {
    const [part1 = '', part2 = ''] = author.split(/,\s*/)
    possibilities.push([part1.toUpperCase(), part2])
    possibilities.push([part2.toUpperCase(), part1])
  } else {
    const [part1 = '', part2 = ''] = author.split(/\s+/)
    possibilities.push([part1.toUpperCase(), part2])
    possibilities.push([part2.toUpperCase(), part1])
  }

  return (
    <div className="d-flex flex-wrap">
      {possibilities.map((possibility, key) => (
        <Possibility key={key} possibility={possibility} authors={authors} onAdd={onAdd} onRemove={onRemove} />
      ))}
    </div>
  )
}

interface IPossibilityProps {
  possibility: [string, string]
  authors: IAuthor[]
  onAdd: (author: Partial<IAuthor>) => void
  onRemove: (author: IAuthor) => void
}

function Possibility({ possibility, authors, onAdd, onRemove }: IPossibilityProps): JSX.Element | null {
  const author = useMemo(
    () => authors.find(({ firstName, lastName }) => firstName === possibility[1] && lastName === possibility[0]),
    [authors, possibility]
  )
  const maybeAuthor: Partial<IAuthor> = { firstName: possibility[1], lastName: possibility[0] }

  return (
    <FormGroup check className="mr-2">
      <Label check>
        <Input
          type="checkbox"
          defaultChecked={Boolean(author)}
          onChange={() => (author ? onRemove(author) : onAdd(maybeAuthor))}
        />
        {fullName(author || maybeAuthor)}
      </Label>
    </FormGroup>
  )
}
