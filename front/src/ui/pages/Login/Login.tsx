import React, { FormEvent, useState } from 'react'
import { Button, Card, CardBody, Form, FormGroup, Input, Label } from 'reactstrap'
import styled from 'styled-components'
import { login } from '../../../services/session'

const Container = styled.div({
  width: '30rem',
  padding: '2rem',
  margin: 'auto',
})

export function Login(): JSX.Element {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login(username, password).then(() => {
      window.location.reload()
    })
  }

  return (
    <Container>
      <Card>
        <CardBody>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                id="username"
                autoFocus
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>

            <Button type="submit" color="primary">
              Log in
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  )
}
