import styled from 'styled-components'
import React from 'react'
import { Search } from 'react-feather'
import { Card, CardBody, CardSubtitle, CardText, CardTitle, Spinner } from 'reactstrap'

const StyledContainer = styled.div({
  minHeight: '30rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Loader = styled(Spinner)({ width: '2.75rem', height: '2.75rem', borderWidth: '0.5rem', borderRadius: '3rem' })

export function NoData(): JSX.Element {
  return (
    <StyledContainer>
      <Card outline color="light" className="text-center">
        <CardBody>
          <CardTitle>
            <Search size="3rem" />
          </CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            No data found
          </CardSubtitle>
          <CardText>Try resetting your filters</CardText>
        </CardBody>
      </Card>
    </StyledContainer>
  )
}

export function Progress(): JSX.Element {
  return (
    <StyledContainer>
      <Card outline color="light" className="text-center">
        <CardBody>
          <CardTitle>
            <Loader />
          </CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Loading
          </CardSubtitle>
          <CardText>Please wait</CardText>
        </CardBody>
      </Card>
    </StyledContainer>
  )
}
