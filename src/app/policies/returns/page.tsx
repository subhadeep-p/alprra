import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({ title: 'Returns & Refunds Policy', noIndex: true })

export default function ReturnsPage() {
  return (
    <div className="container-brand py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold text-espresso-600 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Returns & Refunds Policy
      </h1>
      <div className="prose prose-lg max-w-none prose-headings:text-espresso-600 prose-p:text-espresso-500">
        <p className="text-sm text-espresso-400">Last updated: January 2025</p>
        <p>As our products are freshly baked food items, we are unable to accept returns. However, if your order arrives damaged, incorrect, or in poor condition, please contact us within 24 hours of delivery with photos and we will resolve it promptly — with a replacement or full refund.</p>
        <h2>Refund conditions</h2>
        <ul>
          <li>Damaged or incorrect products — full refund or replacement</li>
          <li>Non-delivery — full refund after investigation</li>
          <li>Change of mind — not eligible for return (perishable food items)</li>
        </ul>
        <h2>How to claim</h2>
        <p>WhatsApp us at +91 98765 43210 with your order ID and photos within 24 hours of delivery.</p>
      </div>
    </div>
  )
}
