'use client'

import { QuantityStepper } from '@/features/cart/QuantityStepper'

interface QuantitySelectorProps {
  productSlug: string
  value: number
  onChange: (value: number) => void
  min?: number
}

export function QuantitySelector({ productSlug: _productSlug, value, onChange, min = 1 }: QuantitySelectorProps) {
  return (
    <QuantityStepper
      value={value}
      onChange={onChange}
      min={min}
      max={20}
    />
  )
}
