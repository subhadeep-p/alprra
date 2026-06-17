import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getAllProductSlugs, getRelatedProducts } from '@/lib/products'
import { buildProductSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema/product'
import { JsonLd } from '@/components/seo/JsonLd'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { Accordion } from '@/components/ui/Accordion'
import { AddToCartButton } from '@/features/cart/AddToCartButton'
import { QuantitySelector } from '@/features/products/QuantitySelector'
import { ProductGrid } from '@/features/products/ProductGrid'
import { formatPrice } from '@/lib/utils/format'
import { CheckCircle2, Leaf, Thermometer, Package } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: [{ url: product.image, alt: product.name }],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product, 4)

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: product.name, href: `/products/${product.slug}` },
  ]

  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      <JsonLd data={buildFAQSchema(product.faq)} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container-brand py-4">
        <ol className="flex items-center gap-2 text-sm text-espresso-400">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-espresso-600 font-medium" aria-current="page">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-forest-600 transition-colors">{crumb.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Product detail */}
      <div className="container-brand pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-cream-50 border border-cream-200">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-contain p-8"
                priority
              />
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {product.healthTags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
              {product.isBestseller && <Badge variant="honey">Bestseller</Badge>}
            </div>

            <h1
              className="text-3xl md:text-4xl font-semibold text-espresso-600 leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {product.name}
            </h1>

            <p className="text-espresso-400 leading-relaxed">{product.shortDescription}</p>

            {product.rating && (
              <Rating value={product.rating} showValue count={product.reviewCount} />
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-espresso-600">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-espresso-300 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              <span className="text-sm text-espresso-400">· {product.weight}</span>
            </div>

            {/* Add to cart */}
            <div className="flex items-center gap-3">
              <QuantitySelector productSlug={product.slug} />
              <AddToCartButton product={product} size="lg" fullWidth />
            </div>

            {/* WhatsApp order */}
            <p className="text-sm text-espresso-400">
              Prefer to order via{' '}
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210'}?text=${encodeURIComponent(`Hi! I'd like to order ${product.name} (₹${product.price}). Please confirm availability.`)}`}
                className="text-forest-600 font-semibold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp?
              </Link>
            </p>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-cream-200">
              {[
                { icon: Leaf, text: 'No artificial preservatives' },
                { icon: CheckCircle2, text: 'Clean, natural ingredients' },
                { icon: Package, text: `Made fresh · ${product.weight}` },
                { icon: Thermometer, text: product.storageInstructions.split('.')[0] },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2 text-xs text-espresso-400">
                  <Icon className="h-4 w-4 text-forest-600 mt-0.5 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed content */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-2xl font-semibold text-espresso-600 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                About this product
              </h2>
              <p className="text-espresso-500 leading-relaxed">{product.description}</p>
            </section>

            {/* Ingredients */}
            <section aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="text-2xl font-semibold text-espresso-600 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Ingredients
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.ingredients.map((ing) => (
                  <div key={ing.name} className="rounded-xl bg-cream-50 border border-cream-200 p-4">
                    <p className="font-semibold text-espresso-600 text-sm">{ing.name}</p>
                    {ing.description && <p className="text-xs text-espresso-400 mt-0.5">{ing.description}</p>}
                    {ing.benefit && (
                      <p className="text-xs text-forest-600 mt-1.5 font-medium flex items-start gap-1">
                        <Leaf className="h-3 w-3 mt-0.5 shrink-0" />
                        {ing.benefit}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Why these ingredients — GEO content block */}
            {product.whyTheseIngredients && (
              <section aria-labelledby="why-ingredients-heading">
                <h2 id="why-ingredients-heading" className="text-2xl font-semibold text-espresso-600 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Why these ingredients?
                </h2>
                <div className="rounded-2xl bg-forest-50 border border-forest-100 p-6">
                  <p className="text-espresso-500 leading-relaxed">{product.whyTheseIngredients}</p>
                </div>
              </section>
            )}

            {/* Health benefits */}
            <section aria-labelledby="benefits-heading">
              <h2 id="benefits-heading" className="text-2xl font-semibold text-espresso-600 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Health benefits
              </h2>
              <ul className="space-y-3">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-espresso-500">
                    <CheckCircle2 className="h-5 w-5 text-forest-600 mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ */}
            {product.faq.length > 0 && (
              <section aria-labelledby="product-faq-heading">
                <h2 id="product-faq-heading" className="text-2xl font-semibold text-espresso-600 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Frequently asked questions
                </h2>
                <Accordion items={product.faq} />
              </section>
            )}
          </div>

          {/* Sidebar: nutrition + allergens + storage */}
          <div className="space-y-6">
            {/* Nutrition */}
            <div className="rounded-2xl bg-white border border-cream-200 shadow-[var(--shadow-card)] p-5">
              <h3 className="font-semibold text-espresso-600 mb-4">Nutrition information</h3>
              <p className="text-xs text-espresso-400 mb-3">Per serving: {product.nutrition.servingSize}</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Calories', value: `${product.nutrition.calories} kcal` },
                  { label: 'Protein', value: `${product.nutrition.protein}g` },
                  { label: 'Carbohydrates', value: `${product.nutrition.carbs}g` },
                  { label: 'of which Sugar', value: `${product.nutrition.sugar}g`, indent: true },
                  { label: 'Dietary Fiber', value: `${product.nutrition.fiber}g` },
                  { label: 'Total Fat', value: `${product.nutrition.fat}g` },
                  ...(product.nutrition.sodium ? [{ label: 'Sodium', value: `${product.nutrition.sodium}mg` }] : []),
                ].map(({ label, value, indent }) => (
                  <div key={label} className={`flex justify-between text-sm ${indent ? 'pl-3 text-espresso-400' : ''}`}>
                    <span className={indent ? '' : 'text-espresso-500'}>{label}</span>
                    <span className="font-semibold text-espresso-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="rounded-2xl bg-terracotta-50 border border-terracotta-100 p-5">
              <h3 className="font-semibold text-espresso-600 mb-3">Allergen information</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((a) => (
                  <Badge key={a} variant="terracotta">{a}</Badge>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="rounded-2xl bg-cream-50 border border-cream-200 p-5">
              <h3 className="font-semibold text-espresso-600 mb-3 flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-forest-600" />
                Storage instructions
              </h3>
              <p className="text-sm text-espresso-500 leading-relaxed">{product.storageInstructions}</p>
            </div>

            {/* SKU */}
            <p className="text-xs text-espresso-300 px-1">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-2xl font-semibold text-espresso-600 mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              You might also like
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </>
  )
}
