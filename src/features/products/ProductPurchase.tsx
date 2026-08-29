'use client'

import { useState } from 'react'
import { PackageCheck } from 'lucide-react'
import { QuantitySelector } from '@/features/products/QuantitySelector'
import { AddToCartButton } from '@/features/cart/AddToCartButton'
import type { Product } from '@/models/product'

interface ProductPurchaseProps {
  product: Product
}

/**
 * Wires quantity selection to Add to Cart on the product detail page.
 * Seeds quantity to the product's minimum order quantity (if the admin has
 * configured one) and shows a gentle heads-up rather than silently forcing it.
 */
export function ProductPurchase({ product }: ProductPurchaseProps) {
  const minQuantity = product.minOrderQuantity ?? 1
  const [quantity, setQuantity] = useState(minQuantity)
  const [justAdded, setJustAdded] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <QuantitySelector productSlug={product.slug} value={quantity} onChange={setQuantity} min={minQuantity} />
        <AddToCartButton
          product={product}
          quantity={quantity}
          size="lg"
          fullWidth
          onAdded={() => setJustAdded(true)}
        />
      </div>
      {minQuantity > 1 && (
        <p className="flex items-center gap-1.5 text-xs text-espresso-400">
          <PackageCheck className="h-3.5 w-3.5 text-forest-600 shrink-0" />
          {justAdded
            ? `Added the minimum ${minQuantity} for this item 🌿`
            : `Sold in packs — minimum ${minQuantity} per order`}
        </p>
      )}
    </div>
  )
}
