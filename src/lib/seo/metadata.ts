import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

interface BuildMetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
}

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
  keywords = [],
}: BuildMetadataOptions = {}): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image ?? siteConfig.og.image
  const metaTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`
  const metaDescription = description ?? siteConfig.description

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      'healthy snacks India',
      'healthy baked goods',
      'no refined sugar snacks',
      'millet snacks',
      'natural sweeteners',
      'clean ingredients',
      ...keywords,
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: siteConfig.og.width,
          height: siteConfig.og.height,
          alt: metaTitle,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
      creator: '@alprra',
      site: '@alprra',
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    other: {
      'theme-color': '#2D5016',
    },
  }
}
