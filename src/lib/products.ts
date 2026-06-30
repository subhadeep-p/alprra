/**
 * Public product query API — same function names as before, now async + DB-backed.
 * Callers just need to await them.
 */
import type { Product, Category } from '@/models/product'
import {
  dbGetAllProducts,
  dbGetProductBySlug,
  dbGetFeaturedProducts,
  dbGetBestsellerProducts,
  dbGetProductsByCategory,
  dbGetRelatedProducts,
  dbGetAllProductSlugs,
  dbSearchProducts,
  dbGetAllCategories,
  dbGetCategoryBySlug,
  dbGetAllCategorySlugs,
} from './db/products.repo'

export async function getAllProducts(): Promise<Product[]> {
  return dbGetAllProducts()
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return dbGetProductBySlug(slug)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return dbGetProductsByCategory(category)
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return dbGetFeaturedProducts(limit)
}

export async function getBestsellerProducts(limit = 4): Promise<Product[]> {
  return dbGetBestsellerProducts(limit)
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return dbGetRelatedProducts(product, limit)
}

export async function getAllProductSlugs(): Promise<string[]> {
  return dbGetAllProductSlugs()
}

export async function searchProducts(query: string): Promise<Product[]> {
  return dbSearchProducts(query)
}

// Category helpers — now DB-backed (async)
export async function getAllCategories(): Promise<Category[]> {
  return dbGetAllCategories()
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return dbGetCategoryBySlug(slug)
}

export async function getAllCategorySlugs(): Promise<string[]> {
  return dbGetAllCategorySlugs()
}
