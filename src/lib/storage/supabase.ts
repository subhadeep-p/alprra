import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ===========================================================================
// Supabase Storage (server-side only)
// ---------------------------------------------------------------------------
// Product images live in a PUBLIC bucket so the storefront can load them
// directly over the CDN. Uploads are performed exclusively on the server with
// the SERVICE ROLE key (which bypasses storage RLS) — the key must never be
// exposed to the browser. The DB only ever stores the resulting public URL.
// ===========================================================================

export const PRODUCT_IMAGE_BUCKET = 'product-images'

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
])

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // keep in sync with the bucket limit

let cached: SupabaseClient | null = null

/** Returns a service-role Supabase client (server-only). Throws if env is missing. */
export function getStorageAdmin(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) is not set')
  }
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  if (!cached) {
    cached = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return cached
}

function slugifySegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export interface UploadProductImageInput {
  data: Uint8Array | ArrayBuffer | Buffer
  contentType: string
  /** Product slug used to namespace the storage path (optional). */
  slug?: string
  /** Stable object name (without extension). When set, re-uploads overwrite the same path. */
  objectName?: string
}

/**
 * Uploads an image to the public product-images bucket and returns its public URL.
 * Path convention: products/{slug|'misc'}/{objectName|uuid}.{ext}
 */
export async function uploadProductImage(input: UploadProductImageInput): Promise<string> {
  const { data, contentType, slug, objectName } = input

  if (!ALLOWED_MIME.has(contentType)) {
    throw new Error(`Unsupported image type: ${contentType}`)
  }

  const ext = MIME_TO_EXT[contentType]
  const folder = slug ? slugifySegment(slug) || 'misc' : 'misc'
  const name = objectName ? slugifySegment(objectName) : crypto.randomUUID()
  const path = `products/${folder}/${name}.${ext}`

  const body =
    data instanceof Uint8Array ? data : data instanceof Buffer ? data : new Uint8Array(data)

  const supabase = getStorageAdmin()
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, body, {
    contentType,
    upsert: true,
    cacheControl: '31536000',
  })
  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`)
  }

  const { data: pub } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path)
  return pub.publicUrl
}
