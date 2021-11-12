import React from 'react'
import { useBarcode } from 'react-barcodes'

interface IBarCodeProps {
  serial: string
}

export function BarCode({ serial }: IBarCodeProps): JSX.Element {
  const { inputRef } = useBarcode({ value: serial, options: { format: 'EAN13' } })
  return <canvas ref={inputRef} style={{ marginTop: 14 }} />
}
