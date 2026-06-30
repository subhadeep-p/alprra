/**
 * Moves product images out of the codebase (public/images/...) into Supabase
 * Storage and rewrites the DB rows to point at the public CDN URLs.
 *
 * Idempotent: only local paths (starting with "/") are migrated; already-migrated
 * https URLs are left untouched. Re-runnable safely (uploads use upsert).
 *
 * Requires in .env.local (or .env):
 *   DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Run with: npm run db:migrate-images
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import path from 'node:path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

const isLocalPath = (url: unknown): url is string =>
  typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')

async function main() {
  const { readFile } = await import('node:fs/promises')
  const { eq } = await import('drizzle-orm')
  const { db } = await import('../src/lib/db/client')
  const { products } = await import('../src/lib/db/schema')
  const { uploadProductImage } = await import('../src/lib/storage/supabase')

  async function migrateOne(localPath: string, slug: string): Promise<string> {
    const ext = path.extname(localPath).toLowerCase()
    const contentType = MIME_BY_EXT[ext]
    if (!contentType) throw new Error(`Unsupported extension for ${localPath}`)
    const data = await readFile(path.join(PUBLIC_DIR, localPath))
    const objectName = path.basename(localPath, ext)
    return uploadProductImage({ data, contentType, slug, objectName })
  }

  const rows = await db.select().from(products)
  console.log(`Scanning ${rows.length} products for local image paths...`)

  for (const row of rows) {
    let changed = false

    let image = row.image
    if (isLocalPath(image)) {
      try {
        image = await migrateOne(image, row.slug)
        changed = true
        console.log(`  ✓ ${row.slug}: main image -> ${image}`)
      } catch (err) {
        console.warn(`  ! ${row.slug}: skipped main image (${(err as Error).message})`)
      }
    }

    const attrs = (row.attributes ?? {}) as Record<string, unknown> & { gallery?: unknown }
    let gallery = attrs.gallery
    if (Array.isArray(gallery)) {
      const next: string[] = []
      for (const g of gallery) {
        if (isLocalPath(g)) {
          try {
            const url = await migrateOne(g, row.slug)
            next.push(url)
            changed = true
            console.log(`  ✓ ${row.slug}: gallery image -> ${url}`)
          } catch (err) {
            console.warn(`  ! ${row.slug}: skipped gallery ${g} (${(err as Error).message})`)
            next.push(g as string)
          }
        } else {
          next.push(g as string)
        }
      }
      gallery = next
    }

    if (changed) {
      await db
        .update(products)
        .set({ image, attributes: { ...attrs, gallery }, updatedAt: new Date() })
        .where(eq(products.id, row.id))
      console.log(`Updated ${row.slug}`)
    }
  }

  console.log('\nImage migration complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Image migration failed:', err)
  process.exit(1)
})
