import React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Container } from 'reactstrap'
import { HeaderProvider } from '../contexts/HeaderContext'
import { SessionProvider } from '../contexts/SessionContext'
import { TableProvider } from '../contexts/TableContext'
import { PrivateRoute, PublicRoute } from './components/Route/Route'
import { Header } from './Header'
import { Author } from './pages/Authors/Author'
import { Authors } from './pages/Authors/Authors'
import { Book } from './pages/Books/Book'
import { Books } from './pages/Books/Books'
import { Draft } from './pages/Draft/Draft'
import { Drafts } from './pages/Draft/Drafts'
import { Login } from './pages/Login/Login'

export function App(): JSX.Element | null {
  return (
    <BrowserRouter>
      <Switch>
        <SessionProvider>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute>
            <TableProvider>
              <HeaderProvider>
                <Header />
                <Container>
                  <ToastContainer />
                  <Switch>
                    <PrivateRoute exact path="/books" component={Books} />
                    <PrivateRoute exact path="/book/:id" component={Book} />
                    <PrivateRoute exact path="/authors" component={Authors} />
                    <PrivateRoute exact path="/author/:id?" component={Author} />
                    <PrivateRoute exact path="/drafts" component={Drafts} />
                    <PrivateRoute exact path="/draft/:id" component={Draft} />
                    <Redirect to="/books" />
                  </Switch>
                </Container>
              </HeaderProvider>
            </TableProvider>
          </PrivateRoute>
        </SessionProvider>
      </Switch>
    </BrowserRouter>
  )
}
