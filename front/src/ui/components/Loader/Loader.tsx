import React, { PropsWithChildren } from "react"
import { Spinner } from "reactstrap"
import styled from "styled-components"

const Container = styled.div(
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  (props: ILoadProps) => ({
    ...(props.absolute && {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }),
  })
)

interface ILoadProps {
  absolute?: boolean
}

export function Loader({ absolute }: ILoadProps): JSX.Element {
  return (
    <Container absolute={absolute}>
      <Spinner />
    </Container>
  )
}

export function LoadContainer({
  loading,
  children,
  ...props
}: PropsWithChildren<ILoadProps & { loading: boolean }>): JSX.Element {
  if (loading) {
    return <Loader {...props} />
  }

  return <>{children}</>
}
