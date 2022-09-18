import { IconLogout } from '@tabler/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../services/session'

export function Header(): JSX.Element {
  return (
    <>
      <nav aria-label="Main">
        <Link to={'/'}>
          <img src="/favicon.svg" height={16} /> <strong>Mini Board</strong>
        </Link>

        <Link to="/books">Books</Link>

        <Link to="/authors">Authors</Link>

        <button onClick={logout} className="ml-auto">
          <IconLogout /> Log out
        </button>
      </nav>
      <header></header>
    </>
  )
}
