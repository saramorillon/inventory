import React, { useContext } from 'react'
import { NavLink as Link } from 'react-router-dom'
import { Jumbotron, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap'
import { HeaderContext } from '../contexts/HeaderContext'

export function Header(): JSX.Element {
  const { title, subtitle } = useContext(HeaderContext)

  return (
    <header>
      <Navbar color="primary" dark expand="md">
        <NavbarBrand href="/">Inventory</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/books">
              Books
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/authors">
              Authors
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/drafts">
              Add book
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Jumbotron>
        <h1>{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
      </Jumbotron>
    </header>
  )
}
