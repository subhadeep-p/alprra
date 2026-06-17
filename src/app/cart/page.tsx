import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { CartView } from '@/features/cart/CartView'

export const metadata: Metadata = buildMetadata({
  title: 'Your Cart',
  path: '/cart',
  noIndex: true,
})

export default function CartPage() {
  return (
    <div className="container-brand py-12">
      <h1 className="text-3xl font-semibold text-espresso-600 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Your Cart
      </h1>
      <CartView />
    </div>
  )
}
