import React, { FormEvent, useState } from 'react'
import { login } from '../../services/session'

export function Login(): JSX.Element {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login(username, password)
      .then(() => {
        window.location.reload()
      })
      .catch(console.error)
  }

  return (
    <main className="max-width-2 mx-auto my4">
      <article>
        <form onSubmit={onSubmit}>
          <label>
            Username *
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>

          <label>
            Password *
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <button data-variant="primary">Log in</button>
        </form>
      </article>
    </main>
  )
}
