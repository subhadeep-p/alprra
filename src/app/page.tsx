import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Shield, Zap, Heart, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { Accordion } from '@/components/ui/Accordion'
import { ProductGrid } from '@/features/products/ProductGrid'
import { getFeaturedProducts } from '@/lib/products'
import { testimonials } from '@/data/testimonials'
import { globalFaqs } from '@/data/faqs'
import { buildFAQSchema } from '@/lib/schema/product'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Healthy Snacks & Baked Goods',
  description:
    'Alprra makes premium healthy snacks and baked goods — millet cookies, granola, energy bars, whole wheat breads — with clean, natural ingredients. No refined sugar, no preservatives. Shop now.',
  keywords: ['healthy cookies India', 'millet snacks', 'no refined sugar snacks', 'healthy granola India', 'energy bars India'],
})

const valueProps = [
  {
    icon: Leaf,
    title: 'Clean Ingredients',
    description: 'Every ingredient is chosen for a reason. If you cannot pronounce it, it is not in our products.',
  },
  {
    icon: Shield,
    title: 'No Artificial Preservatives',
    description: 'Short shelf life is proof of freshness. We make in small batches and ship fresh.',
  },
  {
    icon: Zap,
    title: 'Small Batch Production',
    description: 'Every batch is made by hand in small quantities so quality never gets scaled away.',
  },
  {
    icon: Heart,
    title: 'Nutrition Focused',
    description: 'We obsess over every macro and micro nutrient so you can snack with confidence.',
  },
  {
    icon: Users,
    title: 'Family Friendly',
    description: 'Kids and adults love our products. No compromise on taste, ever.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Whole grains, real nuts, raw honey, and cold-pressed oils — no cheap substitutes.',
  },
]

const ingredients = [
  { name: 'Finger Millet (Ragi)', fact: 'More calcium per calorie than milk', color: 'bg-forest-100 text-forest-700' },
  { name: 'Coconut Sugar', fact: 'GI of ~35 vs 65 for white sugar', color: 'bg-honey-100 text-honey-600' },
  { name: 'Jowar (Sorghum)', fact: 'Naturally gluten-free ancient grain', color: 'bg-terracotta-100 text-terracotta-600' },
  { name: 'Medjool Dates', fact: 'Natural sweetener rich in fiber', color: 'bg-cream-200 text-espresso-600' },
  { name: 'Raw Honey', fact: 'Antioxidants and enzymes intact', color: 'bg-honey-100 text-honey-600' },
  { name: 'Pure Jaggery', fact: 'Iron, potassium, and minerals', color: 'bg-terracotta-100 text-terracotta-600' },
  { name: 'Almond Flour', fact: 'Protein, healthy fats, vitamin E', color: 'bg-forest-100 text-forest-700' },
  { name: 'Whole Wheat', fact: 'Bran and germ intact — full nutrition', color: 'bg-cream-200 text-espresso-600' },
]

const homeFaqs = globalFaqs.slice(0, 6)

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4)
  return (
    <>
      <JsonLd data={buildFAQSchema(homeFaqs)} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-forest-50 py-20 md:py-28 lg:py-36">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-forest-100 opacity-30" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-honey-100 opacity-40" aria-hidden="true" />

        <div className="container-brand relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="default" className="mb-5 gap-1.5">
                <Leaf className="h-3 w-3" />
                Made fresh in Bengaluru, India
              </Badge>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-espresso-600 leading-[1.1] tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Snacks that are actually{' '}
                <span className="text-forest-600">good for you.</span>
              </h1>
              <p className="text-lg text-espresso-400 leading-relaxed mb-8 max-w-lg">
                Alprra makes premium healthy snacks and baked goods with clean, natural ingredients —
                ancient grains, natural sweeteners, real nuts. No refined flour, no artificial
                preservatives, no compromise.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="xl" asChild>
                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { stat: '1000+', label: 'Happy customers' },
                  { stat: '4.8★', label: 'Average rating' },
                  { stat: '100%', label: 'Natural ingredients' },
                ].map(({ stat, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-forest-600" style={{ fontFamily: 'var(--font-display)' }}>{stat}</p>
                    <p className="text-sm text-espresso-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image / visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-80 w-80 md:h-96 md:w-96 rounded-full overflow-hidden bg-cream-200">
                <Image
                  src="/images/products/multigrain-granola.svg"
                  alt="Alprra premium healthy snacks — multigrain seed granola"
                  fill
                  className="object-contain p-8"
                  priority
                />
              </div>
              {/* Floating badges */}
              <div className="absolute top-4 right-0 md:right-4 bg-white rounded-2xl px-4 py-3 shadow-[var(--shadow-card)]">
                <p className="text-xs font-semibold text-espresso-500 mb-0.5">Our promise</p>
                <p className="text-sm font-bold text-forest-600">No refined sugar</p>
              </div>
              <div className="absolute bottom-4 left-0 md:left-4 bg-white rounded-2xl px-4 py-3 shadow-[var(--shadow-card)]">
                <p className="text-xs font-semibold text-espresso-500 mb-0.5">Every product</p>
                <p className="text-sm font-bold text-forest-600">Freshly baked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENT STRIP ───────────────────────────────────────── */}
      <div className="bg-forest-600 text-white py-3 text-center text-sm font-medium">
        Free delivery on orders above ₹599 · Same-day dispatch for orders before 12pm ·
        <Link href="/products" className="ml-1 underline underline-offset-2 hover:no-underline">Shop now →</Link>
      </div>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="featured-products-heading">
        <div className="container-brand">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-forest-600 mb-2">Handpicked for you</p>
              <h2
                id="featured-products-heading"
                className="text-3xl md:text-4xl font-semibold text-espresso-600"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Our bestsellers
              </h2>
              <p className="text-espresso-400 mt-2 max-w-md">
                Trusted by thousands of health-conscious families across India.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">View all products <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} priorityCount={2} />
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">View more products <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-cream-50" aria-labelledby="why-us-heading">
        <div className="container-brand">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-forest-600 mb-2">Our difference</p>
            <h2
              id="why-us-heading"
              className="text-3xl md:text-4xl font-semibold text-espresso-600"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Why choose Alprra?
            </h2>
            <p className="text-espresso-400 mt-3 max-w-2xl mx-auto">
              We believe healthy eating should be delicious, transparent, and accessible.
              Here is what makes every Alprra product different.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueProps.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-cream-200 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-250"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100 mb-4">
                  <Icon className="h-5 w-5 text-forest-600" />
                </div>
                <h3 className="text-base font-semibold text-espresso-600 mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p className="text-sm text-espresso-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INGREDIENT PHILOSOPHY ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-forest-600 text-white" aria-labelledby="ingredients-heading">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-forest-200 mb-2">Clean label promise</p>
              <h2
                id="ingredients-heading"
                className="text-3xl md:text-4xl font-semibold text-white leading-snug mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Every ingredient earns its place.
              </h2>
              <p className="text-forest-100 leading-relaxed mb-5">
                We use ancient Indian superfoods — ragi, jowar, amaranth — that modern nutrition science keeps rediscovering.
                These are not trends to us; they are how India has eaten well for thousands of years.
              </p>
              <p className="text-forest-100 leading-relaxed mb-8">
                Every sweetener we use is chosen for its nutritional profile — not just its sweetness.
                Coconut sugar, jaggery, dates, and raw honey all bring minerals, fiber, and depth of flavour
                that refined sugar simply cannot match.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/about">Read our ingredient philosophy <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ingredients.map(({ name, fact, color }) => (
                <div key={name} className="rounded-2xl bg-forest-700 p-4 border border-forest-500">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold mb-2 ${color}`}>
                    {name}
                  </span>
                  <p className="text-xs text-forest-200 leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HEALTHY LIFESTYLE CONTENT (GEO content block) ────────────── */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="lifestyle-heading">
        <div className="container-brand">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-forest-600 mb-2">Snack smarter</p>
            <h2
              id="lifestyle-heading"
              className="text-3xl md:text-4xl font-semibold text-espresso-600"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Healthy snacking for every lifestyle
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                tag: 'For office workers',
                title: 'Beat the 3pm slump without the sugar crash',
                body: 'Our energy bars and chikki provide sustained protein and complex carbohydrates — stable blood sugar means consistent focus through the workday. No vending machine required.',
                href: '/blog/healthy-snacks-for-office',
                cta: 'Office snacks guide',
              },
              {
                tag: 'For parents',
                title: 'Snacks your kids will actually want to eat',
                body: 'Ragi\'s calcium content rivals dairy. Amaranth\'s complete protein supports growth. Dates\' natural sweetness means no battles over "healthy" food. Our kids\' range is designed to be craved, not tolerated.',
                href: '/blog/healthy-snacks-for-kids',
                cta: 'Kids\' snacks guide',
              },
              {
                tag: 'For fitness enthusiasts',
                title: 'Real food macros, not lab-engineered bars',
                body: 'Our protein bars use whey and peanut butter — not soy isolate and maltitol. Real food with real macros that your body processes efficiently, before or after your workout.',
                href: '/blog/millet-benefits',
                cta: 'Fitness snacks guide',
              },
            ].map(({ tag, title, body, href, cta }) => (
              <div key={title} className="flex flex-col">
                <Badge variant="default" className="w-fit mb-3">{tag}</Badge>
                <h3 className="text-xl font-semibold text-espresso-600 mb-3 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                  {title}
                </h3>
                <p className="text-espresso-400 text-sm leading-relaxed flex-1 mb-5">{body}</p>
                <Link
                  href={href}
                  className="text-sm font-semibold text-forest-600 hover:text-forest-700 flex items-center gap-1 group"
                >
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-cream-50" aria-labelledby="testimonials-heading">
        <div className="container-brand">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-forest-600 mb-2">What customers say</p>
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-semibold text-espresso-600"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Loved across India
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t) => (
              <blockquote
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-cream-200 shadow-[var(--shadow-card)] flex flex-col gap-4"
              >
                <Rating value={t.rating} size="sm" />
                <p className="text-sm text-espresso-500 leading-relaxed flex-1">&quot;{t.text}&quot;</p>
                <footer className="flex items-center justify-between">
                  <div>
                    <cite className="not-italic text-sm font-semibold text-espresso-600">{t.name}</cite>
                    <p className="text-xs text-espresso-400">{t.location}</p>
                  </div>
                  {t.product && (
                    <Badge variant="cream" className="text-[10px]">{t.product}</Badge>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="faq-heading">
        <div className="container-brand">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-forest-600 mb-2">Got questions?</p>
              <h2
                id="faq-heading"
                className="text-3xl md:text-4xl font-semibold text-espresso-600"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Frequently asked questions
              </h2>
            </div>
            <Accordion items={homeFaqs} />
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/faq">See all FAQs <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-espresso-600 to-espresso-700" aria-labelledby="cta-heading">
        <div className="container-brand text-center">
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-semibold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to snack better?
          </h2>
          <p className="text-cream-300 mb-8 max-w-lg mx-auto">
            Free delivery above ₹599. Fresh products, real ingredients, and a taste that proves healthy
            does not mean boring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="accent" size="xl" asChild>
              <Link href="/products">
                Shop All Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="xl" className="text-cream-200 hover:bg-espresso-500 hover:text-white" asChild>
              <Link href="/blog">Read our blog</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
