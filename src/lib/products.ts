import { products } from '@/data/products'
import { categories } from '@/data/categories'
import type { Product, Category } from '@/models/product'

export function getAllProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((p) => p.isFeatured).slice(0, limit)
}

export function getBestsellerProducts(limit = 4): Product[] {
  return products.filter((p) => p.isBestseller).slice(0, limit)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.tags.some((t) => product.tags.includes(t))))
    .slice(0, limit)
}

export function getAllCategories(): Category[] {
  return categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug)
}

export function getAllCategorySlugs(): string[] {
  return categories.map((c) => c.slug)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.healthTags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  )
}
