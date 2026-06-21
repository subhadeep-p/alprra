import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({ title: 'Privacy Policy', noIndex: true })

export default function PrivacyPage() {
  return (
    <div className="container-brand py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold text-espresso-600 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Privacy Policy
      </h1>
      <div className="prose prose-lg max-w-none prose-headings:text-espresso-600 prose-p:text-espresso-500">
        <p className="text-sm text-espresso-400">Last updated: January 2025</p>
        <p>Alprra collects only the information necessary to process and deliver your order: name, phone number, email address, and delivery address. We do not sell or share your personal data with third parties for marketing purposes.</p>
        <h2>Data we collect</h2>
        <ul>
          <li>Order information (name, address, contact details)</li>
          <li>Email address (for order confirmation and newsletter, if subscribed)</li>
          <li>Device and browsing data (via analytics tools, anonymised)</li>
        </ul>
        <h2>How we use your data</h2>
        <ul>
          <li>Process and deliver your orders</li>
          <li>Send order confirmations and delivery updates</li>
          <li>Improve our products and website</li>
        </ul>
        <h2>Contact</h2>
        <p>For privacy queries, email support@alprra.com</p>
      </div>
    </div>
  )
}
