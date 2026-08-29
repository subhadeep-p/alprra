/**
 * Google reviews fetcher (Places API v1 — Place Details).
 *
 * Returns the business's overall rating, total review count, and up to 5 of the
 * most relevant ("top") reviews. The official Places API caps reviews at 5 and
 * does not expose the full set — that requires the gated Business Profile API or
 * a paid third party.
 *
 * Compliance: Google's terms forbid persisting Places review CONTENT beyond
 * ~30 days, so this is fetched live with ISR (revalidated daily) and never
 * written to the database.
 *
 * Required env (server-side only):
 *   GOOGLE_PLACES_API_KEY  — Google Cloud key with "Places API (New)" enabled
 *   GOOGLE_PLACE_ID        — the Place ID for the Alprra business profile
 */

export interface GoogleReview {
  id: string
  author: string
  authorUrl?: string
  rating: number
  text: string
  relativeTime: string
  /** Link the user can click to view/leave reviews, for attribution. */
  profilePhoto?: string
}

export interface GoogleReviewsData {
  rating: number
  total: number
  reviews: GoogleReview[]
  /** Deep link to the business's reviews on Google Maps. */
  reviewsUrl?: string
}

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places'

// Refresh once a day — well inside Google's caching window, and reviews change slowly.
const REVALIDATE_SECONDS = 60 * 60 * 24

interface PlacesReviewAuthor {
  displayName?: string
  uri?: string
  photoUri?: string
}

interface PlacesReview {
  name?: string
  rating?: number
  text?: { text?: string }
  originalText?: { text?: string }
  relativePublishTimeDescription?: string
  authorAttribution?: PlacesReviewAuthor
}

interface PlacesResponse {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: PlacesReview[]
}

/**
 * Fetch top Google reviews for the configured place.
 * Returns `null` when not configured or on any error, so callers can fall back
 * to static content without the page breaking.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) return null

  try {
    const res = await fetch(`${PLACES_ENDPOINT}/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        // Field mask keeps the request cheap — only what we render.
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
      },
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!res.ok) return null

    const data = (await res.json()) as PlacesResponse

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r, i) => {
        const text = r.text?.text ?? r.originalText?.text ?? ''
        return {
          id: r.name ?? `google-review-${i}`,
          author: r.authorAttribution?.displayName ?? 'Google user',
          authorUrl: r.authorAttribution?.uri,
          profilePhoto: r.authorAttribution?.photoUri,
          rating: typeof r.rating === 'number' ? r.rating : 5,
          text,
          relativeTime: r.relativePublishTimeDescription ?? '',
        }
      })
      .filter((r) => r.text.trim().length > 0)

    if (reviews.length === 0) return null

    return {
      rating: data.rating ?? 0,
      total: data.userRatingCount ?? reviews.length,
      reviews,
      reviewsUrl: data.googleMapsUri,
    }
  } catch {
    return null
  }
}
