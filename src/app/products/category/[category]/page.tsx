import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getProductsByCategory, getAllCategorySlugs } from '@/lib/products'
import { ProductGrid } from '@/features/products/ProductGrid'
import { buildBreadcrumbSchema } from '@/lib/schema/product'
import { JsonLd } from '@/components/seo/JsonLd'

interface Props { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) return {}
  return { title: cat.seoTitle, description: cat.seoDescription }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) notFound()

  const products = await getProductsByCategory(category)

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: cat.name, href: `/products/category/${cat.slug}` },
      ])} />

      <div className="bg-cream-50 border-b border-cream-200 py-12">
        <div className="container-brand">
          <nav className="text-sm text-espresso-400 mb-4">
            <Link href="/products" className="hover:text-forest-600">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-espresso-600">{cat.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-semibold text-espresso-600 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {cat.name}
          </h1>
          <p className="text-espresso-400 max-w-lg">{cat.description}</p>
        </div>
      </div>

      <div className="container-brand py-10">
        <p className="text-sm text-espresso-400 mb-8">{products.length} products</p>
        <ProductGrid products={products} />
      </div>
    </>
  )
}
