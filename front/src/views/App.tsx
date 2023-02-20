import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider } from '../contexts/SessionContext'
import { PrivateOutlet, PublicOutlet } from './components/Outlet'
import { Author } from './pages/Author'
import { Authors } from './pages/Authors'
import { Book } from './pages/Book'
import { Books } from './pages/Books'
import { Login } from './pages/Login'

export function App(): JSX.Element | null {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicOutlet />}>
            <Route index element={<Login />} />
          </Route>

          <Route element={<PrivateOutlet />}>
            <Route path="/books" element={<Books />} />
            <Route path="/book/:id" element={<Book />} />

            <Route path="/authors" element={<Authors />} />
            <Route path="/author" element={<Author />} />
            <Route path="/author/:id" element={<Author />} />
          </Route>

          <Route path="*" element={<Navigate to="/books" />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}
