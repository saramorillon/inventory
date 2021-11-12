import React, { FormEvent, useCallback, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Save, Search, Trash } from 'react-feather'
import { Button, ButtonGroup, Form as BSForm, FormGroup, Input, Label } from 'reactstrap'
import { useMultiSelect, useText } from '../../../../hooks/useFields'
import { IFormProps, useForm } from '../../../../hooks/useForm'
import { fullName } from '../../../../models/Author'
import { IBook } from '../../../../models/Book'
import { getAuthors } from '../../../../services/authors'
import { deleteBook, putBook } from '../../../../services/books'
import { BarCode } from './BarCode'
import { Compare } from './Compare'

const path: IFormProps<IBook>['path'] = {
  list: '/books',
  entity: (book) => `/book/${book.id}`,
}
const saveData = putBook
const deleteData = deleteBook

interface IBookFormProps {
  book?: IBook
  refresh: () => void
}

export function Form({ book, refresh }: IBookFormProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [serial, setSerial] = useText(book?.serial)
  const [title, setTitle] = useText(book?.title)
  const [subtitle, setSubtitle] = useText(book?.subtitle || undefined)
  const [authors, setAuthors, allAuthors, { loading: loadingAuthors }] = useMultiSelect(getAuthors, book?.authors)
  const { onDelete, onSave } = useForm({ refresh, saveData, deleteData, path })

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      onSave({ ...book, serial, title, subtitle, authors, source: book?.source || '' })
    },
    [serial, title, subtitle, authors, book, onSave]
  )

  return (
    <>
      <BSForm onSubmit={onSubmit} className="clearfix">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <FormGroup>
              <Label for="source">Source</Label>
              <Input id="source" value={book?.source || 'manual'} required disabled />
            </FormGroup>

            <FormGroup>
              <Label for="serial">Serial</Label>
              <Input id="serial" value={serial} onChange={(e) => setSerial(e.target.value)} required />
            </FormGroup>
          </div>
          {book && <BarCode serial={book?.serial} />}
        </div>

        <FormGroup>
          <Label for="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormGroup>

        <FormGroup>
          <Label for="subtitle">Subtitle</Label>
          <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="books">Authors ({authors.length})</Label>
          {!loadingAuthors && (
            <Typeahead
              id="books"
              multiple
              onChange={setAuthors}
              options={allAuthors}
              selected={authors}
              labelKey={fullName}
            />
          )}
        </FormGroup>

        <ButtonGroup size="sm" className="float-right">
          <Button size="sm" color="primary" outline>
            <Save size={16} className="mb-1" /> Save
          </Button>
          {isComplete(book) && (
            <>
              <Button outline color="primary" onClick={() => onDelete(book)} type="button">
                <Trash size={16} /> Delete
              </Button>
              <Button size="sm" color="primary" outline type="button" onClick={() => setOpen(true)}>
                <Search size={16} className="mb-1" /> Compare
              </Button>
            </>
          )}
        </ButtonGroup>
      </BSForm>
      {open && isComplete(book) && <Compare book={book} />}
      {book?.serial && (
        <iframe src={`https://www.google.com/search?q=${book.serial}&igu=1`} width="100%" height="400" />
      )}
    </>
  )
}

function isComplete(book?: Partial<IBook>): book is IBook {
  return Boolean(book?.id)
}
