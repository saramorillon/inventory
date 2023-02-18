import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext'
import { Login } from '../pages/Login'
import { Footer } from './Footer'
import { Header } from './Header'

export function PublicOutlet(): JSX.Element {
  const session = useContext(SessionContext)
  if (session) return <Navigate to="/" />
  return <Login />
}

export function PrivateOutlet(): JSX.Element {
  const session = useContext(SessionContext)
  if (!session) return <Navigate to="/login" />
  return (
    <>
      <Header />
      <main className="mx-auto flex-auto" style={{ minHeight: 'calc(100vh - 555px)', overflowX: 'auto' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
