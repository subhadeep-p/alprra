/**
 * One-time seed: migrates the static categories + products catalog into the DB.
 * Run with: npm run db:seed
 * Safe to re-run — uses ON CONFLICT DO UPDATE keyed on slug.
 */
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { products as productsTable, categories as categoriesTable } from '../src/lib/db/schema'
import { products as staticProducts } from '../src/data/products'
import { categories as staticCategories } from '../src/data/categories'
import type { NewProductRow, NewCategoryRow } from '../src/lib/db/schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL env var is not set')
  process.exit(1)
}

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

const rupeesToPaise = (rupees: number) => Math.round(rupees * 100)

// Maps the raw category strings used in data/products.ts to canonical slugs.
const CATEGORY_SLUG_MAP: Record<string, string> = {
  cookies: 'cookies',
  Namkeen: 'namkeen',
  Laddos: 'laddoos',
  bakery: 'breads-cakes',
}

async function seedCategories(): Promise<Map<string, string>> {
  console.log('Seeding categories...')
  const slugToId = new Map<string, string>()

  for (let i = 0; i < staticCategories.length; i++) {
    const c = staticCategories[i]
    const row: NewCategoryRow = {
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      seoTitle: c.seoTitle,
      seoDescription: c.seoDescription,
      sortOrder: i,
    }

    const [saved] = await db
      .insert(categoriesTable)
      .values(row)
      .onConflictDoUpdate({
        target: categoriesTable.slug,
        set: {
          name: row.name,
          description: row.description,
          image: row.image,
          seoTitle: row.seoTitle,
          seoDescription: row.seoDescription,
          sortOrder: row.sortOrder,
          updatedAt: new Date(),
        },
      })
      .returning({ id: categoriesTable.id, slug: categoriesTable.slug })

    slugToId.set(saved.slug, saved.id)
    console.log(`  ✓ ${c.name}`)
  }

  return slugToId
}

function productToRow(
  product: (typeof staticProducts)[number],
  index: number,
  categoryId: string,
): NewProductRow {
  const {
    slug, name, shortDescription, description,
    price, compareAtPrice, currency, image,
    availability, rating, reviewCount, isFeatured, isBestseller,
    // everything else goes into attributes
    gallery, tags, healthTags, ingredients, benefits, nutrition,
    allergens, storageInstructions, weight, sku, faq,
    seoTitle, seoDescription, whyTheseIngredients,
  } = product

  return {
    slug,
    name,
    shortDescription,
    description,
    price: rupeesToPaise(price),
    compareAtPrice: compareAtPrice != null ? rupeesToPaise(compareAtPrice) : null,
    currency,
    image,
    categoryId,
    availability,
    rating: rating ?? null,
    reviewCount: reviewCount ?? null,
    isFeatured,
    isBestseller,
    sortOrder: index,
    attributes: {
      gallery,
      tags,
      healthTags,
      ingredients,
      benefits,
      nutrition,
      allergens,
      storageInstructions,
      weight,
      sku,
      faq,
      seoTitle,
      seoDescription,
      whyTheseIngredients: whyTheseIngredients ?? null,
      customFields: {},
    },
  }
}

async function seedProducts(slugToId: Map<string, string>) {
  console.log('Seeding products...')

  for (let i = 0; i < staticProducts.length; i++) {
    const product = staticProducts[i]
    const canonicalSlug = CATEGORY_SLUG_MAP[product.category] ?? product.category
    const categoryId = slugToId.get(canonicalSlug)

    if (!categoryId) {
      throw new Error(
        `No category found for product "${product.name}" (raw="${product.category}", canonical="${canonicalSlug}")`,
      )
    }

    const row = productToRow(product, i, categoryId)

    await db
      .insert(productsTable)
      .values(row)
      .onConflictDoUpdate({
        target: productsTable.slug,
        set: {
          name: row.name,
          shortDescription: row.shortDescription,
          description: row.description,
          price: row.price,
          compareAtPrice: row.compareAtPrice,
          currency: row.currency,
          image: row.image,
          categoryId: row.categoryId,
          availability: row.availability,
          rating: row.rating,
          reviewCount: row.reviewCount,
          isFeatured: row.isFeatured,
          isBestseller: row.isBestseller,
          sortOrder: row.sortOrder,
          attributes: row.attributes,
          updatedAt: new Date(),
        },
      })
    console.log(`  ✓ ${row.name}  →  ${canonicalSlug}`)
  }
}

async function main() {
  const slugToId = await seedCategories()
  await seedProducts(slugToId)
  console.log(`\nSeeded ${staticCategories.length} categories and ${staticProducts.length} products successfully.`)
  await client.end()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
