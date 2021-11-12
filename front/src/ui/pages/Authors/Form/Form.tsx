import React, { FormEvent, useCallback } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Save, Trash } from 'react-feather'
import { Button, ButtonGroup, Form as BSForm, FormGroup, Input, Label } from 'reactstrap'
import { useMultiSelect, useText } from '../../../../hooks/useFields'
import { IFormProps, useForm } from '../../../../hooks/useForm'
import { IAuthor } from '../../../../models/Author'
import { deleteAuthor, putAuthor } from '../../../../services/authors'
import { getBooks } from '../../../../services/books'
import { Merge } from './Merge'

const path: IFormProps<IAuthor>['path'] = {
  list: '/authors',
  entity: (author) => `/author/${author.id}`,
}
const saveData = putAuthor
const deleteData = deleteAuthor

interface IAuthorFormProps {
  author?: IAuthor
  refresh: () => void
}

export function Form({ author, refresh }: IAuthorFormProps): JSX.Element {
  const { onDelete, onSave } = useForm({ refresh, saveData, deleteData, path })
  const [firstName, setFirstName] = useText(author?.firstName)
  const [lastName, setLastName] = useText(author?.lastName)
  const [books, setBooks, allBooks, { loading }] = useMultiSelect(getBooks, author?.books || [])

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      onSave({ ...author, firstName, lastName, books })
    },
    [onSave, author, firstName, lastName, books]
  )

  return (
    <>
      <BSForm onSubmit={onSubmit}>
        <FormGroup>
          <Label for="first-name">First name</Label>
          <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="last-name">Last name</Label>
          <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="authors">Books</Label>
          {!loading && (
            <Typeahead id="authors" multiple onChange={setBooks} options={allBooks} selected={books} labelKey="title" />
          )}
        </FormGroup>

        <ButtonGroup size="sm" className="float-right">
          <Button size="sm" color="primary" outline>
            <Save size={16} className="mb-1" /> Save
          </Button>
          {isComplete(author) && (
            <>
              <Button outline color="primary" onClick={() => onDelete(author)} type="button">
                <Trash size={16} /> Delete
              </Button>
            </>
          )}
        </ButtonGroup>
      </BSForm>
      {isComplete(author) && <Merge author={author} refresh={refresh} />}
    </>
  )
}

function isComplete(author?: Partial<IAuthor>): author is IAuthor {
  return Boolean(author?.id)
}
