import { useForm } from '@saramorillon/hooks'
import React, { useCallback } from 'react'
import { login } from '../../services/session'
import { Error } from '../components/Helpers'

export function Login() {
  const save = useCallback(
    ({ username, password }: { username: string; password: string }) =>
      login(username, password).then(() => {
        window.location.reload()
      }),
    [],
  )

  const { values, onChange, submit, loading, error } = useForm(save, { username: '', password: '' })

  return (
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

        <button data-variant="primary" aria-busy={loading} disabled={loading}>
          Log in
        </button>

        {Boolean(error) && (
          <span className="mx2">
            <Error message="Invalid credentials" />
          </span>
        )}
      </form>
    </article>
  )
}
