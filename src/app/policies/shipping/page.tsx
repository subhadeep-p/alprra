import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Shipping Policy',
  description: 'Alprra shipping information — delivery times, areas served, and costs.',
  path: '/policies/shipping',
  noIndex: true,
})

export default function ShippingPolicyPage() {
  return (
    <div className="container-brand py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold text-espresso-600 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Shipping Policy
      </h1>
      <div className="prose prose-lg max-w-none prose-headings:text-espresso-600 prose-p:text-espresso-500 prose-strong:text-espresso-600 prose-ul:text-espresso-500">
        <p className="text-sm text-espresso-400">Last updated: January 2025</p>
        <h2>Delivery areas</h2>
        <p>We deliver pan-India. Bengaluru orders may qualify for same-day delivery when placed before 12pm IST.</p>
        <h2>Delivery timeline</h2>
        <ul>
          <li><strong>Bengaluru:</strong> 24–48 hours</li>
          <li><strong>Metro cities:</strong> 2–4 business days</li>
          <li><strong>Rest of India:</strong> 3–6 business days</li>
        </ul>
        <p>Freshly baked items (breads, cakes) require 24–48 hours preparation time before dispatch.</p>
        <h2>Shipping costs</h2>
        <ul>
          <li>Free delivery on orders above ₹599</li>
          <li>₹60 flat fee on orders below ₹599</li>
        </ul>
        <h2>Contact</h2>
        <p>WhatsApp us at +91 6363132503 or email support@alprra.com for shipping queries.</p>
      </div>
    </div>
  )
}
