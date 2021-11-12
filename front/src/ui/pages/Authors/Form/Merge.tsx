import React, { FormEvent, useCallback, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { GitMerge, Save } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useApi } from '../../../../hooks/useApi'
import { fullName, IAuthor } from '../../../../models/Author'
import { getAuthors, mergeAuthors } from '../../../../services/authors'

interface IMergeProps {
  author: IAuthor
  refresh: () => void
}

export function Merge(props: IMergeProps): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" color="primary" outline type="button" onClick={() => setOpen(true)}>
        <GitMerge size={16} className="mb-1" /> Merge
      </Button>
      {open && <MergeModal {...props} toggle={() => setOpen((open) => !open)} />}
    </>
  )
}

interface IMergeModalProps extends IMergeProps {
  toggle: () => void
}

function MergeModal({ author, refresh, toggle }: IMergeModalProps): JSX.Element {
  const history = useHistory()
  const call = useCallback(() => getAuthors(), [])
  const [allAuthors, { loading }] = useApi(call, [])
  const [authors, setAuthors] = useState<IAuthor[]>([])

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      mergeAuthors([author, ...authors]).then((id) => {
        if (id === author.id) refresh()
        else history.push(`/author/${id}`)
      })
    },
    [author, authors, history, refresh]
  )

  return (
    <Modal isOpen toggle={toggle} size="lg">
      <Form onSubmit={onSubmit}>
        <ModalHeader>Chose authors to merge</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label for="authors">Authors</Label>
            {!loading && (
              <Typeahead
                id="authors"
                multiple
                onChange={setAuthors}
                options={allAuthors.filter(({ id }) => id !== author.id)}
                selected={authors}
                labelKey={(author) => fullName(author)}
              />
            )}
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size="sm" className="float-right">
            <Button size="sm" color="primary" outline>
              <Save size={16} className="mb-1" /> Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Form>
    </Modal>
  )
}
