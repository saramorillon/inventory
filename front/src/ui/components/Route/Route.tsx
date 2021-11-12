import React, { useContext } from 'react'
import { Redirect, RedirectProps, Route, RouteProps, useLocation } from 'react-router-dom'
import { SessionContext } from '../../../contexts/SessionContext'

function redirectProps(props: RouteProps, to: string): RedirectProps {
  const path = Array.isArray(props.path) ? props.path[0] : props.path
  return { exact: props.exact, strict: props.strict, path, to }
}

export function PrivateRoute(props: RouteProps): JSX.Element {
  const session = useContext(SessionContext)
  if (session) {
    return <Route {...props} />
  }
  return <Redirect {...redirectProps(props, '/login')} />
}

export function PublicRoute(props: RouteProps): JSX.Element {
  const session = useContext(SessionContext)
  const { pathname } = useLocation()
  if (!session) {
    return <Route {...props} />
  }
  return <Redirect {...redirectProps(props, props.path === pathname ? '/' : pathname)} />
}
