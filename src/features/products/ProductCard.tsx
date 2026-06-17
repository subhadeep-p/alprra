'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { AddToCartButton } from '@/features/cart/AddToCartButton'
import { formatPrice } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/models/product'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

const HEALTH_TAG_COLORS: Record<string, 'default' | 'honey' | 'terracotta' | 'primary'> = {
  'High Fiber': 'default',
  'No Refined Sugar': 'honey',
  'Protein Rich': 'primary',
  'Gluten Conscious': 'terracotta',
  'Vegan': 'default',
  'Kid Friendly': 'honey',
  'Natural Sweetener': 'honey',
  'No Preservatives': 'default',
  'Whole Grain': 'default',
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false) // mobile expand

  const displayTags = product.healthTags.slice(0, 3)
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : null
  const savingsPct = savings && product.compareAtPrice ? Math.round((savings / product.compareAtPrice) * 100) : null

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-250 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isBestseller && (
          <span className="rounded-full bg-honey-400 px-2.5 py-1 text-[11px] font-bold text-espresso-700 uppercase tracking-wide">
            Bestseller
          </span>
        )}
        {savingsPct && (
          <span className="rounded-full bg-terracotta-400 px-2.5 py-1 text-[11px] font-bold text-white">
            {savingsPct}% off
          </span>
        )}
      </div>

      {/* Product image + desktop hover overlay */}
      <div className="relative overflow-hidden rounded-t-2xl bg-cream-50">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="h-56 w-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
            priority={priority}
          />
        </Link>

        {/* Desktop hover overlay — gated behind hover media query in CSS */}
        <div
          className={cn(
            'absolute inset-0 bg-espresso-900/85 backdrop-blur-[2px] p-4 flex flex-col justify-end',
            'opacity-0 transition-opacity duration-250',
            '@media (hover: hover) { group-hover:opacity-100 }',
            'pointer-events-none group-hover:pointer-events-auto'
          )}
          style={{}}
          aria-hidden="true"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-cream-300 mb-2">Key Ingredients</p>
          <ul className="space-y-1 mb-3">
            {product.ingredients.slice(0, 4).map((ing) => (
              <li key={ing.name} className="text-xs text-cream-100 flex items-start gap-1.5">
                <span className="text-honey-400 mt-0.5">•</span>
                <span>
                  <strong>{ing.name}</strong>
                  {ing.benefit && ` — ${ing.benefit}`}
                </span>
              </li>
            ))}
          </ul>
          {product.allergens.length > 0 && (
            <p className="text-[11px] text-cream-400">
              <strong className="text-terracotta-300">Contains:</strong> {product.allergens.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Health tags */}
        <div className="flex flex-wrap gap-1.5">
          {displayTags.map((tag) => (
            <Badge key={tag} variant={HEALTH_TAG_COLORS[tag] ?? 'default'}>
              {tag}
            </Badge>
          ))}
        </div>

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-base font-semibold text-espresso-600 hover:text-forest-600 leading-snug transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {product.name}
        </Link>

        {/* Short description */}
        <p className="text-xs text-espresso-400 leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating */}
        {product.rating && (
          <Rating value={product.rating} size="sm" showValue count={product.reviewCount} />
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-espresso-600">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-espresso-300 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
          <span className="text-xs text-espresso-400 ml-auto">{product.weight}</span>
        </div>

        {/* Mobile expand toggle */}
        <button
          className="flex items-center gap-1 text-xs font-medium text-forest-600 md:hidden"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide details' : 'Ingredients & details'}
          <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', expanded && 'rotate-180')} />
        </button>

        {/* Mobile expanded ingredients */}
        {expanded && (
          <div className="md:hidden rounded-xl bg-cream-50 p-3 text-xs space-y-2">
            <p className="font-semibold text-espresso-600">Key Ingredients</p>
            <ul className="space-y-1">
              {product.ingredients.slice(0, 4).map((ing) => (
                <li key={ing.name} className="flex items-start gap-1.5 text-espresso-500">
                  <span className="text-forest-600 mt-0.5">•</span>
                  <span><strong>{ing.name}</strong>{ing.benefit && ` — ${ing.benefit}`}</span>
                </li>
              ))}
            </ul>
            {product.allergens.length > 0 && (
              <p className="text-espresso-400">
                <strong className="text-terracotta-500">Contains:</strong> {product.allergens.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <AddToCartButton product={product} size="md" fullWidth className="mt-auto" />
      </div>
    </article>
  )
}
