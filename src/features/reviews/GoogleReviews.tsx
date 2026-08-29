import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'
import { Badge } from '@/components/ui/Badge'
import { getGoogleReviews } from '@/lib/reviews/google'
import { testimonials } from '@/data/testimonials'

const MAX_CARDS = 6

interface ReviewCard {
  id: string
  text: string
  rating: number
  author: string
  /** Secondary line: relative time for Google, city for static testimonials. */
  meta?: string
  authorUrl?: string
  tag?: string
  fromGoogle: boolean
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

export async function GoogleReviews() {
  const google = await getGoogleReviews()

  const fromGoogle = Boolean(google && google.reviews.length > 0)

  const cards: ReviewCard[] = fromGoogle
    ? google!.reviews.slice(0, MAX_CARDS).map((r) => ({
        id: r.id,
        text: r.text,
        rating: r.rating,
        author: r.author,
        meta: r.relativeTime,
        authorUrl: r.authorUrl,
        fromGoogle: true,
      }))
    : testimonials.slice(0, MAX_CARDS).map((t) => ({
        id: t.id,
        text: t.text,
        rating: t.rating,
        author: t.name,
        meta: t.location,
        tag: t.product,
        fromGoogle: false,
      }))

  const overallRating = fromGoogle ? google!.rating : 4.8
  const totalReviews = fromGoogle ? google!.total : undefined
  const reviewsUrl = google?.reviewsUrl

  return (
    <section className="py-20 md:py-28 bg-cream-50" aria-labelledby="testimonials-heading">
      <div className="container-brand">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-forest-600 mb-2">
            What customers say
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-semibold text-espresso-600"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Loved across India
          </h2>

          {fromGoogle && (
            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-cream-200 bg-white px-5 py-2.5 shadow-[var(--shadow-card)]">
              <GoogleGlyph className="h-5 w-5" />
              <Rating value={overallRating} size="sm" />
              <span className="text-sm font-semibold text-espresso-600">
                {overallRating.toFixed(1)}
              </span>
              {totalReviews !== undefined && (
                <span className="text-sm text-espresso-400">
                  · {totalReviews.toLocaleString('en-IN')} Google reviews
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <blockquote
              key={c.id}
              className="bg-white rounded-2xl p-6 border border-cream-200 shadow-[var(--shadow-card)] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <Rating value={c.rating} size="sm" />
                {c.fromGoogle && <GoogleGlyph className="h-4 w-4 shrink-0" />}
              </div>
              <p className="text-sm text-espresso-500 leading-relaxed flex-1">&quot;{c.text}&quot;</p>
              <footer className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  {c.authorUrl ? (
                    <a
                      href={c.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="not-italic text-sm font-semibold text-espresso-600 hover:text-forest-600 truncate block"
                    >
                      {c.author}
                    </a>
                  ) : (
                    <cite className="not-italic text-sm font-semibold text-espresso-600 truncate block">
                      {c.author}
                    </cite>
                  )}
                  {c.meta && <p className="text-xs text-espresso-400">{c.meta}</p>}
                </div>
                {c.tag && (
                  <Badge variant="cream" className="text-[10px] shrink-0">
                    {c.tag}
                  </Badge>
                )}
              </footer>
            </blockquote>
          ))}
        </div>

        {fromGoogle && reviewsUrl && (
          <div className="mt-10 text-center">
            <Link
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 hover:text-forest-700"
            >
              Read all reviews on Google
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
