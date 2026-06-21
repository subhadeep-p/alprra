import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { buildMetadata } from '@/lib/seo/metadata'
import { getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils/format'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = buildMetadata({
  title: 'Blog — Healthy Snacking & Nutrition',
  description:
    "Explore Alprra's blog for expert guides on healthy snacking, millet benefits, natural sweeteners, recipes, and nutrition tips. Science-backed, India-focused.",
  path: '/blog',
  keywords: ['healthy snacking tips', 'millet benefits India', 'natural sweeteners guide', 'healthy recipes India'],
})

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div>
      <div className="bg-cream-50 border-b border-cream-200 py-12 animate-fade-in">
        <div className="container-brand">
          <p className="text-sm text-forest-600 font-medium mb-2">Knowledge hub</p>
          <h1
            className="text-3xl md:text-4xl font-semibold text-espresso-600 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Snack smarter. Live better.
          </h1>
          <p className="text-espresso-400 max-w-lg">
            Expert articles on healthy snacking, ancient Indian grains, natural sweeteners, and nutrition for real life.
          </p>
        </div>
      </div>

      <div className="container-brand py-12">
        {posts.length === 0 ? (
          <p className="text-center text-espresso-400 py-20">Articles coming soon. Check back shortly.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-cream-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-forest-700">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h2
                    className="text-lg font-semibold text-espresso-600 group-hover:text-forest-600 leading-snug transition-colors duration-200 mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm text-espresso-400 flex-1 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>

                  {/* Card footer */}
                  <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between">
                    <span className="text-xs text-espresso-400">
                      {formatDate(post.date)}
                      {post.readingTime ? ` · ${post.readingTime} min` : ''}
                    </span>
                    <span className="text-xs font-semibold text-forest-600 flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-200">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
