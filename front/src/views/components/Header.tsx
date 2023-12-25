import { IconLogout } from '@tabler/icons-react'
import React from 'react'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <>
      <nav aria-label="Main">
        <Link to="/">
          <img src="/favicon.svg" height={16} alt="" /> <strong>Inventory</strong>
        </Link>

        <Link to="/books">Books</Link>

        <Link to="/authors">Authors</Link>

        <a href="/api/logout" className="ml-auto">
          <IconLogout /> Log out
        </a>
      </nav>
      <header />
    </>
  )
}
