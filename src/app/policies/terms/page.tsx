import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({ title: 'Terms of Service', noIndex: true })

export default function TermsPage() {
  return (
    <div className="container-brand py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold text-espresso-600 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Terms of Service
      </h1>
      <div className="prose prose-lg max-w-none prose-headings:text-espresso-600 prose-p:text-espresso-500">
        <p className="text-sm text-espresso-400">Last updated: January 2025</p>
        <p>By placing an order with Alprra, you agree to these terms. Alprra reserves the right to cancel orders that cannot be fulfilled, with a full refund issued promptly.</p>
        <h2>Orders</h2>
        <p>Orders are confirmed via WhatsApp. Payment is collected on delivery (Cash on Delivery) unless otherwise arranged. Order confirmation via WhatsApp constitutes a binding agreement.</p>
        <h2>Allergens</h2>
        <p>Our products contain common allergens including tree nuts, dairy, eggs, gluten, and sesame. Full allergen information is listed on each product page. It is the customer&apos;s responsibility to review allergen information before ordering.</p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of India. Disputes are subject to the jurisdiction of courts in Bengaluru, Karnataka.</p>
      </div>
    </div>
  )
}
