import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { CheckoutForm } from '@/features/checkout/CheckoutForm'

export const metadata: Metadata = buildMetadata({
  title: 'Checkout',
  path: '/checkout',
  noIndex: true,
})

export default function CheckoutPage() {
  return (
    <div className="container-brand py-12">
      <h1 className="text-3xl font-semibold text-espresso-600 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Checkout
      </h1>
      <p className="text-espresso-400 mb-10 text-sm">
        Fill in your details and confirm your order via WhatsApp. No payment required upfront.
      </p>
      <CheckoutForm />
    </div>
  )
}
