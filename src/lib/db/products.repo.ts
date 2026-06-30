import { eq, ilike, or, asc } from 'drizzle-orm'
import { db } from './client'
import { products, categories } from './schema'
import type { ProductRow, NewProductRow, CategoryRow } from './schema'
import { ProductSchema } from '@/models/product'
import type { Product, Category } from '@/models/product'

// ---------------------------------------------------------------------------
// Money helpers — DB stores integer paise, the app works in rupees (number).
// ---------------------------------------------------------------------------
export const paiseToRupees = (paise: number | null | undefined): number =>
  paise == null ? 0 : paise / 100
export const rupeesToPaise = (rupees: number): number => Math.round(rupees * 100)

// ---------------------------------------------------------------------------
// Attributes blob shape (rich/nested product data + custom fields)
// ---------------------------------------------------------------------------
type AttributesBlob = {
  gallery?: string[]
  tags?: string[]
  healthTags?: string[]
  ingredients?: Array<{ name: string; description?: string; benefit?: string }>
  benefits?: string[]
  nutrition?: {
    servingSize: string
    calories: number
    protein: number
    carbs: number
    sugar: number
    fiber: number
    fat: number
    sodium?: number
  }
  allergens?: string[]
  storageInstructions?: string
  weight?: string
  sku?: string
  faq?: Array<{ question: string; answer: string }>
  seoTitle?: string
  seoDescription?: string
  whyTheseIngredients?: string | null
  customFields?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Category mapper
// ---------------------------------------------------------------------------
export function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.slug, // public Category type keys on slug-style id
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  }
}

// ---------------------------------------------------------------------------
// Row -> Product mapper
// ---------------------------------------------------------------------------
// `categorySlug` comes from the joined categories table so the public Product
// type keeps exposing `category` as a slug string (storefront unchanged).
// ---------------------------------------------------------------------------
export function rowToProduct(row: ProductRow, categorySlug: string): Product {
  const attrs = (row.attributes ?? {}) as AttributesBlob

  return ProductSchema.parse({
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    price: paiseToRupees(row.price),
    compareAtPrice: row.compareAtPrice != null ? paiseToRupees(row.compareAtPrice) : undefined,
    currency: row.currency,
    image: row.image,
    gallery: attrs.gallery ?? [],
    category: categorySlug,
    tags: attrs.tags ?? [],
    healthTags: attrs.healthTags ?? [],
    ingredients: attrs.ingredients ?? [],
    benefits: attrs.benefits ?? [],
    nutrition: attrs.nutrition ?? {
      servingSize: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      sugar: 0,
      fiber: 0,
      fat: 0,
    },
    allergens: attrs.allergens ?? [],
    storageInstructions: attrs.storageInstructions ?? '',
    weight: attrs.weight ?? '',
    sku: attrs.sku ?? '',
    availability: row.availability as Product['availability'],
    rating: row.rating ?? undefined,
    reviewCount: row.reviewCount ?? undefined,
    faq: attrs.faq ?? [],
    seoTitle: attrs.seoTitle ?? '',
    seoDescription: attrs.seoDescription ?? '',
    isFeatured: row.isFeatured,
    isBestseller: row.isBestseller,
    whyTheseIngredients: attrs.whyTheseIngredients ?? undefined,
  })
}

// Internal: build the attributes blob from a Product
function productToAttributes(product: Product): AttributesBlob {
  return {
    gallery: product.gallery,
    tags: product.tags,
    healthTags: product.healthTags,
    ingredients: product.ingredients,
    benefits: product.benefits,
    nutrition: product.nutrition,
    allergens: product.allergens,
    storageInstructions: product.storageInstructions,
    weight: product.weight,
    sku: product.sku,
    faq: product.faq,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    whyTheseIngredients: product.whyTheseIngredients ?? null,
    customFields: {},
  }
}

// ---------------------------------------------------------------------------
// Joined select helpers
// ---------------------------------------------------------------------------
const productSelect = {
  product: products,
  categorySlug: categories.slug,
}

function mapJoined(rows: Array<{ product: ProductRow; categorySlug: string | null }>): Product[] {
  return rows.map((r) => rowToProduct(r.product, r.categorySlug ?? ''))
}

// ---------------------------------------------------------------------------
// Category queries
// ---------------------------------------------------------------------------
export async function dbGetAllCategories(): Promise<Category[]> {
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name))
  return rows.map(rowToCategory)
}

export async function dbGetCategoryBySlug(slug: string): Promise<Category | undefined> {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)
  return row ? rowToCategory(row) : undefined
}

export async function dbGetAllCategorySlugs(): Promise<string[]> {
  const rows = await db.select({ slug: categories.slug }).from(categories)
  return rows.map((r) => r.slug)
}

async function resolveCategoryId(slug: string): Promise<string | undefined> {
  const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1)
  return row?.id
}

// ---------------------------------------------------------------------------
// Product queries
// ---------------------------------------------------------------------------
export async function dbGetAllProducts(): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(products.sortOrder), asc(products.name))
  return mapJoined(rows)
}

export async function dbGetProductBySlug(slug: string): Promise<Product | undefined> {
  const [row] = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1)
  return row ? rowToProduct(row.product, row.categorySlug ?? '') : undefined
}

export async function dbGetFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isFeatured, true))
    .orderBy(asc(products.sortOrder))
    .limit(limit)
  return mapJoined(rows)
}

export async function dbGetBestsellerProducts(limit = 4): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isBestseller, true))
    .orderBy(asc(products.sortOrder))
    .limit(limit)
  return mapJoined(rows)
}

export async function dbGetProductsByCategory(categorySlug: string): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(categories.slug, categorySlug))
    .orderBy(asc(products.sortOrder))
  return mapJoined(rows)
}

export async function dbGetAllProductSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: products.slug }).from(products)
  return rows.map((r) => r.slug)
}

export async function dbSearchProducts(query: string): Promise<Product[]> {
  const q = `%${query}%`
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(or(ilike(products.name, q), ilike(products.shortDescription, q), ilike(categories.slug, q)))
    .orderBy(asc(products.sortOrder))
  return mapJoined(rows)
}

export async function dbGetRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(categories.slug, product.category))
    .orderBy(asc(products.sortOrder))
    .limit(limit + 1)

  return mapJoined(rows)
    .filter((p) => p.id !== product.id)
    .slice(0, limit)
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export async function dbUpsertProduct(product: Product, sortOrder?: number): Promise<Product> {
  const categoryId = await resolveCategoryId(product.category)
  if (!categoryId) {
    throw new Error(`Unknown category slug: "${product.category}". Create the category first.`)
  }

  const base: Omit<NewProductRow, 'id' | 'createdAt' | 'updatedAt'> = {
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    price: rupeesToPaise(product.price),
    compareAtPrice: product.compareAtPrice != null ? rupeesToPaise(product.compareAtPrice) : null,
    currency: product.currency,
    image: product.image,
    categoryId,
    availability: product.availability,
    rating: product.rating ?? null,
    reviewCount: product.reviewCount ?? null,
    isFeatured: product.isFeatured,
    isBestseller: product.isBestseller,
    sortOrder: sortOrder ?? 0,
    attributes: productToAttributes(product),
  }

  // Upsert keyed on the unique slug (id is a server-owned surrogate).
  const insertValues: NewProductRow = product.id
    ? { ...base, id: product.id, updatedAt: new Date() }
    : { ...base, updatedAt: new Date() }

  const [saved] = await db
    .insert(products)
    .values(insertValues)
    .onConflictDoUpdate({
      target: products.slug,
      set: { ...base, updatedAt: new Date() },
    })
    .returning()

  return rowToProduct(saved, product.category)
}

export async function dbDeleteProduct(id: string): Promise<void> {
  await db.delete(products).where(eq(products.id, id))
}

export async function dbGetProductRowById(id: string): Promise<{ product: ProductRow; categorySlug: string | null } | undefined> {
  const [row] = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1)
  return row
}
