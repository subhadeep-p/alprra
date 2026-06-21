import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from './Logo'
import { siteConfig } from '@/config/site'
import { SmartLink } from '@/lib/native/SmartLink'
import { NewsletterForm } from './NewsletterForm'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-espresso-600 text-cream-200" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Newsletter strip */}
      <div className="bg-forest-600">
        <div className="container-brand py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-xl font-semibold" style={{ color: '#FDFAF4' }}>
                Fresh recipes & snack ideas — straight to your inbox
              </h2>
              <p className="text-cream-200 text-sm mt-1 opacity-80">No spam. Just goodness.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-brand py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo onDark />
            <p className="mt-4 text-sm leading-relaxed text-cream-300 max-w-xs">
              {siteConfig.description}
            </p>

            {/* Contact */}
            <div className="mt-6 flex flex-col gap-2.5">
              <SmartLink
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-sm text-cream-300 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {siteConfig.email}
              </SmartLink>
              <SmartLink
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-cream-300 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {siteConfig.phone}
              </SmartLink>
              <span className="flex items-center gap-2 text-sm text-cream-300">
                <MapPin className="h-4 w-4 shrink-0" />
                {siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}
              </span>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: InstagramIcon, href: siteConfig.social.instagram, label: 'Instagram' },
                { icon: FacebookIcon, href: siteConfig.social.facebook, label: 'Facebook' },
                { icon: TwitterIcon, href: siteConfig.social.twitter, label: 'Twitter / X' },
                { icon: YoutubeIcon, href: siteConfig.social.youtube, label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <SmartLink
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso-500 text-cream-300 hover:bg-forest-600 hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </SmartLink>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream-100 mb-4">Shop</h3>
            <ul className="flex flex-col gap-2.5">
              {siteConfig.nav.footer.shop.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-cream-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream-100 mb-4">Company</h3>
            <ul className="flex flex-col gap-2.5">
              {siteConfig.nav.footer.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-cream-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream-100 mb-4">Policies</h3>
            <ul className="flex flex-col gap-2.5">
              {siteConfig.nav.footer.policies.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-cream-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-espresso-500 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-400">
            © {currentYear} {siteConfig.name}. All rights reserved. Made with care in {siteConfig.address.city}, India.
          </p>
          <p className="text-xs text-cream-400">
            100% natural ingredients. No artificial preservatives.
          </p>
        </div>
      </div>
    </footer>
  )
}
