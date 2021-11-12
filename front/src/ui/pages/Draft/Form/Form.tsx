import React, { FormEvent, useCallback, useMemo, useState } from 'react'
import { Save } from 'react-feather'
import { useHistory } from 'react-router'
import { Button, ButtonGroup, Form as BSForm, FormGroup, Input, Label } from 'reactstrap'
import { useText } from '../../../../hooks/useFields'
import { IAuthor } from '../../../../models/Author'
import { IDraft } from '../../../../models/Draft'
import { putAuthor } from '../../../../services/authors'
import { putBook } from '../../../../services/books'
import { deleteDraft } from '../../../../services/drafts'
import { Author } from './Authors'

interface IDraftFormProps {
  draft: IDraft
}

export function Form({ draft }: IDraftFormProps): JSX.Element {
  const history = useHistory()
  const source = useMemo(() => draft.source, [draft])
  const [serial, setSerial] = useText(draft.serial)
  const [title, setTitle] = useText(draft.title)
  const [subtitle, setSubtitle] = useText('')
  const [authors, setAuthors] = useState<IAuthor[]>([])

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      putBook({ serial, title, subtitle, authors, source }).then(({ id }) => {
        history.push(`/book/${id}`)
        deleteDraft(draft)
      })
    },
    [serial, title, subtitle, authors, source, history, draft]
  )

  const onAuthorAdd = useCallback((author: Partial<IAuthor>) => {
    putAuthor(author).then((author) => setAuthors((authors) => [...authors, author]))
  }, [])

  const onAuthorRemove = useCallback((author: IAuthor) => {
    setAuthors((authors) => authors.filter(({ id }) => id !== author.id))
  }, [])

  return (
    <>
      <BSForm onSubmit={onSubmit} className="clearfix">
        <FormGroup>
          <Label for="source">Source</Label>
          <Input id="source" value={draft.source || 'manual'} required disabled />
        </FormGroup>

        <FormGroup>
          <Label for="serial">Serial</Label>
          <Input id="serial" value={serial} onChange={(e) => setSerial(e.target.value)} required />
        </FormGroup>

        <FormGroup>
          <Label for="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="subtitle">Subtitle</Label>
          <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="drafts">Authors ({authors.length})</Label>
          {(draft.authors || '').split(' | ').map((author) => (
            <Author key={author} author={author} authors={authors} onAdd={onAuthorAdd} onRemove={onAuthorRemove} />
          ))}
        </FormGroup>

        <ButtonGroup size="sm" className="float-right">
          <Button size="sm" color="primary" outline>
            <Save size={16} className="mb-1" /> Save
          </Button>
        </ButtonGroup>
      </BSForm>
    </>
  )
}
