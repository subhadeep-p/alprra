'use client'

import { useState } from 'react'
import { QuantityStepper } from '@/features/cart/QuantityStepper'

interface QuantitySelectorProps {
  productSlug: string
}

export function QuantitySelector({ productSlug: _productSlug }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <QuantityStepper
      value={quantity}
      onChange={setQuantity}
      min={1}
      max={20}
    />
  )
}
