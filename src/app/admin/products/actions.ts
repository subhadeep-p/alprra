'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { dbUpsertProduct, dbDeleteProduct } from '@/lib/db/products.repo'
import { ProductSchema } from '@/models/product'
import { z } from 'zod'

/** Called from the product editor form */
export async function saveProductAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())

  // Parse nested JSON fields that come as stringified JSON from the form
  function parseJSON<T>(key: string, fallback: T): T {
    const val = raw[key]
    if (!val || typeof val !== 'string') return fallback
    try {
      return JSON.parse(val) as T
    } catch {
      return fallback
    }
  }

  const productData = {
    id: raw['id'] as string,
    slug: raw['slug'] as string,
    name: raw['name'] as string,
    shortDescription: raw['shortDescription'] as string,
    description: raw['description'] as string,
    price: Number(raw['price']),
    compareAtPrice: raw['compareAtPrice'] ? Number(raw['compareAtPrice']) : undefined,
    currency: (raw['currency'] as string) || 'INR',
    image: raw['image'] as string,
    category: raw['category'] as string,
    availability: raw['availability'] as string,
    rating: raw['rating'] ? Number(raw['rating']) : undefined,
    reviewCount: raw['reviewCount'] ? Number(raw['reviewCount']) : undefined,
    isFeatured: raw['isFeatured'] === 'true',
    isBestseller: raw['isBestseller'] === 'true',
    gallery: parseJSON('gallery', []),
    tags: parseJSON('tags', []),
    healthTags: parseJSON('healthTags', []),
    ingredients: parseJSON('ingredients', []),
    benefits: parseJSON('benefits', []),
    nutrition: parseJSON('nutrition', {
      servingSize: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      sugar: 0,
      fiber: 0,
      fat: 0,
    }),
    allergens: parseJSON('allergens', []),
    storageInstructions: raw['storageInstructions'] as string,
    weight: raw['weight'] as string,
    sku: raw['sku'] as string,
    faq: parseJSON('faq', []),
    seoTitle: raw['seoTitle'] as string,
    seoDescription: raw['seoDescription'] as string,
    whyTheseIngredients: (raw['whyTheseIngredients'] as string) || undefined,
  }

  const errorTarget = productData.id ? `/admin/products/${productData.id}` : '/admin/products/new'

  const parsed = ProductSchema.safeParse(productData)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(', ')
    redirect(`${errorTarget}?error=${encodeURIComponent(msg)}`)
  }

  const sortOrder = raw['sortOrder'] ? Number(raw['sortOrder']) : 0

  try {
    await dbUpsertProduct(parsed.data, sortOrder)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save product'
    redirect(`${errorTarget}?error=${encodeURIComponent(msg)}`)
  }

  // Revalidate all pages that might show this product
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath(`/products/${parsed.data.slug}`)
  revalidatePath(`/products/category/${parsed.data.category}`)

  redirect('/admin/products')
}

export async function deleteProductAction(id: string) {
  await dbDeleteProduct(id)
  revalidatePath('/')
  revalidatePath('/products')
  redirect('/admin/products')
}
