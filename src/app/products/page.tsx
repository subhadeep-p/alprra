import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { getAllProducts, getAllCategories } from '@/lib/products'
import { ProductGrid } from '@/features/products/ProductGrid'
import { buildBreadcrumbSchema } from '@/lib/schema/product'
import { JsonLd } from '@/components/seo/JsonLd'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export const metadata: Metadata = buildMetadata({
  title: 'All Products — Healthy Snacks & Baked Goods',
  description:
    'Shop all Alprra healthy snacks and baked goods — millet cookies, energy bars, granola, whole wheat breads, and more. No refined sugar, no preservatives. Free delivery above ₹599.',
  path: '/products',
  keywords: ['healthy snacks shop', 'buy healthy cookies India', 'millet snacks online', 'healthy granola buy'],
})

export default function ProductsPage() {
  const products = getAllProducts()
  const categories = getAllCategories()

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }])} />

      {/* Page header */}
      <div className="bg-cream-50 border-b border-cream-200 py-12">
        <div className="container-brand">
          <p className="text-sm text-forest-600 font-medium mb-2">Shop</p>
          <h1
            className="text-3xl md:text-4xl font-semibold text-espresso-600 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            All Products
          </h1>
          <p className="text-espresso-400 max-w-lg">
            {products.length} products made with clean, natural ingredients. No refined sugar, no artificial preservatives.
          </p>
        </div>
      </div>

      <div className="container-brand py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link href="/products">
            <Badge variant="primary" className="cursor-pointer px-4 py-1.5 text-sm">All</Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products/category/${cat.slug}`}>
              <Badge variant="cream" className="cursor-pointer hover:bg-forest-100 hover:text-forest-700 transition-colors px-4 py-1.5 text-sm">
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        <ProductGrid products={products} priorityCount={4} />
      </div>
    </>
  )
}
