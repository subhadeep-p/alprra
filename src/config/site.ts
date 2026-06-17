export const siteConfig = {
  name: 'Alprra',
  tagline: 'Snack Better. Live Better.',
  description:
    'Alprra crafts premium healthy snacks and baked goods — millet cookies, energy bars, granola, and more — made with clean, natural ingredients and no artificial preservatives.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alprra.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210',
  email: 'hello@alprra.com',
  orderEmail: process.env.ORDER_NOTIFY_EMAIL ?? 'orders@alprra.com',
  phone: '+91 98765 43210',
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
    image: '/images/og/alprra-og.png',
    width: 1200,
    height: 630,
  },
} as const

export type SiteConfig = typeof siteConfig
