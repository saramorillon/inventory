import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { Download, Plus, RefreshCcw, Upload } from 'react-feather'
import { NavLink } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Spinner,
} from 'reactstrap'
import { io } from 'socket.io-client'
import styled from 'styled-components'
import { config } from '../../../config'
import { useDownloadQuery } from '../../../hooks/useDownloadQuery'
import { useScroll } from '../../../hooks/useScroll'

const StickyDiv = styled.div(
  {
    top: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'white',
    float: 'right',
  },
  ({ sticky }: { sticky: boolean }) => sticky && { position: 'sticky', padding: '1rem' }
)

interface IButtonsProps {
  onRefresh: () => void
  onUpload: (file: File) => void
  addLink: string
  dowloadLink: string
  eventName: string
  tableName: string
}

export function Actions({
  onRefresh,
  onUpload,
  eventName,
  addLink,
  dowloadLink,
  tableName,
}: IButtonsProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File>()
  const [progress, setProgress] = useState('0')
  const query = useDownloadQuery(tableName)
  const { y } = useScroll()

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!file) return
      onUpload(file)
      const socket = io(config.api)
      socket.on(eventName, (progress: number) => {
        setProgress((progress * 100).toFixed(2))
        if (progress === 1) {
          socket.disconnect()
          onRefresh()
          setProgress('0')
        }
      })
    },
    [file, onRefresh, eventName, onUpload]
  )

  useEffect(() => {
    if (progress === '0') setOpen((open) => (open ? false : open))
  }, [progress])

  return (
    <StickyDiv sticky={y > 0}>
      <ButtonGroup size="sm" className="mb-3">
        <Button tag={NavLink} color="primary" outline to={addLink}>
          <Plus size={16} className="mb-1" /> Add data
        </Button>
        <Button color="primary" outline onClick={onRefresh}>
          <RefreshCcw size={16} className="mb-1" /> Refresh data
        </Button>
        <Button tag="a" outline color="primary" href={`${dowloadLink}?${query}`}>
          <Download size={16} /> Download CSV
        </Button>
        <Button outline color="primary" onClick={() => setOpen(true)}>
          <Upload size={16} /> Upload CSV
        </Button>
      </ButtonGroup>
      {open && (
        <Modal isOpen toggle={() => setOpen((open) => !open)}>
          <Form onSubmit={onSubmit}>
            <ModalHeader>Chose a file to upload</ModalHeader>

            <ModalBody>
              <Input id="file" type="file" required onChange={(e) => setFile(e.target.files?.[0])} accept=".csv" />
              <Progress value={progress} max={100} className="mt-3" />
            </ModalBody>
            <ModalFooter>
              <ButtonGroup size="sm" className="float-right">
                <UploadButton progress={progress} />
              </ButtonGroup>
            </ModalFooter>
          </Form>
        </Modal>
      )}
    </StickyDiv>
  )
}

function UploadButton({ progress }: { progress: string }) {
  if (progress === '0')
    return (
      <Button size="sm" color="primary" outline>
        <Upload size={16} className="mb-1" /> Upload CSV
      </Button>
    )
  return (
    <Button size="sm" color="primary" outline disabled>
      <Spinner size="sm" /> Upload CSV {progress}%
    </Button>
  )
}
