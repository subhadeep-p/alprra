export const siteConfig = {
  name: 'Alprra',
  tagline: 'Snack Better. Live Better.',
  description:
    'Alprra crafts premium healthy snacks and baked goods — millet cookies, energy bars, granola, and more — made with clean, natural ingredients and no artificial preservatives.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alprra.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '916363132503',
  email: 'support@alprra.com',
  orderEmail: process.env.ORDER_NOTIFY_EMAIL ?? 'orders@alprra.com',
  phone: '+91 6363132503',
  address: {
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    countryCode: 'IN',
  },
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
  },
  social: {
    instagram: 'https://instagram.com/alprra',
    facebook: 'https://facebook.com/alprra',
    twitter: 'https://twitter.com/alprra',
    youtube: 'https://youtube.com/@alprra',
  },
  nav: {
    main: [
      { label: 'Products', href: '/products' },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    footer: {
      shop: [
        { label: 'All Products', href: '/products' },
        { label: 'Cookies & Biscuits', href: '/products/category/cookies' },
        { label: 'Millet Snacks', href: '/products/category/millet-snacks' },
        { label: 'Energy Bars', href: '/products/category/energy-bars' },
        { label: 'Breads & Cakes', href: '/products/category/breads-cakes' },
        { label: 'Granola', href: '/products/category/granola' },
      ],
      company: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
      ],
      policies: [
        { label: 'Shipping Policy', href: '/policies/shipping' },
        { label: 'Returns & Refunds', href: '/policies/returns' },
        { label: 'Privacy Policy', href: '/policies/privacy' },
        { label: 'Terms of Service', href: '/policies/terms' },
      ],
    },
  },
  og: {
    // NOTE: the previous path /images/og/alprra-og.png did not exist on disk
    // (the file is actually alprra-og.png.svg), so OG previews + the schema logo
    // were 404ing. Point at the real raster logo. Swap in a purpose-built
    // 1200×630 PNG here later if you want a designed share card.
    image: '/images/logo.png',
    width: 1408,
    height: 768,
  },
} as const

export type SiteConfig = typeof siteConfig
