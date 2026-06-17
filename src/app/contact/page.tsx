import type { Metadata } from 'next'
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react'
import { buildMetadata } from '@/lib/seo/metadata'
import { siteConfig } from '@/config/site'
import { SmartLink } from '@/lib/native/SmartLink'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Alprra',
  description:
    'Get in touch with the Alprra team — for orders, bulk enquiries, corporate gifting, or any questions about our healthy snacks and baked goods.',
  path: '/contact',
})

export default function ContactPage() {
  const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent('Hi Alprra! I have a question about your products.')}`

  return (
    <div>
      <div className="bg-cream-50 border-b border-cream-200 py-12">
        <div className="container-brand">
          <h1 className="text-3xl md:text-4xl font-semibold text-espresso-600 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Contact us
          </h1>
          <p className="text-espresso-400 max-w-lg">
            Questions, bulk orders, corporate gifting, or just want to say hello — we are always happy to hear from you.
          </p>
        </div>
      </div>

      <div className="container-brand py-14 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: MessageCircle,
              title: 'WhatsApp (fastest)',
              body: 'For orders, product questions, and quick support. We respond within minutes during business hours.',
              link: { href: waUrl, label: 'Chat on WhatsApp' },
              accent: true,
            },
            {
              icon: Mail,
              title: 'Email',
              body: 'For detailed enquiries, corporate partnerships, and bulk order discussions.',
              link: { href: `mailto:${siteConfig.email}`, label: siteConfig.email },
              accent: false,
            },
            {
              icon: Phone,
              title: 'Phone',
              body: 'Available Monday to Saturday, 9am to 7pm IST.',
              link: { href: `tel:${siteConfig.phone.replace(/\s/g, '')}`, label: siteConfig.phone },
              accent: false,
            },
            {
              icon: MapPin,
              title: 'Location',
              body: `We are based in ${siteConfig.address.city}, ${siteConfig.address.state}, and deliver across India.`,
              link: null,
              accent: false,
            },
          ].map(({ icon: Icon, title, body, link, accent }) => (
            <div
              key={title}
              className={`rounded-2xl p-6 border ${accent ? 'bg-forest-600 border-forest-500 text-white' : 'bg-white border-cream-200'} shadow-[var(--shadow-card)]`}
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-4 ${accent ? 'bg-forest-500' : 'bg-forest-100'}`}>
                <Icon className={`h-5 w-5 ${accent ? 'text-white' : 'text-forest-600'}`} />
              </div>
              <h2 className={`font-semibold mb-2 ${accent ? 'text-white' : 'text-espresso-600'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h2>
              <p className={`text-sm mb-4 ${accent ? 'text-forest-100' : 'text-espresso-400'}`}>{body}</p>
              {link && (
                <SmartLink
                  href={link.href}
                  className={`text-sm font-semibold hover:underline ${accent ? 'text-honey-300' : 'text-forest-600'}`}
                >
                  {link.label}
                </SmartLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
