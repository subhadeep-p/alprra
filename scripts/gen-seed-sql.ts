/**
 * Generates idempotent seed SQL (categories + products) from the static catalog,
 * writing it to scripts/seed.generated.sql. No DB connection required.
 * Run with: npx tsx scripts/gen-seed-sql.ts
 */
import { writeFileSync } from 'node:fs'
import { products as staticProducts } from '../src/data/products'
import { categories as staticCategories } from '../src/data/categories'

const rupeesToPaise = (rupees: number) => Math.round(rupees * 100)

const CATEGORY_SLUG_MAP: Record<string, string> = {
  cookies: 'cookies',
  Namkeen: 'namkeen',
  Laddos: 'laddoos',
  bakery: 'breads-cakes',
}

const q = (v: string | null | undefined) =>
  v == null ? 'NULL' : `'${v.replace(/'/g, "''")}'`

const num = (v: number | null | undefined) => (v == null ? 'NULL' : String(v))

const bool = (v: boolean) => (v ? 'true' : 'false')

const jsonb = (obj: unknown) => `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`

function categoriesSql(): string {
  const rows = staticCategories.map((c, i) =>
    `  (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${q(c.image)}, ${q(c.seoTitle)}, ${q(c.seoDescription)}, ${i})`,
  )
  return (
    `INSERT INTO categories (slug, name, description, image, seo_title, seo_description, sort_order) VALUES\n` +
    rows.join(',\n') +
    `\nON CONFLICT (slug) DO UPDATE SET\n` +
    `  name = EXCLUDED.name,\n` +
    `  description = EXCLUDED.description,\n` +
    `  image = EXCLUDED.image,\n` +
    `  seo_title = EXCLUDED.seo_title,\n` +
    `  seo_description = EXCLUDED.seo_description,\n` +
    `  sort_order = EXCLUDED.sort_order,\n` +
    `  updated_at = now();`
  )
}

function productRow(p: (typeof staticProducts)[number], index: number): string {
  const canonicalSlug = CATEGORY_SLUG_MAP[p.category] ?? p.category
  const attributes = {
    gallery: p.gallery,
    tags: p.tags,
    healthTags: p.healthTags,
    ingredients: p.ingredients,
    benefits: p.benefits,
    nutrition: p.nutrition,
    allergens: p.allergens,
    storageInstructions: p.storageInstructions,
    weight: p.weight,
    sku: p.sku,
    faq: p.faq,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    whyTheseIngredients: p.whyTheseIngredients ?? null,
    customFields: {},
  }
  return (
    `  (${q(p.slug)}, ${q(p.name)}, ${q(p.shortDescription)}, ${q(p.description)}, ` +
    `${rupeesToPaise(p.price)}, ${p.compareAtPrice != null ? rupeesToPaise(p.compareAtPrice) : 'NULL'}, ` +
    `${q(p.currency)}, ${q(p.image)}, ` +
    `(SELECT id FROM categories WHERE slug = ${q(canonicalSlug)}), ` +
    `${q(p.availability)}, ${num(p.rating)}, ${num(p.reviewCount)}, ` +
    `${bool(p.isFeatured)}, ${bool(p.isBestseller)}, ${index}, ${jsonb(attributes)})`
  )
}

function productsSql(): string {
  const rows = staticProducts.map((p, i) => productRow(p, i))
  return (
    `INSERT INTO products (slug, name, short_description, description, price, compare_at_price, currency, image, category_id, availability, rating, review_count, is_featured, is_bestseller, sort_order, attributes) VALUES\n` +
    rows.join(',\n') +
    `\nON CONFLICT (slug) DO UPDATE SET\n` +
    `  name = EXCLUDED.name,\n` +
    `  short_description = EXCLUDED.short_description,\n` +
    `  description = EXCLUDED.description,\n` +
    `  price = EXCLUDED.price,\n` +
    `  compare_at_price = EXCLUDED.compare_at_price,\n` +
    `  currency = EXCLUDED.currency,\n` +
    `  image = EXCLUDED.image,\n` +
    `  category_id = EXCLUDED.category_id,\n` +
    `  availability = EXCLUDED.availability,\n` +
    `  rating = EXCLUDED.rating,\n` +
    `  review_count = EXCLUDED.review_count,\n` +
    `  is_featured = EXCLUDED.is_featured,\n` +
    `  is_bestseller = EXCLUDED.is_bestseller,\n` +
    `  sort_order = EXCLUDED.sort_order,\n` +
    `  attributes = EXCLUDED.attributes,\n` +
    `  updated_at = now();`
  )
}

const sqlOut = `${categoriesSql()}\n\n${productsSql()}\n`
writeFileSync(new URL('./seed.generated.sql', import.meta.url), sqlOut)
console.log('Wrote scripts/seed.generated.sql')
