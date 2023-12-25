import { useBarcode } from 'next-barcode'
import React from 'react'

interface IBarCodeProps {
  serial: string
}

export function BarCode({ serial }: IBarCodeProps) {
  const { inputRef } = useBarcode({ value: serial, options: { format: 'EAN13' } })
  return <canvas title={serial} ref={inputRef} />
}
