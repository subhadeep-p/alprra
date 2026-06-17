import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Leaf, Heart, Shield } from 'lucide-react'
import { buildMetadata } from '@/lib/seo/metadata'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildLocalBusinessSchema } from '@/lib/schema/organization'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = buildMetadata({
  title: 'About Alprra — Our Story & Ingredient Philosophy',
  description:
    'Alprra was born from a simple belief: healthy snacks should taste as good as they are good for you. Learn about our story, our ingredient philosophy, and our commitment to clean-label, honest food.',
  path: '/about',
  keywords: ['about Alprra', 'healthy snacks brand India', 'clean label food India'],
})

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildLocalBusinessSchema()} />

      <div className="bg-gradient-to-br from-cream-50 to-forest-50 py-16">
        <div className="container-brand max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-forest-600 mb-3">Our story</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-espresso-600 mb-6 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
            Food made the way it should be.
          </h1>
          <p className="text-lg text-espresso-400 leading-relaxed max-w-2xl">
            Alprra was founded in Bengaluru with one conviction: that you should not have to choose between food
            that tastes good and food that is good for you. We started baking for family and friends,
            and the response was immediate — people wanted more.
          </p>
        </div>
      </div>

      <div className="container-brand py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-espresso-600 prose-p:text-espresso-500">
          <h2>Why we started</h2>
          <p>
            Walk into any Indian supermarket and look at the snacks aisle. The ingredient lists are long, the sweeteners are multiple,
            and the preservatives are numerous. &quot;Healthy&quot; versions of popular snacks often just replace one problem with another —
            removing fat but adding sugar, or using &quot;natural flavours&quot; that are anything but natural.
          </p>
          <p>
            We wanted to build something different. Every Alprra product starts with a question: what is the cleanest,
            most nutritious way to make this food genuinely delicious? That question leads us back to India&apos;s extraordinary
            pantry of ancient ingredients.
          </p>

          <h2>Our ingredient philosophy</h2>
          <p>
            We are a millet-forward company. Ragi (finger millet), jowar (sorghum), amaranth, and bajra are not
            just trendy superfoods to us — they are the traditional foundation of Indian nutrition, sidelined
            by cheap refined flour over the last few decades. We are bringing them back.
          </p>
          <p>
            We sweeten with coconut sugar, jaggery, medjool dates, and raw honey — not because they are
            zero-calorie, but because they are meaningfully better: lower glycemic index, mineral-rich,
            and genuinely complex in flavour.
          </p>
          <p>
            We do not use artificial preservatives. Short shelf life is not a weakness in our products —
            it is proof that they are real food.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-14">
          {[
            { icon: Leaf, title: 'Ancient ingredients', body: 'Ragi, jowar, amaranth, and millet — India&apos;s nutritional heritage, rediscovered.' },
            { icon: Shield, title: 'Clean label', body: 'No artificial preservatives, flavours, colours, or emulsifiers. Read every ingredient.' },
            { icon: Heart, title: 'Made with care', body: 'Small batches, hand-packed, and shipped fresh. Every order is made by people, not machines.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
              <div className="h-10 w-10 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-forest-600" />
              </div>
              <h3 className="font-semibold text-espresso-600 mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
              <p className="text-sm text-espresso-400">{body}</p>
            </div>
          ))}
        </div>

        <div className="bg-forest-600 rounded-3xl p-10 text-white text-center">
          <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Questions? We would love to hear from you.
          </h2>
          <p className="text-forest-100 mb-6">
            Based in {siteConfig.address.city}, we are a small team that cares deeply about every product we make.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="accent" asChild>
              <Link href="/contact">Get in touch <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/products">Shop our products</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
