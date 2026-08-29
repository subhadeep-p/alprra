import { describe, it, expect } from 'vitest'
import { ProductSchema } from './product'

function baseProduct() {
  return {
    id: 'p1',
    slug: 'test-product',
    name: 'Test Product',
    shortDescription: 'Short',
    description: 'Long',
    price: 100,
    currency: 'INR',
    image: '/image.png',
    gallery: [],
    category: 'cookies',
    tags: [],
    healthTags: [],
    ingredients: [],
    benefits: [],
    nutrition: { servingSize: '', calories: 0, protein: 0, carbs: 0, sugar: 0, fiber: 0, fat: 0 },
    allergens: [],
    storageInstructions: '',
    weight: '100g',
    sku: 'SKU-1',
    faq: [],
    seoTitle: '',
    seoDescription: '',
  }
}

describe('ProductSchema', () => {
  it('accepts a custom health tag that is not in the curated preset list', () => {
    const result = ProductSchema.safeParse({
      ...baseProduct(),
      healthTags: ['High Fiber', 'Totally New Custom Tag'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts an optional minOrderQuantity', () => {
    const result = ProductSchema.safeParse({ ...baseProduct(), minOrderQuantity: 3 })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.minOrderQuantity).toBe(3)
  })

  it('defaults minOrderQuantity to undefined when omitted', () => {
    const result = ProductSchema.safeParse(baseProduct())
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.minOrderQuantity).toBeUndefined()
  })

  it('rejects a minOrderQuantity below 1', () => {
    const result = ProductSchema.safeParse({ ...baseProduct(), minOrderQuantity: 0 })
    expect(result.success).toBe(false)
  })

  it('accepts an optional itemsPerBox', () => {
    const result = ProductSchema.safeParse({ ...baseProduct(), itemsPerBox: 6 })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.itemsPerBox).toBe(6)
  })

  it('defaults itemsPerBox to undefined when omitted', () => {
    const result = ProductSchema.safeParse(baseProduct())
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.itemsPerBox).toBeUndefined()
  })

  it('rejects an itemsPerBox below 1', () => {
    const result = ProductSchema.safeParse({ ...baseProduct(), itemsPerBox: 0 })
    expect(result.success).toBe(false)
  })
})
