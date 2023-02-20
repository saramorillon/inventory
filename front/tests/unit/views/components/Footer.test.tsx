import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { getApp } from '../../../../src/services/app'
import { Footer } from '../../../../src/views/components/Footer'
import { mockApp, wait } from '../../../mocks'

jest.mock('../../../../src/services/app')

mockdate.set('2022')

describe('Footer', () => {
  beforeEach(() => {
    jest.mocked(getApp).mockResolvedValue(mockApp())
  })

  it('should fetch app', async () => {
    render(<Footer />)
    await wait()
    expect(getApp).toHaveBeenCalled()
  })

  it('should render nothing if no app', async () => {
    const { container } = render(<Footer />)
    expect(container).toBeEmptyDOMElement()
    await wait()
  })

  it('should render app name', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('should render app version, author name and current year', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('vversion © author name 2022')).toBeInTheDocument()
  })

  it('should render repository url', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('repository url')).toHaveAttribute('href', 'repository url')
  })

  it('should render author url', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('author url')).toHaveAttribute('href', 'author url')
  })
})
