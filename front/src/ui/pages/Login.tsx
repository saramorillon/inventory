import { useForm } from '@saramorillon/hooks'
import React, { useCallback } from 'react'
import { login } from '../../services/session'
import { Error } from '../components/Helpers'

export function Login(): JSX.Element {
  const save = useCallback(
    ({ username, password }: { username: string; password: string }) =>
      login(username, password).then(() => {
        window.location.reload()
      }),
    []
  )

  const { values, onChange, submit, loading, error } = useForm(save, { username: '', password: '' })

  return (
    <main className="max-width-2 mx-auto my4">
      <article>
        <form onSubmit={submit}>
          <label>
            Username *
            <input value={values.username} onChange={(e) => onChange('username', e.target.value)} required />
          </label>

          <label>
            Password *
            <input
              type="password"
              value={values.password}
              onChange={(e) => onChange('password', e.target.value)}
              required
            />
          </label>

          <div className="flex items-center">
            <button data-variant="primary" aria-busy={loading} disabled={loading}>
              Log in
            </button>

            <div className="ml2">{Boolean(error) && <Error message="Invalid credentials" />}</div>
          </div>
        </form>
      </article>
    </main>
  )
}
