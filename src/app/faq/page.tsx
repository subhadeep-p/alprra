import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { globalFaqs } from '@/data/faqs'
import { buildFAQSchema } from '@/lib/schema/product'
import { JsonLd } from '@/components/seo/JsonLd'
import { Accordion } from '@/components/ui/Accordion'

export const metadata: Metadata = buildMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers to the most common questions about Alprra products — ingredients, allergens, ordering, delivery, and our ingredient philosophy.',
  path: '/faq',
  keywords: ['Alprra FAQ', 'healthy snacks FAQ', 'millet snacks questions'],
})

const grouped = globalFaqs.reduce(
  (acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = []
    acc[faq.category].push({ question: faq.question, answer: faq.answer })
    return acc
  },
  {} as Record<string, { question: string; answer: string }[]>
)

export default function FAQPage() {
  return (
    <>
      <JsonLd data={buildFAQSchema(globalFaqs)} />
      <div className="bg-cream-50 border-b border-cream-200 py-12">
        <div className="container-brand">
          <h1 className="text-3xl md:text-4xl font-semibold text-espresso-600 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-espresso-400 max-w-lg">
            Everything you need to know about Alprra — our ingredients, products, ordering, and delivery.
          </p>
        </div>
      </div>
      <div className="container-brand py-12 max-w-3xl">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="mb-12">
            <h2 className="text-xl font-semibold text-espresso-600 mb-5 pb-3 border-b border-cream-200" style={{ fontFamily: 'var(--font-display)' }}>
              {category}
            </h2>
            <Accordion items={items} />
          </section>
        ))}
      </div>
    </>
  )
}
