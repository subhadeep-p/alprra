import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/schema/organization'
import { buildMetadata } from '@/lib/seo/metadata'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = buildMetadata()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',      // Safe area support for WebView shells
  themeColor: '#2D5016',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/* Apple WebView / PWA metas */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Alprra" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Structured data — site-wide */}
        <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />
      </head>
      <body className="flex min-h-dvh flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] antialiased" style={{ fontFamily: 'var(--font-body)' }}>
        {/* Accessibility skip link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
