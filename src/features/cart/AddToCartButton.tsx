'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from './cartStore'
import type { Product } from '@/models/product'
import { cn } from '@/lib/utils/cn'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fullWidth?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = 'lg',
  className,
  fullWidth = false,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      variant={added ? 'secondary' : 'primary'}
      size={size}
      onClick={handleAdd}
      disabled={product.availability === 'out_of_stock'}
      className={cn(fullWidth && 'w-full', className)}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Added to Cart
        </>
      ) : product.availability === 'out_of_stock' ? (
        'Out of Stock'
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
