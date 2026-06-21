import { ProductCard } from './ProductCard'
import type { Product } from '@/models/product'

interface ProductGridProps {
  products: Product[]
  priorityCount?: number
}

export function ProductGrid({ products, priorityCount = 2 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-espresso-400 font-display" style={{ fontFamily: 'var(--font-display)' }}>
          No products found.
        </p>
        <p className="text-sm text-espresso-300 mt-2">Try a different category or search term.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {products.map((product, i) => (
        <div key={product.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] min-w-0">
          <ProductCard product={product} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  )
}
