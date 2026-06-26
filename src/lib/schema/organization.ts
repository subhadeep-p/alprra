import { siteConfig } from '@/config/site'

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    // Alternate names reinforce the exact "Alprra" spelling as a real entity
    // so Google stops auto-correcting the query to "alprax".
    alternateName: ['Alprra Foods', 'Alprra Snacks'],
    // Explicitly disambiguates Alprra (the snacks brand) from the
    // similarly-spelled medication "Alprax" that Google defaults to.
    disambiguatingDescription:
      'Alprra is an independent healthy-snacks and baked-goods brand based in Bengaluru, India, known for millet cookies, granola, and energy bars made with clean, natural ingredients. It is not affiliated with any pharmaceutical product.',
    slogan: siteConfig.tagline,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/images/logo.png`,
      width: 1408,
      height: 768,
    },
    image: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone.replace(/\s+/g, ''),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      addressCountry: siteConfig.address.countryCode,
    },
    areaServed: siteConfig.address.countryCode,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    sameAs: Object.values(siteConfig.social),
    keywords:
      'Alprra, Alprra healthy snacks, Alprra Bengaluru, millet cookies, clean-label baked goods, healthy snacks India',
    foundingDate: '2024',
    knowsAbout: [
      'Healthy snacking',
      'Millet-based foods',
      'Clean-label baked goods',
      'Natural sweeteners',
      'Whole grain nutrition',
      'Artisan baking',
    ],
  }
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      addressCountry: siteConfig.address.countryCode,
    },
    priceRange: '₹₹',
    servesCuisine: 'Healthy Snacks',
    hasMap: '',
  }
}
