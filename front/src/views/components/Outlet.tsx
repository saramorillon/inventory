import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext'
import { Footer } from './Footer'
import { Header } from './Header'

export function PublicOutlet() {
  const session = useContext(SessionContext)
  if (session) return <Navigate to="/" />
  return (
    <>
      <main className="mx-auto max-width-2" style={{ minHeight: 'calc(100vh - 162px - 96px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export function PrivateOutlet() {
  const session = useContext(SessionContext)
  if (!session) return <Navigate to="/login" />
  return (
    <>
      <Header />
      <main className="mx-auto" style={{ minHeight: 'calc(100vh - 162px - 96px - 55px)', overflowX: 'auto' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
