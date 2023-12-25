import { render, screen } from '@testing-library/react'
import { useBarcode } from 'next-barcode'
import React from 'react'
import { BarCode } from '../../../../src/views/components/BarCode'
import { wait } from '../../../mocks'

vi.mock('next-barcode')

describe('BarCode', () => {
  it('should render bar code', async () => {
    vi.mocked(useBarcode).mockReturnValue({})
    render(<BarCode serial="serial" />)
    await wait()
    expect(screen.getByTitle('serial')).toBeInTheDocument()
  })
})
